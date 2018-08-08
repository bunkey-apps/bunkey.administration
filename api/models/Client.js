import MongooseModel from 'mongoose-model-class';
import SearchService from 'search-service-mongoose';
import moment from 'moment';

const modelFields = [
  'dni',
  'name',
  'agent',
  'email',
  'phone',
  'status',
  'acountSetting',
];

class Client extends MongooseModel {
  schema() {
    const AcountSetting = new MongooseModel.Schema({
      logo: { type: String },
      background: { type: String },
      language: { type: String },
    }, { _id: false });
    return {
      dni: { type: String, index: true, require: true },
      name: { type: String, index: true, require: true },
      agent: { type: String, index: true, require: true },
      email: { type: String, index: true, require: true },
      phone: { type: String, index: true, require: true },
      status: { type: Boolean, default: true },
      acountSetting: { type: AcountSetting, default: {} },
    };
  }

  getContracts() {
    return Contract.find({ client: this.id });
  }

  static get(query) {
    const criteria = buildCriteria(query);
    const opts = buildOpts(query);
    return SearchService.search(this, criteria, opts);
  }

  static async getById(id) {
    const client = await this.findById(id);
    if (!client) {
      throw new ClientError('notFound', 'Client not found.');
    }
    return client;
  }

  static async updateById(id, data) {
    await this.getById(id);
    const criteria = { _id: id };
    return this.update(criteria, { $set: data });
  }

  static async deleteById(id) {
    const { Contract } = cano.app.models;
    await this.getById(id);
    const countContracts = await Contract.count({ client: id });
    if (countContracts > 0) {
      throw new ClientError('relatedClient');
    }
    const criteria = { _id: id };
    return this.remove(criteria);
  }

  config(schema) {
    schema.index({ '$**': 'text' });
  }

  options() {
    return { timestamps: true };
  }
}

function buildOpts(query) {
  const {
    page = 1,
    limit = 10,
    orderBy = '-createdAt',
    fields = modelFields.join(','),
  } = query;
  return {
    page,
    limit,
    orderBy,
    fields,
  };
}

function buildCriteria({ search, fromDate, toDate }) {
  const criteria = {};
  const filterDate = [];
  if (search) {
    Object.assign(criteria, { $text: { $search: search } });
  }
  if (fromDate) {
    filterDate.push({
      createdAt: {
        $gte: moment(fromDate, 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (toDate) {
    filterDate.push({
      createdAt: {
        $lte: moment(toDate, 'DD-MM-YYYY').toDate(),
      },
    });
  }
  if (filterDate.length > 0) {
    Object.assign(criteria, { $and: filterDate });
  }
  return criteria;
}

module.exports = Client;

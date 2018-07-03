import MongooseModel from 'mongoose-model-class';
import SearchService from 'search-service-mongoose';
import moment from 'moment';

const modelFields = [
  'name',
];

class Tag extends MongooseModel {
  schema() {
    return {
      name: { type: String, require: true },
    };
  }

  static get(query) {
    const criteria = buildCriteria(query);
    const opts = buildOpts(query);
    return SearchService.search(this, criteria, opts);
  }

  static async getById(id) {
    const tag = await this.findById(id);
    if (!tag) {
      throw new TagError('notFound', 'Tag not found.');
    }
    return tag;
  }

  static async updateById(id, data) {
    await this.getById(id);
    const criteria = { _id: id };
    return this.update(criteria, { $set: data });
  }

  static async deleteById(id) {
    await this.getById(id);
    const criteria = { _id: id };
    return this.remove(criteria);
  }

  config(schema) {
    schema.index({ name: 'text' });
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

module.exports = Tag;

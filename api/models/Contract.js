import MongooseModel from 'mongoose-model-class';
import SearchService from 'search-service-mongoose';
import moment from 'moment';
import mongoose from 'mongoose';
import keys from 'lodash/keys';
import find from 'lodash/find';

const modelFields = [
  'client',
  'plan',
  'monthlyPaymentDay',
  'endDate',
  'payments',
];

class Contract extends MongooseModel {

  schema() {
    const Plan = new MongooseModel.Schema({
      sizeTotal: { type: String, require: true },
      sizeVideoRow: { type: String, require: true },
      sizeVideoFinal: { type: String, require: true },
    }, { _id: false });
    const Payment = new MongooseModel.Schema({
      month: { type: String, require: true },
      observation: { type: String, require: true },
    });
    return {
      client: { type: MongooseModel.types.ObjectId, ref: 'Client',  require: true },
      plan: { type: Plan, require: true },
      monthlyPaymentDay: { type: Number, require: true },
      startDate: { type: Date, require: true },
      endDate: { type: Date, require: true },
      nextPayment: { type: Date, require: true },
      payments: { type: [Payment], default: [] },
    };
  }

  beforeSave(next) {
    const doc = this;
    const startDate = moment(doc.startDate);
    doc.nextPayment = moment(`${doc.monthlyPaymentDay}-${startDate.month() + 1}-${startDate.year()}`, 'DD-MM-YYYY');
    next();
  }

  static get(query) {
    const criteria = buildCriteria(query);
    const opts = buildOpts(query);
    return SearchService.search(this, criteria, opts);
  }

  async createPayment(payment, generateID = true) {
    const _id = generateID ? mongoose.Types.ObjectId(): payment._id;
    Object.assign(payment, { _id });
    const operations = { $push: { payments: payment, $sort: { createdAt: 1 } } };
    const { monthlyPaymentDay, nextPayment, endDate } = this;
    const newNextPayment = moment(nextPayment).add(1, 'M').date(monthlyPaymentDay);
    if (newNextPayment.isBefore(endDate)) {
      operations.$set = { nextPayment: newNextPayment };
    }
    const contract = await this.model('Contract').findByIdAndUpdate(this.id, operations, { new: true });
    return getPaymentById(_id.toString(), contract);
  }

  async updatePaymentById(id, data) {
    const payment = getPaymentById(id, this);
    if (data.month) payment.month = data.month;
    if (data.observation) payment.observation = data.observation;
    await this.deletePaymentById(id);
    return this.createPayment(payment, false);
  }

  deletePaymentById(id) {
    const { monthlyPaymentDay, nextPayment } = this;
    const newNextPayment = moment(nextPayment).subtract(1, 'M').date(monthlyPaymentDay);
    const criteria = { _id: this.id };
    const operations = {
      $pull: { payments: { _id: id } },
      $set: { nextPayment: newNextPayment },
    };
    return this.model('Contract').update(criteria, operations);
  }

  static getPayments(query) {
    Object.assign(query, { isCriteriaPipeline: true })
    if (!query.fields) {
      Object.assign(query, { fields: 'contract,date,paymed,month,observation' })
    }
    if (!query.orderBy) {
      Object.assign(query, { orderBy: '-paymed,-date' })
    }
    const criteria = buildCriteriaForPayments(query);
    const opts = buildOpts(query);
    const pipeline = [
      {
        $match: criteria,
      },
      {
        $unwind: '$payments',
      },
      {
        $addFields: {
          payment: {
            _id: '$payments._id',
            contract: {
              _id: '$_id',
              client: '$client',
              typePay: '$typePay',
            },
            createdAt: '$payments.createdAt',
            paymed: '$payments.paymed',
            month: '$payments.month',
            observation: '$payments.observation',
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$payment' },
      },
    ];
    const { fromDate, toDate } = query;
    const criteriaDate = buildCriteriaByDate(fromDate, toDate);
    if (keys(criteriaDate).length > 0) {
      pipeline.push({
        $match: criteriaDate,
      })
    }
    return SearchService.search(this, pipeline, opts);
  }

  static async getById(id) {
    const contract = await this.findById(id);
    if (!contract) {
      throw new Error('Contract not found.');
    }
    return contract;
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

  options() {
    return { timestamps: true };
  }

}

function getPaymentById(id, { payments }) {
  const payment = find(payments,({ _id }) => _id.toString() === id);
  if (!payment) throw new Error('Payment not found.');
  return payment;
}

function buildOpts(query) {
  const {
    page = 1,
    limit = 10,
    orderBy = '-createdAt',
    fields = modelFields.join(','),
    isCriteriaPipeline = false,
  } = query;
  return { page, limit, orderBy, fields, isCriteriaPipeline };
}

function buildCriteriaForPayments({ client, contract, search, fromDate, toDate }) {
  const criteria = {}
  if (search) {
    Object.assign(criteria, { $text: { $search: search } })
  }
  if (contract) {
    Object.assign(criteria, { _id: mongoose.Types.ObjectId(contract) })
  }
  if (client) {
    Object.assign(criteria, { 'client': mongoose.Types.ObjectId(client) })
  }
  return criteria
}

function buildCriteria({ search, fromDate, toDate }) {
  const criteria = {};
  if (search) {
    Object.assign(criteria, { $text: { $search: search } });
  }
  Object.assign(criteria, buildCriteriaByDate(fromDate, toDate));
  return criteria;
}

function buildCriteriaByDate(fromDate, toDate) {
  let criteria = {};
  const filterDate = [];
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

module.exports = Contract;

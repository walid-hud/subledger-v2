import Transaction from "../models/Transaction.model.js";
import Subscription from "../models/Subscription.model.js";
import { ConflictError } from "../utils/errors.js";

const normalizePagination = (page, limit) => {
  const safePage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const safeLimit =
    Number.isFinite(Number(limit)) && Number(limit) > 0 && Number(limit) <= 100
      ? Number(limit)
      : 10;
  return { page: safePage, limit: safeLimit };
};

const buildDateFilter = (fromDate, toDate) => {
  const dateFilter = {};
  if (fromDate) {
    dateFilter.$gte = new Date(fromDate);
  }
  if (toDate) {
    dateFilter.$lte = new Date(toDate);
  }
  return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
};

const getMonthlyTotal = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const subscriptions = await Subscription.find({ user: userId }, { _id: 1 });
  const subscriptionIds = subscriptions.map((s) => s._id);

  if (subscriptionIds.length === 0) return 0;

  const result = await Transaction.aggregate([
    {
      $match: {
        subscription: { $in: subscriptionIds },
        paymentDate: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

export const createTransactionForSubscription = async (subscription, payload, user) => {
  if (subscription.status === "cancelled") {
    throw new ConflictError("Cannot create transactions for a cancelled subscription");
  }

  let warning = null;
  if (user?.monthlySpendingLimit != null) {
    const monthlyTotal = await getMonthlyTotal(user._id);
    const newTotal = monthlyTotal + payload.amount;
    if (newTotal > user.monthlySpendingLimit) {
      warning = `Monthly spending limit exceeded: ${newTotal.toFixed(2)} spent vs limit of ${user.monthlySpendingLimit.toFixed(2)}`;
    }
  }

  const transaction = await Transaction.create({
    subscription: subscription._id,
    amount: payload.amount,
    paymentDate: payload.paymentDate,
    status: payload.status,
  });

  return { transaction, warning };
};

export const getSubscriptionTransactions = async (subscriptionId, options = {}) => {
  const { page, limit } = normalizePagination(options.page, options.limit);
  const filter = { subscription: subscriptionId };

  if (options.status) {
    filter.status = options.status;
  }

  const paymentDate = buildDateFilter(options.fromDate, options.toDate);
  if (paymentDate) {
    filter.paymentDate = paymentDate;
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ paymentDate: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getUserTransactions = async (userId, options = {}) => {
  const { page, limit } = normalizePagination(options.page, options.limit);
  const subscriptionFilter = { user: userId };

  if (options.subscriptionId) {
    subscriptionFilter._id = options.subscriptionId;
  }

  const subscriptions = await Subscription.find(subscriptionFilter, { _id: 1 });
  const subscriptionIds = subscriptions.map((sub) => sub._id);

  if (subscriptionIds.length === 0) {
    return {
      transactions: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const filter = {
    subscription: { $in: subscriptionIds },
  };

  if (options.status) {
    filter.status = options.status;
  }

  const paymentDate = buildDateFilter(options.fromDate, options.toDate);
  if (paymentDate) {
    filter.paymentDate = paymentDate;
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ paymentDate: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export default {
  createTransactionForSubscription,
  getSubscriptionTransactions,
  getUserTransactions,
};

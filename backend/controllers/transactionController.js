const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    // Save to MongoDB
    await Transaction.insertMany(data);
    res.status(200).json({ message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const query = {
    dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
    $or: [
      { productTitle: { $regex: search, $options: 'i' } },
      { productDescription: { $regex: search, $options: 'i' } },
      { price: { $regex: search } }
    ]
  };

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  res.status(200).json(transactions);
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  const totalSales = await Transaction.aggregate([
    { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
    { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSoldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } }, totalUnsoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } } } }
  ]);

  res.status(200).json(totalSales[0]);
};

exports.getBarChartData = async (req, res) => {
  const { month } = req.query;

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    // Continue for other ranges...
  ];

  const data = await Promise.all(
    priceRanges.map(async (range) => {
      const count = await Transaction.countDocuments({
        dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') },
        price: { $gte: range.min, $lte: range.max },
      });
      return { range: range.range, count };
    })
  );

  res.status(200).json(data);
};

exports.getPieChartData = async (req, res) => {
  const { month } = req.query;

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  res.status(200).json(categories);
};

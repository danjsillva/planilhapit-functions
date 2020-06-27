'use strict';

const axios = require('axios');

module.exports.quotation = async event => {
  const symbol = event.queryStringParameters.symbol
  const response = (await axios.get(`https://api.hgbrasil.com/finance/stock_price?key=1c0aeaa5&symbol=${symbol}`)).data;

  return {
    headers: { "Access-Control-Allow-Origin" : "*" },
    statusCode: 200,
    body: JSON.stringify({ ...response.results }, null, 2),
  };
};

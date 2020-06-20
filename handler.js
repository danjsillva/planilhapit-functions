'use strict';

const axios = require('axios');

module.exports.quotation = async event => {
  const label = event.queryStringParameters.label
  const response = (await axios.get(`https://api.hgbrasil.com/finance/stock_price?key=1c0aeaa5&symbol=${label}`)).data;

  return {
    statusCode: 200,
    body: JSON.stringify({ ...response.results }, null, 2),
  };
};

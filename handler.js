"use strict";

const axios = require("axios");
const uuid = require("uuid");
const AWS = require("aws-sdk");

AWS.config.update({ region: "sa-east-1" });

const DynamoDB = new AWS.DynamoDB.DocumentClient();

exports.getQuotation = async (event) => {
  const symbol = event.queryStringParameters.symbol;
  const response = (
    await axios.get(
      `https://api.hgbrasil.com/finance/stock_price?key=1c0aeaa5&symbol=${symbol}`
    )
  ).data;

  return {
    headers: { "Access-Control-Allow-Origin": "*" },
    statusCode: 200,
    body: JSON.stringify({ ...response.results }, null, 2),
  };
};

exports.setLog = async (event) => {
  try {
    const ip = event.requestContext.identity.sourceIp;
    const response = (await axios.get(`http://ip-api.com/json/${ip}`)).data;

    const params = {
      TableName: "LogsTable",
      Item: {
        id: uuid.v1(),
        ip,
        ...response,
        createdAt: new Date().toISOString(),
      },
    };

    await DynamoDB.put(params).promise();

    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 201,
    };
  } catch (error) {
    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 555,
      body: JSON.stringify({ ...error }, null, 2),
    };
  }
};

exports.getLog = async (event) => {
  try {
    const params = {
      TableName: "LogsTable",
    };

    const data = await DynamoDB.scan(params).promise();

    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 200,
      body: JSON.stringify({ ...data }, null, 2),
    };
  } catch (error) {
    return {
      headers: { "Access-Control-Allow-Origin": "*" },
      statusCode: 500,
      body: JSON.stringify({ ...error }, null, 2),
    };
  }
};

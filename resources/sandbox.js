const AWS = require('aws-sdk');
const client = require('data-api-client');

const bucketName = process.env.BUCKET;

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ message: 'Hello, world!' }),
  };
}

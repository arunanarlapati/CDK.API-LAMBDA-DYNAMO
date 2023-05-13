/*const AWS = require("aws-sdk");
const dynamodb = new AWS.dynamodb;
const tableName = process.env.TABLE_NAME || "";
*/
const AWS = require('aws-sdk');
exports.handler = async function (event) {
  
  const dynamodb = new AWS.DynamoDB();
  const res = await dynamodb.scan({
    TableName : process.env.TABLE_NAME,
  }).promise();
  
  const items = res.Items;

  if(!items){
    return{
      statusCode:404,
      body: JSON.stringify({message: "No Items"}),
    }
  }

  return{
    statusCode:200,
    body: JSON.stringify({
      devices: items.map(
        (value=>AWS.DynamoDB.Converter.unmarshall(value)),
      )
    }),
  }
  /*console.log("request:", JSON.stringify(event));
  
    // return response back to upstream caller
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(tableName),
    };*/
  };
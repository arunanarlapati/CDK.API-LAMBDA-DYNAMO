
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.handler = async function (event) {
    
    const tableName = process.env.TABLE_NAME;

    console.info('received:', event);
    const body = JSON.parse(event.body);
    const id = body.id;
    const devicename = body.devicename;
    const devicetype = body.devicetype;
    const devicelocation = body.devicelocation;
    const roomtemp = body.roomtemp;
    const humidity = body.humidity;
    const lightstatus = body.lightstatus;

    var params = {

        TableName: tableName,
        Item: {id: id, devicename: devicename, devicetype: devicetype,devicelocation: devicelocation,
            roomtemp: roomtemp,humidity: humidity,lightstatus: lightstatus}
    };

    const result = await docClient.put(params).promise();

    const response = {
        statuscode: 200,
        body: JSON.stringify({message: "Successfully uploaded"})
    };

    return response;
}
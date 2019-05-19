"use strict";

const AWS = require("aws-sdk");
const TABLE_NAME = "newWorld2";

module.exports.hello = async (event, context, callback) => {
    console.log("hello");
    console.log("again");

    let dynamodb = getDynamoClient(event);
    let s3 = getS3Client(event);

    try {
        // scanの実行
        const scanItems = await dynamodb.scan({TableName: TABLE_NAME}).promise();
        
        // queryの実行
        const queryItems = await dynamodb.query({
            TableName: TABLE_NAME, 
            KeyConditionExpression: "#ID = :ID",
            ExpressionAttributeNames: {"#ID": "key"},
            ExpressionAttributeValues: {":ID": "id001"}
        }).promise();

        // scanとqueryの結果をreturnする
        return {
            statusCode: 200,
            body: JSON.stringify({
                scanItems: scanItems,
                query: queryItems,
            }, null, 2),
        };
    } catch (err) {
        
        // エラー発生時はエラー文をreturnする
        console.error(`[Error]: ${JSON.stringify(err)}`);
        return err;
    }
};

const getDynamoClient = function (event) {
    let dynamodb = null;
    if ("isLocal" in event && event.isLocal) {
        dynamodb = new AWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        });
    } else { 
        dynamodb = new AWS.DynamoDB.DocumentClient({
            region: "ap-northeast-1"
        });
    }
    return dynamodb;
};

const getS3Client = function (event) {
    let s3 = null;
    if ("isLocal" in event && event.isLocal) {
        s3 = new AWS.S3({
            s3ForcePathStyle: true,
            // endpoint: "http://localhost:8000"
            endpoint: new AWS.Endpoint("http://localhost:8000"),
        });
    } else { 
        s3 = new AWS.S3({
            region: "ap-northeast-1"
        });
    }
    return s3;
};

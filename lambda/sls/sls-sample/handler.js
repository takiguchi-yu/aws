"use strict";

const AWS = require("aws-sdk");
const TABLE_NAME = "newWorld2";
const S3 = new AWS.S3({apiVersion: "2006-03-01"});

module.exports.hello = async (event, context, callback) => {
    console.log("hello");
    console.log("again");

    let dynamodb = getDynamoClient(event);
    // let s3 = getS3Client(event);
    
    try {
    
        // s3 バケット一覧取得
        await S3.listBuckets(function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Buckets);
            }
        }).promise();

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

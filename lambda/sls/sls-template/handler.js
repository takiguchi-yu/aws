"use strict";

const AWS = require("aws-sdk");
const TABLE_NAME = "account_list";
const S3 = new AWS.S3();

module.exports.hello = async (event, context, callback) => {
    console.log("---------- hello ----------");
    // console.log(JSON.stringify(event.Records[0]));

    let dynamodb = getDynamoClient(event);
    
    try {
        // dynamoDB から 1件取得
        const item = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: {
                "key": "id001"
            }
        }).promise();
        console.log(item);

        // s3 バケット一覧取得
        const s3list = await S3.listBuckets(function(err, data) {
            if (err) {
                return err;
            } else {
                return data.Buckets;
            }
        }).promise();

        console.log(s3list);

        // scanとqueryの結果をreturnする
        return {
            statusCode: 200,
            body: JSON.stringify({
                getItem: item
            }, null, 2),
        };

    } catch (err) {
        
        // エラー発生時はエラー文をreturnする
        console.error(`[Error]: ${JSON.stringify(err)}`);
        return err;
    }
};

const getDynamoClient = function (event) {
    if ("isLocal" in event && event.isLocal) {
        return new AWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        });
    } else { 
        return new AWS.DynamoDB.DocumentClient({
            region: "ap-northeast-1"
        });
    }
};

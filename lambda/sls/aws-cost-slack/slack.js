const https = require ('https');
const url = require('url');
const cost = require('./cost.js');
const ENDPOINT = process.env.SLACK_ENDPOINT_URL;
const PAYLOAD  = {
  "channel": process.env.SLACK_CHANNEL,
  "username": process.env.SLACK_USERNAME,
  "text": "",
  "icon_url": ""
};

/**
 * Slackへ料金情報を投稿処理
 * 
 * @param data 料金集計結果のJSON
 * @return Slackへ投稿リクエストを投げた結果のレスポンス
 */
const postSlack = function requestToAPI(data) {
  console.log(`■□■□ Slackへ料金情報を投稿処理 ■□■□`);
  return new Promise(
    (resolve, reject) => { 
      const s3  = isNaN(data.serviceBy["Amazon Simple Storage Service"]) ? 0 : data.serviceBy["Amazon Simple Storage Service"];
      const cw  = isNaN(data.serviceBy["AmazonCloudWatch"]) ? 0 : data.serviceBy["AmazonCloudWatch"];
      const cf  = isNaN(data.serviceBy["Amazon CloudFront"]) ? 0 : data.serviceBy["Amazon CloudFront"];
      const ct  = isNaN(data.serviceBy["AWS CloudTrail"]) ? 0 : data.serviceBy["AWS CloudTrail"];
      const la  = isNaN(data.serviceBy["AWS Lambda"]) ? 0 : data.serviceBy["AWS Lambda"];
      const ec2 = (isNaN(data.serviceBy["Amazon Elastic Compute Cloud - Compute"]) ? 0 : data.serviceBy["Amazon Elastic Compute Cloud - Compute"]) + (isNaN(data.serviceBy["EC2 - Other"]) ? 0 : data.serviceBy["EC2 - Other"]);
      PAYLOAD.text = `今月（${cost.month1}〜${cost.yesterday}）のAWSの使用料は以下の通りです。\n\n`
                    + `\*${process.env.AWS_ACCOUNT_NAME}\* アカウント\n\n`
                    + "```"
                    + `・S3         : $ ${Math.round(s3  * 10) / 10}\n`
                    + `・CloudWatch : $ ${Math.round(cw  * 10) / 10}\n`
                    + `・CloudFront : $ ${Math.round(cf  * 10) / 10}\n`
                    + `・CloudTrail : $ ${Math.round(ct  * 10) / 10}\n`
                    + `・Lambda     : $ ${Math.round(la  * 10) / 10}\n`
                    + `・EC2        : $ ${Math.round(ec2 * 10) / 10}\n`
                    + `・Others     : $ ${Math.round((data.totalCost - s3 - cw - cf - ct - la - ec2) * 10) / 10}\n`
                    + `--------------------------------\n`
                    + `・Total      : $ ${Math.round(data.totalCost * 10) / 10}\n\n`
                    + `※ 金額は、ディスカウント適用前で、端数切捨てです。\n`
                    + "```";

      console.log('■□■□■□ SlackへPOSTリクエスト:\n' + JSON.stringify(data));

      const parser = url.parse(ENDPOINT);
      let req, body = '';

      let options = {
        host : parser.host,
        port : 443,
        path : parser.path,
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${process.env.SLACK_API_TOKEN}`, 
        }
      };

      /* APIへのリクエスト */
      req = https.request(options, (res) => {
        res.setEncoding('utf8');
        /* レスポンスボディのデータ読み込み処理（dataイベント発生）*/
        res.on('data', (chunk) => {
          body += chunk;
        });
        /* 読み込むデータが無くなった時の処理（endイベント発生） */
        res.on('end', () => {
          if(res.statusCode == 200) {
            console.log('■□■□ レスポンス情報 ');
            console.log(body);
            resolve(body);
          } else {
            console.log('■□■□ レスポンス情報なし ');
          }
        });
      });

      req.write(JSON.stringify(PAYLOAD)); 
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
        reject(e);
      });
      req.end();
  });
}

module.exports = {
  postSlack,
}

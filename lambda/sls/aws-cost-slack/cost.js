const moment = require('moment');
const AWS = require('aws-sdk');
// us-east-1 じゃないと、この API は使えない
const costexplorer = new AWS.CostExplorer({region: 'us-east-1'});

/* yyyy-mm-ddの書式で、集計の開始日と終了日をセット */
const month1    = moment().set('date', 1).format('YYYY-MM-DD');
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');


/* request body　*/
const PARAMS = {
   "Granularity": 'MONTHLY', // DAILY, MONTHLY
   "GroupBy": [
     {
       "Type": 'DIMENSION',
       "Key": 'SERVICE',
     }
   ],
   "Metrics": [ 'UnblendedCost' ],
   "TimePeriod": { 
      "Start": month1,
      "End": yesterday,
   },
};

/**
 * Cost Management APIsから料金情報の取得処理
 * 
 * @return AWSから取得した料金情報
 */
const getCost = function getCost() {
  console.log(`■□■□ Cost Management APIsから料金情報の取得処理 ■□■□`);
  return new Promise (
    (resolve) => {  
      costexplorer.getCostAndUsage(PARAMS, (err, data) => {
        if (err) {
          console.error(err, err.stack);
          return;
        }
        resolve(data);
      });
    }
  );
}

module.exports = {
  getCost,
  yesterday,
  month1,
};

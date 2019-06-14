const moment = require('moment');
const _ = require('lodash');  // https://lodash.com/docs/

/**
 * 使用料金の計算処理
 * 
 * @param data AWSから取得した料金情報
 * @return 料金集計結果のJSON
 */
const costCalc = function costCalc(data) {
  console.log(`■□■□ 使用料金の計算処理 ■□■□`);
  return new Promise (
    (resolve) => {
      let serviceBy = {};
      let totalCost = 0;
      /* サービス単位で集計 */
      _.forEach(data.ResultsByTime, function(value, key) {  // 料金部分を抽出
        _.forEach(value.Groups, function(service, key) {    // AWSサービス単位で料金を抽出して加算
          let amt = service.Metrics.UnblendedCost.Amount;
          (service.Keys[0] in serviceBy) ? serviceBy[service.Keys[0]] += Number(amt) : serviceBy[service.Keys[0]] = Number(amt);
        });
      });
      /* 合計金額 */
      _.forEach(serviceBy, function(value, key) {
        totalCost += Number(value);
      });
      resolve({serviceBy, totalCost});
    }
  );
}

module.exports = {
  costCalc, 
}

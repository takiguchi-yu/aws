/**
 * AWS の料金を集計
 *
 */
const cost  = require('./cost.js');
const calc  = require('./calc.js');
const slack = require('./slack.js');

/**
 * メイン処理
 * 
 */
module.exports.awsCost = async (evnet) => {
  // コストを取得
  let costRaw  = await cost.getCost();
  // コストを計算
  let costJson = await calc.costCalc(costRaw);
  // 計算したコストを slack に通知
  let result   = await slack.postSlack(costJson);
  return result;
};

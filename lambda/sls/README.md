# Serverless Framework

## はじめに
Lambda をやってみたけどソースコードが大きいと表示できなくなるため、
ローカルである程度のできないかなと思ったので、その方法をまとめておく。

調べたところ Serverless Framework を使えば、ローカルで開発したソースコードをlambda に
デプロイしたり、デプロイしたソースコードを実行することが可能らしいので試してみる。

あわよくばデバッグができないかなとも思っているので、その方法もまとめる。

公式
https://serverless.com/

参考
https://dev.classmethod.jp/cloud/aws/serverless-first-serverlessframework/

## 前提
* 環境は `mac`
* node `v10.14.2`
* npm `6.4.1`
* エディタは `VSCode`
* Serverless Framework は `1.42.3`
* `npm` はインストール済み
* `AWS アカウント` は作成済み
* `credentials` はローカルに配置済み

## 概要図
<img width="676" alt="スクリーンショット 2019-05-18 16 56 17" src="https://user-images.githubusercontent.com/8340629/57966509-b5dcb200-798d-11e9-8be5-e43967aca437.png">

## Serverless Framework インストール
```bash
$ npm install serverless -g
$ sls -v
1.42.3

# アップデートする場合
$ npm update -g serverless
```
## Serverless サービス作成
```bash
$ serverless create --template aws-nodejs --path sls-sample

# 使用可能なテンプレートは以下で確認
$ sls create --help
```
### ヘルプ
---
`--template` or `-t` 利用可能なテンプレートの1つの名前。 --template-urlと--template-pathが存在しない場合は必須です。
--`template-url` or `-u` 利用可能なテンプレートの1つの名前。 --templateと--template-pathが存在しない場合は必須です。
`--template-path` テンプレートのローカルパス--templateと--template-urlが存在しない場合は必須です。
`--path` or `-p` サービスを作成する場所のパス。
`--name` or `-n` serverless.yml内のサービスの名前。

## Serverless デプロイ
```bash
$ cd sls-sample
$ sls deploy -v
```

## デプロイした Lambda Function 実行
```bash
$ sls invoke -f hello
```
### ヘルプ
```
$ sls invoke --help
Plugin: Invoke
invoke ........................ Invoke a deployed function
invoke local .................. Invoke function locally
    --function / -f (required) ......... The function name
    --stage / -s ....................... Stage of the service
    --region / -r ...................... Region of the service
    --path / -p ........................ Path to JSON or YAML file holding input data
    --type / -t ........................ Type of invocation
    --log / -l ......................... Trigger logging data output
    --data / -d ........................ Input data
    --raw .............................. Flag to pass input data as a raw string
```

## serverless.yml
設定ファイルについては以下を参照。
https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/

## Lambda 以外の AWS サービス構築
試してはいないが、 `cloudformation` チックな記述方法でデプロイ時にDynamoDB他、
AWSサービスを作成することが可能。

## Severless サービス削除
```bash
$ sls remove -v
```

## ローカル開発環境を整える
### 概要図
<img width="673" alt="スクリーンショット 2019-05-19 19 15 52" src="https://user-images.githubusercontent.com/8340629/57980777-52748200-7a6a-11e9-9231-0cfc2fe6add1.png">

### 初期設定
```bash
$ npm install serverless -g
$ npm install # package.json をもとに依存関係をインストール
```
以下はただのインストールメモ
```bash
$ npm install serverless -g
$ npm install eslint --save-dev
$ npm install aws-sdk --save
$ npm install serverless-dynamodb-local --save-dev
```

### DynamoDB Local
* DynamoDB
https://serverless.com/plugins/serverless-dynamodb-local/
https://qiita.com/noralife/items/e36621ddd0e5b8ff4447

```bash
# プラグインをインストール
$ npm install serverless-dynamodb-local --save-dev

# serverless.yml に以下を追記
plugins:
  - serverless-dynamodb-local
```

```bash
# プラグインを使って DynamoDB Local をインストール
$ sls dynamodb install
```

```bash
# DynamoDB Local 起動
$ sls dynamodb start
```

```bash
# 初期データ投入
$ aws dynamodb batch-write-item --request-items file://migrations/dynamodb.json --endpoint-url http://localhost:8000
```

```bash
# 以下にアクセス
http://localhost:8000/shell

# 以下を左記に入力し、▷ボタンを押下
var params = {
    TableName: 'テーブル名',
};
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err);
    else ppJson(data);
});
```

### S3 Local インストール
* S3
https://serverless.com/plugins/serverless-s3-local/

```bash
# プラグインをインストール
$ npm install serverless-s3-local --save-dev

# serverless.yml に以下を追記
plugins:
  - serverless-s3-local
```

```bash
# プラグインを使って DynamoDB Local をインストール
$ sls plugin install --name serverless-s3-local
```

```bash
# DynamoDB Local 起動
$ sls s3 start
```

### 実行方法
```bash
$ sls invoke local -f { function name }

# sample
sls invoke local -f hello -p testdata/test001.json
```
https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/

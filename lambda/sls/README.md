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

## ローカルで AWS サービスを利用
plugin を利用すれば各種 AWS サービスが利用可能になる。
* DynamoDB
https://serverless.com/plugins/serverless-dynamodb-local/
* S3
https://serverless.com/plugins/serverless-s3-local/

<p class="ec__link-index"><a href="#index">[↑ 目次へ]</a></p>

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

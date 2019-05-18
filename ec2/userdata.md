# aws-ec2-user-data

EC2 ユーザーデータ
```
#!/bin/bash

# ホスト名
sed -i 's/^HOSTNAME=[a-zA-Z0-9\.\-]*$/HOSTNAME={任意のホスト名}/g' /etc/sysconfig/network
hostname '{任意のホスト名}'

# タイムゾーン
cp /usr/share/zoneinfo/Japan /etc/localtime
sed -i 's|^ZONE=[a-zA-Z0-9\.\-\"]*$|ZONE="Asia/Tokyo”|g' /etc/sysconfig/clock

# 言語設定
echo "LANG=ja_JP.UTF-8" > /etc/sysconfig/i18n

# yum update
yum update -y
```
参考
https://www.ketancho.net/entry/2018/06/12/074000

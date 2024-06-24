#!/bin/bash

# Thực hiện lệnh chmod để thay đổi quyền trên tệp keyfile
chmod 600 /mongodb-keyfile.key

# Khởi chạy MongoDB với keyfile và cấu hình khác nếu cần
mongod  --bind_ip_all --keyFile /mongodb-keyfile.key --replSet "rs0"

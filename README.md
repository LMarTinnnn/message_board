# message_board

My first front-end project
Powered by Node.js/Express/MondoDB

安装 Node.js

我们下载编译好的 Node.js 压缩包，解压然后使用软连接。

wget https://nodejs.org/dist/v8.9.1/node-v8.9.1-linux-x64.tar.xz
tar -xvf node-v8.9.1-linux-x64.tar.xz
mv node-v8.9.1-linux-x64 nodejs
ln -s ~/nodejs/bin/* /usr/local/bin/
node -v
npm -v
安装 MongoDB

wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-3.4.10.tgz
tar -xvf mongodb-linux-x86_64-ubuntu1604-3.4.10.tgz
mv mongodb-linux-x86_64-ubuntu1604-3.4.10 mongodb
ln -s ~/mongodb/bin/* /usr/local/bin/
mongod --version
mongo --version
mkdir mongodb/data
mongod --dbpath=mongodb/data &
安装 Git

apt-get update
apt-get install git
git clone https://github.com/nswbmw/N-blog.git #或者你的 GitHub blog 地址
cd N-blog
npm i
vim config/default.js #修改端口 3000->80
node index
此时，浏览器中访问你的机器的公网 ip 试试吧。

使用 PM2 启动

npm i pm2 -g
ln -s ~/nodejs/bin/* /usr/local/bin/
pm2 start index.js --name="myblog"
这里我们使用 pm2 启动博客，所以关掉终端后博客仍然在运行。

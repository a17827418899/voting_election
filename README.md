# voting_election

voting_election

### Development

```bash

### 本地运行指南

1、导入数据库

将根目录下的voting_election.sql文件导入到数据库中

2、本地运行

$ npm i

$ npm install egg egg-sequelize mysql2 egg-redis nodemailer jsonwebtoken --save

$ npm run dev

$ 访问 http://localhost:8090/

3、若要进行接口调试
将根目录下的 New Collection.postman_collection.json 文件导入到自己的本地postman即可

```

### Deploy

```bash

$ npm start

$ npm stop

```

### npm scripts

- Use npm run lint to check code style.

- Use npm test to run unit test.

- Use npm run autod to auto detect dependencies upgrade, see autod for more detail.
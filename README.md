**# voting_election**

voting_election

**### Development**



\```bash

**### 本地运行指南**

1、导入数据库

将根目录下的voting_election.sql文件导入到数据库中

2、本地运行

$ npm i

$ npm install egg egg-sequelize mysql2 egg-redis nodemailer jsonwebtoken --save

$ npm run dev

$ 访问 http://localhost:8090/

\```



**### Deploy**



\```bash

$ npm start

$ npm stop

\```



**### npm scripts**



\- Use `npm run lint` to check code style.

\- Use `npm test` to run unit test.

\- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.



[egg]: https://eggjs.org
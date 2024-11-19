// express 모듈 가져오기
const express = require('express')
// 새로운 Express 앱 만들기
const app = express()
// 포트번호 설정
const port = 5000
// 몽구스 가져오기
const mongoose = require('mongoose')
// body-parser 가져오기
const bodyParser = require('body-parser');
// User 가져오기
const { User } = require("./models/User");
const config = require('./config/key');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))
// 루트디렉토리에 문자열 출력
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', async (req, res) => {
    // 회원가입 시 필요한 정보들을 client에서 가져오고,
    const user = new User(req.body)
    // 데이터베이스에 넣어준다.
    try {
        const userInfo = await user.save(); // await 사용
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err); // 에러 로깅
        return res.status(400).json({ success: false, message: '회원가입에 실패했습니다.', err });
    }
})

// 포트 5000번에서 실행
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
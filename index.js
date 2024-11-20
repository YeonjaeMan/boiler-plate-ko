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
// cookie-parser 가져오기
const cookieParser = require('cookie-parser');
const config = require('./config/key');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

app.use(cookieParser());

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

app.post('/login', async (req, res) => {
    try {
        // 요청된 이메일을 데이터베이스에서 확인
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        // 비밀번호가 일치하는지 확인
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
        }
        // 비밀번호가 일치한다면 토큰을 생성하기
        const token = await user.generateToken();
        // 토큰을 쿠키에 저장
        res.cookie("x_auth", token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "서버 오류가 발생했습니다.", err });
    }
    // // 요청된 이메일을 데이터베이스에 존재하는지 확인
    // User.findOne({ email: req.body.email }, (err, user) => {
    //     if (!user) {
    //         return res.json({
    //             loginSuccess: false,
    //             message: "제공된 이메일에 해당하는 유저가 없습니다."
    //         });
    //     }
    //     // 요청된 이메일이 데이터베이스에 존재한다면 비밀번호가 일치하는지 확인
    //     user.comparePassword(req.body.password, (err, isMatch) => {
    //         if (!isMatch)
    //             return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
    //         // 비밀번호가 일치한다면 토큰을 생성하기
    //         user.generateToken((err, user) => {
    //             if (err) return res.status(400).send(err);
    //             // 토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지, 세션
    //             res.cookie("x_auth", user.token)
    //                 .status(200)
    //                 .json({ loginSuccess: true, userId: user._id });
    //         });
    //     });
    // });
});

// 포트 5000번에서 실행
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
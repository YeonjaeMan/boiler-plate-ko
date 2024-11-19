// express 모듈 가져오기
const express = require('express')
// 새로운 Express 앱 만들기
const app = express()
// 포트번호 설정
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yeonjae:247247@boiler-plate.hsndl.mongodb.net/?retryWrites=true&w=majority&appName=boiler-plate')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))
// 루트디렉토리에 문자열 출력
app.get('/', (req, res) => res.send('Hello World!'))
// 포트 5000번에서 실행
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
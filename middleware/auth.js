const { User } = require('../models/User');

// 인증 처리를 하는 곳
let auth = async (req, res, next) => {
    // 클라이언트 쿠키에서 토큰을 가져오기
    let token = req.cookies.x_auth;

    try {
        // 토큰을 복호화한 후 유저를 찾기
        const user = await User.findByToken(token);
        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        req.token = token;
        req.user = user;
        next(); // 인증 성공 시 다음 미들웨어로 넘어감
    } catch (err) {
        return res.status(500).json({ isAuth: false, error: true });
    }
};


module.exports = { auth };
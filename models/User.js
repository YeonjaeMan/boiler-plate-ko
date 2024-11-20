const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // john ahn@naver.com << 띄어쓰기 제거 활성화
        unique: 1
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    // 비밀번호 수정 시에만 동작
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
    // 비밀번호 수정이 아닐 시
    else {
        next();
    }
});

userSchema.methods.comparePassword = async function (plainPassword) {
    try {
        const isMatch = await bcrypt.compare(plainPassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ id: this._id }, "secretToken");
    this.token = token;
    await this.save();
    return token;
};

// userSchema.methods.comparePassword = function (plainPassword, cb) {
//     // plainPassword : 12345
//     // 암호화된 비밀번호 : $2b$10$7ooVSV9vq4HTOefzBwRjeeflSmaYU7MGkBaqcgoMxvSeIWk5GkRAa
//     bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

// userSchema.methods.generateToken = function (cb) {
//     var user = this;
//     // jsonwebtoken을 이용해서 token을 생성하기
//     var token = jwt.sign(user._id.toHexString(), 'secretToken');
//     // user._id + 'secretToken' = token
//     user.token = token;
//     user.save(function (err, user) {
//         if (err) return cb(err);
//         cb(null, user);
//     });
// };

const User = mongoose.model('User', userSchema)

module.exports = { User }
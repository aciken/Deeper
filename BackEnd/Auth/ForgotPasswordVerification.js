const User = require('../DataBase/User');

const ForgotPasswordVerification = async (req, res) => {
    const { email, code } = req.body;
        try {
      console.log(email,code)
        const user = await User.findOne({ email, resetCode: code });

        if(user){
            console.log('User found')
            res.json(user);
        } else{
            res.json("failed");
        }
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = ForgotPasswordVerification;
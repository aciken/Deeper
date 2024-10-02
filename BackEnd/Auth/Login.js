const User = require('../DataBase/User');

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Logging in')
        const user = await User.findOne({ email, password });

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

module.exports = Login;
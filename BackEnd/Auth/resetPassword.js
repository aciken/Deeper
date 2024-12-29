const User = require('../DataBase/User');

const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Resetting password', email, password)
        const user = await User.findOne({ email });

        if(user){
            await User.findByIdAndUpdate(user._id, { password: password });
            await User.findByIdAndUpdate(user._id, { resetCode: 0 });
            console.log('success')
            res.json("success");
        } else{
            res.json("failed");
        }
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = resetPassword;
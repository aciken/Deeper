const User = require('../DataBase/User');

const Verify = async (req, res) => {
    const { id, code } = req.body;
    const user = await User.findById(id);
    console.log(user.verify, code, user.email);
    if(user.verify == code){
        user.verify = 1;
        await user.save();
        res.json(user);
    } else{
        res.json("failed");
    }
}


module.exports = Verify;
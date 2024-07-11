const User = require('../DataBase/User');

const GetUser = async (req, res) => {
    const {email} = req.body;
    console.log('getting user')
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.json(user);
        } else {
            res.json('User not found');
        }
} catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
}

module.exports = GetUser;

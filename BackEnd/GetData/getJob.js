const User = require('../DataBase/User');

const GetJob = async (req, res) => {
    const {id} = req.body;
    console.log('getting user')
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            res.json(user.work);
        } else {
            res.json('User not found');
        }
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
}

module.exports = GetJob;

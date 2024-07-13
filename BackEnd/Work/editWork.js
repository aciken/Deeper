const User = require('../DataBase/User');

const editWork = async (req, res) => {
    const {data, email, clicked, index} = req.body;

    const num = clicked-1

    try {
        const user = await User.findOne({ email });
        if(user){
            user.array[num][index] = data;
            user.markModified('array');
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
} catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = editWork;
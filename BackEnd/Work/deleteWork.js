const User = require('../DataBase/User');

const deleteWork = async (req, res) => {
    const { email, clicked, index } = req.body;

    const num = clicked-1

    try {
        const user = await User.findOne({ email });

        if(user){
            user.array[num].splice(index, 1);
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

module.exports = deleteWork;
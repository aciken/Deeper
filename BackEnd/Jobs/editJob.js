const User = require('../DataBase/User');

const EditJob = async (req, res) => {
    const { id, index, editWork } = req.body;
    console.log('editing job')
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.work[index] = editWork;
        }
        await user.save();
        res.json(user);
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
}

module.exports = EditJob;
const User = require('../DataBase/User');

const AddJob = async (req, res) => {
    const { id, job } = req.body;
    console.log('adding job')
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.goals.push(job);
        }
        await user.save();
        res.json(user.goals);
    } catch (error) {
        console.error('Error occurred:', error); // More detailed error logging
        res.status(400).json({ message: error.message });
    }
}

module.exports = AddJob;

const User = require('../DataBase/User');

const DeleteJob = async (req, res) => {
    const { id, index } = req.body;
    console.log('deleting job')
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            user.work.splice(index, 1);
        }
        await user.save();
        res.json(user.work);
    } catch (error) {
        console.error('Error occurred:', error); 
        res.status(400).json({ message: error.message });
    }
}

module.exports = DeleteJob;
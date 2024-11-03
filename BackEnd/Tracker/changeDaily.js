const User = require('../DataBase/User');

const changeDaily = async (req, res) => {
    const { id, change } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { 'tracker.daily.daily': change },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating daily tracker:', error);
        res.status(500).json({ message: 'Error updating daily tracker' });
    }
}

module.exports = changeDaily;

const User = require('../DataBase/User');

const RestartNumber = async (req, res) => {
    const { id } = req.body;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentDate = new Date();
        let modified = false;

        user.work.forEach(work => {
            if (work.updatedAt.toDateString() !== currentDate.toDateString()) {
                work.weeklyWork = 0;
                work.updatedAt = currentDate;
                modified = true;
            }
        });

        if (modified) {
            user.markModified('work');
            await user.save();
        }
        res.json(user);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: "An error occurred while restarting numbers" });
    }
}

module.exports = RestartNumber;


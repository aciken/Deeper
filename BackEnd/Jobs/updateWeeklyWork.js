const User = require('../DataBase/User');

const UpdateWeeklyWork = async (req, res) => {
    const { work, timeWorked, id } = req.body;
    try {
        const user = await User.findOne({ _id: id });
        if (user) {

            const workIndex = user.work.findIndex(job => job.name === work.name);
            if (workIndex !== -1) {
                if (user.work[workIndex].weeklyWork < timeWorked) {
                    user.work[workIndex].weeklyWork = timeWorked;
                }
                user.markModified('work');
                console.log(user.work[workIndex])
                await user.save();
                res.json(user.work);
            } else {
                res.status(404).json({ message: "Work not found" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = UpdateWeeklyWork;

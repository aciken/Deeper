const User = require('../DataBase/User');

const collectDaily = async (req, res) => {
    const { id, points, index } = req.body;
    
    try {
        const user = await User.findByIdAndUpdate(
            id,
            {
                $inc: { 'points.current': points },
                $push: { 'points.dailyDone': index }
            },
            { new: true }
        );
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = collectDaily;
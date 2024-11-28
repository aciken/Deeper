const User = require('../DataBase/User');

const collectGeneral = async (req, res) => {
    const { id, points, type} = req.body;
    
    try {
        let updateQuery;
        if (type === 'general') {
            updateQuery = {
                $inc: { 
                    'points.current': points,
                    'points.currentGeneral.0': 1
                }
            };
        } else {
            updateQuery = {
                $inc: {
                    'points.current': points,
                    'points.currentGeneralPlus.0': 1
                }
            };
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateQuery,
            { new: true }
        );
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = collectGeneral;
const User = require('../DataBase/User');

const createNewPreset = async (req, res) => {
    const { id, preset } = req.body;

    const user = await User.findOne({ _id: id });
    if(user){
        user.preset.push(preset);
        await user.save();
        res.status(200).json(user);
    }
}

module.exports = createNewPreset;


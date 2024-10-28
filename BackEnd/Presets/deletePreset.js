const User = require('../DataBase/User');

const deletePreset = async (req, res) => {
    const { id, presetIndex } = req.body;

    const user = await User.findOne({ _id: id });
    if(user){
        user.preset.splice(presetIndex, 1);
        await user.save();
        res.status(200).json(user);
    }
}

module.exports = deletePreset;



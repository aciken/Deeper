const User = require('../DataBase/User');

const editPreset = async (req, res) => {
    const { id, preset, presetIndex } = req.body;

    const user = await User.findOne({ _id: id });
    if(user){
        user.preset[presetIndex] = preset;
        await user.save();
        res.status(200).json(user);
    }
    else{
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = editPreset;
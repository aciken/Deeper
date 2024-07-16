const User = require('../DataBase/User');

const editWork = async (req, res) => {
    const {data, email, clicked, index} = req.body;

    const [startTime, startamPm] = data[0].split(' ');
    const [startHour, startMinute] = startTime.split(':');

    const [endTime, endamPm] = data[1].split(' ');
    const [endHour, endMinute] = endTime.split(':');

    let startPoints = 0;
    let endPoints = 0;

    if(startamPm == 'PM'){
        startPoints += 240;
    }

    if(startHour != 12){
    startPoints += startHour * 20;
    }
    startPoints += startMinute / 3;

    if(endamPm == 'PM'){
        endPoints += 240;
    }

    if(endHour != 12){
    endPoints += endHour * 20;
    }
    endPoints += endMinute / 3;

    data.push(startPoints);
    data.push(endPoints);

    const num = clicked-1

    console.log(data)

    try {
        const user = await User.findOne({ email });
        if(user){

            let counter = 0;

            for(let i = 0; i < user.array[num].length; i++){
                console.log(user.array[num][i])
                if(i == index){
                    counter++;       
                }
                if((startPoints > user.array[num][i][3] && startPoints >= user.array[num][i][4]) || (endPoints <= user.array[num][i][3] && endPoints < user.array[num][i][4])){

                    counter++;
                }
            }

            if(counter == user.array[num].length){
            user.array[num][index] = data;
            user.markModified('array');
            await user.save();
            res.json(user);
        } else {
            res.json('Time overlap')
        }
    } 
} catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = editWork;
const User = require('../DataBase/User');

const addWork = async (req, res) => {
    const { data, email, clicked } = req.body;
    console.log(data[0], data[1])

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

    console.log(data);


    const num = clicked-1

    try {

        const user = await User.findOne({email});


        if(user){

            console.log(user.array[num].length)

            let counter = 0;

            for(let i = 0; i < user.array[num].length; i++){
                console.log(user.array[num][i])
                if((startPoints > user.array[num][i][3] && startPoints >= user.array[num][i][4]) || (endPoints <= user.array[num][i][3] && endPoints < user.array[num][i][4])){
                    counter++;
                }
            }

            console.log(counter)

            if(counter == user.array[num].length){

            user.array[num].push(data);
            user.markModified('array');
            await user.save();
            res.json(user);
            } else {
                res.json('Time overlap');
            }

        }
        
} catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = addWork;
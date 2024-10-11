const User = require('../DataBase/User');

const addWork = async (req, res) => {
    const { data, id, clicked, dayIndices } = req.body;
    console.log(data[0], data[1])

    const [startTime, startamPm] = data[0].split(' ');
    const [startHour, startMinute] = startTime.split(':');

    const [endTime, endamPm] = data[1].split(' ');
    const [endHour, endMinute] = endTime.split(':');

    let startPoints = 0;
    let endPoints = 0;

    startPoints += startHour * 20;
    startPoints += startMinute / 3;

    endPoints += endHour * 20;
    endPoints += endMinute / 3;

    data.push(startPoints);
    data.push(endPoints);

    try {
        const user = await User.findOne({_id: id});

        if(user){
            console.log('data', data)

            let isOverlap = false;

            for (let dayIndex of dayIndices) {
                console.log('user array', user.array[dayIndex])

                let counter = 0;

                for(let i = 0; i < user.array[dayIndex].length; i++){
                    if((startPoints > user.array[dayIndex][i][4] && startPoints >= user.array[dayIndex][i][5]) || (endPoints <= user.array[dayIndex][i][4] && endPoints < user.array[dayIndex][i][5])){
                        counter++;
                    }
                }

                console.log('numbers', counter, user.array[dayIndex].length)
                if(counter == user.array[dayIndex].length){
                    console.log(user.array[dayIndex], data)
                    user.array[dayIndex].push(data);
                } else {
                    isOverlap = true;
                    break;
                }
            }

            if (!isOverlap) {
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
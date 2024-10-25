const User = require('../DataBase/User');

const addToSchedule = async (req, res) => {
    const { id, preset, clickedDates } = req.body;

    const user = await User.findOne({ _id: id });
    if(user){

        // Find the smallest start point and largest end point
        let smallestStartPoint = Infinity;
        let largestEndPoint = -Infinity;

        console.log('preset', preset)

        preset.sessions.forEach(session => {
            const startPoint = session[4];
            const endPoint = session[5];

            if (startPoint < smallestStartPoint) {
                smallestStartPoint = startPoint;
            }

            if (endPoint > largestEndPoint) {
                largestEndPoint = endPoint;
            }
        });

        console.log('smallestStartPoint', smallestStartPoint)
        console.log('largestEndPoint', largestEndPoint)

        // Remove tasks that overlap with the new preset
        clickedDates.forEach(date => {
            const dateIndex = date - 1;
            if (user.array[dateIndex]) {
                user.array[dateIndex] = user.array[dateIndex].filter(task => {
                    const taskStartPoint = task[4];
                    const taskEndPoint = task[5];

                    console.log(taskStartPoint, largestEndPoint);
                    console.log(taskEndPoint, smallestStartPoint);
                    
                    // Keep the task if it's completely outside the preset's time range
                    return taskStartPoint >= largestEndPoint || taskEndPoint <= smallestStartPoint;
                });
            }
        });

        // Add the new preset sessions to the schedule
        clickedDates.forEach(date => {
            const dateIndex = date - 1;
            if (!user.array[dateIndex]) {
                user.array[dateIndex] = [];
            }
            user.array[dateIndex] = [...user.array[dateIndex], ...preset.sessions];
        });


        await user.save();
        console.log(user);
        res.json(user);




        clickedDates.forEach(date => {
            
        })
    }
}

module.exports = addToSchedule;


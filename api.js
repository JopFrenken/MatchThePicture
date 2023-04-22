const db = require("./utils/Database.js");

// api endpoints
module.exports = (app) => {
    app.get([ '/api/leaderboard'], async (req, res) => {
        // retrieve users from db
        let users = await db.$.USER.GET_ALL();
        res.render('components/leaderboard', {
            users: users || []
        });
    })

    // save user score to database
    app.post([ '/api/score' ], async (req, res) => {
        const { body } = req;
        let { name, time } = body;

        if(name && time) {
            let result = await db.$.USER.SEND_SCORE({
                name: name,
                time: time
            });
        
            res.json({
                success: true
            })
        } else {
            res.json({
                success: false
            })
        }
    });
}
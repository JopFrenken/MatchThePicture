const db = require("./utils/Database.js");

module.exports = (app) => {
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
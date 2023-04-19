const apiRouter = require("./api.js");
const db = require("./utils/Database.js");

module.exports = (app) => {
    
    app.get([ '/' ], async (req, res) => {
        res.render('home');
    });

    app.get([ '/test' ], async (req, res) => {
        let user = await db.$.USER.GET_ONE("jop");
        console.log(user);
        res.render('test', {
            username: user.name
        })
    })
    
    apiRouter(app);
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });

}
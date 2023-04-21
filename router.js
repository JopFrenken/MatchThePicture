const apiRouter = require("./api.js");
const db = require("./utils/Database.js");

module.exports = (app) => {
    
    app.get([ '/' ], async (req, res) => {
        let images = await db.$.COUNTRIES.GET_ALL();
        let users = await db.$.USER.GET_ALL();

        const flags = images.map(image => { 
            return {
                image: image.image,
                attribute: image.attribute
            }
        }).sort(() => Math.random() - 0.5);

        const questions = images.map(image => {
            return {
                question: image.question,
                attribute: image.attribute
            }
        }).sort(() => Math.random() - 0.5);

        res.render('home', {
            flags,
            questions,
            users: users || []
        });
    });

    // app.get([ '/test' ], async (req, res) => {
    //     let user = await db.$.USER.GET_ONE("jop");
    //     res.render('test', {
    //         username: user.name
    //     })
    // })
    
    apiRouter(app);
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });

}
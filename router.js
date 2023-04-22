const apiRouter = require("./api.js");
const db = require("./utils/Database.js");

// routes for the app
module.exports = (app) => {
    // homepage route
    app.get([ '/' ], async (req, res) => {
        // gets users and images from db
        let images = await db.$.COUNTRIES.GET_ALL();
        let users = await db.$.USER.GET_ALL();

        // randomizes flag and questions from db
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

        // renders home with shuffled data
        res.render('home', {
            flags,
            questions,
            users: users || []
        });
    });

    // wildcard route, any route that doesn't match the others will render this
    app.use((req, res, next) => {
        // ignores api calls
        if(req.path.startsWith('/api')) {
            return next();
        }
        res.status(404).render('404');
    })
    
    // starts app server
    apiRouter(app);
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });

}
module.exports = (app) => {
    
    app.post([ '/api/login' ], async (req, res) => {
        res.json({
            success: true
        })
    });
    
}
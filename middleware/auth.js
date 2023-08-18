module.exports = {
    // once logged in moved to the next route
    ensureAauth: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }else{
            res.redirect('/')
        }
    },
    // Ensures that if logged in going back to the previous page (landing/login) is impossible
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }else{
            return next();
        }
    }
}
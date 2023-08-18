const express = require('express');
const router = express.Router();
const passport = require('passport');

// authenticate with google auth
router.get('/google', passport.authenticate('google', {scope: ['profile']}));

// Google auth callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) =>{
    res.redirect('/dashboard')
});

router.get('/logout', function(req, res, next){
    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

module.exports = router;
const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const Story = require('../models/Story')


// @desc Login/landing page
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
     layout: 'login',
  })
}),

// @desc Dashboard page
router.get('/dashboard', ensureAuth, (req, res) => {
  res.render('dashboard',{
    name: req.user.firstName,
  })
})

module.exports = router
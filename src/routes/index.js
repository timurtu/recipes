var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    user: req.user
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    user: req.user
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact',
    user: req.user
  });
});

router.get('/profile', (req, res) => {
  if (req.user) {
    res.render('profile', {
      title: 'Profile',
      user: req.user
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Log In',
    user: req.user
  })
})

module.exports = router

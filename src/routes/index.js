var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {

  if(req.user) {
    res.redirect('/recipes')
  } else {
    res.render('index', {
      title: 'Home',
      user: req.user
    })
  }
})

router.get('/family', (req, res) => {
  res.render('family', {
    title: 'Family',
    user: req.user
  })
})

router.get('/recipes', (req, res) => {
  res.render('recipes', {
    title: 'Recipes',
    user: req.user
  })
})

router.get('/create-family', (req, res) => {
  if(req.user) {
    res.render('create-family', {
      title: 'Create Family',
      user: req.user
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/join-family', (req, res) => {
  if(req.user) {
    res.render('join-family', {
      title: 'Join Family',
      user: req.user
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact',
    user: req.user
  })
})

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

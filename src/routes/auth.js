import express from 'express'
import passport from 'passport'

const router = express.Router()

// GET /auth/login/facebook
router.get('/login/facebook', passport.authenticate('facebook', {
  scope: ['email']
}))

// GET /auth/facebook/return
router.get('/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  (req, res) => {
    // Success auth redirect
    res.redirect('/profile')
  })

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

export default router

const express = require('express');
const router = express.Router();
const { verifyFirebaseCookie } = require('../middleware/authorization');
const { createEvent, getEventsonDate, getAllDates, viewNote, editNote, deleteEvent } = require('../controllers/userController');

// Route to create an event or get all available dates (basic endpoints)
router.route('/')
  .post(verifyFirebaseCookie, createEvent)
  .get(verifyFirebaseCookie, getAllDates);

// Route to get events on a specific date using route parameter
router.route('/date/:date')
  .get(verifyFirebaseCookie, getEventsonDate);

// Route to handle a specific event (view, edit, delete)
router.route('/event/:eventId')
  .get(verifyFirebaseCookie, viewNote)
  .patch(verifyFirebaseCookie, editNote)
  .delete(verifyFirebaseCookie, deleteEvent);

module.exports = router;



 // .get(verifyFirebaseCookie , async (req, res) => {
  //   try{

  //       console.log('Request made on protected path by user:', req.user.idToken.email);
  //       res.json({ message: 'Access granted to protected route' });
  //   }
  //   catch(err){
  //       console.log('No access since uid not present')
  //       return res.status(400).json({msg : "bad request"})
  //   }
  // });
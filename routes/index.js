var express = require('express');
var router = express.Router();

const 
  loginController = require('../controllers/loginController'),
  authMiddleware = require('../middleware/authMiddleware'),
  roomController = require('../controllers/roomController'),
  homeController = require('../controllers/homeController');


router.get('/jed/:roomName', authMiddleware, roomController.renderRoom); 

router.get('/', homeController.renderHome);
router.get('/jed',loginController.renderLogin);
router.post('/jed',loginController.submitLogin);


module.exports = router;
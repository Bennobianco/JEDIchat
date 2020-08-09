var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();
var rn;

const renderHome = (req, res) => {
  res.render('index', { title: 'JEDI12' });
};


const renderLogin = (req, res) => {
  res.render('login', { title: 'login'});
}

const renderRoom = (req, res) => {
  roomName = (req.params.roomName);
  res.render('index', { title: 'JEDI (JavascriptEmitDiscussionInterface)' , roomName: roomName});
  
  //console.log(roomName);
};

router.get('/jed/:roomName', renderRoom); 


/* GET home page. */
router.get('/', renderHome);
router.get('/jed', renderLogin);


module.exports = router;
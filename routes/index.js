var express = require('express');
var router = express.Router();

const renderHome = (req, res) => {
  res.render('index', { title: 'JEDI' });
};


/* GET home page. */
router.get('/', renderHome);
//router.get('/home', renderHome);

module.exports = router;
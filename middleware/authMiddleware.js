
//var parseurl = require('parseurl');
var AllSessions = [];
const userService = require('../services/userService');


 
 const auth = (req, res, next) => {
    
    
    //console.log(req.sessionID);
    
    //return true;

    
      // get the url pathname
      //var pathname = parseurl(req).pathname
     
      // count the views
      
      //console.log();

    if (req.session && req.session.isUser === true) {
      //console.log(req.session.nickname);
      //verify room, verifyuser
      //console.log(userService.verifyUser(req.session.nickname,req.session.roomName));
      //console.log(userService.verifyRoom(req.session.nickname,req.session.roomName));

        //AllSessions.push(req.sessionID);
        //console.log(req.session.views[pathname] = (req.session.views[pathname] || 0) + 1);
        next();
    } else {
         res.status(401);
         res.render('not-authorized');
    }
};
    
module.exports = auth;
  
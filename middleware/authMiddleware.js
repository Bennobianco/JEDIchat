
 const auth = (req, res, next) => {

    //console.log(req.session.isUser);
    //console.log(req.session.nickname);
    if (req.session && req.session.isUser === true) {
        next();
    } else {
         res.status(401);
         res.render('not-authorized');
    }
};
    
module.exports = auth;
  
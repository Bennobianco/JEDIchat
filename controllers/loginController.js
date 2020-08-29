var roomName1;
const userService = require('../services/userService')

const getRoom = (roomName) => {
    roomName1 = roomName;
    //console.log(roomname, this.roomName);
}

const renderLogin = (req, res) => {
    res.render('login', {
        heading: 'LOGIN site',
        nickname: req.body.nickname,
        roomExistst: req.body.roomExistst,
        roomNotExistst : req.body.roomNotExistst,
        userExists: req.body.userExists
    });
};

const submitLogin = (req, res) => {
    req.session.nickname = req.body.nickname;
    req.session.roomname = req.body.roomname;

    if (userService.verifyUser(req.body.nickname,roomName1)){ 
        req.session.isUser = true;
        if(userService.verifyRoom(req.body.roomname, roomName1) && (req.body.handleRoom == 'createRoom')) {
            res.redirect('/jed/' + req.body.roomname); 
        } else if (!userService.verifyRoom(req.body.roomname, roomName1) && (req.body.handleRoom == 'joinRoom')){
            res.redirect('/jed/' + req.body.roomname); 
            
        }else if (userService.verifyRoom(req.body.roomname, roomName1) && (req.body.handleRoom == 'joinRoom')){
            req.body.roomNotExistst = true;
            renderLogin(req, res);
        }else{
            req.body.roomExistst = true;
            renderLogin(req, res);
        }

    }else{
        req.body.userExists = true;
        renderLogin(req, res);
    }
    
};

module.exports = {
    renderLogin,
    submitLogin,
    getRoom
};
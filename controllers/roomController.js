

const renderRoom = (req, res) => {
    res.render('index', { 
      title: 'JEDI',
      roomName: req.session.roomname,
      nickname: req.session.nickname
      
    });
    
  };

  module.exports = {
    renderRoom
  };
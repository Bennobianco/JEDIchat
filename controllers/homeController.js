const renderHome = (req, res) => {
    res.render('home', { 
      title: 'JEDIHOME'
    });
  };

  module.exports = {renderHome};
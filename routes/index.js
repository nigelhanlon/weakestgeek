exports.index = function(req, res){
  res.render('index', { 'title': 'Weakest Geek' });
};

exports.controller = function(req, res){
  res.render('controlv2', { player_count: '8' });
};

exports.round = function(req, res){
  res.render('round', {  });
};

exports.final = function(req, res){
  res.render('headtohead.ejs', {  });
};

exports.transition = function(req, res){
  res.render('transition.ejs', {  });
};

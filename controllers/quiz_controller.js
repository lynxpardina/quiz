var models = require('../models/models.js');

//Autoload -- factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz=quiz;
				next();
			} else { next (new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error) { next(error);});
};

//GET /quizes   gestiona y búsqueda y presentación de preguntas         
exports.index = function(req, res){
	if (req.query.search) {
	 	  var consulta = ('%' + req.query.search.toLowerCase() + '%').replace(/ /g,'%');
    	  models.Quiz.findAll({ where: ["LOWER(pregunta) like ?", consulta],
  		  					 	order: [['pregunta', 'ASC']]}
    	  ).then(function(quizes) {
    			res.render('quizes/index.ejs', {quizes: quizes});
  		  }).catch(function(error) {next(error);});
	  }else{
      models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes});
        }
      ).catch(function(error){ next(error); })
	  }
};


// GET /quizes/:id
exports.show = function(req, res){
models.Quiz.find(req.params.quizId).then(function(quiz){
  res.render('quizes/show', {quiz: req.quiz });
})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
models.Quiz.find(req.params.quizId).then(function(quiz){
  if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
    res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
  }else {
    res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
  }
})
};

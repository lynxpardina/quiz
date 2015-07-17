var models = require('../models/models.js');

//Autoload -factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
      where: { id: Number(quizId)}, 
      include: [{ model: models.Comment}]
  }).then(
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
  var consulta = req.query.search || "";
  var consulta_tema = req.query.search_tema || "";
  
//  consulta = ('%' + consulta.toLowerCase() + '%').replace(/ /g,'%');
//  consulta_tema = ('%' + consulta_tema.toLowerCase() + '%').replace(/ /g,'%');

  consulta = ('%' + consulta + '%').replace(/ /g,'%');
  consulta_tema = ('%' + consulta_tema + '%').replace(/ /g,'%');  

//    	models.Quiz.findAll({  where: 
//                  ["LOWER(pregunta) like ?", consulta],
//                  ["LOWER(tema) like ?", consulta_tema],
//  		  					order:  [['pregunta', 'ASC']]}

        models.Quiz.findAll({where: {
                    pregunta: {like: consulta},
                    tema: {like :consulta_tema}},
                    order:[["pregunta", "ASC"]]}

    	  ).then(function(quizes) {
    			res.render('quizes/index.ejs', {quizes: quizes, temas: models.temas, errors: []});
  		  }).catch(function(error) {next(error);});
	  
};


// GET /quizes/:id
exports.show = function(req, res){
models.Quiz.find(req.params.quizId).then(function(quiz){
  res.render('quizes/show', {quiz: req.quiz, errors: [] });
})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
models.Quiz.find(req.params.quizId).then(function(quiz){
  if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
    res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
  }else {
    res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
  }
})
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  //autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, temas: models.temas, errors: []});
};

//GET /quizes/new
exports.new = function(req, res){
  var quiz = models.Quiz.build(    //crea objeto quiz
    {pregunta: "pregunta", respuesta: "respuesta", tema: ""}
    );
  res.render('quizes/new', {quiz: quiz, temas: models.temas, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build( req.body.quiz );

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        //guarda en DB los campos pregunta y respuesta de quiz
//        quiz.pregunta = quiz.pregunta.toLowerCase();
//        quiz.respuesta = quiz.respuesta.toLowerCase();
//        quiz.tema = quiz.tema.toLowerCase();
        quiz.save({fields: ["pregunta", "respuesta", "tema"]})
        .then(function(){ res.redirect('/quizes')})  //Redirección HTTP (URL relativo) lista de preguntas
      }
    }
  )
//  ).catch(function(error){next(error)});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema      = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, temas: models.temas, errors: err.errors});
      } else {
//        req.quiz.pregunta = req.quiz.pregunta.toLowerCase();
//        req.quiz.respuesta = req.quiz.respuesta.toLowerCase();
//        req.quiz.tema = req.quiz.tema.toLowerCase();
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

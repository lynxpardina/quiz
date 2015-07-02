// GET /quizes/question
exports.question = function(req, res){
  res.render('quizes/question', {title: 'Quiz', pregunta: 'Capital de Italia'});
}


// GET /quizes/answer
exports.answer = function(req, res) {

 //if (!respuesta.match(/^ *lisboa *$/i)) resultado = "Respuesta " + respuesta + " incorrecta, la respuesta correcta es Lisboa";

  if (req.query.respuesta.match (/^ *roma *$/i)){
            // busca roma con o sin espacios al principio y al final
            // ignorando las mayusculas y con $ comprueba que roma
            // no forme parte de una palabra
    res.render('quizes/answer', {title: 'Quiz', respuesta: 'Correcto'});
  }else {
    res.render('quizes/answer', {title: 'Quiz', respuesta: 'Incorrecto'});
  }
};

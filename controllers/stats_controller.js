var models = require('../models/models.js');

exports.show = function(req, res){
 var stats = {
    questions: 1,
    comments: 1,
    q_w_comments:1,
    q_x_comments:1,
  };

models.Quiz.count()
 .then(function (numQuizes) { // número de preguntas
   stats.questions = numQuizes;
    return models.Comment.count();
 }).then (function (commentNumber) {
    stats.comments = commentNumber;

    var promise = models.Quiz.findAndCountAll({include: [{
         model: models.Comment,
                required: true,
                where: {publicado: true}
         }],
         distinct: true
    });
    return promise;
 }).then(function (quizes) { 
   stats.q_w_comments = quizes.count;
   stats.q_x_comments= stats.questions - quizes.count;
   stats.avg_comments = (stats.questions/stats.comments).toFixed(1);
 }).finally(function () {
    res.render('quizes/statistics', {stats:stats, errors: []});
});

};

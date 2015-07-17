var path = require('path');

var temas = ["Otro", "Humanidades", "Ocio", "Ciencia", "Tecnología"];

exports.temas = temas;


// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/)
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQlite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: 	protocol,
	 protocol: 	protocol, 
	 port: 		port, 
	 host: 		host, 
	 storage: 	storage, // sólo SQLite (.env)
	 omitNull: 	true     // sólo Postgres
	}
	);

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;  //exportar definición de la tabla Quiz
exports.Comment = Comment; //exportar definición de la tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0) {  //la tabla se inicializa solo si está vacia
			Quiz.create({pregunta: 'Capital de Italia', 
						 respuesta: 'Roma', 
						 tema: temas[1]
			});
			Quiz.create({pregunta: '¿En que año descubrió Colón América?', 
						 respuesta: '1492', 
						 tema: temas[1]
			});
			Quiz.create({pregunta: 'Autor del "El ingenioso hidalgo don Quijote de la Mancha', 
						 respuesta: 'Miguel de Cervantes', 
						 tema: temas[1]					 
			});
			Quiz.create({pregunta: 'IP de localhost', 
						 respuesta: '127.0.0.1', 
						 tema: temas[4]						 
			});
			Quiz.create({pregunta: '¿De que color es el caballo blanco de Santiago?', 
						 respuesta: 'blanco', 
						 tema: temas[2]
			});
			Quiz.create({pregunta: 'Nombre del satélite de la tierra', 
						 respuesta: 'luna', 
						 tema: temas[3]		 
			});
			Quiz.create({pregunta: 'Capital de Portugal', 
						 respuesta: 'Lisboa', 
						 tema: temas[1]		 
			})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});

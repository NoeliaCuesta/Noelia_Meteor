//Inicializacion del server
var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;  //variable para definir el puerto
var bodyParser = require('body-parser');
var app = express();              //Usamos express
//nos conectamos a traves de socket.io y le suministr
var server = require('http').Server(app);
var io = require('socket.io')(server);
//dependencies
var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://127.0.0.1:27017/sondas', {ns : 'sondas.sondas'}).tail();
var info_oplog = MongoOplog('mongodb://127.0.0.1:27017/sondas', {ns : 'sondas.info_sondas'}).tail();
var ping_oplog = MongoOplog('mongodb://127.0.0.1:27017/ping3', {ns : 'ping3.ping3'}).tail();

//Nos conectamos a la base de datos con mongoose
//mongoose.connect("mongodb://localhost:27017/sondas");
//creamos dos conexiones, una a la base de datos de sondas, y la otra a ping3
var con1 = mongoose.createConnection("mongodb://localhost:27017/sondas");
var con2 = mongoose.createConnection("mongodb://localhost:27017/ping3");
var Sonda = require('./app/model1.js')(con1);
var Info = require('./app/model2.js')(con1);
var Ping = require('./app/model3.js')(con2);

//Logging and parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
//app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
//app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
//app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
//app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
//app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
//app.use(methodOverride());

//conexion con el socket
io.on('connection', function(socket){
  console.log("socket");
  socket.emit('news', {hello : "doc"});
  socket.on('my other event', function(data){
    console.log(data);
  });
});



oplog.on('op', function (data) {
  //console.log(data);
});

info_oplog.on('op', function(data){

});

ping_oplog.on('op', function(data){

});

//funcion oplog insert para insertar los datos de sondas en tiempo real
oplog.on('insert', function(doc){
  console.log("Los datos de 'sondas' se han insertado correctamente");
  console.log(doc);
  Sonda.find(function(err, res){
    if(err)
      res.send(err);

    io.emit('insertar', {hello : doc});
  });
});

//funcion oplog update para actualizar los resultados de sonda
oplog.on('update', function(doc){
    console.log(doc);
    console.log("Los datos de 'sondas' se han actualizado correctamente");

    Sonda.findOne({_id:doc.o2._id}, function(err, doc){
      if(err)
        res.send(err);

      io.emit('actualizarSondas', {hello : doc})
  });
});


//funcion oplog insert para insertar los datos de info_sondas en tiempo real
info_oplog.on('insert', function(doc){
  console.log("Los datos de 'info_sondas' se han insertado correctamente");
  console.log(doc);
  Info.find(function(err, res){
    if(err)
      res.send(err);

    io.emit('insertarInfo', {hello: doc});
  });
});


//funcion oplog update para actualizar los resultados de info_sonda
info_oplog.on('update', function(doc){
    console.log(doc);
    console.log("Los datos de 'info_sondas' se han actualizado correctamente");
    var cambio = {
      _id: doc.o2._id,
      cambio: doc.o['$set']
    };
    console.log(cambio);
    //var id = mongoose.Types.ObjectId(doc.o2._id);
    //console.log(id);
    /*Info.findOne({_id:doc.o2._id},function(err, doc){
      if(err){
        console.log(err);
      }*/


      io.emit('actualizarInfo', {hello : cambio})
//  });
});

//funcion oplog insert para insertar los datos de ping3 en tiempo real
ping_oplog.on('insert', function(doc){
  console.log("Los datos de ping3 se han insertado correctamente");
  console.log(doc);
  Ping.find(function(err, res){
    if(err)
      res.send(err)
    io.emit('insertarPing', {hello: doc});
  });
});

//funcion oplog update para actualizar los resultados de ping3
ping_oplog.on('update', function(doc){
    console.log(doc);
    console.log("Los datos de 'ping3' se han actualizado correctamente");

    Ping.findOne({_id:doc.o2._id}, /*{ 'sort': { '_id' : -1 } }*/function(err, doc){
      if(err)
        res.send(err);

      io.emit('actualizarPing', {hello : doc})
  });
});


//Routes
require('./app/routes.js')(app);

//Start the server
//app.listen(port);
//console.log("Server running in port " + port);
//Ahora abrimos la conexion mediante sockets
server.listen(port);
console.log("Server running in port " + port + " with socket.io");

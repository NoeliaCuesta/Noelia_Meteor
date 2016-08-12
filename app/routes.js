//dependencies
var mongoose = require('mongoose');
var con1 = mongoose.createConnection("mongodb://localhost:27017/sondas");
var con2 = mongoose.createConnection("mongodb://localhost:27017/ping3");
var Sonda = require('./model1.js')(con1);
var InfoSonda = require('./model2.js')(con1);
var Ping = require('./model3.js')(con2);

//abrimos las rutas de la app
module.exports = function(app){

  //GET para datos registro sondas
  app.get('/sondas', function(req, res){
    console.log("He recibido un GET request de sondas");
    Sonda.find(function(err, doc){
      if(err)
        res.send(err);
      res.json(doc);
    });
  });

  //GET para info_sondas
  app.get('/info_sondas', function(req, res){
    console.log("He recibido un GET request de info_sondas");
    InfoSonda.find(function(err, doc){
      if(err)
        res.send(err);
      res.json(doc);
      //console.log(doc);
    });
  });

  //GET para ping3
  app.get('/ping3', function(req, res){
    console.log("Get request de ping3!");
    Ping.find(function(err, doc){
      if(err)
        res.send(err);
      res.json(doc);
      //console.log(doc);
    });
  });

};

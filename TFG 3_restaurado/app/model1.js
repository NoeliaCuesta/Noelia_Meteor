module.exports = function (connection){

//dependencia de mongoose para crear esquemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un esquema de la sonda
var SondaSchema = new Schema({
  user_name: String,
  user_surname: String,
  phone: String,
  address: String,
  cp: String,
  poblacion: String,
  provincia: String,
  fijo: String,
  tipo_acceso: String,
  conectada : String,
  id_sonda: String,
  campania: String,
  lat:String,
  lon: String,
  termsAccepted : Boolean
},{
  collection: 'sondas'
});

//Indexamos el esquema en formato 2dsphere
SondaSchema.index({location: '2dsphere'});

//Exportamos el sondaSchema para usarlo en cualquier sitio.
return connection.model('Sonda', SondaSchema);
//module.exports = mongoose.model('sondas', SondaSchema);
}

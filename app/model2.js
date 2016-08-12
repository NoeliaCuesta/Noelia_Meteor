module.exports = function (connection){
//dependencia de mongoose para crear esquemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un esquema de la sonda
var InfoSchema = new Schema({
  id_sonda: String,
  WIFI: String,
  ETHERNET: String
},
{
  collection: 'info_sondas'
});

//Indexamos el esquema en formato 2dsphere
InfoSchema.index({location: '2dsphere'});

//Exportamos el sondaSchema para usarlo en cualquier sitio.
return connection.model('InfoSonda', InfoSchema);
}
//module.exports = mongoose.model('info_sondas', InfoSchema);

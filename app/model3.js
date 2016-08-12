module.exports = function (connection){

//dependencia de mongoose para crear esquemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creamos un esquema de la sonda
var SondaSchema = new Schema({
  id_sonda: String,
  campana : String,
  tipo_acceso: String,
  version: String,
  radioParams: [
    {
      device: String,
      subtechnology: String
    },
    {device: String,
    subtechnology: String
    }
  ]
},
{
  collection: 'ping3'
});

//Indexamos el esquema en formato 2dsphere
SondaSchema.index({location: '2dsphere'});

//Exportamos el sondaSchema para usarlo en cualquier sitio.
return connection.model('Ping', SondaSchema);
}




//para que coja los valores del double
//var SchemaTypes = mongoose.Schema.Types;
//var mySchema = new Schema({ double: SchemaTypes.Double });
//npm install mongoose-double

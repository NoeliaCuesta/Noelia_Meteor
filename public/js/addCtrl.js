var addCtrl = angular.module('addCtrl', ['ngSanitize', 'ngCsv']);

addCtrl.controller('addCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hola desde el Controlador");

    //Se muestra las opciones del filtro por tipo de conexion
    $scope.filtros=[
      {value:1,descripcion:"No filtrar"},
      {value:"on",descripcion:"Todo conectado - ON"},
      {value:"off",descripcion:"No conectadas - OFF"},
      {value:"wifi",descripcion:"Solo WiFi"},
      {value:"ethernet",descripcion:"Solo Ethernet"}
    ];

    $scope.filtros2=[
      {value:1,descripcion:"No filtrar"},
      {value:"on",descripcion:"Todo conectado - ON"},
      {value:"off",descripcion:"No conectadas - OFF"},
      {value:"wifi",descripcion:"Solo WiFi"},
      {value:"ethernet",descripcion:"Solo Ethernet"}
    ];
    //se muestran las opciones de los paises que se pueden filtrar
    $scope.filtrosPais=[
      {value:"todos",descripcion:"No filtrar"},
      {value:"es",descripcion:"España"},
      {value:"co",descripcion:"Colombia"},
      {value:"otr",descripcion:"Otros"}
    ];
    //se muestras las opciones de las distintas campañas
    $scope.filtrosCampana=[
      {value:1,descripcion:"-------"},
      {value:"voADSL",descripcion:"Vodafone ADSL"},
      {value:"voFTTH",descripcion:"Vodafone FTTH"},
      {value:"movADSL",descripcion:"Movistar ADSL"},
      {value:"movFTTH",descripcion:"Movistar FTTH"},
      {value:"orADSL",descripcion:"Orange ADSL"},
      {value:"orFTTH",descripcion:"Orange FTTH"},
      {value:"onoHFC",descripcion:"ONO HFC"},
      {value:"jaADSL",descripcion:"Jazztel ADSL"},
      {value:"jaFTTH",descripcion:"Jazztel FTTH"}
    ];

    $scope.filtrosFeebbo=[
      {value:"nada",descripcion:""},
      {value:"si", descripcion:"SI"},
      {value:"no", descripcion:"NO"}
    ];



    //seleccionamos el primer valor por defecto, que seria "no filtrar"
    $scope.filtroSeleccionado=$scope.filtros[0].value;
    $scope.filtroSeleccionado2=$scope.filtros[0].value;
    $scope.filtroSeleccionadoP=$scope.filtrosPais[0].value;
    $scope.filtroSeleccionadoC=$scope.filtrosCampana[0].value;
    $scope.filtroSeleccionadoCampana=$scope.filtrosCampana[0].value;
    $scope.filtroSeleccionadoF=$scope.filtrosFeebbo[0].value;
    $scope.filtroSeleccionado2=$scope.filtros2[0].value;
    $scope.search={};

    $scope.filtrosOrdenar=[
      {value:"nada",descripcion:"---"},
      {value:"id_sonda", descripcion:"Id Sonda"},
      {value:"user_name", descripcion:"Nombre"},
      {value: "-porcentajeConectada", descripcion: "Mayor tiempo conectada"},
      {value: "porcentajeConectada", descripcion: "Menor tiempo conectada"}
    ];

    $scope.filtroSeleccionadoO=$scope.filtrosOrdenar[0].value;


    //creamos un filtro personalizado para poder combinar todos los filtros de los que disponemos
    $scope.filtroPersonalizado= function(item){
      //variable regex que buscará la palabra de manera global sin distinguir entre mayusculas y minusculas
      var regex = new RegExp( $scope.searchText, 'gi' );
      //inicializamos las variables a true
      var searchResult = true;
      var filtroResult = true;
      var filtroPais = true;
      var filtroCampana = true;
      var filtroFeebbo = true;
      //este seria el cuadro de texto que filtra por cualquier parametro
      if($scope.searchText){
        searchResult =  item.id_sonda.match(regex) || item.user_name.match(regex) || item.user_surname.match(regex) ||item.phone.match(regex) || item.address.match(regex) || item.cp.match(regex) || item.poblacion.match(regex) || item.provincia.match(regex) || item.pais.match(regex) || item.fijo.match(regex) || item.tipo_acceso.match(regex);
      }
      //a continuacion lo combinamos con los filtros por tipo de conexion
      if($scope.filtroSeleccionado){
        switch ($scope.filtroSeleccionado) {
          case "on":
                filtroResult = (item.WIFI === "ON" && item.ETHERNET === "ON");
            break;
          case "off":
              filtroResult = (item.WIFI === "OFF" && item.ETHERNET === "OFF");
            break;
          case "wifi":
          filtroResult = (item.WIFI === "ON" && item.ETHERNET === "OFF");
            break;
          case "ethernet":
            filtroResult = (item.WIFI === "OFF" && item.ETHERNET === "ON");
            break;
          default:
            filtroResult = true;
        }
      }

      //a continuacion lo combinamos con los filtros por pais
      if ($scope.filtroSeleccionadoP){
        switch ($scope.filtroSeleccionadoP) {
          case "es":
              filtroPais = (item.pais === "es");
            break;
          case "co":
              filtroPais = (item.pais === "co");
            break;
          case "otr":
              filtroPais = (item.pais !=="es" && item.pais!=="co");
            break;
          default:
              filtroPais = true;
        }
      }

      //a continuacion lo combinamos con los filtros por los distintos operadores
      if ($scope.filtroSeleccionadoC){
        switch ($scope.filtroSeleccionadoC) {
          case "voADSL":
              filtroCampana = (item.fijo === "vodafone" && item.tipo_acceso === "adsl");
            break;
          case "voFTTH":
              filtroCampana = (item.fijo === "vodafone" && item.tipo_acceso === "ftth");
            break;
          case "movADSL":
              filtroCampana = (item.fijo === "movistar" && item.tipo_acceso === "adsl");
            break;
          case "movFTTH":
              filtroCampana = (item.fijo === "movistar" && item.tipo_acceso === "ftth");
            break;
          case "orADSL":
              filtroCampana = (item.fijo === "orange" && item.tipo_acceso === "adsl");
            break;
          case "orFTTH":
              filtroCampana = (item.fijo === "orange" && item.tipo_acceso === "ftth");
            break;
          case "onoHFC":
              filtroCampana = (item.fijo === "ono" && item.tipo_acceso === "hfc");
            break;
          case "jaADSL":
              filtroCampana = (item.fijo === "jazztel" && item.tipo_acceso === "adsl");
            break;
          case "jaFTTH":
              filtroCampana = (item.fijo === "jazztel" && item.tipo_acceso == "ftth");
            break;
          default:
            filtroCampana = true;
        }
      }
      //a continuacion lo combinamos dependiendo de si son usuarios de feebbo o no
      if($scope.filtroSeleccionadoF){
        switch ($scope.filtroSeleccionadoF) {
          case "si":
            filtroFeebbo = (item.feebbo === true);
            break;
          case "no":
            filtroFeebbo = (item.feebbo !== true);
            break;
          default:
            filtroFeebbo = true;
        }
      }
      //devolvemos todos los valores
      return searchResult && filtroResult && filtroPais && filtroCampana && filtroFeebbo;
    };

    //filtro para la segunda pestaña ya que no tienen los mismos valores que la primera pestaña
    $scope.filtroPersonal = function(item){
      //variable regex que buscará la palabra de manera global sin distinguir entre mayusculas y minusculas
      var regex = new RegExp( $scope.searchText, 'gi' );
      var searchResult = true;
      var filtroResult = true;
      var filtroCampana = true;

      if($scope.searchText){
        searchResult = item.id_sonda.match(regex) || item.campana.match(regex);
      }

      //a continuacion lo combinamos con los filtros por los distintos operadores
      if ($scope.filtroSeleccionadoCampana){
        switch ($scope.filtroSeleccionadoCampana) {
          case "voADSL":
              filtroCampana = (item.campana === "vodafone-adsl");
            break;
          case "voFTTH":
              filtroCampana = (item.campana === "vodafone-ftth");
            break;
          case "movADSL":
              filtroCampana = (item.campana === "movistar-adsl");
            break;
          case "movFTTH":
              filtroCampana = (item.campana === "movistar-ftth");
            break;
          case "orADSL":
              filtroCampana = (item.campana === "orange-adsl");
            break;
          case "orFTTH":
              filtroCampana = (item.campana === "orange-ftth");
            break;
          case "onoHFC":
              filtroCampana = (item.campana === "ono-hfc");
            break;
          case "jaADSL":
              filtroCampana = (item.campana === "jazztel-adsl");
            break;
          case "jaFTTH":
              filtroCampana = (item.campana === "jazztel-ftth");
            break;
          default:
            filtroCampana = true;
        }
      }

      //a continuacion lo combinamos con los filtros por tipo de conexion
      if($scope.filtroSeleccionado2){
        switch ($scope.filtroSeleccionado2) {
          case "on":
                filtroResult = (item.radioParams[0].status === 1 && item.radioParams[1].status === 1);
            break;
          case "off":
              filtroResult = (item.radioParams[1].status === 0 && item.radioParams[0].status === 0);
            break;
          case "wifi":
          filtroResult = (item.radioParams[1].status === 1 && item.radioParams[0].status === 0);
            break;
          case "ethernet":
            filtroResult = (item.radioParams[1].status === 0 && item.radioParams[0].status === 1);
            break;
          default:
            filtroResult = true;
        }
      }

      return searchResult && filtroCampana && filtroResult;
    };


    //funciones para contar el numero de sondas segun su conexion, en este caso su estado
    /*
    green = todo ON
    yellow = wifi o ethernet OFF
    red = todo OFF
    */
    $scope.numSondasGreenFunction = function(item){
      var green = 0;
        for (var i = 0; i < $scope.sondas.length; i++) {
          if($scope.sondas[i].status === 'green'){
            green ++;
          };
        }
        $scope.numSondasGreen =  green;
    };

    $scope.numSondasYellowFunction = function(item){
      var yellow = 0;
        for (var i = 0; i < $scope.sondas.length; i++) {
          if($scope.sondas[i].status === 'yellow'){
            yellow ++;
          };
        }

        $scope.numSondasYellow = yellow;
    };


    $scope.numSondasRedFunction = function(item){
      var red = 0;
        for (var i = 0; i < $scope.sondas.length; i++) {
          if($scope.sondas[i].status === 'red'){
            red ++;
          };
        }
        $scope.numSondasRed = red;
    };

    //funcion para calcular cuantos dias lleva desconectada una sonda
    $scope.tiempoDesconectada = function(item){
      var today = new Date().getTime();
      var one_day = 1000*60*60*24;

      for (var i = 0; i < $scope.sondas.length; i++) {
        var a = new Date($scope.sondas[i].human_last_seen).getTime();
        var tiempo = (today - a)/one_day;
        //console.log(a);
        console.log(tiempo + " dias");
        $scope.sondas[i].tiempoDesconectada = tiempo;
      };
    };

    //funcion para calcular el porcentaje de tiempo que ha estado conectada la sonda
    $scope.porcentajeConectada = function(){
      var today = new Date().getTime();
      var date = new Date();
      //primer dia del mes
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      //console.log("hoy" +today);
      //console.log("primer dia mes" +firstDay);
      var porcentaje;
      //Para calcular el porcentaje hay que tener en cuenta el dia actual en el que estamos y restarle desde principio de mes
      var total_pings = ((today - firstDay) / 60000);

      for (var i = 0; i < $scope.sondas.length; i++) {
        //1440 pings en un dia
          porcentaje = ($scope.sondas[i].count * 100) / total_pings;
          $scope.sondas[i].porcentajeConectada = porcentaje.toFixed(); //metodo para redondear el resultado
      };
        console.log(porcentaje);
    };




    //GET de sondas
    $http.get('/sondas').success(function(response){
        console.log("Tengo los datos que he pedido");
        $scope.sondas = response;
      });

      //GET de info_sondas
    $http.get('/info_sondas').success(function(response){
        console.log("Tengo los datos que he pedido de info_sondas");
        $scope.info_sondas = response;

        //aqui comprobamos que el id de las sondas es el mismo y por tanto vamos a añadir su wifi y ethernet correspondiente
        for (var i = 0; i < $scope.sondas.length; i++) {
          for (var j = 0; j < $scope.info_sondas.length; j++) {
            if($scope.sondas[i].id_sonda === $scope.info_sondas[j].id_sonda){
              $scope.sondas[i].ETHERNET = $scope.info_sondas[j].ETHERNET;
              $scope.sondas[i].WIFI = $scope.info_sondas[j].WIFI;
              $scope.sondas[i].status = $scope.info_sondas[j].status;
              $scope.sondas[i].human_last_seen = $scope.info_sondas[j].human_last_seen;
              $scope.sondas[i].count = $scope.info_sondas[j].count;
            }
          };
        };

        $scope.tiempoDesconectada();
        $scope.numSondasGreenFunction();
        $scope.numSondasYellowFunction();
        $scope.numSondasRedFunction();
        $scope.porcentajeConectada();

    });

    //GET de ping3
    $http.get('/ping3').success(function(response){
      console.log("tengo los datos de ping3!");
      $scope.ping3 = response;
      //console.log($scope.ping3);

    });


      //Nos conectamos al socket y pasamos los datos de la sonda actualizada para mostrarlos posteriormente
      var socket = io('http://localhost:3000');

      //modificacion de los datos de la coleccion sondas
      socket.on('actualizarSondas', function(data) {
        console.log($scope.sondas);
        console.log(data);
        for (var i = 0; i < $scope.sondas.length; i++) {
          if($scope.sondas[i]._id===data.hello._id)
          $scope.sondas[i]=data.hello;
        }
        console.log($scope.sondas);
        //para que se actualice todo
        $scope.$apply();
      });

      //inserccion de datos de la coleccion de sondas
      socket.on('insertar', function(data){
        console.log($scope.sondas);
        console.log(data);
        $scope.sondas.push(data.hello.o);
        $scope.$apply();
      });

      //inserccion datos de info_sonda.
      //en este caso solo nos hace falta insertar el wifi y ethernet
      socket.on('insertarInfo', function(data){
        for (var i = 0; i < $scope.sondas.length; i++) {
          //comparamos que el id de la sonda sea el mismo que el que se ha insertado
          if($scope.sondas[i].id_sonda === data.hello.o.id_sonda){
            $scope.sondas[i].ETHERNET = data.hello.o.ETHERNET;
            $scope.sondas[i].WIFI = data.hello.o.WIFI;
          }
        }
        $scope.$apply();
      });

      //modificacion de datos de info_sondas
      socket.on('actualizarInfo', function(data) {
        console.log($scope.sondas);
        console.log(data);
        var id = data.hello._id.split("-")[1];
        for (var i = 0; i < $scope.sondas.length; i++) {
          if($scope.sondas[i].id_sonda ===id){
            $scope.sondas[i][Object.keys(data.hello.cambio)[0]] = data.hello.cambio[Object.keys(data.hello.cambio)[0]];
          };
        };

        //para que se actualice todo
        $scope.$apply();
      });

      //inserccion de datos de ping3
      socket.on('insertarPing', function(data){
        console.log($scope.ping3);
        console.log(data);
        $scope.ping3.push(data.hello.o);
        $scope.$apply();
      });

      //modificacion de los datos de la coleccion sondas
      socket.on('actualizarPing', function(data) {
        console.log($scope.ping3);
        console.log(data);
        for (var i = 0; i < $scope.ping3.length; i++) {
          if($scope.ping3[i]._id===data.hello._id)
          $scope.ping3[i]=data.hello;
        }
        console.log($scope.ping3);
        //para que se actualice todo
        $scope.$apply();
      });


      //--------------EXPORTAR A CSV-----------------------------
      //nuevo array para guardar los datos que pasaremos al excel
      $scope.tabla = [];
      //funcion ara exportar los datos al excel
      $scope.getData = function(){
        //recorrer todo el array de sondas y crear un array nuevo con los datos que se quieran sacar
        for (var i = 0; i < $scope.sondas.length; i++) {
          // de momento solo vamos a exportar las sondas que sean de feebbo
          if($scope.sondas[i].feebbo === true){
            $scope.tabla.push({
              'id' : $scope.sondas[i].id_sonda,
              'nombre': $scope.sondas[i].user_name + ' ' + $scope.sondas[i].user_surname,
              'porcentaje': $scope.sondas[i].porcentajeConectada,
              'wifi': $scope.sondas[i].WIFI,
              'ethernet': $scope.sondas[i].ETHERNET
            });
          }

        };
        return $scope.tabla;
      };

      //cabecera del excel
      $scope.getHeader = function(){
        return ["Id_Sonda", "Nombre Usuario", "Porcentaje tiempo conectada", "WIFI", "ETHERNET"];
      };


      //-----------------REINICIAR Y ACTUALIZAR SONDA---------------
      //Funcion que permitira reinicar la sonda desde el index
      $scope.reiniciarSonda = function(sonda){
        var answer = confirm("¿Desea reiniciar la sonda?");
      };

      //funcion que permite actualizar la sonda desde el actualizar
      /*$scope.actualizarSonda = function(){
        var act = alert("La sonda se esta actualizando");
      };*/

}]);


// Directiva para crear el grafico con los tipos de sondas segun su conexion
addCtrl.directive("chart", function() {
        return {
          restrict: 'A',
          link: function(scope, elm, attr) {

            scope.$watchCollection('info_sondas', function(){
              //meter las variables lat y lon en un array
              var green = 0;
              var yellow = 0;
              var red = 0;
                for (var i = 0; i < scope.info_sondas.length; i++) {
                  if(scope.info_sondas[i].status === 'green'){
                    green ++;
                  };
                  if(scope.info_sondas[i].status === 'yellow'){
                    yellow ++;
                  };
                  if(scope.info_sondas[i].status === 'red'){
                    red ++;
                  };
                }
                scope.numSondasGreen = green;
                scope.numSondasYellow = yellow;
                scope.numSondasRed = red;

              console.log('numSondasGreen' + scope.numSondasGreen);
              console.log('numSondasYellow' + scope.numSondasYellow);
              console.log('numSondasRed' + scope.numSondasRed);
              // Create the data table.
              var data = new google.visualization.DataTable();
              data.addColumn('string', 'Topping');
              data.addColumn('number', 'Slices');
              data.addRows([
                ['Todo ON', scope.numSondasGreen],
                ['Solo WIFI o ETHERNET', scope.numSondasYellow],
                ['Todo OFF', scope.numSondasRed]
              ]);

              // Set chart options
              var options = {'title':'Número de sondas según su conexión',
                             'width':400,
                             'height':300,
                             'colors': ['#41F122', '#F1EE22', '#F12222'],
                             'is3D': true,
                             'backgroundColor': '#f7f7f7'
                           };

              // Instantiate and draw our chart, passing in some options.
              var chart = new google.visualization.PieChart(elm[0]);
              chart.draw(data, options);


            });
}

      }
    });

//Directiva para el mapa de google
addCtrl.directive("myMaps", function(){
  return{
    restrict:'E',
    template:'<div></div>',
    replace:true,
    link:function(scope, element, attrs){
      scope.lat = [];
      scope.lon = [];
      scope.$watchCollection('sondas', function(){
        //meter las variables lat y lon en un array
        for (var i = 0; i < scope.sondas.length; i++) {
          scope.lat.push({
            'lat' :scope.sondas[i].lat,
            //variable que usaremos para identificar cada sonda en el mapa por su id
            'id' : scope.sondas[i].id_sonda
          });
          scope.lon.push({
            'lon' : scope.sondas[i].lon
          });

        };
          //console.log(scope.lat);
          //console.log(scope.lon);
          //para que aparezca siempre centrado en españa, aunque se cambie de pestaña
          var myLatLng = {lat: 40.407340, lng: -3.692279};

          var map = new google.maps.Map(document.getElementById(attrs.id),{
             zoom: 4,
             center: myLatLng
           });

           //array para agrupar posteriormente todos los marcadores
           var markers = [];
          for (var i = 0; i < scope.lat.length; i++) {
            //pasamos a float porq son de tipo string
            var latitude = parseFloat(scope.lat[i].lat);
            var longitude = parseFloat(scope.lon[i].lon);
            var myLatLng = new google.maps.LatLng(latitude, longitude);
            //var image = '../assets/img/map-marker-hi.png';

          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            //icon: image,
            title :scope.lat[i].id
          });
          //centramos el mapa en la ultima posicion del array
          //map.center = myLatLng;
          markers.push(marker);
        }
        //con markerclusterer agrupamos todos los marcadores
        var markerCluster = new MarkerClusterer(map, markers);
    });
    }
  };
});



//filtro para poner en mayuscula la primera letra de un string
addCtrl.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});


//filtro para pasar los segundos a fecha completa.
addCtrl.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}]);

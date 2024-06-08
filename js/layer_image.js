//Importamos los módulos requeridos
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import {getCenter} from 'ol/extent.js'
import ImageLayer from 'ol/layer/Image.js'
import Projection from 'ol/proj/Projection.js'
import Static from 'ol/source/ImageStatic.js'
import metro from '../images/esquema_metro.jpg'

var extent = [0, 0, 2186, 1475]

//Ahora podemos utilizar la variable extent
//para definir la proyección del siguiente modo.

var projection = new Projection({
  code: 'xkcd-image', // Código SRS.
  units: 'pixels',
  extent: extent
})

//Definimos la variable map que alojará nuestro mapa
var map = new Map({

  //definimos la capa de nuestro mapa en una array
  layers: [

    //creamos una nueva instancia de la clase ol.layer.Image
    //indicando el parámetro options con todas las opcions de la clase
    new ImageLayer({

    //El origen de la capa es una instancia de ol.source.ImageStatic
    //definida con sus opciones: attributions, url, projection e imageExtent.
      source: new Static({

        //añadimos una atribución a la capa
        attributions:'&copy;<a href="http://www.londres.es/metro">Londres.es</a>',

       //indicamos la url donde se encuentra la imagen
        url: metro,

       //Utilizamos la proyección definida en la variable projection
       //Utilizaremos la misma proyección al definir la vista del mapa
        projection: projection,

      //Aplicamos la extension de la variable extent
        imageExtent: extent
      })
    })
  ],

  //Contenedor del mapa
  target: 'map',

  //Vista inicial del mapa.
  view: new View({
    projection: projection,
    //aplicamos el método getCenter() de la clase lo.extent
    //para extraer el centro de la varible extent.
    center: getCenter(extent),
    zoom: 2
  })
})
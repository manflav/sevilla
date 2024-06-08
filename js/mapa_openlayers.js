//Importamos los módulos requeridos
import 'ol/ol.css'
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import {defaults as defaultControls, OverviewMap} from 'ol/control.js'

//Parámetro options
var overviewoptions = {
   //Definimos la clase para asignar un estilo concreto al objeto
   className: 'ol-overviewmap ol-custom-overviewmap',

   //Capas que se mostrarán en el OverviewMap
   //Mantenemos la misma capa del mapa aunque podría ser distinta
   layers: [
    new TileLayer({
      source: new OSM({
      'url': 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
      })
    })
    ],

  //Oculto por defecto
  collapsed: false,

  //ToolTip
  tipLabel: 'Mapa de referencia'
}
      
//Definimos la variable map que alojará nuestro mapa
var map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [312807, 5156486],
    zoom: 14
  }),
  //Agregamos nuestro control OverviewMap extendiendo los controles por defecto
   controls: defaultControls().extend([
      new OverviewMap(overviewoptions)
   ])
});
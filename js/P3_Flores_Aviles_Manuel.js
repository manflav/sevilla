 //Importamos los módulos requeridos
 import 'ol/ol.css'
 import {Map, View} from 'ol'
 import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer.js'
 import TileWMS from 'ol/source/TileWMS.js'
 import OSM from 'ol/source/OSM'
 import StadiaMaps from 'ol/source/StadiaMaps.js'
 import GeoJSON from 'ol/format/GeoJSON.js'
 import {defaults as defaultControls, OverviewMap,FullScreen} from 'ol/control.js'
 import vias_geojson from '../datos/Vias_Ciclistas_Sevilla.geojson'
 import bicicleteros_geojson from '../datos/Aparcabicicletas.geojson'
 import VectorLayer from 'ol/layer/Vector.js'
 import VectorSource from 'ol/source/Vector.js'
 import LayerSwitcher from 'ol-layerswitcher'
 import Style from 'ol/style/Style.js'
 import bike from '../images/bike.png'
 import Icon from 'ol/style/Icon'
 import Overlay from 'ol/Overlay'
 import * as olProj from 'ol/proj'
 import { Coordinate } from 'ol/coordinate'

//Capas
var mylayers = [
      new LayerGroup({
        'title': 'Base maps',
        layers: [
          //Primera capa base
          new TileLayer ({
            title: 'Watercolor', //Título de la capa
            type: 'base',//Tipo de capa
            visible: false,
            source: new StadiaMaps({
                layer: 'stamen_watercolor'
            })
          })
          ,
           //Segunda capa base
           new TileLayer ({
            title: 'Toner', //Título de la capa
            type: 'base',//Tipo de capa
            visible: false,
            source: new StadiaMaps({
                layer: 'stamen_toner'
            })
          })
          ,
           //Tercera capa base
           new TileLayer ({
            title: 'Terrain', //Título de la capa
            type: 'base',//Tipo de capa
            visible: false,
            source: new StadiaMaps({
                layer: 'stamen_terrain'
            })
          })
          ,
          //Cuarta capa base
          new TileLayer({
            title: 'OSM',//Título de la capa
            type: 'base',//Tipo de capa
            visible: true,
            source: new OSM()
            })
        ]
        }),

      //Capa Overlay
      new LayerGroup({
        title: 'Overlays',
        layers: [
        //Primera capa overlays
            new TileLayer({
            title:'Ortofoto',//Título de la capa
            type: 'overlays',//Tipo de capa
            opacity:0.5,
            source: new TileWMS({
              attributions: '&copy; PNOA. Instituto Geográfico Nacional',
              url: 'http://www.ign.es/wms/pnoa-historico?',
              params: {'LAYERS': 'PNOA2004', 'TILED': true}
            })
          }),

        //Segunda capa overlays
         new VectorLayer({
            title:'Vias ciclistas',//Título de la capa
            source: new VectorSource({
            url: vias_geojson,
            format: new GeoJSON()
            }),
        }),

        //Tercera capa overlays
        new VectorLayer({
            title:'Bicicleteros',
            source: new VectorSource({
            url:bicicleteros_geojson,
            format: new GeoJSON({
                    extractStyle:false
                }),
            }),
            style:new Style({
                image: new Icon(({
                    scale: 0.08,
                    anchor: [0.5,46],
                    anchorXUnits: 'pixels',
                    anchorYUnits: 'pixels',
                    src:bike
                }))
            })
        }),
        ]
    })]
    

//Parámetro options Overview
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
   layers: mylayers,
   view: new View({
    center: [-666997.869116, 4494045.806970],
    zoom: 14
  }),
  controls: defaultControls().extend([
    new OverviewMap(overviewoptions),
    new FullScreen,
     ]),
  })

//Definimos el control
var layerSwitcher = new LayerSwitcher({
      tipLabel: 'Leyenda'
    })
//Agregamos el control al mapa
map.addControl(layerSwitcher)
//Lo mostramos desplegado
layerSwitcher.showPanel()


var container = document.getElementById('popup'),
    content_element = document.getElementById('popup-content'),
    closer = document.getElementById('popup-closer');

closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

var overlay = new Overlay({
    element: container,
    autoPan: true,
    offset: [0, -10]
});
map.addOverlay(overlay);

map.on('singleclick', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });
    if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();
        
        var content = '<h5>Barrio: ' + feature.get('LAYER') + '</h5>';
        content += '<h6> N° Aparcamiento: ' + feature.get('NUMERO') + '</h6>';
        content += '<h6> Numero de aros: ' + feature.get('AROS') + '</h6>';
        content_element.innerHTML = content;
        overlay.setPosition(coord);
        
        console.info(feature.getProperties());
    }
});

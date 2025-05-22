// Inisialisasi peta
const map = L.map('map', {
    center: [-6.903, 107.6510],
    zoom: 13
  });
  
  // Basemap OSM
  const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  
  // Basemap Google Maps
  const basemapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Map data © <a href="https://maps.google.com/">Google</a>',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });
  
  // Tambahkan salah satu basemap ke peta secara default
  basemapOSM.addTo(map);
  
  // Control panel untuk memilih basemap
  const baseMaps = {
    "OpenStreetMap": basemapOSM,
    "Google Maps": basemapGoogle
  };
  
  L.control.layers(baseMaps).addTo(map);

  //Menambahkan Fitur FullScree
  map.addControl(new L.Control.Fullscreen());

// Membuat tombol "Home"
const homeButton = L.control({ position: 'topleft' });

homeButton.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
  const button = L.DomUtil.create('a', '', div);
  button.innerHTML = '🏠';
  button.title = 'Kembali ke Home';
  button.href = '#';

  // Cegah zoom ketika klik tombol
  L.DomEvent.on(button, 'click', function (e) {
    L.DomEvent.preventDefault(e);
    map.setView([home.lat, home.lng], home.zoom);
  });

  return div;
};

homeButton.addTo(map);

// Menambahkan Fitur My Location
map.addControl(
    L.control.locate({
    locateOptions: {
    enableHighAccuracy: true
    }
    })
    );

//Menambahkan GeoJSON Jembatan
var symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
  }

  const jembatanPT = new L.LayerGroup();
  $.getJSON("./jembatan_pt.geojson", function (OBJECTID) {
  L.geoJSON(OBJECTID, {
  pointToLayer: function (feature, latlng) {
  return L.circleMarker(latlng, symbologyPoint);}
  }).addTo(jembatanPT);
  });
  jembatanPT.addTo(map);

  const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./admin_kelurahan_ln.geojson", function (OBJECTID) {
L.geoJSON(OBJECTID, {
style: {
color : "black",
weight : 2,
opacity : 1,
dashArray: '3,3,20,3,20,3,20,3,20,3,20',
lineJoin: 'round'
}
}).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);


const landcover = new L.LayerGroup();

$.getJSON("./landcover_ar.geojson", function (REMARK) {
    L.geoJson(REMARK, {
        style: function(feature) {
            switch (feature.properties.REMARK) {
                case 'Danau/Situ':
                    return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Empang':
                    return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Hutan Rimba':
                    return { fillColor: "#38A800", fillOpacity: 0.8, color: "#38A800" };
                case 'Perkebunan/Kebun':
                    return { fillColor: "#E9FFBE", fillOpacity: 0.8, color: "#E9FFBE" };
                case 'Permukiman dan Tempat Kegiatan':
                    return { fillColor: "#FFBEBE", fillOpacity: 0.8, weight: 0.5, color: "#FB0101" };
                case 'Sawah':
                    return { fillColor: "#01FBBB", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Semak Belukar':
                    return { fillColor: "#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#00A52F" };
                case 'Sungai':
                    return { fillColor: "#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB" };
                case 'Tanah Kosong/Gundul':
                    return { fillColor: "#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
                case 'Tegalan/Ladang':
                    return { fillColor: "#EDFF85", fillOpacity: 0.8, color: "#EDFF85" };
                case 'Vegetasi Non Budidaya Lainnya':
                    return { fillColor: "#000000", fillOpacity: 0.8, weight: 0.5, color: "#000000" };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK);
        }
    }).addTo(landcover);
});
landcover.addTo(map);


// Pastikan semua variabel seperti basemapOSM, osmHOT, baseMapGoogle, dll. sudah didefinisikan sebelumnya
const basemaps = {
  "OpenStreetMap": basemapOSM,
  "Google Maps": basemapGoogle
};

const overlayMaps = {
  "Jembatan": jembatanPT,
  "Batas Administrasi": adminKelurahanAR,
  "Tutupan Lahan": landcover
};

// Menambahkan kontrol layer ke peta
L.control.layers(basemaps, overlayMaps).addTo(map);



let legend = L.control({ position: "topright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        // Judul Legenda
        '<p style="font-size: 18px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Legenda</p>' +

        // Infrastruktur
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Infrastruktur</p>' +
        '<div><svg width="30" height="16" style="display:block; margin:auto;"><circle cx="15" cy="8" r="5" fill="#9dfc03" stroke="black" stroke-width="1" /></svg></div>Jembatan<br>' +

        // Batas Administrasi
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Batas Administrasi</p>' +
        '<div><svg width="30" height="16"><line x1="0" y1="11" x2="23" y2="11" style="stroke:black;stroke-width:2;stroke-dasharray:10,1,1,1,1,1,1,1,1,1;" /></svg></div>Batas Desa/Kelurahan<br>' +

        // Tutupan Lahan
        '<p style="font-size: 12px; font-weight: bold; margin-bottom: 5px; margin-top: 10px;">Tutupan Lahan</p>' +
        '<div style="width: 20px; height: 10px; background-color: #97DBF2; display: inline-block; margin-right: 5px;"></div>Danau/Situ<br>' +
        '<div style="width: 20px; height: 10px; background-color: #97DBF2; display: inline-block; margin-right: 5px;"></div>Empang<br>' +
        '<div style="width: 20px; height: 10px; background-color: #38A800; display: inline-block; margin-right: 5px;"></div>Hutan Rimba<br>' +
        '<div style="width: 20px; height: 10px; background-color: #E9FFBE; display: inline-block; margin-right: 5px;"></div>Perkebunan/Kebun<br>' +
        '<div style="width: 20px; height: 10px; background-color: #FFBEBE; display: inline-block; margin-right: 5px;"></div>Permukiman dan Tempat Kegiatan<br>' +
        '<div style="width: 20px; height: 10px; background-color: #01FBBB; display: inline-block; margin-right: 5px;"></div>Sawah<br>' +
        '<div style="width: 20px; height: 10px; background-color: #FDFDFD; display: inline-block; margin-right: 5px;"></div>Semak Belukar<br>' +
        '<div style="width: 20px; height: 10px; background-color: #97DBF2; display: inline-block; margin-right: 5px;"></div>Sungai<br>' +
        '<div style="width: 20px; height: 10px; background-color: #FDFDFD; display: inline-block; margin-right: 5px;"></div>Tanah Kosong/Gundul<br>' +
        '<div style="width: 20px; height: 10px; background-color: #EDFF85; display: inline-block; margin-right: 5px;"></div>Tegalan/Ladang<br>' +
        '<div style="width: 20px; height: 10px; background-color: #000000; display: inline-block; margin-right: 5px;"></div>Vegetasi Non Budidaya Lainnya<br>';

    return div;
};

legend.addTo(map);

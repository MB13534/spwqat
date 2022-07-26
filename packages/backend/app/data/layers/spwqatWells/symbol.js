module.exports = {
  id: 'spwqat-locations-symbol',
  name: 'SPWQAT Locations Labels',
  type: 'symbol',
  source: 'spwqat-locations',
  minzoom: 10,
  drawOrder: -100,
  legendOrder: 99,
  layout: {
    'text-field': ['get', 'station_name'],
    'text-size': 14,
    // 'text-offset': [0, -1.2],
    'text-offset': [0, -1.75],
    'text-font': ['literal', ['Roboto Black', 'Arial Unicode MS Bold']],
    visibility: 'none',
  },
  paint: {
    'text-color': 'rgb(49,49,49)',
    'text-halo-color': 'rgba(255,255,255,1)',
    'text-halo-width': 3,
  },
  lreProperties: {
    popup: {
      excludePopup: true,
    },
  },
};

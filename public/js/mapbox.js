/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmlkZW9lZXJvIiwiYSI6ImNrM2VjOHM0ZTFlYjgzY3FqZG5icDlyaGwifQ.uqJFsn0pH90YNnqUWjAuoQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/videoeero/ck3ecopes1ywq1cqu9s4i91b8',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    bounds.extend(loc.coordinates);

    // Add map popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
  });

  map.fitBounds(bounds, {
    padding: { top: 150, bottom: 150, left: 100, right: 100 }
  });
};

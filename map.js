mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbGVuMTA2IiwiYSI6ImNsbnQ5MzB2dzAxZWkya3FpZzAxZGYxYnAifQ.b_NWo0c5txenAVygf3Y7aQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [-68.137343, 45.137451], // starting position
    zoom: 5 // starting zoom
});

let marker;  // Global variable to hold the marker instance

map.on('load', () => {
map.addSource('maine', {
'type': 'geojson',
'data': {
'type': 'Feature',
'geometry': {
'type': 'Polygon',
// These coordinates outline Maine.
'coordinates': [
[
[-67.13734, 45.13745],
[-66.96466, 44.8097],
[-68.03252, 44.3252],
[-69.06, 43.98],
[-70.11617, 43.68405],
[-70.64573, 43.09008],
[-70.75102, 43.08003],
[-70.79761, 43.21973],
[-70.98176, 43.36789],
[-70.94416, 43.46633],
[-71.08482, 45.30524],
[-70.66002, 45.46022],
[-70.30495, 45.91479],
[-70.00014, 46.69317],
[-69.23708, 47.44777],
[-68.90478, 47.18479],
[-68.2343, 47.35462],
[-67.79035, 47.06624],
[-67.79141, 45.70258],
[-67.13734, 45.13745]
]
]
}
}
    });
      

// Add a new layer to visualize the polygon.
map.addLayer({
'id': 'maine',
'type': 'fill',
'source': 'maine', // reference the data source
'layout': {},
'paint': {
'fill-color': '#0080ff', // blue color fill
'fill-opacity': 0.5
}
});
// Add a black outline around the polygon.
map.addLayer({
'id': 'outline',
'type': 'line',
'source': 'maine',
'layout': {},
'paint': {
'line-color': '#000',
'line-width': 3
}
});

 

    map.on('click', 'maine', (e) => {
        const properties = e.features[0].properties;
        const name = properties.name || 'Unknown';
        const description = properties.description || 'No description available';
        const link_url = properties.link_url || '#';

        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h3>${name}</h3>
                <p>${description}</p>
                <a href="${link_url}" target="_blank">Learn more</a>
            `)
            .addTo(map);
    });

    map.on('mouseenter', 'maine', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'maine', () => {
        map.getCanvas().style.cursor = '';
    });
});

function searchAddress() {
		console.log('Search function triggered'); 
    const address = document.getElementById('address-search').value;
    const accessToken = 'sk.eyJ1Ijoic2FsbGVuMTA2IiwiYSI6ImNsbnRhMzB6dTAxbGUya21majU0bGZndXgifQ.7zYszJiUMf-J8LeKR0ma7w';


    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
            console.log('Geocoding Data:', data);
            const coordinates = data.features[0].geometry.coordinates;
            console.log('Coordinates:', coordinates);

            // Remove the previous marker if it exists
            if (marker) {
                marker.remove();
            }
            
            // Add a new marker to the map at the coordinates of the searched address
            marker = new mapboxgl.Marker()
                .setLngLat(coordinates)
                .addTo(map);

            // Pan the map to the coordinates of the searched address
            map.flyTo({ center: coordinates });

            checkPointInPolygon(coordinates);
        })
        .catch(error => console.error('Error:', error));
}

function checkPointInPolygon(coordinates) {
    console.log('Checking point in polygon with coordinates:', coordinates);
    
    const polygonData = map.getSource('maine')._data;

    console.log('Polygon data:', polygonData);
    
    const point = turf.point(coordinates);

    // Directly check against the 'maine' polygon data without iterating through features
    const isInPolygon = turf.booleanPointInPolygon(point, polygonData);

    if (isInPolygon) {
        console.log("The address is within the polygon!");
        alert('The address is within the polygon!');
    } else {
        console.log("The address is not within the polygon.");
        alert('The address is not within the polygon.');
    }
}

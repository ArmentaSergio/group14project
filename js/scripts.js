$(document).ready(function () {
    var mapInitialized = false;
    var map;
    var start = [-122.0308, 36.9741]; // Change this to your desired starting point

    // Function to initialize Mapbox
    function initializeMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFhYmFycmkxMiIsImEiOiJjbHBpb3d1Ym0wMWNsMnZ1b3B0aTE0YXFsIn0.f9_PivdonzFgElqgn1eycA';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: start, // Set the center to the starting point
            zoom: 12
        }).on('load', function () {
            // Add starting point marker
            map.addLayer({
                'id': 'start',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': start
                                }
                            }
                        ]
                    }
                },
                'paint': {
                    'circle-radius': 10,
                    'circle-color': '#3887be'
                }
            });

            // Set mapInitialized to true after initialization
            mapInitialized = true;

            // Allow the user to click the map to change the destination
            map.on('click', function (event) {
                const coords = [event.lngLat.lng, event.lngLat.lat];
                const end = {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coords
                            }
                        }
                    ]
                };
                if (map.getSource('end')) {
                    map.getSource('end').setData(end);
                } else {
                    map.addLayer({
                        'id': 'end',
                        'type': 'circle',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': [
                                    {
                                        'type': 'Feature',
                                        'properties': {},
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': coords
                                        }
                                    }
                                ]
                            }
                        },
                        'paint': {
                            'circle-radius': 10,
                            'circle-color': '#f30'
                        }
                    });
                }
                getRoute(coords);
            });
        });
    }

    // Function to resize Mapbox map
    function resizeMap() {
        if (mapInitialized && map) {
            map.resize();
        }
    }

    // Function to make a directions request
    async function getRoute(end) {
        // make directions request using cycling profile
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
            { method: 'GET' }
        );
        const json = await query.json();
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        const geojson = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': route
            }
        };
        // if the route already exists on the map, we'll reset it using setData
        if (map.getSource('route')) {
            map.getSource('route').setData(geojson);
        }
        // otherwise, we'll make a new request
        else {
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': geojson
                },
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#3887be',
                    'line-width': 5,
                    'line-opacity': 0.75
                }
            });
        }

        // get the sidebar and add the instructions
        const instructions = document.getElementById('instructions');
        const steps = data.legs[0].steps;

        let tripInstructions = '';
        for (const step of steps) {
            tripInstructions += `<li>${step.maneuver.instruction}</li>`;
        }
        instructions.innerHTML = `<p><strong>Trip duration: ${Math.floor(
            data.duration / 60
        )} min 🚴 </strong></p><ol>${tripInstructions}</ol>`;
    }

    // When a tab is clicked
    $('.tab').click(function () {
        // Get the value of the data-tab attribute of the clicked tab
        var tabId = $(this).data('tab');
        console.log("Tab clicked:", tabId);

        // Remove the 'active' class from all tabs
        $(".tab").removeClass('active');
        // Add the 'active' class to the clicked tab
        $(this).addClass('active');

        // Hide all tab panes
        $('.tab-pane').removeClass('active');
        // Show the tab pane corresponding to the clicked tab
        $('[data-tab-content="' + tabId + '"]').addClass('active');

        // Check if the clicked tab is the one containing the map
        if (tabId === 'route') {
            // If map is already initialized, resize it
            if (mapInitialized) {
                // Add a delay to ensure that the map container is visible
                setTimeout(resizeMap, 100);
            } else {
                // Initialize the map if not already initialized
                initializeMap();
            }
        }
    });
});

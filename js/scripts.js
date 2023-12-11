$(document).ready(function() {
    var mapInitialized = false;
    var map;

    // Function to initialize Mapbox
    function initializeMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFhYmFycmkxMiIsImEiOiJjbHBpb3d1Ym0wMWNsMnZ1b3B0aTE0YXFsIn0.f9_PivdonzFgElqgn1eycA';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-122.0308, 36.9741],
            zoom: 12
        });

        // Add markers or other map-related code here

        // Set mapInitialized to true after initialization
        mapInitialized = true;
    }

    // Function to resize Mapbox map
    function resizeMap() {
        if (mapInitialized && map) {
            map.resize();
        }
    }

    // When a tab is clicked
    $('.tab').click(function() {
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

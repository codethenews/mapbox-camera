mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhd24iLCJhIjoiUHpMUXE4MCJ9.n_8tsbMDU7_XEzZzkc0s4A';
    // easing functions take parameter 't' representing
    // the progress of the animation.
    // t is in a range of 0 to 1 where 0 is the initial
    // state and 1 is the completed state.
    const easingFunctions = {
        // start slow and gradually increase speed
        easeInCubic: function (t) {
            return t * t * t;
        },
        // start fast with a long, slow wind-down
        easeOutQuint: function (t) {
            return 1 - Math.pow(1 - t, 5);
        },
        // slow start and finish with fast middle
        easeInOutCirc: function (t) {
            return t < 0.5
                ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
                : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
        },
        // fast start with a "bounce" at the end
        easeOutBounce: function (t) {
            const n1 = 7.5625;
            const d1 = 2.75;

            if (t < 1 / d1) {
                return n1 * t * t;
            } else if (t < 2 / d1) {
                return n1 * (t -= 1.5 / d1) * t + 0.75;
            } else if (t < 2.5 / d1) {
                return n1 * (t -= 2.25 / d1) * t + 0.9375;
            } else {
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        }
    };

    // set up some helpful UX on the form
    const durationValueSpan = document.getElementById('durationValue');
    const durationInput = document.getElementById('duration');
    durationValueSpan.innerHTML = durationInput.value / 1000 + ' seconds';
    durationInput.addEventListener('change', (e) => {
        durationValueSpan.innerHTML = e.target.value / 1000 + ' seconds';
    });

    const animateLabel = document.getElementById('animateLabel');
    const animateValue = document.getElementById('animate');
    animateValue.addEventListener('change', (e) => {
        animateLabel.innerHTML = e.target.checked ? 'Yes' : 'No';
    });

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/shawn/ckto4z7h60xda18o086awxnfh',
        center: [-95, 40],
        zoom: 3
    });

    map.on('load', () => {
        // add a layer to display the map's center point
        map.addSource('center', {
            'type': 'geojson',
            'data': {
                'type': 'Point',
                'coordinates': [-94, 40]
            }
        });
        map.addLayer({
            'id': 'center',
            'type': 'circle',
            'source': 'center',
            'paint': {
                'circle-radius': 4
            }
        });
        map.addLayer({
            'id': 'center-text',
            'type': 'symbol',
            'source': 'center',
            'layout': {
                'text-field': 'Center: [-94, 40]',
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.6],
                'text-anchor': 'top'
            }
        });

        const animateButton = document.getElementById('animateButton');
        animateButton.addEventListener('click', () => {
            const easingInput = document.getElementById('easing');
            const easingFn =
                easingFunctions[
                    easingInput.options[easingInput.selectedIndex].value
                ];
            const duration = parseInt(durationInput.value, 10);
            const animate = animateValue.checked;
            const offsetX = parseInt(
                document.getElementById('offset-x').value,
                10
            );
            const offsetY = parseInt(
                document.getElementById('offset-y').value,
                10
            );

            const animationOptions = {
                duration: duration,
                easing: easingFn,
                offset: [offsetX, offsetY],
                animate: animate,
                essential: true // animation will happen even if user has `prefers-reduced-motion` setting on
            };
                /* 
                The original example had this randoizing function that I would like to replace with customizable inputs to set the animation options.
                ( see original example~  https://docs.mapbox.com/mapbox-gl-js/example/camera-animation/ )
                (see documentation: https://docs.mapbox.com/mapbox-gl-js/api/properties/#animationoptions )
                */

            // Create a random location to fly to by offsetting the map's
            // initial center point by up to 10 degrees.
            const center = [
                -95 + (Math.random() - 0.5) * 20,
                40 + (Math.random() - 0.5) * 20
            ];
          
          
          
            // merge animationOptions with other flyTo options
            animationOptions.center = center;

            map.flyTo(animationOptions);
            // update 'center' source and layer to show our new map center
            // compare this center point to where the camera ends up when an offset is applied
            map.getSource('center').setData({
                'type': 'Point',
                'coordinates': center
            });
            map.setLayoutProperty(
                'center',
                'text-field',
                `Center: [${center[0].toFixed(1)}, ${center[1].toFixed(1)}`
            );
        });
    });
var geojsonArea = require('@mapbox/geojson-area');

var obj = {
    "type": "Polygon",
    "coordinates": [
        [
            [
                16.611328125,
                20.05593126519445
            ],
            [
                14.765625,
                11.609193407938953
            ],
            [
                18.369140624999996,
                10.746969318460001
            ]
        ]
    ]
}


var area = geojsonArea.geometry(obj);
console.log(area) //Area in squre meter
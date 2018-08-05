import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, Polygon } from 'react-native-maps';


export default class App extends Component {
  state = {
    markers: [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Bangkok',
        latlng: {
          latitude: 37.8025259,
          longitude: -122.4351431,
        },
        description: 'description'
      }
    ],
    polygons: [
      {
        latitude: 13.736717,
        longitude: 100.523186,
      },
      {
        latitude: 15.736717,
        longitude: 105.523186,
      }
    ],
    coordinates: [
      [
        [
          -122.43455886840819,
          37.804358908571395
        ],
        [
          -122.4326705932617,
          37.7897092979573
        ],
        [
          -122.41155624389647,
          37.790116270812874
        ],
        [
          -122.40829467773436,
          37.79717011082383
        ],
        [
          -122.43455886840819,
          37.804358908571395
        ]
      ]
    ]
  }

  onPress(e) {
    // console.log(e.nativeEvent)
    const lat = e.nativeEvent.coordinate.latitude;
    const long = e.nativeEvent.coordinate.longitude;
    markersCopy = [...this.state.markers];
    markersCopy.push(
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Bangkok' + Math.random().toString(36).substr(2, 9),
        latlng: {
          latitude: lat,
          longitude: long,
        },
        description: 'description'
      }
    )
    polygonsCopy = [...this.state.polygons];
    polygonsCopy.push([long, lat])
    this.setState({ markers: markersCopy })
    // this.setState({ polygons: polygonsCopy })
  }

  render() {
    const initlat = 37.8025259;
    const initlong = -122.4351431;
    const polygons = this.state.coordinates[0].map(coordsArr => {
      let coords = {
        latitude: coordsArr[1],
        longitude: coordsArr[0],
      }
      return coords;
    })
    console.log(polygons)
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={{
            latitude: initlat,
            longitude: initlong,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={e => this.onPress(e)}
        >
          {this.state.markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
          <Polygon
            coordinates={polygons}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={2} />
        </MapView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
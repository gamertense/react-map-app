import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';


export default class App extends Component {
  state = {
    polygons: [
      {
        latitude: 37.8025259,
        longitude: -122.4351431
      }
    ]
  }

  onPress(e) {
    // console.log(e.nativeEvent)
    const lat = e.nativeEvent.coordinate.latitude;
    const long = e.nativeEvent.coordinate.longitude;

    polygonsCopy = [...this.state.polygons];
    polygonsCopy.push({
      latitude: lat,
      longitude: long
    })
    this.setState({ polygons: polygonsCopy })
  }

  render() {
    const initialRegion = {
      latitude: 37.8025259,
      longitude: -122.4351431,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }

    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={initialRegion}
          onPress={e => this.onPress(e)}
        >
          <Polygon
            coordinates={this.state.polygons}
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
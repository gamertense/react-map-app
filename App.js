import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';


export default class App extends Component {
  state = {
    markers: [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Bangkok',
        latlng: {
          latitude: 13.736717,
          longitude: 100.523186,
        },
        description: 'description'
      }
    ]
  }

  onPress(e) {
    console.log(e.nativeEvent)
    const lat = e.nativeEvent.coordinate.latitude;
    const long = e.nativeEvent.coordinate.longitude;
    this.setState({
      markers: [
        ...this.state.markers,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: 'Bangkok' + Math.random().toString(36).substr(2, 9),
          latlng: {
            latitude: lat,
            longitude: long,
          },
          description: 'description'
        }
      ]
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={{
            latitude: 13.736717,
            longitude: 100.523186,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={e => this.onPress(e)}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.id}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
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
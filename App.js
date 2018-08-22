import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, MAP_TYPES, Marker, Polygon } from 'react-native-maps';
import { Icon } from 'react-native-elements'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {
  state = {
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polygons: []
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  }

  onPress = () => {
    // const lat = e.nativeEvent.coordinate.latitude;
    // const long = e.nativeEvent.coordinate.longitude;

    polygonsCopy = [...this.state.polygons];
    polygonsCopy.push({
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    })
    this.setState({ polygons: polygonsCopy })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}
          mapType={MAP_TYPES.HYBRID}
          onRegionChangeComplete={region => this.onRegionChangeComplete(region)}
        >
          <Polygon
            coordinates={this.state.polygons}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={2} />
        </MapView>
        <View style={styles.target} >
          <Icon
            type='material-community'
            name='target'
            color='#fff'
          />
        </View>
        <View style={[styles.bubble, styles.latlng]}>
          <Text style={{ textAlign: 'center' }}>
            {this.state.region.latitude.toPrecision(7)},
            {this.state.region.longitude.toPrecision(7)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.onPress}
            style={[styles.bubble, styles.button]}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  target: {
    position: 'absolute',
    top: '48%',
    right: 0,
    left: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
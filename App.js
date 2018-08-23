import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, MAP_TYPES, Marker, Polygon, Polyline } from 'react-native-maps';
import { Icon, Button } from 'react-native-elements'

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
    polygons: [],
    polylines: []
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  handleAdd = () => {
    polygonsCopy = [...this.state.polygons];
    polygonsCopy.push({
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    })

    this.setState({ polygons: polygonsCopy })
  }

  render() {
    const polylines = this.state.polygons.length > 0 ? [this.state.polygons[this.state.polygons.length - 1], {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }] : null
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}
          mapType={MAP_TYPES.HYBRID}
          onRegionChange={region => this.onRegionChange(region)}
        >
          <Polyline
            coordinates={polylines}
            strokeColor="#fff"
            strokeWidth={3}
          />
          <Polygon
            coordinates={this.state.polygons}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={2}
          />
        </MapView>
        <View style={styles.target} >
          <Icon
            type='material-community'
            name='target'
            color='#fff'
          />
        </View>
        <View style={styles.add} >
          <Icon
            raised
            name='add'
            type='MaterialIcons'
            color='#517fa4'
            onPress={this.handleAdd} />
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 20,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  target: {
    position: 'absolute',
    top: '48%',
  },
  add: {
    position: 'absolute',
    bottom: '5%',
  }
});
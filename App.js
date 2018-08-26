import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, MAP_TYPES, Marker, Polygon, Polyline } from 'react-native-maps';
import { Icon } from 'react-native-elements'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var geojsonArea = require('@mapbox/geojson-area');

export default class App extends Component {
  state = {
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polygons: [],
    area: 0,
    flex: 0
  }

  componentDidMount() {
    setTimeout(() => this.setState({ flex: 1 }), 100);
  }

  handleAdd = () => {
    const polygons = this.state.polygons
    polygonsCopy = [...polygons];
    polygonsCopy.push({
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    })

    this.setState({ polygons: polygonsCopy })

    if (polygons.length > 1) {
      const array_coordinates = polygons.map(obj => [obj.longitude, obj.latitude])
      const geojson = {
        "type": "Polygon",
        "coordinates": [array_coordinates]
      }
      this.setState({ area: (geojsonArea.geometry(geojson) * 0.000625).toFixed(2) }) //Converted to Rai
    }
  }

  goBack = () => {
    const polygonsCopy = [...this.state.polygons]
    polygonsCopy.splice(-1, 1)
    this.setState({ polygons: polygonsCopy })
  }

  showAreaMessage() {
    if (this.state.aera !== 0) {
      return (
        <View style={styles.area_message} >
          <Text> {this.state.area} ไร่ </Text>
        </View>
      )
    }
  }

  render() {
    const polylines = this.state.polygons.length > 0 ? [this.state.polygons[this.state.polygons.length - 1], {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }] : null
    return (
      <View style={styles.container}>
        <MapView style={[styles.map, { flex: this.state.flex }]}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}
          mapType={MAP_TYPES.HYBRID}
          onRegionChange={region => this.setState({ region })}
          showsMyLocationButton
          showsUserLocation
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
        {this.showAreaMessage()}
        <View style={styles.target} >
          <Icon
            type='material-community'
            name='target'
            color='#fff'
          />
        </View>
        <View style={styles.add_button} >
          <Icon
            raised
            name='add'
            type='MaterialIcons'
            color='#517fa4'
            onPress={this.handleAdd} />
        </View>
        <View style={styles.go_back} >
          <Icon
            raised
            name='arrow-back'
            type='MaterialIcons'
            color='#517fa4'
            onPress={this.goBack} />
        </View>
        <View style={styles.clear} >
          <Icon
            raised
            name='clear'
            type='MaterialIcons'
            color='#517fa4'
            onPress={() => this.setState({ polygons: [] })} />
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
  area_message: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  target: {
    position: 'absolute',
    top: '48%',
  },
  add_button: {
    position: 'absolute',
    bottom: '2%',
  },
  go_back: {
    position: 'absolute',
    left: '2%',
    bottom: '2%',
  },
  clear: {
    position: 'absolute',
    right: '2%',
    bottom: '15%',
  }
});
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, MAP_TYPES, Marker, Polygon, Polyline } from 'react-native-maps';
import { Icon } from 'react-native-elements'

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const geolib = require('geolib')
const geojsonArea = require('@mapbox/geojson-area');

export default class App extends Component {
  state = {
    flex: 0,
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polygons: [
      {
        latitude: LATITUDE,
        longitude: LONGITUDE
      }
    ],
    followsUserLocation: false
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
    this.calculateArea(polygons)
  }

  backButton = () => {
    const polygonsCopy = [...this.state.polygons]
    polygonsCopy.splice(-1, 1)
    this.setState({ polygons: polygonsCopy })
  }

  calculateArea = () => {
    const polygons = this.state.polygons
    if (polygons.length > 1) {
      const array_coordinates = polygons.map(obj => [obj.longitude, obj.latitude])
      const geojson = {
        "type": "Polygon",
        "coordinates": [array_coordinates]
      }
      const areaInRai = Math.floor(geojsonArea.geometry(geojson) * 0.000625)
      const areaInNgarn = Math.floor(geojsonArea.geometry(geojson) * 0.0025)
      const areaInWa = Math.floor(areaInRai * 0.25)

      return (
        <View style={styles.area_message} >
          <Text> {areaInRai + ' ไร่' + areaInNgarn + ' งาน' + areaInWa + ' ตารางวา'}</Text>
        </View>
      )
    }
  }

  render() {
    const polygonsLength = this.state.polygons.length
    const polylines = polygonsLength > 0 ? [this.state.polygons[polygonsLength - 1], {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
    }] : []
    const distance = polygonsLength > 0 ? geolib.getDistance(...polylines).toString() : ''

    return (
      <View style={styles.container}>
        <MapView style={[styles.map, { flex: this.state.flex }]}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.region}
          mapType={MAP_TYPES.HYBRID}
          onRegionChange={region => this.setState({ region })}
          onRegionChangeComplete={() => this.state.polygons.length > 0 ? this.marker1.showCallout() : this.marker1.hideCallout()}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
        >
          <Marker
            ref={ref => { this.marker1 = ref; }}
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
            }}
            title={distance + ' เมตร'}
            opacity={0}
          />
          <Polyline
            coordinates={polylines}
            strokeColor="#fff"
            strokeWidth={2}
          />
          <Polygon
            coordinates={this.state.polygons}
            fillColor="rgba(0, 200, 0, 0.5)"
            strokeColor="#fff"
            strokeWidth={2}
          />
        </MapView>
        {this.calculateArea()}
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
        <View style={styles.back_button} >
          <Icon
            raised
            name='arrow-back'
            type='MaterialIcons'
            color='#517fa4'
            onPress={this.backButton} />
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
    justifyContent: 'flex-end',
    top: 25,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
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
  back_button: {
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
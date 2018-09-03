import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements'
import MapView, { MAP_TYPES, Polyline, Marker, Polygon } from 'react-native-maps';

const geolib = require('geolib')

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends React.Component {
  state = {
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    polygon: null,
    marginBottom: 1
  };

  onRegionChangeComplete = () => {
    if (this.state.polygon)
      this.state.polygon.coordinates.length > 0 ? this.marker1.showCallout() : this.marker1.hideCallout()
  }

  handleAdd = () => {
    const { polygon, creatingHole } = this.state;
    const coord = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    }
    if (!polygon) {
      this.setState({
        polygon: {
          coordinates: [{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
          }],
        },
      });
    } else {
      this.setState({
        polygon: {
          ...polygon,
          coordinates: [
            ...polygon.coordinates,
            coord,
          ],
        },
      });
    }
  }

  backButton = () => {
    const polygonCopy = [...this.state.polygon.coordinates]
    polygonCopy.splice(-1, 1)
    this.setState({ polygon: { coordinates: polygonCopy } })
  }

  render() {
    let polyline = null
    let distance = null
    if (this.state.polygon) {
      const polygonLength = this.state.polygon.coordinates.length
      polyline = polygonLength > 0 ? [this.state.polygon.coordinates[polygonLength - 1], {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude,
      }] : []
      distance = polygonLength > 0 ? geolib.getDistance(...polyline).toString() : ''
    }

    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={[styles.map, { marginBottom: this.state.marginBottom }]}
          mapType={MAP_TYPES.HYBRID}
          initialRegion={this.state.region}
          onRegionChange={region => this.setState({ region })}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onMapReady={() => this.setState({ marginBottom: 0 })}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
        >
          {polyline && (
            <Polyline
              coordinates={polyline}
              strokeColor="#fff"
              strokeWidth={2}
            />
          )}
          {distance && (
            <Marker
              ref={ref => { this.marker1 = ref; }}
              coordinate={{
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
              }}
              title={distance + ' เมตร'}
              calloutAnchor={{ x: 0.5, y: 0.75 }}
              opacity={0}
            />
          )}
          {this.state.polygon && (
            <Polygon
              coordinates={this.state.polygon.coordinates}
              strokeColor="#FFF"
              fillColor="rgba(255,0,0,0.5)"
              strokeWidth={1}
            />
          )}
        </MapView>
        <View style={styles.target} >
          <Icon
            type='material-community'
            name='target'
            color='#fff'
          />
        </View>
        <View style={styles.buttonContainer}>
          <View>
            <Icon
              raised
              name='arrow-back'
              type='MaterialIcons'
              color='#517fa4'
              onPress={this.backButton} />
          </View>
          <View>
            <Icon
              raised
              name='add'
              type='MaterialIcons'
              color='#517fa4'
              onPress={this.handleAdd} />
          </View>
          <View >
            <Icon
              raised
              name='clear'
              type='MaterialIcons'
              color='#517fa4'
              onPress={() => this.setState({ polygon: null })} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: 25
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  target: {
    position: 'absolute',
    top: '48%',
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});
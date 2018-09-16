import React from 'react';
import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import MapView, { MAP_TYPES, Polyline, Marker, Polygon } from 'react-native-maps';

const geolib = require('geolib')
const geojsonArea = require('@mapbox/geojson-area');

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let id = 0
function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default class MapScreen extends React.Component {
    static navigationOptions = {
        title: 'Land Measure',
    };
    
    state = {
        region: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        polygon: null,
        markers: [],
        marginBottom: 1
    };

    componentDidUpdate() {
        //Getting result from searching
        const { navigation } = this.props;
        const lat = navigation.getParam('lat');
        const lng = navigation.getParam('lng');
        if (lat) {
            this.map.animateToCoordinate({
                latitude: lat,
                longitude: lng,
            })
        }

        //Show callout (popup) when area is drawn.
        if (this.state.polygon)
            this.state.polygon.coordinates.length > 0 ? this.marker1.showCallout() : this.marker1.hideCallout()
    }

    handleAdd = () => {
        const polygon = this.state.polygon;
        const coord = {
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude
        }
        if (!polygon) {
            this.setState({
                polygon: {
                    coordinates: [coord],
                },
                markers: [
                    {
                        coordinate: coord,
                        key: id++,
                        color: randomColor(),
                    },
                ],
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
                markers: [
                    ...this.state.markers,
                    {
                        coordinate: coord,
                        key: id++,
                        color: randomColor(),
                    },
                ],
            });
        }
    }

    calculateArea = () => {
        const polygons = this.state.polygon.coordinates
        if (polygons.length > 1) {
            const array_coordinates = polygons.map(obj => [obj.longitude, obj.latitude])
            const geojson = {
                "type": "Polygon",
                "coordinates": [array_coordinates]
            }
            let areaInRai = geojsonArea.geometry(geojson) / 1600
            let areaInNgarn = areaInRai % 1 * 4
            let areaInWa = (areaInNgarn % 1) * 100
            areaInRai = Math.floor(areaInRai)
            areaInNgarn = Math.floor(areaInNgarn)
            areaInWa = Math.floor(areaInWa)

            return (
                <View style={styles.area_message} >
                    <Text> {areaInRai + ' ไร่ ' + areaInNgarn + ' งาน ' + areaInWa + ' ตารางวา '}</Text>
                </View>
            )
        }
    }

    backButton = () => {
        if (this.state.polygon) {
            const polygonCopy = [...this.state.polygon.coordinates]
            const markersCopy = [...this.state.markers]
            polygonCopy.splice(-1, 1)
            markersCopy.splice(-1, 1)
            this.setState({ polygon: { coordinates: polygonCopy }, markers: markersCopy })
        }
    }

    render() {
        let polyline = null
        let distance = null
        if (this.state.polygon) {
            const polygon = this.state.polygon
            const polygonLength = polygon.coordinates.length
            polyline = polygonLength > 0 ? [polygon.coordinates[polygonLength - 1], {
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
            }] : []
            distance = polygonLength > 0 ? geolib.getDistance(...polyline).toString() : ''
        }

        return (
            <View style={styles.container}>
                <MapView
                    ref={ref => { this.map = ref; }}
                    provider={'google'}
                    style={[styles.map, { marginBottom: this.state.marginBottom }]}
                    mapType={MAP_TYPES.HYBRID}
                    initialRegion={this.state.region}
                    onRegionChangeComplete={region => this.setState({ region })}
                    onMapReady={() => this.setState({ marginBottom: 0 })}
                    showsUserLocation
                    followsUserLocation
                    showsMyLocationButton
                >
                    {this.state.markers.map(marker => (
                        <Marker
                            key={marker.key}
                            coordinate={marker.coordinate}
                            pinColor={marker.color}
                        />
                    ))}
                    {polyline && (
                        <Polyline
                            coordinates={polyline}
                            strokeColor="#fff"
                            strokeWidth={2}
                        />
                    )}
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
                    {this.state.polygon && (
                        <Polygon
                            coordinates={this.state.polygon.coordinates}
                            strokeColor="#FFF"
                            fillColor="rgba(255,0,0,0.5)"
                            strokeWidth={1}
                        />
                    )}
                </MapView>
                {this.state.polygon && (
                    this.calculateArea()
                )}
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
                            onPress={() => this.setState({ polygon: null, markers: [] })} />
                    </View>
                    <View>
                        <Icon
                            raised
                            name='search'
                            type='MaterialIcons'
                            color='#517fa4'
                            onPress={() => { this.props.navigation.navigate('Search'); }} />
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
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    target: {
        position: 'absolute',
        top: '48%',
    },
    area_message: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});
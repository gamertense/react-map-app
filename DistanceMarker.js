import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

const propTypes = {
  distance: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
};

const defaultProps = {
  fontSize: 13,
};

class DistanceMarker extends React.Component {
  render() {
    const { fontSize, distance } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          <Text style={[styles.distance, { fontSize }]}>{distance} เมตร</Text>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

DistanceMarker.propTypes = propTypes;
DistanceMarker.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#FF5A5F',
    padding: 2,
    borderRadius: 3,
    borderColor: '#D23F44',
    borderWidth: 0.5,
  },
  dollar: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  distance: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FF5A5F',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#D23F44',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

export default DistanceMarker;
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import MapScreen from './screens/MapScreen'
import SearchScreen from './screens/SearchScreen'

const RootStack = createStackNavigator(
  {
    Map: MapScreen,
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Map',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
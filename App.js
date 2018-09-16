import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import MapScreen from './screens/MapScreen'
import SearchScreen from './screens/SearchScreen'

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Map',
  };

  render() {
    return (
      <View style={{ flex: 1}}>
        <MapScreen />
        <Button
          title="Go to Search"
          onPress={() => this.props.navigation.navigate('Search')}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Tips, Ranking, Ringkasan} from './CompStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();

export default class Home extends Component {
  render() {
    return (
      <Tab.Navigator shifting>
        <Tab.Screen
          options={{
            tabBarColor: '#9C27B0',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="chart-timeline"
                color="#fff"
                size={24}
              />
            ),
          }}
          name={'Ringkasan'}
          component={Ringkasan}
        />
        <Tab.Screen
          options={{
            tabBarColor: '#2196F3',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="podium-gold"
                color="#fff"
                size={24}
              />
            ),
          }}
          name={'Ranking'}
          component={Ranking}
        />
        <Tab.Screen
          options={{
            tabBarColor: '#009688',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="lightbulb-on" color="#fff" size={24} />
            )
          }}
          name={'Tips'}
          component={Tips}
        />
      </Tab.Navigator>
    );
  }
}

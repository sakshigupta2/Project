import React from 'react';
import LottieView from 'lottie-react-native';
import {View, Image} from 'react-native';

export default class PumpingAnimation extends React.Component {
  render() {
    return (

      <Image
      source={require('../assets/pumpingHeart.json')}
      style={{width:"60%"}}
       />
    )
  }
}
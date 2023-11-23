import {View} from 'react-native';
import React, {useEffect} from 'react';
import Auth from '@react-native-firebase/auth';
import {StackActions, useNavigation} from '@react-navigation/native';
import Spinner from '../components/Spinner';
import {ROUTES} from '../../App';
import {COMMON_STYLES} from '../styles/common.styles';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      Auth().onAuthStateChanged(user => {
        const routeName = user !== null ? ROUTES.HOME : ROUTES.LOGIN;
        navigation.dispatch(StackActions.replace(routeName));
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        COMMON_STYLES.flex1,
        COMMON_STYLES.centerItems,
        COMMON_STYLES.blueBgColor,
      ]}>
      <Spinner />
    </View>
  );
}

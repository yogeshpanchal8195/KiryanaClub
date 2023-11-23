import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {PARAGRAPH_STYLES} from '../styles/common.styles';
import {ROUTES} from '../../App';

export default function Logout() {
  const navigation = useNavigation();
  const onLogout = () => {
    Auth().signOut();
    navigation.replace(ROUTES.LOGIN);
  };

  return (
    <TouchableOpacity onPress={onLogout}>
      <Text style={[styles.inputLabelText, styles.whiteColor]}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inputLabelText: {
    ...PARAGRAPH_STYLES.RegulerT2,
    marginVertical: 12,
    fontWeight: '600',
    color: '#337AB8',
  },
});

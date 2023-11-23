import React, {useState} from 'react';
import {
  View,
  TextInput,
  ToastAndroid,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Auth from '@react-native-firebase/auth';
import {COMMON_STYLES, PARAGRAPH_STYLES} from '../styles/common.styles';
import {ROUTES} from '../../App';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      const isUserLogin = await Auth().signInWithEmailAndPassword(
        email,
        password,
      );
      if (isUserLogin) {
        navigation.replace(ROUTES.HOME);
      }
    } catch (error) {
      ToastAndroid.show(error.message, 4000);
    }
  };

  return (
    <View
      style={[
        COMMON_STYLES.flex1,
        COMMON_STYLES.centerItems,
        COMMON_STYLES.col,
        COMMON_STYLES.p1,
      ]}>
      <View style={styles.inputLabel}>
        <Text style={styles.inputLabelText}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={val => setEmail(val)}
        />
      </View>
      <View style={styles.inputLabel}>
        <Text style={styles.inputLabelText}>Password</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={val => setPassword(val)}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={onLogin} style={styles.btnStyle}>
        <Text style={[styles.inputLabelText, styles.whiteColor]}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    width: '100%',
  },
  inputLabelText: {
    ...PARAGRAPH_STYLES.RegulerT1,
    marginVertical: 12,
    color: '#5A6066',
  },
  inputField: {
    borderColor: '#CED8E0',
    borderWidth: 1,
    borderRadius: 8,
    color: '#5A6066',
    padding: 8,
  },
  btnStyle: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#337AB8',
  },
  whiteColor: {
    color: '#ffffff',
  },
});

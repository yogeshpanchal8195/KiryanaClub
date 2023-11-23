import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {COMMON_STYLES} from '../styles/common.styles';

const Spinner = ({type = 'on-screen'}) => {
  if (type === 'on-screen') {
    return (
      <View style={[COMMON_STYLES.flex1, COMMON_STYLES.centerItems]}>
        <ActivityIndicator color={'#CCE6FF'} size="large" />
      </View>
    );
  }
  return (
    <Modal animationType="fade" transparent visible>
      <View style={styles.background}>
        <View style={[COMMON_STYLES.flex1, COMMON_STYLES.centerItems]}>
          <ActivityIndicator color={'#CCE6FF'} size="large" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default Spinner;

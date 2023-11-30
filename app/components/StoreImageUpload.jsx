import React from 'react';
import {Pressable, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {COMMON_STYLES, SUBHEADING_STYLES} from '../styles/common.styles';
import {cameraUpload, galleryUpload} from '../helpers/imageUpload';

export default function StoreImageUpload({imageUploadSuccess}) {
  const imageUploadCallback = response => {
    if (response && !response.didCancel) {
      if (response.errorMessage) {
        ToastAndroid.show(response.errorMessage || 'Image Picker Error', 2000);
      } else if (response.assets) {
        imageUploadSuccess(response.assets);
      }
    }
  };

  return (
    <View style={styles.uploadFileDrawerCont}>
      <Pressable
        onPress={() => galleryUpload(imageUploadCallback)}
        style={styles.uploadCont}>
        <Text style={styles.textVal}>Gallery</Text>
      </Pressable>
      <Pressable
        onPress={() => cameraUpload(imageUploadCallback)}
        style={[styles.uploadCont, styles.btnCont]}>
        <Text style={[styles.textVal, COMMON_STYLES.whiteColor]}>Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadFileDrawerCont: {
    flexDirection: 'row',
  },
  uploadCont: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#337AB8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
  },
  btnCont: {
    backgroundColor: '#337AB8',
    borderWidth: 0,
    marginLeft: 16,
  },
  textVal: {
    ...SUBHEADING_STYLES.MEDIUM_S2,
    color: '#337AB8',
  },
});

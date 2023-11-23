import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const cameraUpload = async (
  imageUploadCallback,
  cameraType = 'back',
) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      launchCamera(
        {
          mediaType: 'photo',
          cameraType: cameraType || 'back',
        },
        imageUploadCallback,
      );
    } else {
      ToastAndroid.show('Camera Permission Denied', 2000);
    }
  } catch (err) {
    console.warn(err);
  }
};

export const galleryUpload = async imageUploadCallback => {
  try {
    let granted;
    if (Number(Platform.constants.Release) >= 13) {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      );
    } else {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
        },
        imageUploadCallback,
      );
    } else {
      ToastAndroid.show('Gallery Permission Denied', 2000);
    }
  } catch (err) {
    console.warn(err);
  }
};

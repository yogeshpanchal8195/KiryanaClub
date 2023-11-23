import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  COMMON_STYLES,
  SUBHEADING_STYLES,
  PARAGRAPH_STYLES,
} from '../styles/common.styles';
import StoreImageUpload from '../components/StoreImageUpload';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Spinner from '../components/Spinner';

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function StoreDetailsScreen({route}) {
  const {uid} = route.params;
  const [uploadImageDrawer, setUploadImageDrawer] = useState(false);
  const [storeObj, setStoreObj] = useState();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const store = await database().ref(`stores/${uid}`).once('value');
      setStoreObj(JSON.parse(JSON.stringify(store)));
    };
    getData();
  }, [uid]);

  useEffect(() => {
    const getImages = async () => {
      try {
        setLoading(true);
        const reference = storage().ref(`${uid}`);
        const list = await reference.list();
        const imageUrls = await Promise.all(
          list.items.map(async item => {
            const url = await item.getDownloadURL();
            return {name: item.name, url};
          }),
        );
        setImages(imageUrls || []);
      } catch (error) {
        ToastAndroid.show(error.message || 'Some Error Occurred', 3000);
      } finally {
        setLoading(false);
      }
    };
    getImages();
  }, [uid]);

  const imageUploadSuccess = async imageObj => {
    try {
      setLoading(true);
      setUploadImageDrawer(false);
      const reference = storage().ref(`${uid}/${imageObj.fileName}`);
      await reference.putFile(imageObj.uri);
      const url = await reference.getDownloadURL();
      setImages([...images, {name: imageObj.fileName, url}]);
    } catch (error) {
      ToastAndroid.show(error.message || 'Some Error Occurred', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {storeObj ? (
        <View style={COMMON_STYLES.p1}>
          <Text style={styles.type}>{storeObj.type}</Text>
          <Text style={styles.name}>{storeObj.name}</Text>
          <Text style={styles.labelText}>Area: {storeObj.area}</Text>
          <Text style={styles.address}>Address: {storeObj.address}</Text>
          <View style={styles.imageCont}>
            {images.map(ele => (
              <View key={ele.name} style={styles.imageCard}>
                <Image
                  source={{uri: ele.url}}
                  alt={ele.name}
                  style={styles.img}
                />
              </View>
            ))}
            {loading ? <Spinner /> : null}
          </View>
          {(storeObj?.images || []).length < 10 ? (
            <TouchableOpacity onPress={() => setUploadImageDrawer(true)}>
              <Text style={styles.type}>+ Add Image</Text>
            </TouchableOpacity>
          ) : null}
          <Modal
            animationType="slide"
            transparent
            visible={uploadImageDrawer}
            onRequestClose={() => setUploadImageDrawer(false)}>
            <View style={uploadImageDrawer && styles.background}>
              <View style={styles.modal}>
                <StoreImageUpload imageUploadSuccess={imageUploadSuccess} />
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  name: {
    ...SUBHEADING_STYLES.MEDIUM_S2,
    color: '#101010',
  },
  type: {
    ...SUBHEADING_STYLES.MEDIUM_S3,
    color: '#337AB8',
  },
  labelText: {
    ...SUBHEADING_STYLES.MEDIUM_S2,
    color: '#666',
    marginBottom: 12,
  },
  address: {
    ...PARAGRAPH_STYLES.RegulerT2,
    color: '#666',
  },
  background: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    shadowColor: '#000000',
    elevation: 5,
    width: '100%',
    padding: 24,
    flex: 1,
    maxHeight: 0.75 * SCREEN_HEIGHT,
  },
  imageCard: {
    height: 80,
    width: 80,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginRight: 12,
    marginBottom: 12,
    backgroundColor: '#F2F2F2',
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    height: 80,
    width: 80,
    borderRadius: 16,
  },
  imageCont: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

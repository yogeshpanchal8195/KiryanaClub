import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
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
  const [showImage, setShowImage] = useState();
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

  const imageUploadSuccess = async imageObjList => {
    try {
      setLoading(true);
      setUploadImageDrawer(false);
      imageObjList.forEach(async imageObj => {
        const reference = storage().ref(`${uid}/${imageObj.fileName}`);
        const task = reference.putFile(imageObj.uri);
        task.on(
          'state_changed',
          taskSnapshot => {
            const progress =
              (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          error => {
            console.error(error);
          },
          async () => {
            const downloadURL = await reference.getDownloadURL();
            setImages(prevImages => [
              ...prevImages,
              {name: imageObj.fileName, url: downloadURL},
            ]);
          },
        );
      });
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
            {images.map((ele, idx) => (
              <Pressable
                key={ele.name}
                style={styles.imageCard}
                onPress={() => setShowImage(idx)}>
                <Image
                  source={{uri: ele.url}}
                  alt={ele.name}
                  style={styles.img}
                />
              </Pressable>
            ))}
            {loading ? <Spinner /> : null}
          </View>
          {(storeObj?.images || []).length < 10 ? (
            <TouchableOpacity onPress={() => setUploadImageDrawer(true)}>
              <Text style={styles.type}>+ Add Image</Text>
            </TouchableOpacity>
          ) : null}
          {showImage !== undefined && (
            <Modal
              animationType="slide"
              transparent
              visible={showImage !== undefined}
              onRequestClose={() => setShowImage()}>
              <View style={styles.background}>
                <View style={styles.modal}>
                  <View style={styles.cross}>
                    <Pressable onPress={() => setShowImage()}>
                      <Text style={COMMON_STYLES.blackColor}>Close</Text>
                    </Pressable>
                  </View>
                  <View style={COMMON_STYLES.centerItems}>
                    <Image
                      source={{uri: images[showImage].url}}
                      alt={images[showImage].name}
                      style={styles.bigImg}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}
          <Modal
            animationType="slide"
            transparent
            visible={uploadImageDrawer}
            onRequestClose={() => setUploadImageDrawer(false)}>
            <View style={uploadImageDrawer && styles.background}>
              <View style={styles.modal}>
                <View style={styles.cross}>
                  <Pressable onPress={() => setUploadImageDrawer(false)}>
                    <Text style={COMMON_STYLES.blackColor}>Close</Text>
                  </Pressable>
                </View>
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
  cross: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: -14.5,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 999,
    elevation: 1,
    padding: 8,
  },
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
  bigImg: {
    height: 320,
    width: 280,
    borderRadius: 16,
  },
  imageCont: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

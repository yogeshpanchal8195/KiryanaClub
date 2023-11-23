import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COMMON_STYLES} from '../styles/common.styles';
import useStores, {LIMIT} from '../hooks/useStores';
import Spinner from '../components/Spinner';
import {PARAGRAPH_STYLES, SUBHEADING_STYLES} from '../styles/common.styles';
import {ROUTES} from '../../App';
import useDebounce from '../hooks/useDebounce';
import FilterSection from '../components/FilterSection';

const StoreCard = React.memo(({store, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate(ROUTES.STORE_DETAILS, {
          uid: store.uid,
        })
      }>
      <Text style={styles.type}>{store.type}</Text>
      <Text style={styles.name}>{store.name}</Text>
      <View style={[COMMON_STYLES.jb, COMMON_STYLES.row]}>
        <Text style={styles.labelText}>Area: {store.area}</Text>
        <Text style={styles.labelText}>Route: {store.route}</Text>
      </View>
      <Text style={styles.address}>Address: {store.address}</Text>
    </TouchableOpacity>
  );
});

export default function HomeScreen({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const debouncedValue = useDebounce(searchText);

  const {
    storeObjsOfUser,
    fetchNext,
    loading,
    loadingNext,
    totalStoreIdsOfUser,
    currentFetchedIndex,
  } = useStores(debouncedValue, appliedFilters);

  const imposeFilters = vals => {
    setAppliedFilters(vals || {});
  };

  return (
    <View
      style={[COMMON_STYLES.p1, COMMON_STYLES.flex1, COMMON_STYLES.flexGrow]}>
      <TextInput
        style={styles.inputField}
        value={searchText}
        placeholder="Search Store name"
        onChangeText={val => setSearchText(val)}
      />
      <FilterSection imposeFilters={imposeFilters} />
      <Text style={styles.labelText}>
        {storeObjsOfUser.length} of {totalStoreIdsOfUser.length} Stores fetched{' '}
      </Text>
      <FlatList
        scrollToOverflowEnabled={true}
        scrollEnabled={true}
        onEndReached={() => fetchNext(debouncedValue, currentFetchedIndex)}
        data={storeObjsOfUser}
        renderItem={({item}) => (
          <StoreCard store={item} navigation={navigation} />
        )}
        keyExtractor={(item, idx) => item.uid + idx}
      />
      {loading || loadingNext ? <Spinner /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    padding: 16,
    elevation: 1.5,
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
  inputField: {
    borderColor: '#CED8E0',
    borderWidth: 1,
    borderRadius: 8,
    color: '#5A6066',
    padding: 8,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
});

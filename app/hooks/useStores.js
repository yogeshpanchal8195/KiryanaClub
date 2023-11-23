const {useEffect, useCallback, useState} = require('react');
import Auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useIsFocused} from '@react-navigation/native';
import {ToastAndroid} from 'react-native';

export const LIMIT = 20;

const useStores = (searchText, appliedFilters) => {
  const isFocused = useIsFocused();
  const [totalStoreIdsOfUser, setTotalstoreIdsOfUser] = useState([]);
  const [storeObjsOfUser, setStoreObjsOfUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const getStores = async () => {
      const users = await database().ref('users').once('value');
      const list = Object.values(JSON.parse(JSON.stringify(users)));
      const stores = list.find(
        ele => ele.UUID == Auth().currentUser.uid,
      ).stores;
      setTotalstoreIdsOfUser(stores);
    };
    getStores();
  }, [isFocused]);

  const getStoreObj = async storeId => {
    const storeObj = await database().ref(`stores/${storeId}`).once('value');
    const store = JSON.parse(JSON.stringify(storeObj));
    store.uid = storeId;
    return store;
  };

  const isFiltersAvailable = () => {
    return (
      appliedFilters.area?.length ||
      appliedFilters.route?.length ||
      appliedFilters.type?.length
    );
  };

  useEffect(() => {
    const getStoresOfUser = async () => {
      if (totalStoreIdsOfUser.length === 0) {
        return;
      }
      try {
        setLoading(true);
        let storeObjs = await Promise.all(
          totalStoreIdsOfUser.slice(0, LIMIT).map(id => getStoreObj(id)),
        );
        if (searchText) {
          storeObjs = storeObjs.filter(ele =>
            ele.name.toLowerCase().includes(searchText.toLowerCase()),
          );
        }
        if (isFiltersAvailable()) {
          storeObjs = storeObjs.filter(ele => {
            return (
              appliedFilters.area.includes(ele.area) ||
              appliedFilters.route.includes(ele.route) ||
              appliedFilters.type.includes(ele.type)
            );
          });
        }
        setIndex(LIMIT);
        setStoreObjsOfUser(storeObjs);
        if (storeObjs.length === 0 && 0 + LIMIT < totalStoreIdsOfUser.length) {
          setIndex(LIMIT);
          fetchNext(searchText, 0 + LIMIT);
        }
      } catch (error) {
        ToastAndroid.show(error?.message || 'Some Error Occurred', 3000);
      } finally {
        setLoading(false);
      }
    };
    getStoresOfUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, searchText, totalStoreIdsOfUser, appliedFilters]);

  const fetchNext = useCallback(
    async (search, idx) => {
      if (
        totalStoreIdsOfUser.length === 0 ||
        idx > totalStoreIdsOfUser.length
      ) {
        return;
      }
      try {
        setLoadingNext(true);
        let storeObjs = await Promise.all(
          totalStoreIdsOfUser
            .slice(idx, idx + LIMIT)
            .map(id => getStoreObj(id)),
        );
        if (search) {
          storeObjs = storeObjs.filter(ele =>
            ele.name.toLowerCase().includes(search.toLowerCase()),
          );
        }
        if (isFiltersAvailable()) {
          storeObjs = storeObjs.filter(ele => {
            return (
              appliedFilters.area.includes(ele.area) ||
              appliedFilters.route.includes(ele.route) ||
              appliedFilters.type.includes(ele.type)
            );
          });
        }
        setIndex(idx + LIMIT);
        setStoreObjsOfUser(prevList => [...prevList, ...storeObjs]);
        if (
          storeObjs.length === 0 &&
          idx + LIMIT < totalStoreIdsOfUser.length
        ) {
          fetchNext(search, idx + LIMIT);
          setIndex(idx + LIMIT);
        }
      } catch (error) {
        ToastAndroid.show(error?.message || 'Some Error Occurred', 3000);
      } finally {
        setLoadingNext(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appliedFilters, totalStoreIdsOfUser],
  );

  return {
    totalStoreIdsOfUser,
    storeObjsOfUser,
    fetchNext,
    loading,
    loadingNext,
    currentFetchedIndex: index,
  };
};

export default useStores;

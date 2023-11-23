import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {PARAGRAPH_STYLES, SUBHEADING_STYLES} from '../styles/common.styles';

export default function FilterSection({imposeFilters}) {
  const isFocused = useIsFocused();
  const [areaSelectVals, setAreaSelectVals] = useState([]);
  const [routeSelectVals, setRouteSelectVals] = useState([]);
  const [typeSelectVals, setTypeSelectVals] = useState([]);

  useEffect(() => {
    const getStores = async () => {
      const stores = await database().ref('stores').once('value');
      const list = Object.values(JSON.parse(JSON.stringify(stores)));
      const areas = [...new Set(list.map(ele => ele.area))];
      const routes = [...new Set(list.map(ele => ele.route))];
      const types = [...new Set(list.map(ele => ele.type))];
      setAreaSelectVals(areas.map(ele => ({area: ele, selected: false})));
      setRouteSelectVals(routes.map(ele => ({route: ele, selected: false})));
      setTypeSelectVals(types.map(ele => ({type: ele, selected: false})));
    };
    getStores();
  }, [isFocused]);

  const getSelectedVals = (list, key) => {
    const vals = list.filter(ele => ele.selected).map(ele => ele[key]);
    return {[key]: vals};
  };

  useEffect(() => {
    imposeFilters({
      ...getSelectedVals(areaSelectVals, 'area'),
      ...getSelectedVals(routeSelectVals, 'route'),
      ...getSelectedVals(typeSelectVals, 'type'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaSelectVals, routeSelectVals, typeSelectVals]);

  const updateList = (idx, list, setterFn) => {
    const dummy = [...list];
    dummy[idx].selected = !dummy[idx].selected;
    setterFn(dummy);
  };

  const renderList = useCallback((list, key, setterFn) => {
    return (
      <>
        {list && list.length
          ? list.map((ele, idx) => (
              <Pressable
                key={ele[key]}
                onPress={() => updateList(idx, list, setterFn)}
                style={[styles.chip, ele.selected && styles.selected]}>
                <Text
                  style={[
                    styles.chipText,
                    ele.selected && styles.selectedChipText,
                  ]}>
                  {ele[key]}
                </Text>
              </Pressable>
            ))
          : null}
      </>
    );
  }, []);

  return (
    <View>
      <View style={styles.chipCont}>
        <Text style={styles.labelText}>Area :</Text>
        {renderList(areaSelectVals, 'area', setAreaSelectVals)}
      </View>
      <View style={styles.chipCont}>
        <Text style={styles.labelText}>Route : </Text>
        {renderList(routeSelectVals, 'route', setRouteSelectVals)}
      </View>
      <View style={styles.chipCont}>
        <Text style={styles.labelText}>Type : </Text>
        {renderList(typeSelectVals, 'type', setTypeSelectVals)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  selected: {
    opacity: 1,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  chipCont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    alignItems: 'center',
  },
  chipText: {
    ...SUBHEADING_STYLES.MEDIUM_S3,
    color: '#808080',
  },
  selectedChipText: {
    ...SUBHEADING_STYLES.MEDIUM_S3,
    color: '#337AB8',
  },
  labelText: {
    ...PARAGRAPH_STYLES.RegulerT3,
    color: '#337AB8',
    marginRight: 12,
  },
});

import {StyleSheet} from 'react-native';

const EM = 16;

export const PARAGRAPH_STYLES = StyleSheet.create({
  RegulerT1: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  RegulerT2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  RegulerT3: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
});

export const SUBHEADING_STYLES = StyleSheet.create({
  MEDIUM_S1: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  MEDIUM_S2: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  MEDIUM_S3: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '600',
  },
});

export const HEADING_STYLES = StyleSheet.create({
  REGULAR_H1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
  },
  REGULER_H2: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
  REGULER_H3: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
  },
});

export const COMMON_STYLES = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  flex1: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  jb: {
    justifyContent: 'space-between',
  },
  p1: {
    padding: EM,
  },
  blackColor: {
    color: '#000000',
  },
  whiteColor: {
    color: '#FFFFFF',
  },
  whiteBgColor: {
    backgroundColor: '#FFFFFF',
  },
  blueBgColor: {backgroundColor: '#653BA3'},
  centerItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
});

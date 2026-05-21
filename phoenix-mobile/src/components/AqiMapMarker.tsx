import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';

import { getAqiStatus } from '../utils/getAqiStatus';

type AqiMapMarkerProps = {
  coordinate: LatLng;
  value: number;
  title: string;
  onPress?: () => void;
};

export default function AqiMapMarker({
  coordinate,
  value,
  title,
  onPress,
}: AqiMapMarkerProps) {
  const aqiStatus = getAqiStatus(value);

  return (
    <Marker
      coordinate={coordinate}
      title={title}
      description={`AQI ${value} - ${aqiStatus.label}`}
      onPress={onPress}
    >
      <View style={[styles.marker, { borderColor: aqiStatus.color }]}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '900',
  },
});
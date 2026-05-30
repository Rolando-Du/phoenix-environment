import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet, Text, View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import { COLORS } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const clearZoneLogo = require('../../assets/logo-CZ.png');

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

function ClearZoneTitle() {
  return (
    <View style={styles.titleContainer}>
      <Image source={clearZoneLogo} style={styles.logo} resizeMode="contain" />

      <View style={styles.textRow}>
        <Text style={[styles.titleText, { color: COLORS.secondary }]}>
          CLEAR
        </Text>
        <Text style={[styles.titleText, { color: COLORS.success }]}>
          ZONE
        </Text>
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleAlign: 'center',
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <ClearZoneTitle />,
          }}
        />

        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            headerTitle: () => <ClearZoneTitle />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 18,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
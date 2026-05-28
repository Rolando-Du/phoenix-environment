import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { Region } from "react-native-maps";

import AqiCard from "../components/AqiCard";
import AqiMapMarker from "../components/AqiMapMarker";
import AqiSummaryCard from "../components/AqiSummaryCard";
import CurrentAlertCard from "../components/CurrentAlertCard";
import MapHeaderPanel from "../components/MapHeaderPanel";
import MapOptionsMenu from "../components/MapOptionsMenu";
import type { AqiPoint } from "../data/aqiPoints";
import { useUserLocation } from "../hooks/useUserLocation";
import { getCurrentAlert } from "../services/alertService";
import type { CurrentAlert } from "../services/alertService";
import { getNearbyAqiPoints } from "../services/aqiService";
import type { AqiSource } from "../services/aqiService";
import { getAqiSummary } from "../services/aqiSummaryService";
import type { AqiSummary } from "../services/aqiSummaryService";
import { darkMapStyle } from "../theme/mapStyle";

type ActivePanel = "aqi" | "summary" | "alerts";
type LocationMode = "user" | "demo";

const DEFAULT_REGION: Region = {
  latitude: -40.1579,
  longitude: -71.3534,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const BUENOS_AIRES_REGION: Region = {
  latitude: -34.6037,
  longitude: -58.3816,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [aqiPoints, setAqiPoints] = useState<AqiPoint[]>([]);
  const [selectedAqiPoint, setSelectedAqiPoint] = useState<AqiPoint | null>(
    null,
  );

  const [aqiSource, setAqiSource] = useState<AqiSource>("mock");
  const [aqiSummary, setAqiSummary] = useState<AqiSummary | null>(null);
  const [currentAlert, setCurrentAlert] = useState<CurrentAlert | null>(null);

  const [activePanel, setActivePanel] = useState<ActivePanel>("aqi");
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationMode, setLocationMode] = useState<LocationMode>("user");

  const { userLocation, loadingLocation, statusMessage } = useUserLocation();

  useEffect(() => {
    if (loadingLocation) return;

    async function loadAqiData() {
      const queryLocation =
        locationMode === "demo"
          ? {
              latitude: BUENOS_AIRES_REGION.latitude,
              longitude: BUENOS_AIRES_REGION.longitude,
            }
          : userLocation
            ? {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }
            : undefined;

      const nearbyResult = await getNearbyAqiPoints({
        latitude: queryLocation?.latitude,
        longitude: queryLocation?.longitude,
      });

      setAqiSource(nearbyResult.source);
      setAqiPoints(nearbyResult.points);
      setSelectedAqiPoint(nearbyResult.points[0] ?? null);

      const summary = await getAqiSummary({
        source: nearbyResult.source,
      });

      setAqiSummary(summary);

      const alert = await getCurrentAlert();
      setCurrentAlert(alert);
    }

    loadAqiData();
  }, [loadingLocation, userLocation, locationMode]);

  useEffect(() => {
    if (locationMode === "demo") {
      mapRef.current?.animateToRegion(BUENOS_AIRES_REGION, 1000);
      return;
    }

    if (!userLocation) return;

    const userRegion: Region = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };

    mapRef.current?.animateToRegion(userRegion, 1000);
  }, [locationMode, userLocation]);

  function handleSelectAqiPoint(point: AqiPoint) {
    setSelectedAqiPoint(point);
    setActivePanel("aqi");
    setMenuOpen(false);

    mapRef.current?.animateToRegion(
      {
        latitude: point.coordinate.latitude,
        longitude: point.coordinate.longitude,
        latitudeDelta: 0.035,
        longitudeDelta: 0.035,
      },
      700,
    );
  }

  function handleSelectPanel(panel: ActivePanel) {
    setActivePanel(panel);
    setMenuOpen(false);
  }

  function handleUseDemoLocation() {
    setLocationMode("demo");
    setActivePanel("aqi");
    setMenuOpen(false);
  }

  function handleUseUserLocation() {
    setLocationMode("user");
    setActivePanel("aqi");
    setMenuOpen(false);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        customMapStyle={darkMapStyle}
        showsUserLocation={!!userLocation}
        showsMyLocationButton
      >
        {aqiPoints.map((point) => (
          <AqiMapMarker
            key={point.id}
            coordinate={point.coordinate}
            value={point.value}
            title={point.title}
            onPress={() => handleSelectAqiPoint(point)}
          />
        ))}

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Tu ubicación"
            description="Ubicación detectada por Phoenix"
          />
        )}
      </MapView>

      <MapHeaderPanel
        loading={loadingLocation}
        statusMessage={
          locationMode === "demo"
            ? "Modo demo: Buenos Aires seleccionado."
            : statusMessage
        }
      />

      <MapOptionsMenu
        open={menuOpen}
        activePanel={activePanel}
        onToggle={() => setMenuOpen((current) => !current)}
        onSelect={handleSelectPanel}
        onUseDemoLocation={handleUseDemoLocation}
        onUseUserLocation={handleUseUserLocation}
      />
      <View style={styles.bottomPanel}>
        {activePanel === "summary" && aqiSummary && (
          <AqiSummaryCard
            summary={aqiSummary}
            onClose={() => setActivePanel("aqi")}
          />
        )}

        {activePanel === "alerts" && currentAlert && (
          <CurrentAlertCard
            alert={currentAlert}
            onClose={() => setActivePanel("aqi")}
          />
        )}

        {activePanel === "aqi" && selectedAqiPoint && (
          <AqiCard
            title={selectedAqiPoint.title}
            value={selectedAqiPoint.value}
            pm25={selectedAqiPoint.pm25}
            pm10={selectedAqiPoint.pm10}
            source={aqiSource}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },
});

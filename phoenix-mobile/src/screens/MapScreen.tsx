import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import type { MapPressEvent, Region } from "react-native-maps";

import AqiCard from "../components/AqiCard";
import AqiHistoryCard from "../components/AqiHistoryCard";
import AqiMapMarker from "../components/AqiMapMarker";
import AqiSummaryCard from "../components/AqiSummaryCard";
import CurrentAlertCard from "../components/CurrentAlertCard";
import MapHeaderPanel from "../components/MapHeaderPanel";
import MapOptionsMenu from "../components/MapOptionsMenu";
import type { AqiPoint } from "../data/aqiPoints";
import { useUserLocation } from "../hooks/useUserLocation";
import { getCurrentAlert } from "../services/alertService";
import type { CurrentAlert } from "../services/alertService";
import { getAqiHistory } from "../services/aqiHistoryService";
import type { AqiHistoryItem } from "../services/aqiHistoryService";
import { getNearbyAqiPoints } from "../services/aqiService";
import type { AqiSource } from "../services/aqiService";
import { getAqiSummary } from "../services/aqiSummaryService";
import type {
  AqiSummary,
  AqiSummarySource,
} from "../services/aqiSummaryService";
import { darkMapStyle } from "../theme/mapStyle";

type ActivePanel = "aqi" | "summary" | "alerts" | "history";
type MapMode = "user" | "explore";

type QueryCoordinate = {
  latitude?: number;
  longitude?: number;
};

const DEFAULT_REGION: Region = {
  latitude: -40.1579,
  longitude: -71.3534,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

function getPersistedSource(source: AqiSource): AqiSummarySource {
  if (source === "openaq" || source === "openmeteo") {
    return source;
  }

  return "all";
}

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [aqiPoints, setAqiPoints] = useState<AqiPoint[]>([]);
  const [selectedAqiPoint, setSelectedAqiPoint] = useState<AqiPoint | null>(
    null,
  );

  const [aqiSource, setAqiSource] = useState<AqiSource>("unavailable");
  const [aqiSummary, setAqiSummary] = useState<AqiSummary | null>(null);
  const [aqiHistory, setAqiHistory] = useState<AqiHistoryItem[]>([]);
  const [currentAlert, setCurrentAlert] = useState<CurrentAlert | null>(null);

  const [activePanel, setActivePanel] = useState<ActivePanel>("aqi");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapMode, setMapMode] = useState<MapMode>("user");
  const [exploreCoordinate, setExploreCoordinate] =
    useState<QueryCoordinate | null>(null);
  const [loadingAqi, setLoadingAqi] = useState(false);

  const { userLocation, loadingLocation, statusMessage } = useUserLocation();

  async function loadAqiData(coordinate: QueryCoordinate) {
    setLoadingAqi(true);

    try {
      const nearbyResult = await getNearbyAqiPoints({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });

      const persistedSource = getPersistedSource(nearbyResult.source);

      setAqiSource(nearbyResult.source);
      setAqiPoints(nearbyResult.points);
      setSelectedAqiPoint(nearbyResult.points[0] ?? null);

      const summary = await getAqiSummary({
        source: persistedSource,
      });

      setAqiSummary(summary);

      const history = await getAqiHistory({
        source: persistedSource,
        limit: 10,
      });

      setAqiHistory(history);

      const alert = await getCurrentAlert();
      setCurrentAlert(alert);
    } finally {
      setLoadingAqi(false);
    }
  }

  useEffect(() => {
    if (loadingLocation) return;

    loadAqiData({
      latitude: userLocation?.coords.latitude,
      longitude: userLocation?.coords.longitude,
    });
  }, [loadingLocation, userLocation]);

  useEffect(() => {
    if (!userLocation) return;

    const userRegion: Region = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };

    mapRef.current?.animateToRegion(userRegion, 1000);
  }, [userLocation]);

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

  function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setMapMode("explore");
    setExploreCoordinate({ latitude, longitude });
    setActivePanel("aqi");
    setMenuOpen(false);

    loadAqiData({
      latitude,
      longitude,
    });

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      700,
    );
  }

  function handleBackToUserLocation() {
    if (!userLocation) return;

    setMapMode("user");
    setExploreCoordinate(null);
    setActivePanel("aqi");
    setMenuOpen(false);

    const userRegion: Region = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };

    mapRef.current?.animateToRegion(userRegion, 700);

    loadAqiData({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    });
  }

  const headerStatusMessage =
    mapMode === "explore"
      ? "Zona consultada en el mapa. Tocá otro punto para explorar."
      : `${statusMessage} Tocá el mapa para consultar otra zona.`;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        customMapStyle={darkMapStyle}
        showsUserLocation={!!userLocation}
        showsMyLocationButton
        onPress={handleMapPress}
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

        {mapMode === "explore" && exploreCoordinate?.latitude && exploreCoordinate.longitude && (
          <Marker
            coordinate={{
              latitude: exploreCoordinate.latitude,
              longitude: exploreCoordinate.longitude,
            }}
            title="Zona consultada"
            description="Punto seleccionado en el mapa"
            pinColor="#38bdf8"
          />
        )}
      </MapView>

      <MapHeaderPanel
        loading={loadingLocation || loadingAqi}
        statusMessage={headerStatusMessage}
      />

      <MapOptionsMenu
        open={menuOpen}
        activePanel={activePanel}
        onToggle={() => setMenuOpen((current) => !current)}
        onSelect={handleSelectPanel}
      />

      {mapMode === "explore" && userLocation && (
        <Pressable
          style={styles.locationButton}
          onPress={handleBackToUserLocation}
        >
          <Text style={styles.locationButtonText}>Mi ubicación</Text>
        </Pressable>
      )}

      <View style={styles.bottomPanel}>
        {activePanel === "summary" && aqiSummary && (
          <AqiSummaryCard
            summary={aqiSummary}
            onClose={() => setActivePanel("aqi")}
          />
        )}

        {activePanel === "history" && (
          <AqiHistoryCard
            history={aqiHistory}
            source={aqiSource}
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
  locationButton: {
    position: "absolute",
    top: 94,
    right: 20,
    zIndex: 40,
    elevation: 40,
    backgroundColor: "rgba(15, 23, 42, 0.96)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.45)",
  },
  locationButtonText: {
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "900",
  },
  bottomPanel: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
  },
});
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

type UseUserLocationReturn = {
  userLocation: Location.LocationObject | null;
  loadingLocation: boolean;
  statusMessage: string;
};

export function useUserLocation(): UseUserLocationReturn {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  const [loadingLocation, setLoadingLocation] = useState(true);

  const [statusMessage, setStatusMessage] = useState(
    'Buscando ubicación del usuario...'
  );

  useEffect(() => {
    async function loadUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setStatusMessage('Permiso de ubicación denegado. Usando región inicial.');
          setLoadingLocation(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation(currentLocation);
        setStatusMessage('Ubicación real detectada correctamente.');
      } catch (error) {
        setStatusMessage('No se pudo obtener la ubicación. Usando región inicial.');
      } finally {
        setLoadingLocation(false);
      }
    }

    loadUserLocation();
  }, []);

  return {
    userLocation,
    loadingLocation,
    statusMessage,
  };
}
# Phoenix Mobile

Aplicación mobile de Phoenix Environment para visualizar calidad del aire en tiempo real desde el celular.

La app consume datos desde Phoenix API y permite ver:

* AQI actual por ubicación.
* Fuente de datos real.
* Mapa ambiental.
* Resumen AQI.
* Historial AQI.
* Alertas ambientales.
* Modo demo Buenos Aires para probar OpenAQ.

---

## Tecnologías

* React Native
* Expo
* TypeScript
* React Native Maps
* Expo Location

---

## Instalación

Desde la carpeta del mobile:

```bash
cd phoenix-mobile
pnpm install
```

---

## Configuración de API

La app consume el backend desde:

```txt
src/config/api.ts
```

En desarrollo local, usar la IP local de la computadora donde corre el backend.

Ejemplo:

```ts
export const API_BASE_URL = 'http://192.168.1.58:4000';
```

Importante:

```txt
No usar localhost en el celular.
El celular necesita acceder a la IP local de la PC.
```

Cuando el backend esté desplegado en internet, reemplazar por la URL pública:

```ts
export const API_BASE_URL = 'https://phoenix-api.onrender.com';
```

---

## Ejecutar aplicación

```bash
pnpm expo start -c
```

Luego abrir Expo Go y escanear el QR.

---

## Funcionalidades principales

### Mapa ambiental

Muestra la ubicación actual del usuario y los puntos AQI cercanos.

### AQI actual

Muestra:

* Valor AQI.
* Estado ambiental.
* PM2.5.
* PM10.
* Fuente de datos.

Fuentes posibles:

```txt
OpenAQ
Open-Meteo
Sin datos
```

---

## Fuentes de datos

La app no consulta directamente OpenAQ ni Open-Meteo.

La app consulta Phoenix API, y el backend decide la fuente:

```txt
1. OpenAQ
2. Open-Meteo
3. Sin datos disponibles
```

Ejemplos:

```txt
Junín de los Andes → Open-Meteo
Buenos Aires demo → OpenAQ
```

---

## Menú de opciones

El menú hamburguesa permite acceder a:

```txt
AQI actual
Resumen
Alertas
Historial
Probar Buenos Aires
Volver a mi ubicación
```

---

## Modo demo Buenos Aires

Permite probar OpenAQ sin estar físicamente en Buenos Aires.

Al tocar:

```txt
Probar Buenos Aires
```

la app consulta:

```txt
lat=-34.6037
lng=-58.3816
```

Resultado esperado:

```txt
Fuente: OpenAQ
```

---

## Volver a mi ubicación

Al tocar:

```txt
Volver a mi ubicación
```

la app vuelve a usar el GPS real del celular.

En Junín de los Andes, el resultado esperado es:

```txt
Fuente: Open-Meteo
```

---

## Resumen AQI

Muestra estadísticas según la fuente actual:

```txt
OpenAQ
Open-Meteo
Mixto
```

Incluye:

* Total de lecturas.
* AQI promedio.
* AQI máximo.
* AQI mínimo.
* Última zona registrada.

---

## Historial AQI

Muestra las últimas lecturas registradas según la fuente actual.

Ejemplo:

```txt
Junín → historial Open-Meteo
Buenos Aires demo → historial OpenAQ
```

---

## Alertas ambientales

Muestra la alerta actual calculada desde el backend con datos reales recientes.

Niveles posibles:

```txt
info
warning
danger
critical
```

---

## Estructura principal

```txt
phoenix-mobile/
└── src/
    ├── components/
    │   ├── AqiCard.tsx
    │   ├── AqiHistoryCard.tsx
    │   ├── AqiMapMarker.tsx
    │   ├── AqiSummaryCard.tsx
    │   ├── CurrentAlertCard.tsx
    │   ├── MapHeaderPanel.tsx
    │   └── MapOptionsMenu.tsx
    │
    ├── config/
    │   └── api.ts
    │
    ├── hooks/
    │   └── useUserLocation.ts
    │
    ├── screens/
    │   └── MapScreen.tsx
    │
    ├── services/
    │   ├── alertService.ts
    │   ├── aqiHistoryService.ts
    │   ├── aqiService.ts
    │   └── aqiSummaryService.ts
    │
    ├── theme/
    │   └── mapStyle.ts
    │
    └── utils/
        └── getAqiStatus.ts
```

---

## Estado actual

La app ya permite:

* Detectar ubicación real.
* Consultar AQI real.
* Usar Open-Meteo para zonas sin estación OpenAQ.
* Usar OpenAQ cuando hay estaciones cercanas.
* Mostrar resumen ambiental.
* Mostrar historial.
* Mostrar alertas.
* Probar Buenos Aires desde menú demo.
* Volver a ubicación real del usuario.

---

## Autor

Proyecto desarrollado por Rolando Duarte.

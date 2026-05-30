
# CLEARZONE Mobile

Aplicación mobile para consultar calidad del aire y clima actual en tiempo real desde el celular.

CLEARZONE permite visualizar información ambiental tanto desde la ubicación real del usuario como desde cualquier punto seleccionado en el mapa.

La app está pensada para personas que caminan, hacen trekking, realizan actividades al aire libre o desean consultar las condiciones ambientales de una zona antes de ir.

---

## Qué permite consultar

* AQI actual por ubicación.
* AQI de cualquier punto tocado en el mapa.
* Fuente de datos real.
* Mapa ambiental interactivo.
* Temperatura actual.
* Sensación térmica.
* Humedad.
* Viento.
* Estado del clima.
* Recomendación para caminar o realizar actividad al aire libre.
* Resumen AQI.
* Historial AQI.
* Alertas ambientales.

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
export const API_BASE_URL = 'https://phoenix-api-2zpd.onrender.com';
```

---

## Ejecutar aplicación

```bash
pnpm expo start -c
```

Luego abrir Expo Go y escanear el QR.

---

## Funcionalidades principales

### Mapa ambiental interactivo

Muestra la ubicación actual del usuario y los puntos AQI cercanos.

También permite tocar cualquier punto del mapa para consultar la calidad del aire y el clima de esa zona, aunque el usuario no esté físicamente ahí.

Esto permite responder preguntas como:

```txt
¿Cómo está el aire donde estoy?
¿Cómo está el aire donde quiero ir?
¿Conviene caminar en esa zona?
¿Qué temperatura hay en ese lugar?
¿Hay viento o humedad alta?
```

---

### Consulta por ubicación real

Al abrir la app, CLEARZONE obtiene la ubicación real del usuario mediante GPS y consulta el backend usando esas coordenadas.

La app muestra:

* AQI actual.
* PM2.5.
* PM10.
* Fuente AQI.
* Temperatura, si está disponible.
* Recomendación ambiental.

---

### Consulta tocando el mapa

El usuario puede tocar cualquier punto del mapa.

La app toma la latitud y longitud del punto seleccionado y consulta:

```txt
/api/aqi/nearby?lat=...&lng=...
/api/weather/current?lat=...&lng=...
```

Luego actualiza:

* Marcador de zona consultada.
* Tarjeta AQI.
* Clima actual.
* Recomendación para caminar.
* Botón para volver a la ubicación real.

---

### Volver a mi ubicación

Cuando el usuario consulta una zona tocando el mapa, aparece el botón:

```txt
Mi ubicación
```

Al tocarlo, la app vuelve a consultar usando el GPS real del celular.

---

## AQI actual

La tarjeta principal muestra:

* Valor AQI.
* Estado ambiental.
* PM2.5.
* PM10.
* Temperatura actual, si está disponible.
* Fuente de datos.

Fuentes posibles de calidad del aire:

```txt
OpenAQ
Open-Meteo
Sin datos
```

---

## Detalle expandible

La tarjeta AQI tiene una opción:

```txt
Ver detalle
```

Al tocarla, la card se expande y muestra más información.

Incluye:

* Descripción completa del estado del aire.
* Clima actual.
* Temperatura.
* Sensación térmica.
* Humedad.
* Viento.
* Recomendación para caminar.
* Interpretación de PM2.5 y PM10.

La tarjeta expandida tiene scroll interno y un alto máximo para no tapar toda la pantalla.

---

## Clima actual

La app no consulta directamente servicios climáticos externos.

La app consulta el backend, y el backend decide la fuente:

```txt
1. Open-Meteo Weather
2. OpenWeather
3. Clima temporalmente no disponible
```

Si el clima está disponible, la app muestra:

* Temperatura.
* Sensación térmica.
* Humedad.
* Viento.
* Estado del clima.

Si el clima no está disponible temporalmente, la app muestra un mensaje claro sin romper la experiencia:

```txt
Clima temporalmente no disponible.
El AQI sigue funcionando correctamente para evaluar la calidad del aire.
```

---

## Fuentes de datos

La app no consulta directamente OpenAQ, Open-Meteo ni OpenWeather.

La app consume el backend del proyecto, y el backend decide la fuente correspondiente.

### Calidad del aire

```txt
1. OpenAQ
2. Open-Meteo Air Quality
3. Sin datos disponibles
```

### Clima actual

```txt
1. Open-Meteo Weather
2. OpenWeather
3. Clima temporalmente no disponible
```

Ejemplos:

```txt
Junín de los Andes / Patagonia → Open-Meteo Air Quality
Zonas con estaciones ambientales → OpenAQ
Clima actual → Open-Meteo Weather u OpenWeather
```

---

## Menú de opciones

El menú hamburguesa permite acceder a:

```txt
AQI actual
Resumen
Alertas
Historial
```

El modo demo de Buenos Aires fue eliminado.

Ahora la app permite consultar cualquier zona tocando directamente el mapa.

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

Ejemplos:

```txt
Zona con OpenAQ → historial OpenAQ
Zona sin estación cercana → historial Open-Meteo
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

## Identidad visual

La app utiliza el nombre:

```txt
CLEARZONE
```

El título superior muestra:

```txt
CLEAR = celeste
ZONE = verde
```

También incluye un logo propio ubicado en:

```txt
src/assets/logo-CZ.png
```

---

## Estructura principal

```txt
phoenix-mobile/
└── src/
    ├── assets/
    │   └── logo-CZ.png
    │
    ├── components/
    │   ├── AqiCard.tsx
    │   ├── AqiHistoryCard.tsx
    │   ├── AqiMapMarker.tsx
    │   ├── AqiSummaryCard.tsx
    │   ├── CurrentAlertCard.tsx
    │   └── MapOptionsMenu.tsx
    │
    ├── config/
    │   └── api.ts
    │
    ├── hooks/
    │   └── useUserLocation.ts
    │
    ├── navigation/
    │   └── AppNavigator.tsx
    │
    ├── screens/
    │   ├── HomeScreen.tsx
    │   └── MapScreen.tsx
    │
    ├── services/
    │   ├── alertService.ts
    │   ├── aqiHistoryService.ts
    │   ├── aqiService.ts
    │   ├── aqiSummaryService.ts
    │   └── weatherService.ts
    │
    ├── theme/
    │   └── mapStyle.ts
    │
    └── utils/
        └── getAqiStatus.ts
```

---

## Servicios mobile

### aqiService.ts

Consulta puntos AQI cercanos a coordenadas determinadas.

### aqiSummaryService.ts

Obtiene resumen ambiental.

### aqiHistoryService.ts

Obtiene historial AQI.

### alertService.ts

Obtiene alerta ambiental actual.

### weatherService.ts

Obtiene clima actual desde el backend.

Devuelve:

* Temperatura.
* Sensación térmica.
* Humedad.
* Viento.
* Estado del clima.
* Fuente.
* Disponibilidad.

---

## Estado actual

La app ya permite:

* Detectar ubicación real.
* Consultar AQI real.
* Consultar cualquier punto tocando el mapa.
* Usar Open-Meteo para zonas sin estación OpenAQ.
* Usar OpenAQ cuando hay estaciones cercanas.
* Mostrar temperatura actual cuando el backend tiene datos climáticos disponibles.
* Mostrar sensación térmica.
* Mostrar humedad.
* Mostrar viento.
* Mostrar estado del clima.
* Mostrar card expandible con scroll interno.
* Mostrar recomendación para caminar.
* Volver a ubicación real del usuario.
* Mostrar resumen ambiental.
* Mostrar historial.
* Mostrar alertas.
* Mostrar logo propio junto al título CLEARZONE.

---

## Consideraciones

Render Free puede dormir por inactividad. La primera consulta puede tardar algunos segundos mientras el backend despierta.

Open-Meteo puede limitar solicitudes temporalmente. En ese caso, el backend intenta usar OpenWeather como fallback climático.

Si ambas fuentes climáticas fallan, la app sigue funcionando con AQI y muestra clima temporalmente no disponible.

---

## Autor

Proyecto desarrollado por Rolando Duarte.

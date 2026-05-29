
# Phoenix Environment

Phoenix Environment es una aplicación mobile + backend para monitoreo ambiental en tiempo real.

El sistema permite consultar la calidad del aire y condiciones climáticas actuales tanto desde la ubicación real del usuario como desde cualquier punto seleccionado en el mapa.

Phoenix está pensado para ayudar a personas que realizan caminatas, trekking, actividades al aire libre o desplazamientos urbanos a tomar mejores decisiones según el estado ambiental de una zona.

---

## Fuentes de datos

Phoenix obtiene datos reales desde distintas fuentes externas.

### Calidad del aire

* **OpenAQ** : fuente primaria basada en estaciones ambientales disponibles.
* **Open-Meteo Air Quality** : fuente secundaria real por coordenadas cuando no existen estaciones OpenAQ cercanas.

### Clima actual

* **Open-Meteo Weather** : fuente principal para temperatura, sensación térmica, humedad, viento y estado del clima.
* **OpenWeather** : fuente fallback para clima actual cuando Open-Meteo limita solicitudes o no responde.

---

## Tecnologías utilizadas

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL en Neon
* OpenAQ API
* Open-Meteo Air Quality API
* Open-Meteo Weather API
* OpenWeather API

### Mobile

* React Native
* Expo
* TypeScript
* React Native Maps
* Expo Location

---

## Estructura del proyecto

```txt
Phoenix/
├── phoenix-server/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── .env.example
│
└── phoenix-mobile/
    ├── src/
    │   ├── components/
    │   ├── config/
    │   ├── hooks/
    │   ├── screens/
    │   ├── services/
    │   ├── theme/
    │   └── utils/
```

---

## Variables de entorno del backend

Crear un archivo `.env` dentro de:

```txt
phoenix-server/.env
```

Usar como referencia:

```txt
phoenix-server/.env.example
```

Ejemplo:

```env
PORT=4000
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB_NAME?sslmode=require"

OPENAQ_API_KEY="your_openaq_api_key_here"
OPENWEATHER_API_KEY="your_openweather_api_key_here"
```

> Nota: `OPENWEATHER_API_KEY` se usa como fallback climático cuando Open-Meteo Weather no responde o limita solicitudes.

---

## Instalación

Desde la raíz del proyecto:

```bash
cd phoenix-server
pnpm install
```

Luego:

```bash
cd ../phoenix-mobile
pnpm install
```

---

## Base de datos

El backend usa PostgreSQL en Neon y Prisma ORM.

Para aplicar migraciones:

```bash
cd phoenix-server
pnpm exec prisma migrate dev
```

Para regenerar Prisma Client:

```bash
pnpm exec prisma generate
```

Para abrir Prisma Studio:

```bash
pnpm exec prisma studio
```

---

## Ejecutar backend

```bash
cd phoenix-server
pnpm dev
```

Por defecto corre en:

```txt
http://localhost:4000
```

---

## Endpoints principales

### Sistema

```txt
GET /
GET /health
```

### Calidad del aire

```txt
GET /api/aqi/nearby?lat=-39.9504&lng=-71.0695
GET /api/aqi/history
GET /api/aqi/history?source=openaq|openmeteo|all&limit=10
GET /api/aqi/summary
GET /api/aqi/summary?source=openaq|openmeteo|all
```

### Clima actual

```txt
GET /api/weather/current?lat=-39.9504&lng=-71.0695
```

Respuesta esperada:

```json
{
  "success": true,
  "source": "openmeteo",
  "data": {
    "temperature": 8.2,
    "apparentTemperature": 6.7,
    "humidity": 89,
    "windSpeed": 4.2,
    "weatherLabel": "Parcialmente nublado",
    "available": true
  }
}
```

Si Open-Meteo Weather no está disponible y OpenWeather tampoco responde, Phoenix devuelve una respuesta controlada:

```json
{
  "success": true,
  "source": "openmeteo",
  "data": {
    "temperature": null,
    "apparentTemperature": null,
    "humidity": null,
    "windSpeed": null,
    "weatherLabel": "Clima temporalmente no disponible",
    "available": false
  }
}
```

### Alertas

```txt
GET /api/alerts/current
```

---

## Ejecutar mobile

```bash
cd phoenix-mobile
pnpm expo start -c
```

Luego abrir Expo Go y escanear el QR.

---

## Configuración de API en mobile

El mobile consume el backend desde:

```txt
phoenix-mobile/src/config/api.ts
```

En desarrollo local se puede usar la IP local de la PC:

```ts
export const API_BASE_URL = 'http://192.168.1.58:4000';
```

En producción o pruebas con backend deployado:

```ts
export const API_BASE_URL = 'https://phoenix-api-2zpd.onrender.com';
```

---

## Flujo de datos AQI

Phoenix trabaja con este orden:

```txt
1. Consulta OpenAQ.
2. Si OpenAQ tiene estaciones cercanas, usa esos datos.
3. Si OpenAQ no tiene datos cercanos, consulta Open-Meteo Air Quality por coordenadas.
4. Guarda solo datos reales en Neon.
5. Evita guardar lecturas duplicadas recientes.
6. Calcula summary, historial y alertas con datos reales.
```

---

## Flujo de datos climáticos

Phoenix consulta clima actual usando este orden:

```txt
1. Consulta Open-Meteo Weather.
2. Si Open-Meteo responde correctamente, usa esos datos.
3. Si Open-Meteo limita solicitudes o falla, intenta OpenWeather.
4. Si OpenWeather responde correctamente, usa esos datos.
5. Si ambas fuentes fallan, devuelve clima temporalmente no disponible sin romper la app.
```

El clima no se persiste en la base de datos actualmente. Se consulta en tiempo real y se cachea temporalmente en memoria para evitar exceso de solicitudes externas.

---

## Funcionalidades actuales

* Detección de ubicación real del usuario.
* Consulta AQI cercano a la ubicación actual.
* Consulta ambiental tocando cualquier punto del mapa.
* Mapa ambiental interactivo.
* Marcadores AQI.
* Tarjeta AQI actual.
* Card expandible con detalle ambiental.
* Temperatura actual.
* Sensación térmica.
* Humedad.
* Viento.
* Estado del clima.
* Recomendación para caminar o realizar actividad al aire libre.
* Botón para volver a la ubicación real.
* Resumen ambiental.
* Historial AQI.
* Alertas ambientales recientes.
* Persistencia de lecturas AQI en Neon.
* Protección contra duplicados recientes.
* Endpoint raíz documentado.
* Health check del sistema.

---

## Uso principal

Phoenix permite responder preguntas como:

```txt
¿Cómo está el aire donde estoy?
¿Cómo está el aire en una zona a la que quiero ir?
¿Conviene caminar o hacer actividad al aire libre?
¿Qué temperatura y sensación térmica hay en esa zona?
¿Hay viento o humedad alta?
```

El usuario puede tocar cualquier punto del mapa y Phoenix consulta AQI + clima actual para esa coordenada.

---

## Estado actual del proyecto

Phoenix ya funciona con datos reales:

```txt
Junín de los Andes / Patagonia → Open-Meteo Air Quality y Open-Meteo Weather
Zonas con estaciones ambientales → OpenAQ
Fallback climático → OpenWeather
```

No se utilizan datos mock en el flujo actual.

---

## Deploy

El backend está preparado para desplegarse en Render usando:

```txt
Root Directory: phoenix-server
Build Command: pnpm install && pnpm exec prisma migrate deploy && pnpm build
Start Command: pnpm start
Health Check Path: /health
```

Variables necesarias en Render:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=your_neon_database_url
DIRECT_URL=your_neon_direct_url
OPENAQ_API_KEY=your_openaq_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## Autor

Proyecto desarrollado por Rolando Duarte.

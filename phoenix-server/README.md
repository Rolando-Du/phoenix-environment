
# Phoenix API

Backend de Phoenix Environment para monitoreo ambiental de calidad del aire y clima actual.

La API consulta datos reales desde distintas fuentes externas para entregar información ambiental por coordenadas.

---

## Fuentes de datos

### Calidad del aire

* **OpenAQ** : fuente primaria basada en estaciones de monitoreo ambiental.
* **Open-Meteo Air Quality** : fuente secundaria real por coordenadas cuando no hay estaciones OpenAQ cercanas.

### Clima actual

* **Open-Meteo Weather** : fuente principal para temperatura, sensación térmica, humedad, viento y estado del clima.
* **OpenWeather** : fuente fallback para clima actual cuando Open-Meteo limita solicitudes o no responde.

---

## Tecnologías

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* Neon Database
* OpenAQ API
* Open-Meteo Air Quality API
* Open-Meteo Weather API
* OpenWeather API

---

## Instalación

Desde la carpeta del backend:

```bash
cd phoenix-server
pnpm install
```

---

## Variables de entorno

Crear un archivo `.env` en:

```txt
phoenix-server/.env
```

Usar como referencia:

```txt
.env.example
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

> `OPENWEATHER_API_KEY` se usa como respaldo climático cuando Open-Meteo Weather no responde o limita solicitudes.

---

## Base de datos

El proyecto usa Prisma ORM con PostgreSQL en Neon.

Aplicar migraciones:

```bash
pnpm exec prisma migrate dev
```

Regenerar Prisma Client:

```bash
pnpm exec prisma generate
```

Abrir Prisma Studio:

```bash
pnpm exec prisma studio
```

---

## Ejecutar en desarrollo

```bash
pnpm dev
```

La API corre por defecto en:

```txt
http://localhost:4000
```

---

## Endpoints principales

### Sistema

```http
GET /
```

Devuelve información general de Phoenix API.

```http
GET /health
```

Devuelve el estado del sistema.

---

## Calidad del aire

```http
GET /api/aqi/nearby?lat=-39.9504&lng=-71.0695
```

Obtiene AQI cercano a una ubicación.

Ejemplo de respuesta:

```json
{
  "success": true,
  "source": "openmeteo",
  "receivedLocation": {
    "latitude": -39.9504,
    "longitude": -71.0695
  },
  "count": 1,
  "data": [
    {
      "id": "openmeteo-current",
      "title": "Calidad del aire local",
      "value": 3,
      "pm25": 0.5,
      "pm10": 0.7,
      "coordinate": {
        "latitude": -39.9504,
        "longitude": -71.0695
      }
    }
  ]
}
```

---

## Historial AQI

```http
GET /api/aqi/history
```

Devuelve historial general.

```http
GET /api/aqi/history?source=openaq&limit=10
```

Devuelve historial filtrado por OpenAQ.

```http
GET /api/aqi/history?source=openmeteo&limit=10
```

Devuelve historial filtrado por Open-Meteo.

Fuentes disponibles:

```txt
openaq
openmeteo
all
```

---

## Resumen AQI

```http
GET /api/aqi/summary
```

Devuelve resumen general.

```http
GET /api/aqi/summary?source=openaq
```

Resumen filtrado por OpenAQ.

```http
GET /api/aqi/summary?source=openmeteo
```

Resumen filtrado por Open-Meteo.

---

## Clima actual

```http
GET /api/weather/current?lat=-39.9504&lng=-71.0695
```

Obtiene clima actual por coordenadas.

Puede devolver datos desde:

```txt
openmeteo
openweather
```

Ejemplo de respuesta con datos disponibles:

```json
{
  "success": true,
  "source": "openmeteo",
  "data": {
    "temperature": 8.2,
    "apparentTemperature": 6.7,
    "humidity": 89,
    "windSpeed": 4.2,
    "weatherCode": 1,
    "weatherLabel": "Parcialmente nublado",
    "source": "openmeteo",
    "available": true,
    "cached": false,
    "generatedAt": "2026-05-29T21:53:27.446Z",
    "coordinate": {
      "latitude": -40.1579,
      "longitude": -71.3534
    }
  }
}
```

Ejemplo de respuesta cuando el clima externo no está disponible:

```json
{
  "success": true,
  "source": "openmeteo",
  "data": {
    "temperature": null,
    "apparentTemperature": null,
    "humidity": null,
    "windSpeed": null,
    "weatherCode": null,
    "weatherLabel": "Clima temporalmente no disponible",
    "source": "openmeteo",
    "available": false,
    "cached": false,
    "generatedAt": "2026-05-29T22:36:15.486Z",
    "coordinate": {
      "latitude": -40.1579,
      "longitude": -71.3534
    }
  }
}
```

---

## Alertas

```http
GET /api/alerts/current
```

Devuelve la alerta ambiental actual usando lecturas reales recientes.

---

## Flujo de fuentes AQI

Phoenix consulta las fuentes de calidad del aire en este orden:

```txt
1. OpenAQ
2. Open-Meteo Air Quality
3. Sin datos disponibles
```

OpenAQ se usa cuando existen estaciones cercanas.

Open-Meteo Air Quality se usa cuando no hay estaciones cercanas, consultando datos reales por coordenadas.

---

## Flujo de fuentes climáticas

Phoenix consulta clima actual en este orden:

```txt
1. Open-Meteo Weather
2. OpenWeather
3. Clima temporalmente no disponible
```

Si Open-Meteo responde correctamente, Phoenix usa esa fuente.

Si Open-Meteo devuelve error o limita solicitudes, Phoenix intenta obtener clima desde OpenWeather.

Si ambas fuentes fallan, Phoenix devuelve una respuesta controlada con `available: false`, sin romper la API ni el mobile.

---

## Caché climático

El clima actual se cachea temporalmente en memoria para reducir llamadas externas.

Esto ayuda a evitar errores por exceso de solicitudes, especialmente al tocar varios puntos cercanos en el mapa.

```txt
Datos climáticos disponibles: caché temporal
Datos climáticos no disponibles: caché temporal más corto
```

Actualmente el clima no se persiste en Neon.

---

## Persistencia AQI

Phoenix guarda en Neon solo datos reales de calidad del aire:

```txt
openaq
openmeteo
```

No se utilizan datos mock en el flujo actual.

Además, el backend evita guardar lecturas duplicadas recientes dentro de una ventana de tiempo determinada.

---

## Prisma Model principal

```prisma
model AqiReading {
  id         String   @id @default(cuid())
  title      String
  latitude   Float
  longitude  Float
  value      Int
  pm25       Float
  pm10       Float
  source     String
  recordedAt DateTime @default(now())
  createdAt  DateTime @default(now())

  @@index([latitude, longitude])
  @@index([recordedAt])
}
```

---

## Comandos útiles

Ejecutar backend:

```bash
pnpm dev
```

Validar TypeScript:

```bash
pnpm build
```

Validar schema Prisma:

```bash
pnpm exec prisma validate
```

Crear migración:

```bash
pnpm exec prisma migrate dev --name nombre_de_migracion
```

Regenerar cliente:

```bash
pnpm exec prisma generate
```

Abrir Prisma Studio:

```bash
pnpm exec prisma studio
```

---

## Deploy en Render

Configuración recomendada:

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

## Estado actual

El backend ya soporta:

* Consulta AQI por ubicación.
* Consulta AQI por punto seleccionado en mapa.
* OpenAQ como fuente primaria.
* Open-Meteo Air Quality como fuente real por coordenadas.
* Clima actual por coordenadas.
* Temperatura.
* Sensación térmica.
* Humedad.
* Viento.
* Estado del clima.
* Open-Meteo Weather como fuente principal de clima.
* OpenWeather como fallback climático.
* Historial AQI.
* Summary AQI.
* Alertas recientes.
* Persistencia AQI en Neon.
* Prevención de duplicados recientes.
* Caché temporal para clima.
* Health check.
* Endpoint raíz documentado.

---

## Autor

Proyecto desarrollado por Rolando Duarte.

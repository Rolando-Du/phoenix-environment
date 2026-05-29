# Phoenix API

Backend de Phoenix Environment para monitoreo ambiental de calidad del aire.

La API consulta datos reales desde:

* **OpenAQ** : fuente primaria basada en estaciones de monitoreo ambiental.
* **Open-Meteo Air Quality** : fuente secundaria real por coordenadas cuando no hay estaciones OpenAQ cercanas.

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
```

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

### Calidad del aire

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

### Historial AQI

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

### Resumen AQI

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

### Alertas

```http
GET /api/alerts/current
```

Devuelve la alerta ambiental actual usando lecturas reales recientes.

---

## Flujo de fuentes AQI

Phoenix consulta las fuentes en este orden:

```txt
1. OpenAQ
2. Open-Meteo Air Quality
3. Sin datos disponibles
```

OpenAQ se usa cuando existen estaciones cercanas.

Open-Meteo se usa cuando no hay estaciones cercanas, consultando datos reales por coordenadas.

---

## Persistencia

Phoenix guarda en Neon solo datos reales:

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

## Estado actual

El backend ya soporta:

* Consulta AQI por ubicación.
* OpenAQ como fuente primaria.
* Open-Meteo como fuente real por coordenadas.
* Historial AQI.
* Summary AQI.
* Alertas recientes.
* Persistencia en Neon.
* Prevención de duplicados recientes.
* Health check.
* Endpoint raíz documentado.

---

## Autor

Proyecto desarrollado por Rolando Duarte.

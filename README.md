# Phoenix Environment

Phoenix Environment es una aplicación mobile + backend para monitoreo ambiental de calidad del aire en tiempo real.

El sistema obtiene datos reales de calidad del aire usando dos fuentes:

* **OpenAQ** : fuente primaria basada en estaciones ambientales disponibles.
* **Open-Meteo Air Quality** : fuente secundaria real por coordenadas cuando no existen estaciones OpenAQ cercanas.

Actualmente Phoenix permite consultar AQI cercano a la ubicación del usuario, visualizar puntos en un mapa, revisar resumen ambiental, historial AQI y alertas recientes.

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
```

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

Endpoints principales:

```txt
GET /
GET /health
GET /api/aqi/nearby?lat=-39.9504&lng=-71.0695
GET /api/aqi/history
GET /api/aqi/history?source=openaq|openmeteo|all&limit=10
GET /api/aqi/summary
GET /api/aqi/summary?source=openaq|openmeteo|all
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

## Flujo de datos AQI

Phoenix trabaja con este orden:

```txt
1. Consulta OpenAQ.
2. Si OpenAQ tiene estaciones cercanas, usa esos datos.
3. Si OpenAQ no tiene datos cercanos, consulta Open-Meteo por coordenadas.
4. Guarda solo datos reales en Neon.
5. Evita guardar lecturas duplicadas recientes.
6. Calcula summary, historial y alertas con datos reales.
```

---

## Fuentes de datos

### OpenAQ

Usado como fuente primaria cuando existen estaciones ambientales cercanas.

Ejemplo:

```txt
Buenos Aires → OpenAQ
```

### Open-Meteo Air Quality

Usado como fuente real por coordenadas cuando no hay estaciones OpenAQ cercanas.

Ejemplo:

```txt
Junín de los Andes → Open-Meteo
```

---

## Funcionalidades actuales

* Detección de ubicación real del usuario.
* Consulta AQI cercano.
* Fallback real con Open-Meteo.
* Mapa ambiental.
* Marcadores AQI.
* Tarjeta AQI actual.
* Resumen ambiental.
* Historial AQI.
* Alertas ambientales recientes.
* Modo demo Buenos Aires para probar OpenAQ.
* Persistencia en Neon.
* Protección contra duplicados recientes.
* Endpoint raíz documentado.
* Health check del sistema.

---

## Estado actual del proyecto

Phoenix ya funciona con datos reales:

```txt
Junín de los Andes → Open-Meteo
Buenos Aires demo → OpenAQ
```

No se utilizan datos mock en el flujo actual.

---

## Autor

Proyecto desarrollado por Rolando Duarte.

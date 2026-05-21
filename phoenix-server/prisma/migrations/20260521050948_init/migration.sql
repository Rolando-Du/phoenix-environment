-- CreateTable
CREATE TABLE "AqiReading" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "value" INTEGER NOT NULL,
    "pm25" DOUBLE PRECISION NOT NULL,
    "pm10" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'mock',
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AqiReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AqiReading_latitude_longitude_idx" ON "AqiReading"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "AqiReading_recordedAt_idx" ON "AqiReading"("recordedAt");

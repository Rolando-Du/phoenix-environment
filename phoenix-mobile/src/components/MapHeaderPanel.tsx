import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type MapHeaderPanelProps = {
  loading: boolean;
  statusMessage: string;
};

export default function MapHeaderPanel({
  loading,
  statusMessage,
}: MapHeaderPanelProps) {
  return (
    <View style={styles.topPanel}>
      <Text style={styles.label}>PHOENIX ENVIRONMENT</Text>
      <Text style={styles.title}>Mapa ambiental</Text>

      <View style={styles.statusRow}>
        {loading && <ActivityIndicator size="small" color="#38bdf8" />}
        <Text style={styles.description}>{statusMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topPanel: {
    position: "absolute",
    top: 112,
    left: 20,
    right: 20,
    backgroundColor: "rgba(2, 6, 23, 0.9)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    zIndex: 10,
  },
  label: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 14,
    flex: 1,
  },
});
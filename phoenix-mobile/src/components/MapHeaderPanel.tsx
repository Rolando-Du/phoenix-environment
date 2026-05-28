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
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>PHOENIX</Text>
          <Text style={styles.title}>Mapa ambiental</Text>
        </View>

        {loading && <ActivityIndicator size="small" color="#38bdf8" />}
      </View>

      <Text style={styles.description} numberOfLines={1}>
        {statusMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 8,
    left: 76,
    right: 60,
    backgroundColor: "rgba(2, 6, 23, 0.82)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#38bdf8",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  title: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 1,
  },
  description: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 3,
  },
});
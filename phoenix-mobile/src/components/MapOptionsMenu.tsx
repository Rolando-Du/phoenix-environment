import { Pressable, StyleSheet, Text, View } from "react-native";

type ActivePanel = "aqi" | "summary" | "alerts" | "history";

type MapOptionsMenuProps = {
  open: boolean;
  activePanel: ActivePanel;
  onToggle: () => void;
  onSelect: (panel: ActivePanel) => void;
  onUseDemoLocation: () => void;
  onUseUserLocation: () => void;
};

export default function MapOptionsMenu({
  open,
  activePanel,
  onToggle,
  onSelect,
  onUseDemoLocation,
  onUseUserLocation,
}: MapOptionsMenuProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.menuButton} onPress={onToggle}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          <Pressable
            style={[
              styles.option,
              activePanel === "aqi" && styles.optionActive,
            ]}
            onPress={() => onSelect("aqi")}
          >
            <Text style={styles.optionText}>AQI actual</Text>
          </Pressable>

          <Pressable
            style={[
              styles.option,
              activePanel === "summary" && styles.optionActive,
            ]}
            onPress={() => onSelect("summary")}
          >
            <Text style={styles.optionText}>Resumen</Text>
          </Pressable>

          <Pressable
            style={[
              styles.option,
              activePanel === "alerts" && styles.optionActive,
            ]}
            onPress={() => onSelect("alerts")}
          >
            <Text style={styles.optionText}>Alertas</Text>
          </Pressable>

          <Pressable
            style={[
              styles.option,
              activePanel === "history" && styles.optionActive,
            ]}
            onPress={() => onSelect("history")}
          >
            <Text style={styles.optionText}>Historial</Text>
          </Pressable>

          <View style={styles.separator} />

          <Pressable style={styles.option} onPress={onUseDemoLocation}>
            <Text style={styles.optionText}>Probar Buenos Aires</Text>
          </Pressable>

          <Pressable style={styles.option} onPress={onUseUserLocation}>
            <Text style={styles.optionText}>Volver a mi ubicación</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 12,
    left: 20,
    zIndex: 999,
    elevation: 999,
    alignItems: "flex-start",
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    color: "#f8fafc",
    fontSize: 24,
    fontWeight: "900",
    marginTop: -2,
  },
  dropdown: {
    marginTop: 10,
    width: 220,
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    zIndex: 999,
    elevation: 999,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  optionActive: {
    backgroundColor: "rgba(14, 116, 144, 0.65)",
  },
  optionText: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "900",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    marginVertical: 6,
  },
});
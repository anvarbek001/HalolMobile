import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalScreen from "../modal";

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

const C = {
  green: "#20d05b",
  greenDark: "#17a348",
  greenLight: "#e6f9ee",
  greenMid: "#a8edca",
  bg: "#f4faf6",
  white: "#ffffff",
  dark: "#0d1f14",
  gray: "#6b7a72",
  grayLight: "#e8eeea",
  border: "#d4e6d9",
  red: "#ef4444",
  redLight: "#fef2f2",
};

const MOCK_SCANNED = [
  {
    id: "1",
    name: "Toshkent Go'shti",
    brand: "Halol Meat Co.",
    category: "Go'sht",
    icon: "🥩",
    scannedAt: "2025-02-17T10:30:00",
    isHalal: true,
    certNumber: "UZ-HAL-2024-001",
    image: require("../../assets/images/halol_icon.jpg"),
  },
  {
    id: "2",
    name: "Toza Sut 3.5%",
    brand: "FermaSut",
    category: "Sut",
    icon: "🥛",
    scannedAt: "2025-02-16T15:45:00",
    isHalal: true,
    certNumber: "UZ-HAL-2024-089",
    image: require("../../assets/images/halol_icon.jpg"),
  },
  {
    id: "3",
    name: "Bugdoy Non",
    brand: "Navoiy Novvoyxona",
    category: "Non",
    icon: "🍞",
    scannedAt: "2025-02-15T09:10:00",
    isHalal: false,
    certNumber: null,
    image: require("../../assets/images/halol_icon.jpg"),
  },
  {
    id: "4",
    name: "Olma Sharbati",
    brand: "UzJuice",
    category: "Ichimlik",
    icon: "🥤",
    scannedAt: "2025-02-14T18:20:00",
    isHalal: true,
    certNumber: "UZ-HAL-2023-210",
    image: require("../../assets/images/halol_icon.jpg"),
  },
  {
    id: "5",
    name: "Sabzi Salat",
    brand: "FreshFood",
    category: "Sabzavot",
    icon: "🥬",
    scannedAt: "2025-02-13T12:00:00",
    isHalal: true,
    certNumber: "UZ-HAL-2024-045",
    image: require("../../assets/images/halol_icon.jpg"),
  },
];

const FILTERS = ["Barchasi", "Halol ✓", "Nomalum ✗"];

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${d.getFullYear()} · ${hour}:${min}`;
}

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("Barchasi");
  const [scanned, setScanned] = useState(MOCK_SCANNED);

  const filtered = scanned.filter((item) => {
    if (activeFilter === "Halol ✓") return item.isHalal;
    if (activeFilter === "Nomalum ✗") return !item.isHalal;
    return true;
  });

  const halalCount = scanned.filter((p) => p.isHalal).length;
  const totalCount = scanned.length;

  const handleDelete = (id: string) => {
    setScanned((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <View style={styles.root}>
      {/* ✅ Header - margin yo'q, ekran tepasiga yopishadi */}
      <ModalScreen />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Sarlavha ── */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Skanerlangan</Text>
            <Text style={styles.pageSubtitle}>
              Jami {totalCount} ta mahsulot
            </Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statNum}>{halalCount}</Text>
            <Text style={styles.statLabel}>/{totalCount} Halol</Text>
          </View>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${totalCount > 0 ? Math.round((halalCount / totalCount) * 100) : 0}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {totalCount > 0
              ? `${Math.round((halalCount / totalCount) * 100)}% mahsulotlaringiz halol`
              : "Hali mahsulot yo'q"}
          </Text>
        </View>

        {/* ── Filterlar ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                activeFilter === f && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Ro'yxat ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Mahsulot topilmadi</Text>
            <Text style={styles.emptyText}>
              QR kodni skanerlang va mahsulotlar shu yerda saqlanadi
            </Text>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {filtered.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productImageWrap}>
                  <Image source={item.image} style={styles.productImage} />
                  <Text style={styles.productEmoji}>{item.icon}</Text>
                </View>

                <View style={styles.productInfo}>
                  <View style={styles.productTopRow}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View
                      style={[
                        styles.halalBadge,
                        !item.isHalal && styles.notHalalBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.halalBadgeText,
                          !item.isHalal && styles.notHalalBadgeText,
                        ]}
                      >
                        {item.isHalal ? "✓ Halol" : "✗ Nomalum"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.productBrand}>{item.brand}</Text>

                  {item.certNumber && (
                    <Text style={styles.certNumber}>🔖 {item.certNumber}</Text>
                  )}

                  <Text style={styles.scannedAt}>
                    🕐 {formatDate(item.scannedAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10, // ✅ Kamaytirildi
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.dark,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: C.gray,
    marginTop: 2,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: C.greenLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.greenMid,
  },
  statNum: {
    fontSize: 20,
    fontWeight: "800",
    color: C.green,
  },
  statLabel: {
    fontSize: 13,
    color: C.greenDark,
    fontWeight: "600",
    marginLeft: 2,
  },

  // Progress
  progressWrap: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressBg: {
    height: 8,
    backgroundColor: C.grayLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.green,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: C.gray,
  },

  // Filters
  filterScroll: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: C.green,
    borderColor: C.green,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.gray,
  },
  filterTextActive: {
    color: C.white,
  },

  // List
  listWrap: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  productImageWrap: {
    position: "relative",
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: C.grayLight,
  },
  productEmoji: {
    position: "absolute",
    bottom: -4,
    right: -4,
    fontSize: 18,
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 1,
  },
  productInfo: {
    flex: 1,
    gap: 3,
  },
  productTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.dark,
    flex: 1,
  },
  halalBadge: {
    backgroundColor: C.greenLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  notHalalBadge: {
    backgroundColor: C.redLight,
  },
  halalBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.green,
  },
  notHalalBadgeText: {
    color: C.red,
  },
  productBrand: {
    fontSize: 12,
    color: C.gray,
  },
  certNumber: {
    fontSize: 11,
    color: C.gray,
  },
  scannedAt: {
    fontSize: 11,
    color: "#aab8b2",
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 6,
  },
  deleteIcon: {
    fontSize: 17,
  },

  // Empty
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: C.gray,
    textAlign: "center",
    lineHeight: 21,
  },
});

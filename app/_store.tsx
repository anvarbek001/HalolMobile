import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ModalScreen from "./modal";

const Store = () => {
  const { id, name, logo, rating, license, description } =
    useLocalSearchParams();
  const isPdf = (uri: string) => uri?.toLowerCase().endsWith(".pdf");
  return (
    <View style={styles.root}>
      <ModalScreen />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={{ uri: logo as string }} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Halol</Text>
          </View>
        </View>

        {/* Brand Info Card */}
        <View style={styles.card}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brandName}>{name}</Text>
              <Text style={styles.brandId}># {id}</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Kuzatish</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{rating}</Text>
              <Text style={styles.statLabel}>Reyting</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.4K</Text>
              <Text style={styles.statLabel}>Izoh</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12K</Text>
              <Text style={styles.statLabel}>Kuzatuvchi</Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Brend haqida</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {/* Tags */}
        {/* <View style={styles.tagsRow}>
          {["Go'sht", "Sut mahsulot", "Non", "Ichimlik"].map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View> */}

        <View style={styles.imageWrapper}>
          {isPdf(license as string) ? (
            <TouchableOpacity
              style={styles.pdfBox}
              onPress={() => Linking.openURL(license as string)}
              activeOpacity={0.8}
            >
              <Text style={styles.pdfIcon}>📄</Text>
              <Text style={styles.pdfTitle}>Litsenziya (PDF)</Text>
              <Text style={styles.pdfSub}>Ko'rish uchun bosing</Text>
            </TouchableOpacity>
          ) : (
            <Image style={styles.image} source={{ uri: license as string }} />
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Halol</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const COLORS = {
  green: "#20d05b",
  greenLight: "#e8faf0",
  dark: "#111827",
  gray: "#6b7280",
  grayLight: "#f3f4f6",
  border: "#e5e7eb",
  white: "#ffffff",
  bg: "#f9fafb",
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Image
  imageWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  pdfBox: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    backgroundColor: "#e8faf0",
    borderWidth: 2,
    borderColor: "#20d05b",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pdfIcon: {
    fontSize: 48,
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  pdfSub: {
    fontSize: 13,
    color: "#6b7280",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  badge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: COLORS.green,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
  },

  // Card
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  // Brand row
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  brandName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: -0.3,
  },
  brandId: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 3,
  },
  followBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  followText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  // Description
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 22,
  },

  // Tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.greenLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  tagText: {
    color: COLORS.green,
    fontWeight: "600",
    fontSize: 13,
  },
});

export default Store;

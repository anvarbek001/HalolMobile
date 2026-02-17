import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import ModalScreen from "./modal";

const Store = () => {
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
          <Image
            style={styles.image}
            source={require("../assets/images/halol_icon.jpg")}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Halol</Text>
          </View>
        </View>

        {/* Brand Info Card */}
        <View style={styles.card}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brandName}>Brend nomi</Text>
              <Text style={styles.brandId}># 1234</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Kuzatish</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
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
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A magnam
            cupiditate incidunt perferendis ducimus adipisci ab odio? At quos
            quo natus deserunt hic, voluptatibus excepturi? Nemo velit culpa hic
            voluptas nam quia nulla aperiam aut voluptatem, molestias laboriosam
            eum odit tempore odio blanditiis perferendis? Amet quibusdam saepe
            quisquam possimus sed qui dolor voluptates id delectus, quaerat
            ullam asperiores temporibus consequatur nulla aliquid et optio
            molestiae sapiente minima officia!
          </Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {["Go'sht", "Sut mahsulot", "Non", "Ichimlik"].map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
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

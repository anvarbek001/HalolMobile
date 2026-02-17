import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalScreen from "../modal";

const { width } = Dimensions.get("window");

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
};

// ✅ Tab bar balandligi - expo-router default
const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 83 : 60;

const brands = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    name: `Brand ${i + 1}`,
    category: ["Go'sht", "Non", "Sut", "Ichimlik", "Sabzavot"][i % 5],
    rating: (4.2 + i * 0.07).toFixed(1),
    image: require("../../assets/images/halol_icon.jpg"),
  }));

const featured = brands.slice(0, 4);

const categories = [
  { icon: "🥩", label: "Go'sht" },
  { icon: "🥛", label: "Sut" },
  { icon: "🍞", label: "Non" },
  { icon: "🥤", label: "Ichimlik" },
  { icon: "🥬", label: "Sabzavot" },
  { icon: "🍯", label: "Boshqa" },
];

export default function HomeScreen() {
  // ✅ Safe area - iPhone notch va home indicator
  const insets = useSafeAreaInsets();

  const autoScrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Go'sht");
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserScrolling) {
        scrollPosition.current += 1;
        autoScrollRef.current?.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });
        if (scrollPosition.current >= brands.length * 104) {
          scrollPosition.current = 0;
        }
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isUserScrolling]);

  const handleScrollBegin = () => {
    setIsUserScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
  };

  const handleScrollEnd = () => {
    scrollTimeout.current = setTimeout(() => setIsUserScrolling(false), 2000);
  };

  return (
    // ✅ 1-muammo: Keyboard chiqqanda content siqiladi
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // ✅ Tab bar balandligini ayirib, keyboard offset to'g'ri hisoblaydi
      keyboardVerticalOffset={Platform.OS === "ios" ? TAB_BAR_HEIGHT : 0}
    >
      {/* ✅ Ekranning bo'sh joyiga bosilsa keyboard yopiladi */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* Header - doim tepada qotib turadi */}
          <ModalScreen />

          {/* ✅ 2-muammo: Tab bar ostida content yashirinmaydi */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 16,
            }}
            // ✅ ScrollView ichidagi button/input bosilganda keyboard yopilmaydi
            keyboardShouldPersistTaps="handled"
            // ✅ Scroll qilganda keyboard avtomatik yopiladi
            keyboardDismissMode="on-drag"
          >
            {/* ── Hero Banner ── */}
            <View style={styles.heroBanner}>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTag}>🌿 Sertifikatlangan</Text>
                <Text style={styles.heroTitle}>Halol{"\n"}Mahsulotlar</Text>
                <Text style={styles.heroSub}>
                  Ishonchli brendlar, tasdiqlanangan sifat
                </Text>
                <TouchableOpacity style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>Barchasi →</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroImageBox}>
                <Image
                  source={require("../../assets/images/halol_icon.jpg")}
                  style={styles.heroImage}
                />
                <View style={styles.heroGlowDot} />
              </View>
            </View>

            {/* ── Search Bar ── */}
            {/* ✅ 3-muammo: TouchableOpacity -> TextInput, keyboard chiqadi */}
            <View
              style={[
                styles.searchBar,
                searchFocused && styles.searchBarFocused,
              ]}
            >
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Brend yoki mahsulot qidiring..."
                placeholderTextColor="#9fb8a8"
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                returnKeyType="search"
                onSubmitEditing={Keyboard.dismiss}
                // ✅ iOS - o'ng tomonda X tugma chiqadi
                clearButtonMode="while-editing"
              />
              {/* ✅ Android - qo'lda X tugma */}
              {searchText.length > 0 && Platform.OS === "android" && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Brendlar ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Brendlar</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Barchasi</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={autoScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={handleScrollBegin}
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
              contentContainerStyle={styles.brandScroll}
              keyboardShouldPersistTaps="handled"
            >
              {brands.map((brand) => (
                <TouchableOpacity
                  key={brand.id}
                  style={styles.brandCard}
                  onPress={() => router.push("/_store")}
                  activeOpacity={0.8}
                >
                  <View style={styles.brandImageWrap}>
                    <Image style={styles.brandIcon} source={brand.image} />
                    <View style={styles.brandVerified}>
                      <Text style={{ fontSize: 9, color: C.white }}>✓</Text>
                    </View>
                  </View>
                  <Text style={styles.brandName} numberOfLines={1}>
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Kategoriyalar ── */}
            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kategoriyalar</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catScroll}
              keyboardShouldPersistTaps="handled"
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.catChip,
                    activeCategory === cat.label && styles.catChipActive,
                  ]}
                  onPress={() => setActiveCategory(cat.label)}
                >
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.catLabel,
                      activeCategory === cat.label && styles.catLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView> */}

            {/* ── Tavsiya etilgan ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tavsiya etilgan</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Barchasi</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuredGrid}>
              {featured.map((brand) => (
                <TouchableOpacity
                  key={brand.id}
                  style={styles.featuredCard}
                  onPress={() => router.push("/_store")}
                  activeOpacity={0.85}
                >
                  <Image source={brand.image} style={styles.featuredImage} />
                  <View style={styles.featuredInfo}>
                    <View style={styles.featuredTopRow}>
                      <Text style={styles.featuredName}>{brand.name}</Text>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>⭐ {brand.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.featuredCat}>{brand.category}</Text>
                    <View style={styles.featuredFooter}>
                      <View style={styles.halalDot} />
                      <Text style={styles.halalLabel}>Halol sertifikat</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Promo Banner ── */}
            {/* <View style={styles.promoBanner}>
              <Text style={styles.promoEmoji}>🎯</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>Brendingizni qo'shing</Text>
                <Text style={styles.promoSub}>
                  Ming ta foydalanuvchiga yeting
                </Text>
              </View>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>→</Text>
              </TouchableOpacity>
            </View> */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    backgroundColor: C.dark,
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  heroTextBlock: { flex: 1, paddingRight: 10 },
  heroTag: {
    fontSize: 11,
    color: C.greenMid,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.white,
    lineHeight: 30,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 12,
    color: "#8fa89a",
    lineHeight: 17,
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: C.green,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignSelf: "flex-start",
  },
  heroBtnText: { color: C.white, fontWeight: "700", fontSize: 13 },
  heroImageBox: { position: "relative" },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.green,
  },
  heroGlowDot: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.green,
    borderWidth: 3,
    borderColor: C.dark,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 13 : 4,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBarFocused: {
    borderColor: C.green,
    elevation: 5,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.dark,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: 15,
    color: C.gray,
    paddingLeft: 10,
    paddingRight: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.dark,
    letterSpacing: -0.2,
  },
  seeAll: { fontSize: 13, color: C.green, fontWeight: "600" },

  brandScroll: { paddingHorizontal: 16, paddingBottom: 20 },
  brandCard: { alignItems: "center", marginRight: 14, width: 80 },
  brandImageWrap: { position: "relative", marginBottom: 6 },
  brandIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: C.greenLight,
  },
  brandVerified: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  brandName: {
    fontSize: 11,
    color: C.gray,
    fontWeight: "500",
    textAlign: "center",
  },

  catScroll: { paddingHorizontal: 16, paddingBottom: 20 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  catChipActive: { backgroundColor: C.green, borderColor: C.green },
  catIcon: { fontSize: 15 },
  catLabel: { fontSize: 13, color: C.gray, fontWeight: "600" },
  catLabelActive: { color: C.white },

  featuredGrid: { paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  featuredCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  featuredImage: { width: 90, height: 90 },
  featuredInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  featuredTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featuredName: { fontSize: 15, fontWeight: "700", color: C.dark },
  ratingBadge: {
    backgroundColor: C.greenLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  ratingText: { fontSize: 11, color: C.greenDark, fontWeight: "600" },
  featuredCat: { fontSize: 12, color: C.gray },
  featuredFooter: { flexDirection: "row", alignItems: "center", gap: 5 },
  halalDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.green },
  halalLabel: { fontSize: 11, color: C.green, fontWeight: "600" },

  promoBanner: {
    marginHorizontal: 16,
    backgroundColor: C.greenLight,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: C.greenMid,
  },
  promoEmoji: { fontSize: 28 },
  promoTitle: { fontSize: 14, fontWeight: "700", color: C.dark },
  promoSub: { fontSize: 12, color: C.gray, marginTop: 2 },
  promoBtn: {
    backgroundColor: C.green,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  promoBtnText: { color: C.white, fontSize: 16, fontWeight: "700" },
});

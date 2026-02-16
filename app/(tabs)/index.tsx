import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ModalScreen from "../modal";

const { width } = Dimensions.get("window");

const brands = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    name: `Brand ${index + 1}`,
    image: require("../../assets/images/halol_icon.jpg"),
  }));

export default function HomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ To'g'ri tur

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isUserScrolling) {
        scrollPosition.current += 1;

        scrollViewRef.current?.scrollTo({
          x: scrollPosition.current,
          animated: false,
        });

        const maxScroll = brands.length * 92;
        if (scrollPosition.current >= maxScroll) {
          scrollPosition.current = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isUserScrolling]);

  const handleScrollBegin = () => {
    setIsUserScrolling(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  };

  const handleScrollEnd = () => {
    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <ModalScreen />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map((brand) => (
          <View key={`first-${brand.id}`} style={styles.imageWrapper}>
            <TouchableOpacity>
              <Image style={styles.brandIcon} source={brand.image} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  imageWrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderRadius: 40,
    backgroundColor: "#fff",
    marginRight: 12,
  },
  brandIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

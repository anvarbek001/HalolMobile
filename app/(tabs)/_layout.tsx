import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarInactiveTintColor: colorScheme === "dark" ? "#C7C7CC" : "#8E8E93",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: colorScheme === "dark" ? "#fcfcfe" : "#FFFFFF",
          borderTopWidth: 0,
          borderRadius: 28,
          marginHorizontal: 10,
          marginBottom: Platform.OS === "ios" ? 25 : 10,
          height: 75,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingHorizontal: 8,
          elevation: 20,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          borderWidth: 1,
          borderColor:
            colorScheme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <IconSymbol size={30} name="house.fill" color={color} />
            </View>
          ),
        }}
      />

      {/* O'rtadagi katta QR code tugma */}
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeContainer}>
                <LinearGradient
                  colors={["#00d03b", "#38da50"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.qrCodeButton}
                >
                  <IconSymbol size={36} name="qrcode" color="#FFFFFF" />
                </LinearGradient>
              </View>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <IconSymbol size={30} name="paperplane.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconContainerFocused: {
    backgroundColor: "rgba(54, 230, 68, 0.15)",
    transform: [{ scale: 1.08 }],
  },
  qrCodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -7, // Yuqoriga ko'tarish
  },
  qrCodeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: "#40ef0b",
  },
});

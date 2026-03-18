import { API_URL } from "@/constants/api";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const C = {
  green: "#20d05b",
  greenLight: "#e6f9ee",
  greenDark: "#17a348",
  dark: "#0d1f14",
  white: "#ffffff",
  gray: "#6b7a72",
  red: "#ef4444",
  bg: "#f4faf6",
  border: "#d4e6d9",
};

type ProductResult = {
  halol: boolean;
  name?: string;
  brand?: string;
  rating?: string;
  certificate?: string;
  message?: string;
  error?: string;
};

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductResult | null>(null);
  const [qrData, setQrData] = useState("");

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={styles.permText}>Kamera ruxsati kerak</Text>
        <Text style={styles.permSub}>
          Mahsulotni tekshirish uchun kamera ishlatiladi
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Ruxsat berish</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setQrData(data);
    setLoading(true);

    try {
      // ✅ QR dan kelgan data ni backendga yuborish
      const res = await fetch(`${API_URL}/api/products/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_data: data }),
      });

      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({ halol: false, error: "Server bilan bog'lanib bo'lmadi" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setScanned(false);
    setResult(null);
    setQrData("");
  };

  return (
    <View style={styles.container}>
      {/* Kamera */}
      {!result && (
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
      )}

      {/* Overlay */}
      {!result && !loading && (
        <View style={styles.overlay}>
          <View style={styles.topDim} />
          <View style={styles.middle}>
            <View style={styles.sideDim} />
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <View style={styles.sideDim} />
          </View>
          <View style={styles.bottomDim}>
            <Text style={styles.hint}>📦 Mahsulot QR kodini skanerlang</Text>
          </View>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingScreen}>
          <ActivityIndicator color={C.green} size="large" />
          <Text style={styles.loadingText}>Mahsulot tekshirilmoqda...</Text>
          <Text style={styles.loadingQr} numberOfLines={1}>
            {qrData}
          </Text>
        </View>
      )}

      {/* Natija */}
      {result && !loading && (
        <ScrollView
          style={styles.resultScreen}
          contentContainerStyle={{ padding: 24 }}
        >
          {/* Halol / Harom badge */}
          <View
            style={[
              styles.badge,
              result.halol ? styles.badgeHalol : styles.badgeHarom,
            ]}
          >
            <Text style={styles.badgeEmoji}>
              {result.halol ? "✅" : "❌"}
            </Text>
            <Text style={styles.badgeText}>
              {result.halol ? "HALOL" : "TASDIQLANMAGAN"}
            </Text>
          </View>

          {/* Ma'lumotlar */}
          {result.error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{result.error}</Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              {result.name && (
                <Row label="Mahsulot" value={result.name} />
              )}
              {result.brand && (
                <Row label="Brend" value={result.brand} />
              )}
              {result.rating && (
                <Row label="Reyting" value={`⭐ ${result.rating}`} />
              )}
              {result.certificate && (
                <Row label="Sertifikat" value={result.certificate} />
              )}
              {result.message && (
                <Text style={styles.message}>{result.message}</Text>
              )}
            </View>
          )}

          {/* Tugmalar */}
          <TouchableOpacity style={styles.btn} onPress={reset}>
            <Text style={styles.btnText}>🔍 Qayta skanerlash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => router.back()}
          >
            <Text style={[styles.btnText, { color: C.green }]}>
              Orqaga qaytish
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

// Kichik Row komponenti
const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const BOX = 250;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.dark },
  camera: { flex: 1 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: C.bg,
    gap: 12,
  },
  permEmoji: { fontSize: 48 },
  permText: { fontSize: 18, fontWeight: "700", color: C.dark },
  permSub: { fontSize: 14, color: C.gray, textAlign: "center" },

  // Overlay
  overlay: { ...StyleSheet.absoluteFillObject },
  topDim: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  middle: { flexDirection: "row", height: BOX },
  sideDim: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  bottomDim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    paddingTop: 24,
  },
  hint: { color: C.white, fontSize: 15, fontWeight: "600" },

  scanBox: { width: BOX, height: BOX },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: C.green,
    borderWidth: 4,
  },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 8 },

  // Loading
  loadingScreen: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  loadingText: { fontSize: 16, fontWeight: "700", color: C.dark },
  loadingQr: { fontSize: 12, color: C.gray, maxWidth: 280 },

  // Natija
  resultScreen: { flex: 1, backgroundColor: C.bg },

  badge: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  badgeHalol: { backgroundColor: C.greenLight, borderWidth: 1, borderColor: C.border },
  badgeHarom: { backgroundColor: "#fff5f5", borderWidth: 1, borderColor: "#fecaca" },
  badgeEmoji: { fontSize: 48 },
  badgeText: { fontSize: 22, fontWeight: "800", color: C.dark },

  infoCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: { fontSize: 13, color: C.gray, fontWeight: "600" },
  rowValue: { fontSize: 14, color: C.dark, fontWeight: "700", maxWidth: "60%" },
  message: { fontSize: 14, color: C.gray, lineHeight: 20 },

  errorBox: {
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: { color: C.red, fontSize: 14, fontWeight: "600" },

  btn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  btnOutline: {
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.green,
  },
  btnText: { color: C.white, fontWeight: "700", fontSize: 15 },
});
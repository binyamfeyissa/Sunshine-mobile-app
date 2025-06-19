import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PaymentFailedScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.failedContainer}>
          <View style={styles.failedIconContainer}>
            <Ionicons name="close-circle" size={80} color="#FF3B30" />
          </View>
          <Text style={styles.failedTitle}>
            {t("payment_failed", "Payment Failed")}
          </Text>
          <Text style={styles.failedMessage}>
            {t(
              "payment_failed_message",
              "Your payment was not successful. Please try again or contact support."
            )}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.navigate("/(app)/(home)")}
        >
          <Text style={styles.homeButtonText}>
            {t("go_to_homepage", "Go to Homepage")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    justifyContent: "space-between",
  },
  failedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  failedIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  failedTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#FF3B30",
  },
  failedMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  homeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentFailedScreen;

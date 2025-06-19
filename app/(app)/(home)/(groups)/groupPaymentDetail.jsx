import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Linking,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { paymentsApi } from "../../../services/api";

const PaymentDetailScreen = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await paymentsApi.get(`${id}/`);
        setPayment(response.data);
      } catch (_err) {
        setError(
          t("failed_load_payment_details", "Failed to load payment details.")
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPayment();
  }, [id, t]);

  // Clean up websocket on unmount
  useEffect(() => {
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

  let statusLabel = "";
  let statusColor = "#FF3B30";
  if (payment?.status === "pending") {
    statusLabel = t("not_paid", "Not Paid");
    statusColor = "#FF3B30";
  } else if (payment?.status === "paid") {
    statusLabel = t("paid", "Paid");
    statusColor = "#34C759";
  } else if (payment?.status) {
    statusLabel = payment.status;
    statusColor = "#FF9500";
  }

  const handlePay = async () => {
    setPayError(null);
    setPaying(true);
    try {
      // 1. Generate transaction
      const res = await paymentsApi.post("generate-transaction/", {
        payment_id: id,
      });
      const { url, me_id, merchant_request, hash } = res.data;
      // 2. Open your hosted redirect page with params
      const redirectUrl = `https://staff.sunshine-meri-luke-village.com/paymentredirect.html?url=${encodeURIComponent(
        url
      )}&me_id=${encodeURIComponent(
        me_id
      )}&merchant_request=${encodeURIComponent(
        merchant_request
      )}&hash=${encodeURIComponent(hash)}`;
      Linking.openURL(redirectUrl);
      // 3. Connect to websocket
      const socket = new WebSocket(
        `wss://api.sunshine-meri-luke-village.com/ws/payment_status/${id}/`
      );
      setWs(socket);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "Successful") {
            setPaying(false);
            router.push("/(app)/(payment)/success");
          } else if (data.status === "Failed") {
            setPaying(false);
            router.push("/(app)/(payment)/failed");
          }
        } catch (_e) {}
      };
      socket.onerror = () => {
        setPaying(false);
        setPayError(
          t("websocket_connection_error", "WebSocket connection error.")
        );
      };
      socket.onclose = () => {
        // Optionally handle close
      };
    } catch (_err) {
      setPaying(false);
      setPayError(
        t(
          "failed_initiate_payment",
          "Failed to initiate payment. Please try again."
        )
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginTop: 40 }}
          />
        ) : error ? (
          <Text style={{ color: "#FF3B30", marginTop: 40 }}>{error}</Text>
        ) : payment ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {payment.reason || t("payment", "Payment")}
              </Text>
              {statusLabel ? (
                <View
                  style={[
                    styles.notPaidBadge,
                    { backgroundColor: statusColor },
                  ]}
                >
                  <Text style={styles.notPaidText}>{statusLabel}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.subtitle}>
              {t("payment_id", "Payment ID")}: {payment.id}
            </Text>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentRow}>
                <View style={styles.dollarContainer}>
                  <Text style={styles.dollarSign}>$</Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.dueDate}>
                    {t("due", "Due")} {payment.due_date}
                  </Text>
                  <Text style={styles.amount}>{payment.amount} Birr</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePay}
              disabled={payment?.status === "paid" || paying}
            >
              <Text style={styles.payButtonText}>
                {payment?.status === "paid"
                  ? t("paid", "Paid")
                  : t("pay", "Pay")}
              </Text>
            </TouchableOpacity>
            {payError && (
              <Text
                style={{
                  color: "#FF3B30",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {payError}
              </Text>
            )}
          </>
        ) : null}
      </View>
      {/* Blocking loading overlay */}
      <Modal
        visible={paying}
        transparent
        animationType="fade"
        style={{ zIndex: 1000 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 30,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#007AFF" />
            <Text
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "#333",
                textAlign: "center",
              }}
            >
              {t(
                "waiting_payment_confirmation",
                "Waiting for payment confirmation..."
              )}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    marginTop: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 10,
    color: "#000",
  },
  notPaidBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notPaidText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 30,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dollarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dollarSign: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  paymentInfo: {
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  payButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentDetailScreen;

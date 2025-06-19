import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPayments } from "../../services/api";

const PaymentsScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        console.log("Payments API response:", data); // Debug log
        setPayments(data.results || []);
      } catch (_) {
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>
            This are the list of payments requested by SunShine Meri Luke
            Compound
          </Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : payments.length === 0 ? (
            <Text>No payments found.</Text>
          ) : (
            <ScrollView style={styles.paymentsList}>
              {payments.map((payment) => (
                <TouchableOpacity
                  key={payment.id}
                  style={styles.optionCard}
                  onPress={() => router.push(`/(app)/(payment)/${payment.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionInfo}>
                    <View style={styles.avatarContainer}>
                      <Ionicons name="cash" size={20} color="#4CD964" />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.optionName}>{payment.reason}</Text>
                      <Text style={styles.optionDescription}>
                        Due {payment.due_date}
                      </Text>
                      <Text style={styles.amount}>{payment.amount} Birr</Text>
                      {payment.payment_status === "paid" ? (
                        <View style={styles.paidBadge}>
                          <Text style={styles.paidText}>Paid</Text>
                        </View>
                      ) : (
                        <View style={styles.notPaidBadge}>
                          <Text style={styles.notPaidText}>Not Paid</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
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
  },
  innerContent: {
    flex: 1,
    padding: 10,
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 16,
  },
  paymentsList: {
    flex: 1,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
  },
  amount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 8,
  },
  paidBadge: {
    backgroundColor: "#4CD964",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  paidText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  notPaidBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  notPaidText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
});

export default PaymentsScreen;

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getGroupPayments } from "../../../services/groupPayments";

export default function GroupPaymentsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groupPayments, setGroupPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const data = await getGroupPayments(id);
        // Map API response to UI fields
        const mapped = (data.results || []).map((item) => ({
          id: item.id,
          title: item.reason,
          amount: `Birr ${item.amount}`,
          dueDate: item.due_date,
          status:
            item.payment_status === "paid"
              ? t("paid", "Paid")
              : t("pending", "Pending"),
        }));
        setGroupPayments(mapped);
      } catch (_error) {
        setGroupPayments([]);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadPayments();
  }, [id, t]);

  const getStatusColor = (status) => {
    return status === t("paid", "Paid") ? "#4CD964" : "#FF9500";
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t("group_payments", "Group Payments")}
            </Text>
          </View>

          <Text style={styles.subtitle}>
            {t(
              "group_payments_description",
              "These are the payments for your group"
            )}
          </Text>

          <ScrollView style={styles.paymentsList}>
            {groupPayments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={styles.paymentCard}
                onPress={() =>
                  router.push({
                    pathname:
                      "/(app)/(home)/(groups)/groupPaymentDetail/[paymentId]",
                    params: { paymentId: payment.id },
                  })
                }
              >
                <View style={styles.paymentInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="cash" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.paymentTitle}>{payment.title}</Text>
                    <Text style={styles.paymentAmount}>{payment.amount}</Text>
                    <Text style={styles.paymentDate}>
                      {t("due", "Due")}: {payment.dueDate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(payment.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{payment.status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 14,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  paymentsList: {
    flex: 1,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

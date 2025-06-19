import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { servicesApi } from "../../../services/api";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

export default function ListServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchServices = async (url = "/") => {
    setLoading(true);
    try {
      const response = await servicesApi.get(url);
      setServices(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceType}>{item.service_type}</Text>
      <Text style={styles.serviceDescription}>{item.request_description}</Text>
      <Text style={styles.serviceStatus}>
        {t("status", "Status")}: {item.request_status}
      </Text>
      <Text style={styles.serviceDate}>
        {t("requested_on", "Requested on")}:{" "}
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t("service_requests", "Service Requests")}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={() => (
            <View style={styles.paginationContainer}>
              {pagination.previous && (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => fetchServices(pagination.previous)}
                >
                  <Text style={styles.paginationText}>
                    {t("previous", "Previous")}
                  </Text>
                </TouchableOpacity>
              )}
              {pagination.next && (
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={() => fetchServices(pagination.next)}
                >
                  <Text style={styles.paginationText}>{t("next", "Next")}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  serviceCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  serviceStatus: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 12,
    color: "#888",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  paginationButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  paginationText: {
    color: "#fff",
    fontSize: 14,
  },
});

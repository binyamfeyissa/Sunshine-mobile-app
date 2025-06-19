import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { pollsApi } from "../../../services/api";

const PollCard = ({ poll, onPress }) => (
  <TouchableOpacity
    style={styles.pollItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.pollInfo}>
      <View style={styles.avatarContainer}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={20}
          color="#A855F7"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.pollTitle}>{poll.title || poll.question}</Text>
        <Text style={styles.pollDate}>
          {new Date(poll.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      </View>
    </View>
    <View style={styles.statusBadge}>
      <Ionicons name="chevron-forward" size={16} color="#666" />
    </View>
  </TouchableOpacity>
);

export default function Polls() {
  const router = useRouter();
  const { t } = useTranslation();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchPolls = async (url = "/") => {
    try {
      setLoading(true);
      const response = await pollsApi.get(url);
      setPolls(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setError(
        t("polls_error", "Failed to load polls. Please try again later.")
      );
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchPolls();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchPolls()}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>{t("retry", "Retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("polls", "Polls")}</Text>
          </View>

          <Text style={styles.subtitle}>
            {t(
              "polls_subtitle",
              "Participate in community polls and share your opinion"
            )}
          </Text>

          {polls.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="#999"
              />
              <Text style={styles.emptyText}>
                {t("no_polls_available", "No polls available")}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.pollList}
              showsVerticalScrollIndicator={false}
            >
              {polls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  onPress={() =>
                    router.push(`/(app)/(home)/(polls)/${poll.id}`)
                  }
                />
              ))}
              <View style={styles.pagination}>
                {pagination.previous && (
                  <TouchableOpacity
                    style={styles.pageBtn}
                    onPress={() => fetchPolls(pagination.previous)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pageText}>
                      {t("previous", "Previous")}
                    </Text>
                  </TouchableOpacity>
                )}
                {pagination.next && (
                  <TouchableOpacity
                    style={styles.pageBtn}
                    onPress={() => fetchPolls(pagination.next)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pageText}>{t("next", "Next")}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          )}
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
  pollList: {
    flex: 1,
  },
  pollItem: {
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
  pollInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  pollDate: {
    fontSize: 12,
    color: "#666",
  },
  statusBadge: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    marginTop: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 8,
  },
  pageBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

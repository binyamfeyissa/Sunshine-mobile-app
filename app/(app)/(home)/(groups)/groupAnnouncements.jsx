import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { announcementsApi } from "../../../services/api";

export default function GroupAnnouncementsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [groupAnnouncements, setGroupAnnouncements] = useState([]);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await announcementsApi.get("group");
        const data = response.data;
        const mapped = (data.results || []).map((item) => ({
          id: item.id,
          title: item.announcement_title,
          content: item.announcement_content, // keep HTML
          date: new Date(item.created_at).toLocaleDateString(),
          status: t("active", "Active"),
        }));
        setGroupAnnouncements(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, [id, t]);

  const getStatusColor = (status) => {
    return status === t("new", "New") ? "#4CD964" : "#FF9500";
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
              {t("group_announcements", "Group Announcements")}
            </Text>
          </View>

          <Text style={styles.subtitle}>
            {t(
              "group_announcements_description",
              "These are the announcements for your group"
            )}
          </Text>

          <ScrollView style={styles.announcementsList}>
            {groupAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                style={styles.announcementCard}
              >
                <View style={styles.announcementInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="megaphone" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                      {/*  */}
                      <Text style={styles.announcementTitle}>
                        {announcement.title}
                      </Text>
                    </View>
                    {/* Replace announcement.content Text with HTML renderer */}
                    <RenderHtml
                      contentWidth={width}
                      source={{ html: announcement.content }}
                      baseStyle={styles.announcementContent}
                    />
                    <Text style={styles.announcementDate}>
                      {announcement.date}
                    </Text>
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
    marginBottom: 60,
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
  announcementsList: {
    flex: 1,
  },
  announcementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  announcementInfo: {
    flexDirection: "row",
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  announcementContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 12,
    color: "#999",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

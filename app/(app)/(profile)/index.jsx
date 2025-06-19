import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { userData, getUser, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] =
    useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
    const fetchUserData = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Listen for language change and update selectedLanguage
    const onLangChanged = (lng) => setSelectedLanguage(lng);
    i18n.on("languageChanged", onLangChanged);
    return () => {
      i18n.off("languageChanged", onLangChanged);
    };
  }, [getUser, i18n]);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    await i18n.changeLanguage(lang);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.innerContent}>
        {/* Language Switcher */}
        {/* Removed the Picker from here */}
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={require("../../../assets/profile-pic2.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {userData?.full_name || "User"}
          </Text>

          <Text style={styles.houseNumber}>
            House: {userData?.house_number || "No house number"}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/(profile)/change-password")}
          >
            <Text style={styles.editButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  For daily updates and others
                </Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={pushNotifications ? "#2196F3" : "#f4f3f4"}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="megaphone-outline" size={24} color="#666" />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  Promotional Notifications
                </Text>
                <Text style={styles.settingDescription}>
                  New Campaign & Offers
                </Text>
              </View>
            </View>
            <Switch
              value={promotionalNotifications}
              onValueChange={setPromotionalNotifications}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={promotionalNotifications ? "#2196F3" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* More Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MORE</Text>
          {/* Language Change Button */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={24} color="#666" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>
                  {t("change_language", "Change Language")}
                </Text>
                <Text style={styles.menuDescription}>
                  {t("current_language", "Current: ")}
                  {selectedLanguage.toUpperCase()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          {/* Contact Us Button (remains unchanged, now below language button) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(profile)/contact")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="call-outline" size={24} color="#666" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Contact Us</Text>
                <Text style={styles.menuDescription}>For more information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(profile)/faq")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>FAQs</Text>
                <Text style={styles.menuDescription}>
                  Frequently asked questions
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={async () => {
              try {
                await logout();
                router.replace("/");
              } catch (error) {
                console.error("Logout failed:", error);
              }
            }}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <View style={styles.menuText}>
                <Text style={[styles.menuTitle, styles.logoutText]}>
                  Logout
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Add Modal for Language Selection */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 20,
                width: "80%",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 16 }}
              >
                {t("select_language", "Select Language")}
              </Text>
              {[
                { label: "English", value: "en" },
                { label: "Amharic", value: "am" },
                { label: "Oromifa", value: "om" },
                { label: "Tigrigna", value: "ti" },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={{ paddingVertical: 12 }}
                  onPress={async () => {
                    await handleLanguageChange(lang.value);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedLanguage === lang.value ? "#2196F3" : "#000",
                    }}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setShowLanguageModal(false)}
                style={{ marginTop: 16 }}
              >
                <Text style={{ color: "#FF3B30", textAlign: "center" }}>
                  {t("cancel", "Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Bottom Spacing */}
        <SafeAreaView style={styles.bottomSpacing} />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 100,
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  houseNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  editButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuText: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 13,
    color: "#666",
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: "#FF3B30",
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

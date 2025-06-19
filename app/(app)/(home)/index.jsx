import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CARD_WIDTH = 270;
const CARD_HEIGHT = 170;
const CARD_MARGIN = 12;
const CARD_SPACING = CARD_MARGIN; // for FlatList
const AUTO_SCROLL_INTERVAL = 5000;

export default function HomeScreen() {
  const { t } = useTranslation();
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef(null);

  // Handler to open links with error alert
  const handleOpenLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open the link.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the link.");
    }
  };

  // Card data as array
  const cards = [
    {
      key: "card1",
      render: () => (
        <ImageBackground
          source={require("../../../assets/bg_for_card.png")}
          style={styles.cardCustom}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.cardContentCustom}>
            <View style={styles.cardHeaderRow}>
              <Image
                source={require("../../../assets/sunshine_logo.png")}
                style={styles.sunshineIcon}
              />
              <Text style={styles.sunshineText}>SunShine</Text>
            </View>
            <Text style={styles.homesNumber}>210 HOMES</Text>
            <Text style={styles.communityText}>
              {t("community_love_unity", "Community of love and unity")}
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                handleOpenLink("https://chat.whatsapp.com/dummygroup")
              }
            >
              <Text style={styles.contactButtonText}>
                {t("contact_us", "Contact Us")}
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../../../assets/sunshine_logo.png")}
            style={styles.watermarkLogo}
            resizeMode="contain"
          />
        </ImageBackground>
      ),
    },
    {
      key: "card2",
      render: () => (
        <View style={[styles.card, { backgroundColor: "#4CC9F0" }]}>
          <View style={styles.cardContent}>
            <View style={styles.titleBox}>
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.title}>Sunshine</Text>
            </View>
            <Text style={styles.em}>1000+</Text>
            <Text style={styles.text}>
              {t("happy_residents", "Happy Residents")}
            </Text>
            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                handleOpenLink("https://sunshine-meri-luke-village.com/en/home/")
              }
            >
              <Text style={styles.linkText}>{t("join_us", "Join Us")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Ionicons name="people" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      ),
    },
    {
      key: "card3",
      render: () => (
        <View style={[styles.card, { backgroundColor: "#2EC4B6" }]}>
          <View style={styles.cardContent}>
            <View style={styles.titleBox}>
              <Ionicons name="time" size={20} color="#fff" />
              <Text style={styles.title}>Sunshine</Text>
            </View>
            <Text style={styles.em}>24/7</Text>
            <Text style={styles.text}>
              {t("premium_services", "Premium Services")}
            </Text>
            <TouchableOpacity
              style={styles.link}
              onPress={() =>
                handleOpenLink("https://sunshine-meri-luke-village.com/en/home/")
              }
            >
              <Text style={styles.linkText}>{t("explore", "Explore")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <Ionicons name="time" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      ),
    },
  ];

  // Looping logic helpers
  const getNextIndex = (index) => (index + 1) % cards.length;
  const getPrevIndex = (index) => (index - 1 + cards.length) % cards.length;

  // Auto-scroll effect
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [activeIndex]);

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer.current = setInterval(() => {
      let nextIndex = getNextIndex(activeIndex);
      scrollToIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  };

  const scrollToIndex = (index) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  // Handle user swipe
  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
    setActiveIndex(newIndex);
    startAutoScroll(); // reset timer
  };

  // Infinite loop: when user swipes to end, jump to start
  useEffect(() => {
    if (activeIndex === cards.length) {
      scrollToIndex(0);
    }
  }, [activeIndex]);

  // FlatList render
  const renderItem = ({ item }) => (
    <View style={{ width: CARD_WIDTH, marginRight: CARD_SPACING }}>
      {item.render()}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.grid}>
              <View className="gridDot" />
              <View className="gridDot" />
              <View className="gridDot" />
              <View className="gridDot" />
            </View>
          </TouchableOpacity>

          <View style={styles.centerHeader}>
            <Ionicons name="home-outline" size={20} color="#fff" />
            <Text style={styles.headerTitle}>SunShine</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(app)/(home)/(announcements)")}
          >
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.contentWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>
            {t("welcome", "Welcome")} <Text style={styles.waveEmoji}>👋</Text>
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {t("what_do_you_need_today", "What do you need today?")}
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <FlatList
            ref={flatListRef}
            data={cards}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 20 }}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + CARD_SPACING,
              offset: (CARD_WIDTH + CARD_SPACING) * index,
              index,
            })}
            onMomentumScrollEnd={onMomentumScrollEnd}
            initialScrollIndex={activeIndex}
          />
        </View>

        {/* Main Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("main_services", "Main Services")}
          </Text>
          <View style={styles.services}>
            <TouchableOpacity
              style={[styles.service, { backgroundColor: "#FFF1F1" }]}
              onPress={() => router.navigate("/(app)/(guest)")}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIcon}>
                <View style={styles.iconContainer}>
                  <Ionicons name="home-outline" size={22} color="#FF5C5C" />
                </View>
              </View>
              <Text style={styles.serviceText}>
                {t("guest_management", "Guest\nManagement")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.service, { backgroundColor: "#FFF5E9" }]}
              onPress={() => router.push("/(app)/(home)/(incidents)")}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIcon}>
                <View style={styles.iconContainer}>
                  <Ionicons name="warning-outline" size={22} color="#FF9A3D" />
                </View>
              </View>
              <Text style={styles.serviceText}>
                {t("incident", "Incident")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.service, { backgroundColor: "#F1FFF5" }]}
              onPress={() => router.navigate("/(app)/(payment)")}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIcon}>
                <View style={styles.iconContainer}>
                  <Ionicons name="card-outline" size={22} color="#4CD080" />
                </View>
              </View>
              <Text style={styles.serviceText}>
                {t("due_payments", "Due\nPayments")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("other_services", "Other Services")}
          </Text>
          <View style={styles.otherServices}>
            <TouchableOpacity
              style={styles.otherService}
              onPress={() => router.push("/(app)/(home)/(services)")}
              activeOpacity={0.7}
            >
              <View
                style={[styles.serviceIcon, { backgroundColor: "#EAF7FF" }]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="construct-outline"
                    size={22}
                    color="#3B82F6"
                  />
                </View>
              </View>
              <Text style={styles.serviceText}>
                {t("request_service", "Request\nService")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.otherService}
              activeOpacity={0.7}
              onPress={() => router.push("/(app)/(home)/(polls)")}
            >
              <View
                style={[styles.serviceIcon, { backgroundColor: "#F8EEFF" }]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={22}
                    color="#A855F7"
                  />
                </View>
              </View>
              <Text style={styles.serviceText}>{t("poll", "Poll")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.otherService}
              activeOpacity={0.7}
              onPress={() => router.push("/(app)/(home)/(groups)")}
            >
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F0FE" }]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="people-outline" size={22} color="#4A90E2" />
                </View>
              </View>
              <Text style={styles.serviceText}>{t("groups", "Groups")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#121212",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  centerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 16,
    height: 16,
    gap: 2,
  },
  gridDot: {
    width: 6,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  waveEmoji: {
    fontSize: 26,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
  },
  cardsContainer: {
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    padding: 16,
    marginRight: CARD_MARGIN,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
    zIndex: 1,
  },
  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  em: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  link: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    width: 120,
  },
  linkText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  logoContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 16,
    color: "#111827",
  },
  services: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  service: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 12,
    minWidth: 0,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
    lineHeight: 16,
  },
  otherServices: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
  },
  otherService: {
    width: 100,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  cardCustom: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    padding: 20,
    marginRight: CARD_MARGIN,
    position: "relative",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },
  cardContentCustom: {
    flex: 1,
    zIndex: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  sunshineIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  sunshineText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 4,
  },
  homesNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 6,
    marginBottom: 2,
  },
  communityText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginTop: 2,
    minWidth: 90,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  watermarkLogo: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 90,
    height: 90,
    opacity: 0.55,
    zIndex: 1,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FAQItem = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.faqTitle}>{title}</Text>
        <View
          style={{
            transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
          }}
        >
          <Ionicons name="chevron-down" size={24} color="#666" />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqContent}>
          <Text style={styles.faqText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const router = useRouter();

  const faqs = {
    general: [
      {
        title: "What is SunShine Meri Luke App",
        content:
          "SunShine Meri Luke App is your comprehensive home management solution, designed to make your residential experience seamless and enjoyable.",
      },
      {
        title: "Are My Payments Secure",
        content:
          "Yes, all payments are processed through secure payment gateways with industry-standard encryption and security measures.",
      },
      {
        title: "Who owns the app",
        content:
          "The app is owned and operated by SunShine Properties Ltd., a leading property management company.",
      },
    ],
    contact: [
      {
        title: "What is the customer care number?",
        content:
          "Our customer care number is +1234567890, available 24/7 for your assistance.",
      },
      {
        title: "Can I contact anytime?",
        content:
          "Yes, our support team is available 24/7 through multiple channels including phone, chat, and email.",
      },
      {
        title: "How to call any service now?",
        content:
          "You can request any service through the app by navigating to the Services section and selecting your required service type.",
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>FAQ</Text>
        <Text style={styles.subtitle}>
          Find important information and updates about us here.
        </Text>
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        {faqs.general.map((faq, index) => (
          <FAQItem key={index} title={faq.title} content={faq.content} />
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        {faqs.contact.map((faq, index) => (
          <FAQItem key={index} title={faq.title} content={faq.content} />
        ))}
      </View>

      {/* Go to Homepage Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/(app)/(home)")}
      >
        <Text style={styles.homeButtonText}>Go to Homepage</Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
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
    marginTop: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    marginRight: 16,
  },
  faqContent: {
    overflow: "hidden",
  },
  faqText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    padding: 16,
    paddingTop: 0,
  },
  homeButton: {
    backgroundColor: "#3B82F6",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 32,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 40,
  },
});

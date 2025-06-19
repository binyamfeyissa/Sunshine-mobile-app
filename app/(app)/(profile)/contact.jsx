import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactScreen() {
  const router = useRouter();

  const contactOptions = [
    {
      icon: <MaterialIcons name="chat" size={24} color="#4CAF50" />,
      title: "Support Chat",
      description: "24x7 Online Support",
      bgColor: "#E8F5E9",
    },
    {
      icon: <Ionicons name="call" size={24} color="#FF5722" />,
      title: "Call Center",
      description: "24x7 Customer Service",
      bgColor: "#FBE9E7",
    },
    {
      icon: <MaterialIcons name="email" size={24} color="#673AB7" />,
      title: "Email",
      description: "admin@sunshine.com",
      bgColor: "#EDE7F6",
    },
    {
      icon: <FontAwesome name="question" size={24} color="#FFC107" />,
      title: "FAQ",
      description: "+50 Answers",
      bgColor: "#FFF8E1",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>
          Please choose what types of support do you need and let us know.
        </Text>

        <View style={styles.optionsGrid}>
          {contactOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionCard}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: option.bgColor },
                ]}
              >
                {option.icon}
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/(home)")}
        >
          <Text style={styles.homeButtonText}>Go to Homepage</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  optionCard: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  optionDescription: {
    fontSize: 13,
    color: "#666",
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginTop: "auto",
    marginBottom: 20,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});

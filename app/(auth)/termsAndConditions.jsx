import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function TermsAndConditions() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.termsText}>
          Welcome to the Sunshine Meri Luke Village Community App. By using this app, you agree to the following terms:{"\n\n"}
          1.  Use of Services{"\n"}
          This app is intended for residents, staff, and authorized guests of Sunshine Meri Luke Village. You must use the app responsibly and only for its intended purposes, including guest management, reporting incidents, payments, polls, and service requests.{"\n\n"}
          2.  Privacy and Data{"\n"}
          We collect and store personal data (e.g., names, contact info, photos, location data) only for providing community services. Your data is kept secure and is not shared without your consent, except where required by law.{"\n\n"}
          3.  User Content{"\n"}
          You are responsible for any content you upload, including incident photos or messages. Do not upload illegal, offensive, or false information. We reserve the right to remove any content that violates these terms.{"\n\n"}
          4.  Payments{"\n"}
          Any payments made through the app are non-refundable unless otherwise stated. Ensure all payment details are accurate.{"\n\n"}
          5.  Access and Termination{"\n"}
          We may suspend or terminate access if you misuse the app, violate these terms, or engage in harmful behavior.{"\n\n"}
          6.  Liability{"\n"}
          The app is provided “as-is.” We are not liable for any loss, damage, or issues resulting from app usage, service delays, or technical failures.{"\n\n"}
          7.  Updates{"\n"}
          These terms may be updated from time to time. Continued use of the app after changes means you accept the updated terms.
        </Text>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/register")}> 
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  termsText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

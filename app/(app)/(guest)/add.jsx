import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { guestsApi } from "../../services/api";

export default function AddGuestScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    phone_number: "",
    visit_date: new Date(),
    arrival_status: false,
    has_vechile: false,
    is_payer: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, visit_date: selectedDate });
    }
  };

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.guest_name || !formData.phone_number) {
      Alert.alert(
        t("error", "Error"),
        t("fill_required_fields", "Please fill in all required fields")
      );
      return;
    }
    console.log(formData);
    try {
      setLoading(true);

      // Format the date to YYYY-MM-DD
      const formattedDate = formData.visit_date.toISOString().split("T")[0];

      // Prepare the request body
      const requestBody = {
        ...formData,
        visit_date: formattedDate,
      };

      // Make the API call
      await guestsApi.post("/", requestBody);

      // Show success message
      Alert.alert(
        t("success", "Success"),
        t("guest_added_success", "Guest added successfully"),
        [
          {
            text: t("ok", "OK"),
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error adding guest:", error);
      Alert.alert(
        t("error", "Error"),
        t("guest_add_failed", "Failed to add guest. Please try again later.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>{t("add_guest", "Add Guest")}</Text>
        <Text style={styles.subtitle}>
          {t("guest_info_below", "Put the information of the guest below")}
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t("full_name", "Full Name")} *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.guest_name}
              onChangeText={(text) =>
                setFormData({ ...formData, guest_name: text })
              }
              placeholder={t("full_name_placeholder", "John Smith")}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t("phone_number", "Phone Number")} *
            </Text>
            <TextInput
              style={styles.input}
              value={formData.phone_number}
              onChangeText={(text) =>
                setFormData({ ...formData, phone_number: text })
              }
              placeholder={t("phone_number_placeholder", "987654321")}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t("visit_date", "Visit Date")} *
            </Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={24} color="#007AFF" />
              <Text style={styles.dateTimeText}>
                {formData.visit_date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>
              {t("has_vehicle", "Has Vehicle")}
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  formData.has_vechile && styles.switchButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, has_vechile: true })}
              >
                <Text
                  style={[
                    styles.switchText,
                    formData.has_vechile && styles.switchTextActive,
                  ]}
                >
                  {t("yes", "Yes")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  !formData.has_vechile && styles.switchButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, has_vechile: false })}
              >
                <Text
                  style={[
                    styles.switchText,
                    !formData.has_vechile && styles.switchTextActive,
                  ]}
                >
                  {t("no", "No")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>{t("is_payer", "Is Payer")}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  formData.is_payer && styles.switchButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, is_payer: true })}
              >
                <Text
                  style={[
                    styles.switchText,
                    formData.is_payer && styles.switchTextActive,
                  ]}
                >
                  {t("yes", "Yes")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.switchButton,
                  !formData.is_payer && styles.switchButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, is_payer: false })}
              >
                <Text
                  style={[
                    styles.switchText,
                    !formData.is_payer && styles.switchTextActive,
                  ]}
                >
                  {t("no", "No")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.visit_date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>
                {t("cancel", "Cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, loading && styles.addButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>
                  {t("add_guest", "Add Guest")}
                </Text>
              )}
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
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
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
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  dateTimeContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: "#666",
  },
  switchButton: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  switchButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  switchText: {
    fontSize: 14,
    color: "#666",
  },
  switchTextActive: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
    marginBottom: 50,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

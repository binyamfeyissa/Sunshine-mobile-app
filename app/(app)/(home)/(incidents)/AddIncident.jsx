import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import KeyboardDismissView from "../../../../components/ui/KeyboardDismissView";
import { incidentsApi } from "../../../services/api";

// Utility to get mime type based on file extension
const getMimeType = (uri) => {
  const extension = uri.split(".").pop().toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export default function AddIncident() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t('permission_denied', 'Permission Denied'),
          t('allow_photos_permission', 'Please allow access to your photos to upload images.')
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(t('error', 'Error'), error.message || t('an_error_occurred', 'An error occurred.'));
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert(t('error', 'Error'), t('add_image_evidence', 'Please add an image as evidence'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(t('error', 'Error'), t('enter_incident_description', 'Please enter an incident description'));
      return;
    }

    try {
      setLoading(true);

      const newImageUri = image.startsWith("file://")
        ? image
        : "file://" + image;

      const mimeType = getMimeType(newImageUri);
      const fileExtension = mimeType.split("/")[1] || "jpg";

      const formData = new FormData();
      formData.append("evidence_file_path", {
        uri: newImageUri,
        type: mimeType,
        name: `evidence.${fileExtension}`,
      });
      formData.append("incident_description", description);
      formData.append("incident_status", "PENDING");

      await incidentsApi.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert(t('success', 'Success'), t('incident_reported_success', 'Incident reported successfully'), [
        {
          text: t('ok', 'OK'),
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error(
        "Error submitting incident:",
        error.response?.data || error.message
      );
      Alert.alert(
        t('error', 'Error'),
        error.response?.data?.message ||
          t('incident_submit_failed', 'Failed to submit incident. Please try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardDismissView>
      <View style={styles.container}>
        <View style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>{t('add_incident', 'Add Incident')}</Text>
              <Text style={styles.subtitle}>
                {t('incident_info_below', 'Put the information of the incident below')}
              </Text>

              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>{t('evidence', 'Evidence')}</Text>
                {image ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImage}
                      onPress={() => setImage(null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={handleImagePick}
                  >
                    <View style={styles.dottedBorder}>
                      <Ionicons name="camera-outline" size={32} color="#666" />
                      <Text style={styles.imagePickerText}>{t('add_photo', 'Add Photo')}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.descriptionSection}>
                <Text style={styles.sectionTitle}>{t('write_incident', 'WRITE THE INCIDENT')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('type_here', 'Type here...')}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!image || !description.trim() || loading) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!image || !description.trim() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>{t('submit', 'Submit')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </KeyboardDismissView>
  );
}

// Styles (same as your original)
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
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    overflow: "hidden",
  },
  dottedBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerText: {
    color: "#666",
    marginTop: 8,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
  },
  removeImage: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

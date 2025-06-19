import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  style,
  prefix,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = !!secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {prefix ? (
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.focusedInput,
            error && styles.errorInput,
          ]}
        >
          <Text style={styles.prefix}>{prefix}</Text>
          <TextInput
            style={styles.inputWithPrefix}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.inputWithPrefix}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            secureTextEntry={isPassword && !showPassword}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color="#999"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 0,
    height: 50,
  },
  prefix: {
    color: "#aaa",
    fontSize: 18,
    marginRight: 4,
  },
  inputWithPrefix: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 15,
    backgroundColor: "transparent",
  },
  focusedInput: {
    borderColor: "#2196F3",
  },
  errorInput: {
    borderColor: "#ff3333",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 12,
    marginTop: 4,
  },
  eyeIcon: {
    marginLeft: 8,
  },
});

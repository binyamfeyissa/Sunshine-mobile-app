import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function IncidentsLayout() {
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerBackTitle: t("back", "Back"),
        animation: "none",
        animationDuration: 0,
        detachInactiveScreens: true,
        freezeOnBlur: true,
        lazy: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("incident", "Incidents"),
          headerShown: true,
          headerBackTitle: t("back", "Back"),
        }}
      />
      <Stack.Screen
        name="AddIncident"
        options={{
          title: t("add_incident", "Add Incident"),
          headerShown: true,
          headerBackTitle: t("back", "Back"),
        }}
      />
    </Stack>
  );
}

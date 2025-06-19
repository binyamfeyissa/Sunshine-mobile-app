import { Stack } from "expo-router";

export default function ServicesLayout() {
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
        headerShadowVisible: false,
        headerBackTitleVisible: false,
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
          title: "Services",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestService"
        options={{
          title: "Request Service",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Service Details",
        }}
      />
      <Stack.Screen
        name="[id]/review"
        options={{
          title: "Review Service",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

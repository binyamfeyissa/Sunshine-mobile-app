import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react"

export default function App() {
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          console.log("Authorization status:", authStatus);
        }
      }
      useEffect(() => {
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log(token);
            });
        } else {
          console.log("Permission denied", authStatus);
        }
    
        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
              );
            }
          });
        messaging().onNotificationOpenedApp(async (remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        });
        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
        });
    
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        });
    
        return unsubscribe;
      }, []);async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          console.log("Authorization status:", authStatus);
        }
      }
      useEffect(() => {
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log(token);
            });
        } else {
          console.log("Permission denied", authStatus);
        }
    
        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
              );
            }
          });
        messaging().onNotificationOpenedApp(async (remoteMessage) => {
          console.log(
            "Notification caused app to open from background state:",
            remoteMessage.notification
          );
        });
        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
        });
    
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        });
    
        return unsubscribe;
      }, []);
      return (
        <>
          <StatusBar style="light" />
          <AuthContextProvider>
            <Root />
          </AuthContextProvider>
        </>
      );
} 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifycontent: "center"
    },
}
);
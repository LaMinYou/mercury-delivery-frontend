// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import api from "./services/api";

const firebaseConfig = {
  apiKey: "AIzaSyBf16PR1gLC_WlVIJN21tM-IECsVSfoD2A",
  authDomain: "mercury-delivery-21da4.firebaseapp.com",
  projectId: "mercury-delivery-21da4",
  storageBucket: "mercury-delivery-21da4.firebasestorage.app",
  messagingSenderId: "238443846920",
  appId: "1:238443846920:web:65229f9214a4010df160bd",
  measurementId: "G-CZN0EQ8R34"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// FCM Token တောင်းပြီး Backend သို့ ပို့သည့် Function
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const currentToken = await getToken(messaging, {
        vapidKey: 'BNe93-C-QzBNUr-C9mEnBnZIGuSiipqyZ-7eTZm0qrb_02ty2RWRHV3DkcpjPMqtR32CXImcy79mrHm3limzHUs',
        serviceWorkerRegistration: registration
      });

      if (currentToken) {
        // Backend API သို့ FCM Token သိမ်းရန် ပို့မည်
        const res = await api.patch('/auth/user/save-fcm-token', { fcm_token: currentToken });
        console.log(res.data.message);
      }
    }
  } catch (error) {
    console.error('FCM Token Request Error:', error);
  }
}

// App ဖွင့်ထားချိန် (Foreground) FCM Noti ကို Ignore လုပ်မည် (WebSocket ကပဲ Popup ပြမည်)
onMessage(messaging, (payload) => {
  console.log('App is active. Handled by WebSocket.');
});
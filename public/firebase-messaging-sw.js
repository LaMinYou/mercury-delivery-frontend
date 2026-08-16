importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBf16PR1gLC_WlVIJN21tM-IECsVSfoD2A",
  authDomain: "mercury-delivery-21da4.firebaseapp.com",
  projectId: "mercury-delivery-21da4",
  storageBucket: "mercury-delivery-21da4.firebasestorage.app",
  messagingSenderId: "238443846920",
  appId: "1:238443846920:web:65229f9214a4010df160bd",
  measurementId: "G-CZN0EQ8R34"
});

const messaging = firebase.messaging();

//catch push noti from backend for background noti
messaging.onBackgroundMessage((payload) => {
  console.log('Background Noti Received:', payload);

  const notificationTitle = payload.data?.title || payload.notification?.title || 'အကြောင်းကြားစာ';
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body || '',
    icon: '/icon.png',
    //get data from backend that is send by withData()
    data: payload.data 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// catch event when click  Notification Banner 
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // close Noti banner

  const data = event.notification.data || {};
  
  // Backend က ပို့လိုက်တဲ့ target_url ကို ဆွဲထုတ်မည် (မပါလာပါက default '/' သို့ သွားမည်)
  const targetUrl = data.target_url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // ဖွင့်ထားပြီးသား Tab များထဲမှ သက်ဆိုင်ရာ Role Domain/Path ကို ရှာမည်
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        
        // Role အလိုက် Matching စစ်ဆေးခြင်း (ဥပမာ- /rider သို့မဟုတ် /restaurant)
        const isMatchingPage = data.role 
          ? client.url.includes(`/${data.role}`) 
          : true;

        if (isMatchingPage && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      
      // Tab ဖွင့်ထားခြင်း မရှိပါက Window အသစ်ဖွင့်၍ လမ်းကြောင်းမည်
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
<template>
  <v-app>
    <!-- Android သို့မဟုတ် Desktop အတွက် Install Banner -->
    <v-banner
      v-if="showInstallBanner && !isIos"
      color="green-darken-3"
      class="text-white position-fixed w-100 banner"
      max-width="500"
      height="80"
      lines="one"
    >
      <template v-slot:prepend>
        <v-img
          src="/images/icons/icon1-192x192.png"
          width="60"
          height="50"
          cover
          class="install-img"
        ></v-img>
      </template>
      <v-banner-text class="text-green-darken-3">Install App</v-banner-text>
      <template v-slot:actions>
        <v-btn color="green-darken-3" style="margin-top: -10px;" variant="text" @click="installApp">
          <v-img
            src="/images/icons/download.gif"
            width="50"
            height="50"
            cover
          ></v-img> 
        </v-btn>
        <v-btn variant="text" @click="deferredPrompt = null"> <v-icon>mdi-close</v-icon> </v-btn>
      </template>
    </v-banner>

    <!-- iPhone (iOS) အသုံးပြုသူများအတွက် Install လုပ်နည်း လမ်းညွှန် Banner -->
    <v-banner
      v-if="isIos && showIosInstallGuide"
      color="green-darken-3"
      class="text-white position-fixed w-100 banner"
      lines="two"
    >
      <template v-slot:prepend>
        <v-icon size="large" class="me-2">mdi-apple</v-icon>
      </template>
      <v-banner-text class="text-white text-caption">
       To install the app on your iPhone, tap the <v-icon size="small">mdi-export-variant</v-icon> (Share) button in Safari and select <b>"Add to Home Screen"</b>.
      </v-banner-text>
      <template v-slot:actions>
        <v-btn variant="text" color="white" @click="closeIosGuide">OK</v-btn>
      </template>
    </v-banner>

    <router-view />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const deferredPrompt = ref(null);

// 🍏 iPhone (iOS) ဖြစ်မဖြစ် စစ်ဆေးခြင်း
const isIos = computed(() => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
});

// 🍏 iOS Guide ကို ပြမပြ ထိန်းချုပ်ရန် (LocalStorage ဖြင့် မှတ်ထားမည်)
const showIosInstallGuide = ref(false);

const closeIosGuide = () => {
  showIosInstallGuide.value = false;
  localStorage.setItem('ios_guide_closed', 'true');
};

// Android / Desktop အတွက် Login မျက်နှာပြင်တွင် Banner မပြရန်
const showInstallBanner = computed(() => {
  if (!deferredPrompt.value) return false;
  const hiddenPaths = ['/login', '/customer/login'];
  if (hiddenPaths.includes(route.path)) return false;
  return true;
});

onMounted(() => {
  // 1. iOS ဖြစ်ပြီး ယခင်က ပိတ်ထားခြင်း မရှိသေးပါက Guide Banner ကို ပြရန်
  if (isIos.value) {
    const isClosed = localStorage.getItem('ios_guide_closed');
    // standalone mode (Already installed on home screen) မဟုတ်မှသာ ပြမည်
    const isStandalone = window.navigator.standalone === true;
    if (!isClosed && !isStandalone) {
      showIosInstallGuide.value = true;
    }
  }

  // 2. Android/Desktop Browser ၏ Install Prompt Event ကို ဖမ်းဆီးခြင်း
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
  });

  // 3. PWA Standalone Mode ဖြင့် App ကို ဖွင့်လာပါက သိမ်းဆည်းထားသော Path ဆီသို့ Redirect လုပ်ရန်
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || isIos.value;
  
  if (isStandalone) {
    const savedRolePath = localStorage.getItem('pwa_start_path');
    if (savedRolePath && (window.location.pathname === '/' || window.location.pathname === '')) {
      router.push(savedRolePath);
    }
  }
});

const installApp = async () => {
  if (!deferredPrompt.value) return;

  if (route.path.startsWith('/admin') || route.path.startsWith('/rider') || route.path.startsWith('/restaurant')) {
    localStorage.setItem('pwa_start_path', route.path);
  }

  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;

  if (outcome === "accepted") {
    console.log("App successfully installed!");
  }
  deferredPrompt.value = null;
};

</script>

<style scoped>
.banner{
    z-index: 9999; 
    top: 0; 
    left: 50%; 
    transform: translateX(-50%); 
    box-shadow: 0 5px 3px rgba(0,0,0,0.5); 
    border-bottom-left-radius: 5px; 
    border-bottom-right-radius: 5px;
    opacity: 0;
    animation: animateBanner 0.5s linear forwards;
    animation-delay: 2s;
}
 
@keyframes animateBanner {
    from{
        opacity: 0;
        top: -100px;
    }
    to{
        opacity: 1;
        top: 0;
    }
}
.install-img{
    transform: scaleX(1.5);
}
</style>
<!-- <template>
  
    <router-view :key="$route.fullPath" />
  
</template> -->
<template>
  <v-app>
    <v-banner
      v-if="deferredPrompt"
      color="green-darken-3"
      class="text-white position-fixed w-100 banner"
      style=""
      max-width="500"
      height="80"
      lines="one"
    >
      <!-- <template v-slot:text>
        {{ appBannerText }}
      </template> -->
      <template v-slot:prepend>
        <v-img
          src="/images/icons/icon-192x192.png"
          width="60"
          height="50"
          cover
          class="install-img"
        ></v-img>
      </template>
      <v-banner-text class="text-green-darken-3">Install App</v-banner-text>
      <template v-slot:actions>
        <v-btn color="green-darken-3" style="margin-top: -45px;" variant="text" @click="installApp">
            <v-img
          src="/images/icons/download.gif"
          width="50"
          height="50"
          cover
        ></v-img>
           
        </v-btn>
        <!-- <v-btn variant="text" @click="deferredPrompt = null"> ပိတ်မည် </v-btn> -->
      </template>
    </v-banner>
    <router-view />
  </v-app>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const deferredPrompt = ref(null);

// Role / Route အလိုက် Dynamic Banner စာသားပြောင်းခြင်း
const appBannerText = computed(() => {
  if (route.path.startsWith("/admin")) {
    return "Mercury Admin Portal ကို Phone ထဲတွင် Install ပြုလုပ်ပါ။";
  } else if (route.path.startsWith("/rider")) {
    return "Mercury Rider App ကို Phone ထဲတွင် Install ပြုလုပ်ပါ။";
  }
  return "Mercury Delivery App ကို Phone ထဲတွင် Install ပြုလုပ်ပါ။";
});

onMounted(() => {
  // Browser ၏ Install Prompt Event ကို ဖမ်းဆီးခြင်း
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
  });
});

const installApp = async () => {
  if (!deferredPrompt.value) return;

  // Native Browser Install Box ကို တောင်းဆိုခြင်း
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
    animation-delay: 5s;
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
    filter: drop-shadow(3px -3px 2px rgb(155, 155, 8));
}
</style>
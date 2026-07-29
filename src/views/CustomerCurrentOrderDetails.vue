<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <div class="d-flex justify-start mt-4">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/customer/current-orders')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container class="pa-4 bg-grey-lighten-4" fluid>
      <v-row justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="rounded-t-xl elevation-2 overflow-hidden" height="350">
            <div style="height: 100%; width: 100%; position: relative">
              <div ref="mapRef" style="width: 100%; height: 100%"></div>

              <v-progress-linear
                v-if="loading"
                indeterminate
                absolute
                color="green-darken-2"
                class="top-0"
              ></v-progress-linear>
            </div>
          </v-card>

          <v-card
            class="rounded-b-xl pa-4 elevation-2 bg-white mt-n4 relative-card"
          >
            <div class="text-subtitle-2 text-grey-darken-1 mb-4">
              အော်ဒါနံပါတ်: #{{ currentOrder.order_number }}
            </div>

            <div
              class="d-flex justify-space-between align-center mb-6 px-2 relative-steps"
            >
              <div
                class="progress-line"
                :style="{ width: progressWidth }"
              ></div>

              <div class="step-item d-flex flex-column align-center">
                <v-icon :color="stepColor(1)" size="28" class="step-icon">
                  {{
                    currentOrder.delivery_status === "pending"
                      ? "mdi-clock-fast"
                      : "mdi-check-circle"
                  }}
                </v-icon>
                <span
                  class="text-caption mt-1 font-weight-bold"
                  :class="stepTextColor(1)"
                  >pending</span
                >
              </div>

              <div class="step-item d-flex flex-column align-center">
                <v-icon :color="stepColor(2)" size="28" class="step-icon">
                  {{
                    ["picking", "delivering", "completed"].includes(
                      currentOrder.delivery_status
                    )
                      ? currentOrder.delivery_status === "picking"
                        ? "mdi-store-clock"
                        : "mdi-check-circle"
                      : "mdi-circle-outline"
                  }}
                </v-icon>
                <span
                  class="text-caption mt-1 font-weight-bold"
                  :class="stepTextColor(2)"
                  >picking</span
                >
              </div>

              <div class="step-item d-flex flex-column align-center">
                <v-icon :color="stepColor(3)" size="28" class="step-icon">
                  {{
                    ["delivering", "completed"].includes(
                      currentOrder.delivery_status
                    )
                      ? currentOrder.delivery_status === "delivering"
                        ? "mdi-bike-fast"
                        : "mdi-check-circle"
                      : "mdi-circle-outline"
                  }}
                </v-icon>
                <span
                  class="text-caption mt-1 font-weight-bold"
                  :class="stepTextColor(3)"
                  >delivering</span
                >
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div
              v-if="currentOrder.rider"
              class="d-flex align-center justify-space-between bg-grey-lighten-5 pa-3 rounded-xl"
            >
              <div class="d-flex align-center">
                <v-avatar
                  color="green-darken-2"
                  size="48"
                  class="mr-3 text-white font-weight-bold"
                >
                  {{ currentOrder.rider.name.charAt(0) }}
                </v-avatar>
                <div>
                  <div class="text-body-2 text-grey">ပို့ဆောင်မည့် ရိုက်ဒါ</div>
                  <div
                    class="text-subtitle-1 font-weight-black text-grey-darken-4"
                  >
                    {{ currentOrder.rider.name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{
                      currentOrder.rider.bike_number ||
                      "ဆိုင်ကယ်ဖြင့် ပို့ဆောင်နေပါသည်"
                    }}
                  </div>
                </div>
              </div>
              <v-btn
                icon="mdi-phone"
                color="green-darken-2"
                variant="flat"
                elevation="2"
                @click="callRider(currentOrder.rider.phone)"
              ></v-btn>
            </div>

            <div
              v-else
              class="text-center pa-3 bg-orange-lighten-5 rounded-xl text-orange-darken-4 text-body-2 font-weight-medium"
            >
              <v-icon class="mr-1">mdi-bike-fast</v-icon> သင့်အော်ဒါကို ယူရန်
              ရိုက်ဒါ ရှာဖွေနေပါသည်...
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </customer-navbar>
</template>

<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import api from "@/services/api";
import { useRoute, useRouter } from "vue-router";
import echo from "@/services/echo";

const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const loading = ref(false);

// Map HTML Element Ref
const mapRef = ref(null);
let map = null;
let customerMarker = null;
let riderMarker = null;
const userLocation = JSON.parse(localStorage.getItem("userLocation") || {});

// ဒေတာစနစ်
const currentOrder = ref({
  order_number: "MOMO-98374",
  delivery_status: "pending",
  customer: {
    latitude: 16.8409,
    longitude: 96.1735,
  },
  rider: null,
});

const riderLocation = ref(null);

// 🎯 ၁။ မြေပုံကို စတင်ဆောက်လုပ်သည့် ဖန်ရှင်
// အကယ်၍ AdvancedMarkerElement ပြောင်းသုံးချင်ပါက (မဖြစ်မနေတော့ မဟုတ်ပါ)
const initMap = async () => {
  if (!mapRef.value || !window.google) return;

  // Marker library ကို လှမ်းခေါ်ခြင်း
  const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
    "marker"
  );

  map = new window.google.maps.Map(mapRef.value, {
    center: { lat: userLocation.lat, lng: userLocation.lng },
    zoom: 15,
    mapId: "DEMO_MAP_ID", // Advanced Marker သုံးလျှင် Map ID တစ်ခုခု ထည့်ပေးရပါမည်
  });

  customerMarker = new AdvancedMarkerElement({
    map: map,
    position: { lat: userLocation.lat, lng: userLocation.lng },
    title: "သင်၏ အိမ်တည်နေရာ",
  });
};

// 🎯 ၂။ ရိုက်ဒါ တည်နေရာပြောင်းတိုင်း Marker ကို ရွှေ့ပေးမည့် ဖန်ရှင်
const updateRiderMarker = (lat, lng) => {
  if (!map || !window.google) return;

  const riderPos = { lat: Number(lat), lng: Number(lng) };

  if (!riderMarker) {
    // Marker မရှိသေးရင် အသစ်ဆောက်မည်
    riderMarker = new window.google.maps.Marker({
      position: riderPos,
      map: map,
      title: "ရိုက်ဒါ လက်ရှိတည်နေရာ",
      label: {
        text: "ပို့ဆောင်သူ", // 💡 အင်္ဂလိပ်လို ပြောင်းချင်ရင် "Rider" လို့ ရေးနိုင်ပါတယ်ဗျာ
        color: "#2E7D32",          // စာသားအရောင် အမည်းရောင်
        fontWeight: "bold",        // စာသားကို Bold တင်ခြင်း
        fontSize: "14px",          // စာလုံးအရွယ်အစား
      },
      icon: {
        url: "https://cdn-icons-png.flaticon.com/512/3198/3198336.png", // ဆိုင်ကယ်ပုံစံ Custom Icon
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(20, -10), //x is 20 and y is -10
      },
    });
  } else {
    // ရှိပြီးသားဆိုရင် တည်နေရာကိုပဲ ရွှေ့ပေးမည်
    riderMarker.setPosition(riderPos);
  }

  // မြေပုံကို ရိုက်ဒါ့နောက်သို့ လိုက်ဗဟိုပြုပေးခြင်း
  map.panTo(riderPos);
};

// Laravel Echo နားထောင်ခြင်း Logic
let isListening = false;
const startListeningToRider = (riderId) => {
  if (isListening) return;
  isListening = true;

  echo.channel(`riders.${riderId}`).listen(".RiderLocationUpdated", (data) => {
    riderLocation.value = { lat: data.latitude, lng: data.longitude };
    console.log("rider location : ", data);
    // Real-time Marker ရွှေ့ခိုင်းခြင်း
    updateRiderMarker(data.latitude, data.longitude);
  });
};

const fetchOrderStatus = async () => {
  try {
    const res = await api.get(`auth/customer/orders/${props.id}`);
    currentOrder.value = res.data;

    if (res.data.rider && res.data.delivery_status === "delivering") {
      startListeningToRider(res.data.rider.id);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

let statusInterval = null;

onMounted(async () => {
  await fetchOrderStatus();

  setTimeout(() => {
    initMap();
  }, 300);

  statusInterval = setInterval(fetchOrderStatus, 5000);
});

onUnmounted(() => {
  if (statusInterval) clearInterval(statusInterval);
  if (currentOrder.value.rider) {
    echo.leave(`riders.${currentOrder.value.rider.id}`);
  }
});

const progressWidth = computed(() => {
  switch (currentOrder.value.delivery_status) {
    case "pending":
      return "0%";
    case "picking":
      return "50%";
    case "delivering":
    case "completed":
      return "100%";
    default:
      return "0%";
  }
});
const stepColor = (step) => {
  const status = currentOrder.value.delivery_status;
  if (step === 1) return "green-darken-2";
  if (step === 2)
    return ["picking", "delivering", "completed"].includes(status)
      ? "green-darken-2"
      : "grey-lighten-1";
  if (step === 3)
    return ["delivering", "completed"].includes(status)
      ? "green-darken-2"
      : "grey-lighten-1";
  return "grey-lighten-1";
};
const stepTextColor = (step) => {
  const status = currentOrder.value.delivery_status;
  if (step === 1 && status === "pending")
    return "text-green-darken-3 font-weight-black";
  if (step === 2 && status === "picking")
    return "text-green-darken-3 font-weight-black";
  if (step === 3 && status === "delivering")
    return "text-green-darken-3 font-weight-black";
  return "text-grey-darken-1";
};
const callRider = (phone) => {
  if (!phone) return;

  // 🎯 နည်းလမ်းကောင်း: Anchor tag တစ်ခုကို memory ထဲမှာ ယာယီဆောက်ပြီး ဖုန်းခေါ်ခိုင်းခြင်း
  const link = document.createElement("a");
  link.href = `tel:${phone}`;
  
  // Mobile Browser အချို့တွင် လုံခြုံရေးအရ တိုက်ရိုက် window.location ပြောင်းလဲခြင်းကို ပိတ်ထားပါက ယခုနည်းလမ်းက အလုပ်လုပ်ပါသည်
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.relative-card {
  position: relative;
  z-index: 999;
}
.relative-steps {
  position: relative;
}

.progress-line {
  position: absolute;
  top: 14px;
  left: 0; 
  height: 3px;
  background-color: #4caf50;
  transition: width 0.5s ease;
  z-index: 0;
}

.relative-steps::before {
  content: "";
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #e0e0e0;
  z-index: 0;
}

.step-item {
  position: relative;
  z-index: 1;
  width: 80px;
}
.step-icon {
  background-color: #ffffff !important;
  border-radius: 50%;
  padding: 4px; 
}

.top-0 {
  top: 0;
  z-index: 1000;
}
</style>
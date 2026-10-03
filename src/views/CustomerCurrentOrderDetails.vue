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
                  class="mr-3 text-white font-weight-bold cursor-pointer"
                >
                  <v-img
                    v-if="currentOrder.rider.image_url"
                    :src="currentOrder.rider.image_url"
                    @click="openImageDialog = true"
                  ></v-img>
                  <span v-else>
                    {{ currentOrder.rider.name.charAt(0) }}
                  </span>
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

    <image-dialog
      :dialogImgUrl="currentOrder.rider?.image_url"
      :openImageDialog="openImageDialog"
      @closeImageDialog="openImageDialog = false"
    />
  </customer-navbar>
</template>

<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import api from "@/services/api";
import { useRoute, useRouter } from "vue-router";
import echo from "@/services/echo";
import ImageDialog from "@/components/ImageDialog.vue";

const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const openImageDialog = ref(false);

// Map HTML Element & Map Refs
const mapRef = ref(null);
let map = null;
let customerMarker = null;
let riderMarker = null;
let polyline = null;
let animationFrame = null;

const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");

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
const initMap = async () => {
  if (!mapRef.value || !window.google) return;

  const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
    "marker"
  );

  map = new window.google.maps.Map(mapRef.value, {
    center: { lat: userLocation.lat || 16.8409, lng: userLocation.lng || 96.1735 },
    zoom: 15,
    mapId: "DEMO_MAP_ID",
  });

  customerMarker = new AdvancedMarkerElement({
    map: map,
    position: { lat: userLocation.lat || 16.8409, lng: userLocation.lng || 96.1735 },
    title: "သင်၏ အိမ်တည်နေရာ",
  });
};

// 🎯 ၂။ Polyline (အပြာရောင် လမ်းကြောင်းလိုင်း) ဆွဲပေးသည့် ဖန်ရှင်
const drawRouteLine = (riderPos, customerPos) => {
  if (!map || !window.google) return;

  const path = [
    { lat: Number(riderPos.lat), lng: Number(riderPos.lng) },
    { lat: Number(customerPos.lat), lng: Number(customerPos.lng) },
  ];

  if (!polyline) {
    polyline = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#1976D2",
      strokeOpacity: 0.8,
      strokeWeight: 5,
      icons: [
        {
          icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
          offset: "100%",
          repeat: "50px",
        },
      ],
      map: map,
    });
  } else {
    polyline.setPath(path);
  }
};

// 🎯 ၃။ Marker ကို Smooth (ချောမွေ့စွာ) ရွှေ့ပေးမည့် Animation Logic
const animateMarker = (marker, startPos, endPos, duration = 2000) => {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentLat = startPos.lat + (endPos.lat - startPos.lat) * progress;
    const currentLng = startPos.lng + (endPos.lng - startPos.lng) * progress;

    const newPos = { lat: currentLat, lng: currentLng };

    if (typeof marker.setPosition === "function") {
      marker.setPosition(newPos);
    } else {
      marker.position = newPos;
    }

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    }
  };

  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(animate);
};

// 🎯 ၄။ updateRiderMarker (Smooth movement + Polyline)
const updateRiderMarker = (lat, lng) => {
  if (!map || !window.google) return;

  const newRiderPos = { lat: Number(lat), lng: Number(lng) };
  const customerPos = {
    lat: Number(userLocation.lat || 16.8409),
    lng: Number(userLocation.lng || 96.1735),
  };

  if (!riderMarker) {
    riderMarker = new window.google.maps.Marker({
      position: newRiderPos,
      map: map,
      title: "ရိုက်ဒါ လက်ရှိတည်နေရာ",
      label: {
        text: "rider",
        color: "#2E7D32",
        fontWeight: "bold",
        fontSize: "14px",
      },
      icon: {
        url: "https://cdn-icons-png.flaticon.com/512/3198/3198336.png",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(20, -10),
      },
    });
  } else {
    const oldPos = {
      lat: riderMarker.getPosition().lat(),
      lng: riderMarker.getPosition().lng(),
    };
    animateMarker(riderMarker, oldPos, newRiderPos);
  }

  drawRouteLine(newRiderPos, customerPos);
  map.panTo(newRiderPos);
};

// Laravel Echo နားထောင်ခြင်း Logic
let isListening = false;
const startListeningToRider = (riderId) => {
  if (isListening) return;
  isListening = true;

  echo.channel(`riders.${riderId}`).listen(".RiderLocationUpdated", (data) => {
    riderLocation.value = { lat: data.latitude, lng: data.longitude };
    console.log("rider location : ", data);
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
  if (animationFrame) cancelAnimationFrame(animationFrame);
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

  const link = document.createElement("a");
  link.href = `tel:${phone}`;
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
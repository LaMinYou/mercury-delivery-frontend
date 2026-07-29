<template>
  <rider-navbar>
    <!-- show loading if data is currently fetching -->
    <loading v-if="isLoading" />

    <!-- show timeout page and try again if data can't get -->
    <timeout-view v-else-if="isTimeout" @retryFetch="retryFetch" />

    <!-- show data -->
    <v-container v-else fluid>
      <v-row class="align-center justify-center">
        <v-col cols="12" class="text-right">
          <v-btn
            prepend-icon="mdi-wifi-off"
            height="auto"
            color="red-accent-4"
            variant="text"
            v-if="!isOnline"
            @click="handleGoOnline"
          >
            <p class="text-wrap text-green-darken-2">Go Online</p>
          </v-btn>
          <v-btn
            height="auto"
            color="green"
            variant="text"
            v-else
            @click="handleGoOffline"
          >
            <span class="wave-container mr-2">
              <v-icon class="blinking-icon">mdi-wifi</v-icon>
            </span>
            <p class="text-wrap text-red-accent-4">Go Offline</p>
          </v-btn>
        </v-col>

        <v-col cols="12" v-if="hasOrder" class="text-green-darken-2">
          <h4>
            <v-icon>mdi-package-variant-closed</v-icon> သင်လက်ရှိ ပို့ဆောင်ရမည့်
            အော်ဒါများ ({{ activeOrders.length }}
            ခု)
          </h4>

          <v-card
            v-for="order in activeOrders"
            :key="order.id"
            class="mx-auto mb-4 text-left border-card"
            elevation="2"
          >
            <v-card-item>
              <v-card-title
                class="text-primary font-weight-bold d-flex justify-space-between"
              >
                <span class="text-wrap text-body-large"
                  >Order: #{{ order.order_number }}</span
                >
                <v-chip
                  size="small"
                  color="warning"
                  class="text-uppercase font-weight-bold"
                >
                  {{ order.delivery_status }}
                </v-chip>
              </v-card-title>
              <v-card-subtitle class="text-wrap">
                {{
                  order.order_type == "errand"
                    ? "Express အမြန်ချောပို့"
                    : order.restaurant.name
                }}</v-card-subtitle
              >
            </v-card-item>

            <v-divider></v-divider>

            <v-card-text>
              <div class="d-flex align-start mb-3 justify-space-between">
                <div class="d-flex align-start mb-3">
                  <v-icon color="orange" class="mr-2 mt-1"
                    >mdi-storefront</v-icon
                  >
                  <div>
                    <div class="font-weight-bold">သွားယူရန်လိပ်စာ:</div>
                    <div class="text-grey-darken-1">
                      {{
                        order.order_type == "errand"
                          ? order.source_address
                          : order.restaurant?.address
                      }}
                      <!-- {{ order.restaurant?.address || "ဆိုင်လိပ်စာ" }} -->
                    </div>
                  </div>
                </div>
                <div
                  v-if="order.order_type == 'errand' && order.source_phone"
                  class="align-self-center"
                >
                  <v-btn
                    icon="mdi-phone"
                    color="orange-darken-2"
                    variant="tonal"
                    size="small"
                    elevation="1"
                    @click="makePhoneCall(order.source_phone)"
                  ></v-btn>
                </div>
              </div>

              <div class="d-flex align-start mb-4 justify-space-between">
                <div class="d-flex align-start mb-4">
                  <v-icon color="red" class="mr-2 mt-1"
                    >mdi-map-marker-radius</v-icon
                  >
                  <div>
                    <div class="font-weight-bold text-red-darken-2">
                      ပို့ဆောင်ရမည့် (Customer) လိပ်စာ:
                    </div>
                    <div class="text-black font-weight-medium">
                      {{ order.dest_address }}
                    </div>
                  </div>
                </div>
                <div v-if="order.dest_phone" class="align-self-center">
                  <v-btn
                    icon="mdi-phone"
                    color="green-darken-2"
                    variant="tonal"
                    size="small"
                    elevation="1"
                    @click="makePhoneCall(order.dest_phone)"
                  ></v-btn>
                </div>
              </div>

              <div>
                <v-btn
                  variant="outlined"
                  color="red-accent-4"
                  @click="releaseOrder(order)"
                >
                  Release Order
                </v-btn>
              </div>

              <!-- for express order -->
              <div v-if="order.order_type == 'errand'">
                <v-expansion-panels
                  variant="accordion"
                  class="mt-3 custom-panels"
                >
                  <v-expansion-panel class="elevation-0 border-light">
                    <v-expansion-panel-title
                      class="pa-2 text-subtitle-2 font-weight-bold text-grey-darken-3"
                    >
                      <v-icon color="green-darken-2" class="mr-2"
                        >mdi-zip-box</v-icon
                      >
                      မှာယူထားသော ပစ္စည်းစာရင်းကို ကြည့်မည်
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pa-0 bg-grey-lighten-5">
                      <div class="text-wrap my-5">
                        {{ order.item_type }}
                      </div>
                      <div
                        v-if="
                          order.order_type == 'errand' &&
                          order.user_note != null
                        "
                        class="pa-0"
                      >
                        <p>
                          <v-icon>mdi-bookmark-outline</v-icon>
                          {{ order.user_note }}
                        </p>
                      </div>
                      <v-divider></v-divider>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >Delivery Fee:</span
                        >
                        <span class="text-body-1 font-weight-black"
                          >{{ order.delivery_fee }} MMK</span
                        >
                      </div>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >Service Fee:</span
                        >
                        <span class="text-body-1 font-weight-black"
                          >{{ order.service_fee }} MMK</span
                        >
                      </div>

                      <v-divider></v-divider>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >စုစုပေါင်း (Service + Delivery Fee):</span
                        >
                        <span
                          class="text-body-1 font-weight-black text-green-darken-2"
                          >{{
                            Number(order.service_fee) +
                            Number(order.delivery_fee)
                          }}
                          MMK</span
                        >
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <!-- for merchant order -->
              <div v-else-if="order.order_type == 'merchant'">
                <v-card class="text-green-darken-2 font-weight-bold mt-3">
                  <v-card-text>
                    <v-icon>mdi-store-clock-outline</v-icon>
                    ဆိုင်မှ တိုက်ရိုက်ခေါ်ယူသော အော်ဒါ
                  </v-card-text>
                </v-card>
              </div>

              <!-- expansion panel for order details -->
              <div v-else>
                <v-expansion-panels
                  variant="accordion"
                  class="mt-3 custom-panels"
                >
                  <v-expansion-panel class="elevation-0 border-light">
                    <v-expansion-panel-title
                      class="pa-2 text-subtitle-2 font-weight-bold text-grey-darken-3"
                    >
                      <v-icon color="green-darken-2" class="mr-2"
                        >mdi-food-fork-drink</v-icon
                      >
                      မှာယူထားသော ပစ္စည်းစာရင်းကို ကြည့်မည်
                      <v-chip
                        size="x-small"
                        color="green-darken-2"
                        class="ml-2 text-white"
                      >
                        {{ order.order_items?.length || 0 }} မျိုး
                      </v-chip>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pa-0 bg-grey-lighten-5">
                      <div
                        v-for="item in order.order_items"
                        :key="item.id"
                        class="d-flex justify-space-between align-center py-2 px-1 border-bottom"
                      >
                        <div class="d-flex align-center">
                          <v-avatar
                            size="32"
                            color="green-lighten-5"
                            class="mr-2"
                          >
                            <v-icon size="18" color="green-darken-2"
                              >mdi-silverware-clean</v-icon
                            >
                          </v-avatar>
                          <div>
                            <div
                              class="font-weight-medium text-body-2 text-black"
                            >
                              {{ item.menu?.subtitle || "အစားအသောက်အမည်" }}
                            </div>
                            <div class="text-caption text-grey">
                              {{ item.final_price }} MMK
                            </div>
                          </div>
                        </div>

                        <div>
                          <v-chip
                            size="small"
                            color="grey-lighten-3"
                            variant="flat"
                            class="font-weight-bold text-black"
                          >
                            x {{ item.quantity }}
                          </v-chip>
                        </div>
                      </div>

                      <v-divider></v-divider>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >စုစုပေါင်း (Total Price):</span
                        >
                        <span class="text-body-1 font-weight-black"
                          >{{ order.total_price }} MMK</span
                        >
                      </div>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >Delivery Fee:</span
                        >
                        <span class="text-body-1 font-weight-black"
                          >{{ order.delivery_fee }} MMK</span
                        >
                      </div>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >Service Fee:</span
                        >
                        <span class="text-body-1 font-weight-black"
                          >{{ order.service_fee }} MMK</span
                        >
                      </div>

                      <v-divider></v-divider>

                      <div
                        class="d-flex justify-space-between align-center pt-3 mt-2 border-top-dashed"
                      >
                        <span
                          class="text-body-2 font-weight-bold text-grey-darken-2"
                          >စုစုပေါင်း (Service + Delivery Fee):</span
                        >
                        <span
                          class="text-body-1 font-weight-black text-green-darken-2"
                          >{{
                            Number(order.total_price) +
                            Number(order.service_fee) +
                            Number(order.delivery_fee)
                          }}
                          MMK</span
                        >
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4 bg-light d-flex flex-wrap align-center">
              <v-btn
                prepend-icon="mdi-google-maps"
                :color="
                  order.delivery_status === 'picking'
                    ? 'indigo-darken-1'
                    : 'blue-grey-darken-1'
                "
                variant="elevated"
                height="auto"
                class="pa-2 text-white w-100"
                @click="openGoogleMap(order)"
              >
                <span
                  v-if="order.delivery_status === 'picking'"
                  class="text-wrap"
                >
                  Source Address
                </span>
                <span v-else class="text-wrap">
                  <!-- Customer အိမ်သို့သွားမည့် လမ်းကြောင်းကြည့်မည် -->
                  Destination Address
                </span>
              </v-btn>

              <v-btn
                :prepend-icon="
                  order.delivery_status === 'picking'
                    ? 'mdi-bike'
                    : 'mdi-check-circle'
                "
                :color="
                  order.delivery_status === 'picking'
                    ? 'orange-darken-2'
                    : 'green-darken-2'
                "
                variant="elevated"
                height="auto"
                class="mt-2 text-white pa-2 w-100"
                @click="handleDeliveryStatus(order)"
              >
                <span
                  v-if="order.delivery_status === 'picking'"
                  class="text-wrap"
                >
                  Start Delivering
                </span>
                <span
                  v-else-if="order.delivery_status === 'delivering'"
                  class="text-wrap"
                >
                  Mark as Delivered
                </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-else>
          <p class="text-center text-grey font-weight-bold text-h3 py-5">
            <v-icon>mdi-magnify</v-icon> လက်တလောပို့ဆောင်ရန်အော်ဒါများမရှိသေးပါ
          </p>
        </v-col>
      </v-row>
      <!-- popup box for order noti event -->
      <v-card v-if="incomingOrderOffer" class="order-popup-modal pa-3 ma-3">
        <v-card-title>
          အော်ဒါ ကမ်းလှမ်းချက်အသစ် ရရှိပါသည်!
          <v-card-subtitle v-if="incomingOrderOffer.order_type == 'merchant'">
            ဆိုင်မှခေါ်ယူခြင်း
          </v-card-subtitle>
        </v-card-title>
        <v-card-text>
          <p class="text-wrap font-weight-bold" style="max-width: 350px">
            {{ incomingOrderOffer.restaurant?.name || "Express အမြန်ချောပို့" }}
          </p>
          <p class="text-wrap">
            အော်ဒါနံပါတ်: {{ incomingOrderOffer.order_number }}
          </p>
          <p
            class="text-wrap"
            v-if="
              incomingOrderOffer.order_type == 'errand' ||
              incomingOrderOffer.order_type == 'merchant'
            "
          >
            Delivery + Service Fee :
            {{
              Number(incomingOrderOffer.delivery_fee) +
              Number(incomingOrderOffer.service_fee)
            }}
            MMK
          </p>
          <p v-else>
            စုစုပေါင်းတန်ဖိုး: {{ incomingOrderOffer.total_price }} MMK
          </p>
        </v-card-text>
        <v-card-action>
          <v-btn
            block
            variant="elevated"
            color="green-darken-2"
            @click="handleAcceptOrder(incomingOrderOffer.id)"
            class="mb-2"
          >
            လက်ခံမည်
          </v-btn>

          <v-btn
            block
            variant="outlined"
            color="red-accent-4"
            @click="incomingOrderOffer = null"
          >
            ငြင်းပယ်မည်
          </v-btn>
        </v-card-action>
      </v-card>
    </v-container>
    <near-riders-dialog
      :openRiderDialog="riderDialog"
      :order="selectedOrder"
      :riders="riders"
      @closeRiderDialog="riderDialog = false"
      @handOverSuccess="handOverSuccess"
    />
  </rider-navbar>
</template>

<script setup>
import RiderNavbar from "@/components/RiderNavbar.vue";
import NearRidersDialog from "@/components/NearRidersDialog.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import api from "@/services/api";
import echo from "@/services/echo";
import Loading from "@/components/loadings/Loading.vue";
import TimeoutView from "@/components/TimeoutView.vue";

const isOnline = ref(false);
const activeOrders = ref([]);
const incomingOrderOffer = ref(null);
const alertSound = new Audio("/images/noti.wav");
const hasOrder = computed(() => activeOrders.value.length > 0);
let locationTimer = null;
const riders = ref([]);
const riderDialog = ref(false);
const selectedOrder = ref(null);
const isLoading = ref(true);
const isTimeout = ref(false);

const makePhoneCall = (phoneNumber) => {
  if (phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    alert("ဖုန်းနံပါတ် မရှိပါဗျာ။");
  }
};

const updateLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          current_latitude: position.coords.latitude,
          current_longitude: position.coords.longitude,
        };
        try {
          const res = await api.put("auth/rider/update-location", payload);
          console.log(res.data.message);
          //console.log("GPS Tracking Updated:", payload);
        } catch (err) {
          console.error("Tracking Error:", err);
        }
      },
      (error) => console.error("GPS Error:", error),
      { enableHighAccuracy: true }
    );
  }
};

const releaseOrder = async (ord) => {
  selectedOrder.value = ord;
  if (ord.delivery_status == "picking") {
    try {
      const res = await api.post(`auth/rider/order-release/${ord.id}`);
      fetchActiveOrders();
    } catch (err) {
      console.log(err);
    }
  } else {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const current_latitude = position.coords.latitude;
      const current_longitude = position.coords.longitude;

      try {
        const res = await api.get("/auth/rider/nearest-riders", {
          params: {
            latitude: current_latitude,
            longitude: current_longitude,
            order_id: ord.id,
          },
        });

        riders.value = res.data;
        riderDialog.value = true;
      } catch (err) {
        console.error("အနီးနားရှိ ရိုက်ဒါများ ရှာမတွေ့ပါဗျာ-", err);
      }
    });
  }
};

const handOverSuccess = () => {
  fetchActiveOrders();
};

const startLocationTracking = () => {
  if (locationTimer) clearInterval(locationTimer);

  // အော်ဒါပို့နေစဉ်ဆိုလျှင် ၁၅ စက္ကန့်တစ်ခါ၊ ပုံမှန်စောင့်နေချိန်ဆိုလျှင် ၂ မိနစ် (၁၂၀၀၀၀ မီလီစက္ကန့်) တစ်ခါ
  const intervalTime = hasOrder.value ? 15000 : 120000;

  updateLocation(); // ချက်ချင်း တစ်ကြိမ် အရင်ပို့မည်
  locationTimer = setInterval(updateLocation, intervalTime);
};

const listenToRiderChannel = (riderId) => {
  echo
    .private(`riders.${riderId}`)
    .listen(".RiderOrderAssigned", (data) => {
      console.log("အော်ဒါ ကမ်းလှမ်းချက်အသစ် ရောက်လာပါပြီ-", data.order);
      incomingOrderOffer.value = data.order;
      playAlert();
    })
    .listen(".OrderOfferWithdrawn", (data) => {
      if (
        incomingOrderOffer.value &&
        incomingOrderOffer.value.id == data.orderId
      ) {
        incomingOrderOffer.value = null; // ပေါ့ပ်အပ်ကို အလိုအလျောက် ပိတ်မည်
        console.log("ဒီအော်ဒါကို တခြားသူ ယူသွားလို့ ပိတ်လိုက်ပါပြီ။");
      }
    })
    .listen(".OrderHandOver", (data) => {
      activeOrders.value.unshift(data.order);
    });
};

// when rider clicks Go Online
const handleGoOnline = async () => {
  await api.put("auth/rider/toggle-status", { status: "available" });
  isOnline.value = true;

  const user = JSON.parse(localStorage.getItem("user"));
  listenToRiderChannel(user.id);
  startLocationTracking();
};

// when rider click Go Offline
const handleGoOffline = async () => {
  if (hasOrder.value) return;
  await api.put("auth/rider/toggle-status", { status: "inactive" });
  isOnline.value = false;

  if (locationTimer) {
    clearInterval(locationTimer);
    locationTimer = null;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  echo.leave(`riders.${user.id}`); // Close Live Channel
};

const handleAcceptOrder = async (orderId) => {
  try {
    const res = await api.post(`auth/rider/accept-order/${orderId}`);
    activeOrders.value.unshift(res.data.order); // လက်ရှိ Active အော်ဒါစာရင်းထဲ ထည့်မည်
    incomingOrderOffer.value = null; // Pop-up ပိတ်လိုက်မည်

    startLocationTracking(); // GPS ကို ၁၅ စက္ကန့်တစ်ခါ အရှိန်မြှင့်တင်လိုက်မည်
    alert("အော်ဒါ လက်ခံရရှိမှု အောင်မြင်ပါသည်။ ဆိုင်သို့ သွားယူပေးပါဗျာ။");
  } catch (err) {
    alert(err.response?.data?.message || "အော်ဒါအား အခြားသူ ယူသွားပါပြီ။");
    incomingOrderOffer.value = null;
  }
};

const handleDeliveryStatus = async (order) => {
  try {
    let nextStatus =
      order.delivery_status === "picking" ? "delivering" : "completed";
    const res = await api.put(`auth/rider/update-delivery-status/${order.id}`, {
      deliveryStatus: nextStatus,
    });

    const index = activeOrders.value.findIndex(
      (o) => o.id === res.data.order.id
    );

    nextStatus === "completed"
      ? activeOrders.value.splice(index, 1)
      : (activeOrders.value[index] = res.data.order);

    startLocationTracking();
  } catch (err) {
    console.log(err.response.data.error);
  }
};

const playAlert = () => {
  alertSound.play().catch((error) => {
    console.log("Browser Audio Restriction:", error);
  });
};

const openGoogleMap = (order) => {
  let lat, lng;

  if (order.delivery_status === "picking") {
    lat =
      order.order_type == "errand"
        ? order.source_latitude
        : order.restaurant?.latitude;
    lng =
      order.order_type == "errand"
        ? order.source_longitude
        : order.restaurant?.longitude;

    if (!lat || !lng) {
      alert("ဆိုင်၏ မြေပုံတည်နေရာ အချက်အလက် မပြည့်စုံပါဗျာ။");
      return;
    }
  } else {
    lat = order.dest_latitude;
    lng = order.dest_longitude;
  }
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  window.open(googleMapsUrl, "_blank");
};

const fetchActiveOrders = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const res = await api.get("auth/rider/current-active-orders");
      activeOrders.value = res.data.orders;

      if (hasOrder.value) {
        isOnline.value = true;
        listenToRiderChannel(user.id);
        startLocationTracking();
      }
    }
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    isTimeout.value = true;
  }
};

// အက်ပ်စပွင့်ချင်း ရိုက်ဒါတွင် လက်ရှိ ပို့ဆောင်ဆဲ အော်ဒါစာရင်း ရှိ/မရှိ စစ်ခြင်း
onMounted(() => {
  // const user = JSON.parse(localStorage.getItem("user"));
  // if (user) {
  //   const res = await api.get("auth/rider/current-active-orders");
  //   activeOrders.value = res.data.orders;

  //   if (hasOrder.value) {
  //     isOnline.value = true;
  //     listenToRiderChannel(user.id);
  //     startLocationTracking();
  //   }
  // }
  fetchActiveOrders();
});

const retryFetch = () => {
  isLoading.value = true;
  isTimeout.value = false;
  fetchActiveOrders();
};

onUnmounted(() => {
  if (locationTimer) clearInterval(locationTimer);
});
</script>
<style scoped>
.wave-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
.wave-container::before,
.wave-container::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(76, 175, 80, 0.4);
  animation: ripple-wave 2s infinite ease-out;
  opacity: 0;
}
.wave-container::after {
  animation-delay: 0.6s;
}
.blinking-icon {
  position: relative;
  z-index: 1;
  animation: blink-icon 1.5s infinite ease-in-out;
}

@keyframes blink-icon {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes ripple-wave {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
.order-popup-modal {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}
.custom-panels :deep(.v-expansion-panel--active) {
  background-color: #e8f5e9 !important;
  color: #2e7d32 !important;
  border: 1px solid #4caf50 !important;
}
</style>
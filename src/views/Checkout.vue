<template>
  <customer-navbar :address="userLocation?.address" @search="router.push('/')">
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/customer/cart')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container class="pa-4" fluid max-width="850">
      <div v-if="errorMessage">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
      </div>
      <v-row justify="center">
        <v-col cols="12" class="pa-0">
          <v-card class="pa-4 mb-4" flat>
            <div class="font-weight-bold text-subtitle-1 mb-3">
              ပို့ဆောင်မည့် လိပ်စာ
            </div>
            <!-- to show map to move pin -->
            <v-expand-transition>
              <pure-mini-map
                v-if="showMap"
                :lat="orderLocation.lat"
                :lng="orderLocation.lng"
                @map-dragged="handleMapUpdate"
                @close-map="showMap = false"
              />
            </v-expand-transition>

            <!-- to type new address for order -->
            <v-text-field
              v-model="orderLocation.address"
              label="လက်ရှိလိပ်စာတွင် လိပ်စာအသစ် ရိုက်ထည့်နိုင်သည်"
              prepend-inner-icon="mdi-map-marker"
              variant="outlined"
              density="comfortable"
              id="address-input"
              placeholder="ရှာဖွေရန် နေရာရိုက်ပါ..."
              @focus="showMap = true"
            ></v-text-field>

            <div class="font-weight-bold text-subtitle-1 mb-3">
              ပို့ဆောင်မည့် ဖုန်းနံပါတ်
            </div>

            <v-text-field
              v-model="destPhone"
              label="09xxxxxxxxx"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              density="comfortable"
              placeholder="ဖုန်းနံပါတ်ရိုက်ထည့်ပါ..."
              class="mb-3"
              :rules="[rules.required('phone number'), rules.phone]"
            ></v-text-field>

            <!-- use button if user use current location for order -->
            <v-btn
              prepend-icon="mdi-crosshairs-gps"
              variant="tonal"
              color="green-darken-4"
              block
              @click="handleCurrentLocationClick"
            >
              လက်ရှိတည်နေရာကို အသုံးပြုမည်
            </v-btn>

            <!-- to estimate delivery time -->
            <v-card
              class="my-3 px-3 bg-transparent d-flex align-center"
              variant="outlined"
              flat
            >
              <v-img
                src="/images/mortorcycle.png"
                max-width="150"
                min-width="100"
              ></v-img>
              <div class="ms-3">
                <p class="text-wrap">
                  <span class="font-weight-bold">ခန့်မှန်းပို့ဆောင်ချိန်</span>
                  (
                  {{
                    getDeliveryTime(
                      cartItems[0].restaurant.latitude,
                      cartItems[0].restaurant.longitude,
                      userLocation.lat,
                      userLocation.lng,
                      prepareTimes.length > 0 ? Math.max(...prepareTimes) : 15
                    )
                  }}
                  )
                </p>
              </div>
            </v-card>

            <div class="customer-note mt-5">

              <v-text-field
              v-model="userNote"
              label="အမှာစာလိုအပ်ပါက ထည့်သွင်းနိုင်သည်"
              prepend-inner-icon="mdi-note-text-outline"
              variant="outlined"
              density="comfortable"
              id="note-input"
              placeholder="အမှာစာလိုအပ်ပါက ထည့်သွင်းပါ..."
              persistent-placeholder
              class="mb-3"
            ></v-text-field>

            </div>

            <!-- to choose payment type -->
            <div>
              <p class="text-h3 font-weight-bold">ငွေပေးချေမှုနည်းလမ်း</p>
              <v-card
                variant="outlined"
                block
                height="auto"
                @click="openPaymentDialog = true"
                class="pa-2"
              >
                <div
                  v-if="payment"
                  class="d-flex justify-space-between align-center w-100 px-2"
                >
                  <div class="d-flex align-center">
                    <v-img
                      :src="payment.logo_url"
                      width="30"
                      height="20"
                    ></v-img>
                    <span class="ms-2 font-weight-bold">{{
                      payment.name
                    }}</span>
                  </div>

                  <div class="font-weight-bold text-green-darken-3">
                    {{ totalPrice }} MMK
                  </div>
                </div>

                <div class="text-wrap text-center w-100" v-else>
                  <v-icon>mdi-plus</v-icon> ငွေပေးချေမှုနည်းလမ်းတစ်ခုထည့်သွင်းပါ
                </div>
              </v-card>
            </div>

            <!-- to show order summary -->
            <div>
              <p class="text-h3 font-weight-bold">Order Summary</p>
              <v-card flat>
                <v-list>
                  <v-list-item
                    v-for="item in cartItems"
                    :key="item.id"
                    class="d-flex justify-space-between align-center"
                  >
                    <template v-slot:prepend>
                      <span class="text-body-small"
                        >{{ item.quantity }} x {{ item.subtitle }}</span
                      >
                    </template>
                    <v-list-item-title>
                      <span class="text-body-small"
                        >{{ item.finalPrice * item.quantity }} MMK</span
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-card-subtitle class="pa-0">
                  <v-list>
                    <v-list-item
                      class="d-flex justify-space-between align-center"
                    >
                      <template v-slot:prepend>
                        <span class="text-body-small"> စုစုပေါင်း</span>
                      </template>
                      <v-list-item-title>
                        <span class="text-body-small"
                          >{{ totalPrice }} MMK</span
                        >
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      class="d-flex justify-space-between align-center"
                    >
                      <template v-slot:prepend>
                        <span class="text-body-small">
                          ပို့ဆောင်ခနှုန်းထား</span
                        >
                      </template>
                      <v-list-item-title>
                        <span class="text-body-small">
                          {{ deliveryFee }}
                          MMK
                        </span>
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      class="d-flex justify-space-between align-center"
                    >
                      <template v-slot:prepend>
                        <span class="text-body-small"> ဝန်ဆောင်ခ</span>
                      </template>
                      <v-list-item-title>
                        <span class="text-body-small"
                          >{{ serviceFee }} MMK</span
                        >
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-subtitle>
              </v-card>
            </div>

            <!-- to confirm order by clicking confirm button -->
            <div>
              <v-card class="rounded-t-xl pa-5 bg-green-lighten-5">
                <div
                  class="d-flex justify-space-between align-center flex-wrap"
                >
                  <v-card-subtitle class="pa-0">
                    <span class="text-h3 font-weight-bold text-black text-wrap"
                      >စုစုပေါင်း</span
                    >(ဝန်ဆောင်ခနှင့်အခွန်ပါဝင်ပြီး)
                  </v-card-subtitle>
                  <v-card-subtitle
                    class="font-weight-bold text-h3 text-green-darken-2"
                  >
                    <p class="text-wrap">
                      {{ totalPrice + deliveryFee + serviceFee }} MMK
                    </p>
                  </v-card-subtitle>
                </div>

                <v-btn
                  block
                  variant="elevated"
                  color="green-darken-2"
                  class="w-100 my-3"
                  height="auto"
                  :disabled="!payment"
                  @click="makeOrder"
                >
                  <p class="text-wrap text-h3">မှာယူမှုကိုအတည်ပြုပါ</p>
                </v-btn>
              </v-card>
            </div>
            <!-- <div class="text-caption text-grey mt-2">
              Coordinates: {{ orderLocation.lat }}, {{ orderLocation.lng }}
            </div>
            <div
              v-if="payment_transaction.image"
              class="mt-2 text-subtitle-2 text-green-darken-3"
            >
              📁 တင်ထားသောဖိုင် - {{ payment_transaction.image.name }}
            </div> -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- show payment choosing dialog -->
    <payment-dialog
      :openPaymentDialog="openPaymentDialog"
      :payments="payments"
      @closePaymentDialog="closeDialog"
    />

    <payment-q-r-dialog
      :openPaymentQRDialog="openPaymentQRDialog"
      :payment="payment"
      :totalPrice="totalPrice"
      :serviceFee="serviceFee"
      :deliveryFee="deliveryFee"
      @closePaymentQRDialog="closeQRDialog"
    />

    <alert-dialog
      :openAlertDialog="openAlertDialog"
      message="ငွေပေး‌ချေမှုကိုအတည်ပြုနိုင်ရန် ကျေးဇူးပြု၍ငွေလွှဲပြေစာအားထည့်သွင်းပေးပါ"
      @closeAlertDialog="openAlertDialog = false"
    />
  </customer-navbar>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import PureMiniMap from "@/components/PureMiniMap.vue";
import PaymentDialog from "@/components/PaymentDialog.vue";
import Alert from "@/components/Alert.vue";
import { useHaversine } from "@/composables/useHaversine";
import { useDelivery } from "@/composables/useDelivery";
import api from "@/services/api";
import { useRouter } from "vue-router";
import PaymentQRDialog from "@/components/PaymentQRDialog.vue";
import AlertDialog from "@/components/AlertDialog.vue";
import { useCart } from "@/composables/useCart";
import { rules } from "@/services/rules";

const { removeFromCartAfterOrder } = useCart();
const router = useRouter();
const openPaymentDialog = ref(false);
const openPaymentQRDialog = ref(false);
const openAlertDialog = ref(false);
const errorMessage = ref(null);
const { getDeliveryTime } = useHaversine();
const { calculateDeliveryFee } = useDelivery();
const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
const userLocation = JSON.parse(localStorage.getItem("userLocation")) || {
  lat: 16.8409,
  lng: 96.1735,
  address: "",
};
const showMap = ref(false);
const payments = ref([]);
const payment = ref(null);
const userNote = ref(null);
const totalPrice = computed(() => {
  return cartItems.reduce((sum, item) => {
    return sum + item.finalPrice * item.quantity;
  }, 0);
});
const serviceFee = ref(100);
const deliveryFee = ref(0);
const user = JSON.parse(localStorage.getItem('user'));
const payment_transaction = ref({
  user_id: user.id,
  order_id: "#125$7",
  image: null,
});

const orderLocation = ref({
  address: userLocation.address || "",
  lat: userLocation.lat ? parseFloat(userLocation.lat) : 16.8409,
  lng: userLocation.lng ? parseFloat(userLocation.lng) : 96.1735,
});
const destPhone = ref(user?.phone || null);

const order = ref(null);

const prepareTimes = computed(() => {
  return cartItems.map((item) => item.prepare_time);
});

const getPayments = async () => {
  try {
    const res = await api.get("payments");
    payments.value = res.data;
  } catch (err) {
    console.log(err.response.data.error);
  }
};

const closeDialog = (item) => {
  payment.value = item;
  openPaymentDialog.value = false;
};

//place order when clicking confirm button
const makeOrder = async () => {
  if (!payment.value) return; // Payment မရွေးရသေးလျှင် ဘာမှမလုပ်ပါ

  const paymentStatus = ref("accepted");
  if (payment.value?.name?.toLowerCase() !== "cash") {
    paymentStatus.value = "pending";
    openPaymentQRDialog.value = true;
    return;
  }
  await submitOrder(paymentStatus.value);
};

const submitOrder = async (payStatus) => {
  errorMessage.value = null;
  const timeStamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const orderNum = `ORD-${timeStamp}-${randomNum}`;

  order.value = {
    order_number: orderNum,
    restaurant_id: cartItems[0].restaurant.id,
    customer_id: user.id,
    rider_id: null,
    order_type: "food",
    dest_latitude: orderLocation.value.lat,
    dest_longitude: orderLocation.value.lng,
    dest_address: orderLocation.value.address,
    dest_phone: destPhone.value,
    total_price: totalPrice.value,
    delivery_fee: deliveryFee.value,
    service_fee: serviceFee.value,
    payment_id: payment.value.id,
    payment_status: payStatus,
    order_status: "pending",
    delivery_status: "pending",
    user_note: userNote.value
  };

  // လျှော့ချခဲ့ပြီးသမျှ Item IDs တွေကို မှတ်ထားဖို့ Array တစ်ခု ဆောက်ပါမယ်
    const successfullyReducedItems = [];

  try {
    //to show error message if stock is not enough
    for (const item of cartItems) {
      await updateMenuCount(item.id, item.quantity);
      // စတော့လျှော့တာ အောင်မြင်ရင် ဒီ Array ထဲ ထည့်မှတ်ထားမယ်
      successfullyReducedItems.push({ id: item.id, quantity: item.quantity });
    }

    const res = await api.post("/auth/orders/new", order.value);
    const orderId = res.data.orderId;

    const res1 = await api.post("/auth/order-items/new", {
      order_id: orderId,
      items: cartItems,
    });
    console.log(res1.data.message);
    if (payStatus == "pending") {
      payment_transaction.value.order_id = orderId;

      const formData = new FormData();
      formData.append("user_id", payment_transaction.value.user_id);
      formData.append("order_id", payment_transaction.value.order_id);
      if (payment_transaction.value.image) {
        formData.append("image", payment_transaction.value.image);
      }
      const res2 = await api.post("/auth/payment-transaction/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res2.data.message);
    }
    cartItems.forEach((item) => {
      removeFromCartAfterOrder(item.id);
    });

    alert("အော်ဒါမှာယူမှုအောင်မြင်ပါသည်။");
    router.push("/");
  } catch (err) {
    //အော်ဒါမတင်ဖြစ်ရင် လျှော့ခဲ့တဲ့ စတော့တွေကို ပြန်ပေါင်းပေးမယ် (Rollback)
    for (const successItem of successfullyReducedItems) {
      try {
        // Backend မှာ စတော့ပြန်တိုးပေးမယ့် API တစ်ခု (ဥပမာ- increment) ကို လှမ်းခေါ်ရပါမယ်
        await api.put(`menus/${successItem.id}/update-available-count`, {
          order_count: -successItem.quantity, // အနှုတ်တန်ဖိုး ပို့လိုက်ရင် decrement ကနေ ပြန်ပေါင်းပေးသွားမှာပါ
        });
      } catch (rollbackErr) {
        console.error("Rollback failed for item:", successItem.id);
      }
    }
    if (err.response && err.response.status === 422) {
      errorMessage.value = err.response.data.error;
      console.log("Validation Errors:");
      console.error(err.response.data.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.error("API Error:", err.response?.data?.error || err.message);
    }
  }
};

const updateMenuCount = (menuId, orderQty) => {
  return api.put(`menus/${menuId}/update-available-count`, {
    order_count: orderQty,
  });
};

const closeQRDialog = (qrImg) => {
  openPaymentQRDialog.value = false;
  if (qrImg == null) {
    openAlertDialog.value = true;
    return;
  } else {
    payment_transaction.value.image = qrImg;
    submitOrder("pending");
  }
};

onMounted(() => {
  initAutocomplete();
  getPayments();
});

watch(
  () => [orderLocation.value.lat, orderLocation.value.lng],
  async ([newLat, newLng]) => {
    if (newLat && newLng) {
      const fee = await calculateDeliveryFee(
        newLat,
        newLng,
        cartItems[0].restaurant.latitude,
        cartItems[0].restaurant.longitude
      );
      deliveryFee.value = fee || 1000;
    }
  },
  { immediate: true }
);

// connect to Google Places Autocomplete and listen for autocomplete
const initAutocomplete = () => {
  const input = document.getElementById("address-input");
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "MM" },
    fields: ["geometry", "formatted_address"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      // to show map immediately when listen autocomplete
      showMap.value = true;

      orderLocation.value.lat = place.geometry.location.lat();
      orderLocation.value.lng = place.geometry.location.lng();
      orderLocation.value.address = place.formatted_address;
    }
  });
};

// use current location when click button
const handleCurrentLocationClick = () => {
  // show map
  showMap.value = true;

  orderLocation.value.lat = parseFloat(userLocation.lat);
  orderLocation.value.lng = parseFloat(userLocation.lng);
  orderLocation.value.address = userLocation.address;
};

// change order location by moving pin in the map
const handleMapUpdate = (updatedData) => {
  orderLocation.value.lat = updatedData.lat;
  orderLocation.value.lng = updatedData.lng;
  orderLocation.value.address = updatedData.address;
};
</script>
<style scoped>
</style>
<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card max-width="700" class="card mx-auto">
            <v-card-title class="d-flex justify-center align-center my-5">
              <v-img
                :src="require('@/assets/images/mercury.png')"
                width="140"
                height="135"
                max-width="140"
                class="logo"
              />
              <!-- <span
                style="margin-left: -10px; margin-bottom: -10px"
                class="text-green-darken-4 font-weight-bold"
              >
                omo
                <span class="text-indigo-darken-1 font-italic">Express</span>
              </span> -->
              <span class="text-white pt-10 font-italic font-weight-bold header-text">Express</span>
            </v-card-title>

            <v-card-text class="mt-4">
              <!-- for source address -->
              <div class="source">
                <!-- to show map to move pin -->
                <v-expand-transition>
                  <pure-mini-map
                    v-show="showSourceMap"
                    :lat="order.source_latitude"
                    :lng="order.source_longitude"
                    @map-dragged="handleMapUpdateForSource"
                    @close-map="showSourceMap = false"
                  />
                </v-expand-transition>

                <!-- to type new address for order -->
                <v-text-field
                  v-model="order.source_address"
                  label="ပစ္စည်းပို့မည့်လိပ်စာ"
                  prepend-inner-icon="mdi-map-marker"
                  variant="outlined"
                  density="comfortable"
                  id="address-source"
                  placeholder="ရှာဖွေရန် နေရာရိုက်ပါ..."
                  @focus="showSourceMap = true"
                  class="mb-3"
                  :rules="[rules.required('source address')]"
                ></v-text-field>
                <!-- <span>{{ order.source_latitude }}, {{ order.source_longitude }}</span> -->
                
                <v-text-field
                  v-model="order.source_phone"
                  label="ပစ္စည်းပို့မည့်ဖုန်းနံပါတ်"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  density="comfortable"
                  placeholder="09xxxxxxxxx"
                  class="mb-3"
                  :rules="[rules.required('source phone number'), rules.phone]"
                ></v-text-field>

              </div>

              <!-- for destination address -->
              <div class="destination">
                <!-- to show map to move pin -->
                <v-expand-transition>
                  <pure-mini-map
                    v-show="showDestMap"
                    :lat="order.dest_latitude"
                    :lng="order.dest_longitude"
                    @map-dragged="handleMapUpdateForDest"
                    @close-map="showDestMap = false"
                  />
                </v-expand-transition>

                <!-- to type new address for order -->
                <v-text-field
                  v-model="order.dest_address"
                  label="ပစ္စည်းလက်ခံမည့်လိပ်စာ"
                  prepend-inner-icon="mdi-map-marker"
                  variant="outlined"
                  density="comfortable"
                  id="address-dest"
                  placeholder="ရှာဖွေရန် နေရာရိုက်ပါ..."
                  @focus="showDestMap = true"
                  class="mb-3"
                  :rules="[rules.required('destination address')]"
                ></v-text-field>
                <!-- <span>{{ order.dest_latitude }}, {{ order.dest_longitude }}</span> -->

                <v-text-field
                  v-model="order.dest_phone"
                  label="ပစ္စည်းလက်ခံမည့်ဖုန်းနံပါတ်"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  density="comfortable"
                  placeholder="09xxxxxxxxx"
                  class="mb-3"
                  :rules="[rules.required('destination phone number'), rules.phone]"
                ></v-text-field>
              </div>

              <div class="item-type">
                <v-text-field
                  v-model="order.item_type"
                  label="ပစ္စည်းအမျိုးအစား"
                  prepend-inner-icon="mdi-format-list-bulleted"
                  variant="outlined"
                  density="comfortable"
                  placeholder="ပစ္စည်းအမျိုးအစားထည့်ပါ..."
                  class="mb-3"
                  :rules="[rules.required('item type')]"
                ></v-text-field>
              </div>

              <div class="customer-note mt-5">
                <v-text-field
                  v-model="order.user_note"
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

              <!--  payment way to choose -->
              <div class="payment-way">
                <p class="text-subtitle-1 py-5 font-weight-bold">ငွေပေးချေမှုနည်းလမ်း</p>
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

                    <!-- <div class="font-weight-bold text-green-darken-3">
                    {{ totalPrice }} MMK
                  </div> -->
                  </div>

                  <div class="text-wrap text-subtitle-2 text-center w-100" v-else>
                    <v-icon>mdi-plus</v-icon>
                    ငွေပေးချေမှုနည်းလမ်းတစ်ခုထည့်သွင်းပါ
                  </div>
                </v-card>
              </div>

              <!-- order summary -->
              <div>
                <p class="text-subtitle-1 py-5 font-weight-bold">Summary</p>
                <v-card flat>
                  <v-card-subtitle class="pa-0">
                    <v-list>
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
              <!-- confirm delivery -->
              <div>
                <v-card class="rounded-t-xl pa-5 bg-green-lighten-5">
                  <div
                    class="d-flex justify-space-between align-center flex-wrap"
                  >
                    <v-card-subtitle class="pa-0">
                      <span
                        class="text-subtitle-1 font-weight-bold text-black text-wrap"
                        >စုစုပေါင်း</span
                      >(ဝန်ဆောင်ခနှင့်အခွန်ပါဝင်ပြီး)
                    </v-card-subtitle>
                    <v-card-subtitle
                      class="font-weight-bold text-subtitle-1 text-green-darken-2"
                    >
                      <p class="text-wrap">
                        {{ deliveryFee + serviceFee }} MMK
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
                    <p class="text-wrap text-subtitle-1 py-3">အတည်ပြုပါ</p>
                  </v-btn>
                </v-card>
              </div>
            </v-card-text>
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
      :totalPrice="0"
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
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import { onMounted, ref, watch } from "vue";
import { useRandomOrderNumber } from "@/composables/useRandomOrderNumber";
import { useDelivery } from "@/composables/useDelivery";
import PureMiniMap from "@/components/PureMiniMap.vue";
import PaymentDialog from "@/components/PaymentDialog.vue";
import PaymentQRDialog from "@/components/PaymentQRDialog.vue";
import AlertDialog from "@/components/AlertDialog.vue";
import api from "@/services/api";
import { rules } from "@/services/rules";
import { useRouter } from "vue-router";

const router = useRouter();
const userLocation = JSON.parse(localStorage.getItem("userLocation"));
const { calculateDeliveryFee } = useDelivery();
const serviceFee = ref(100);
const deliveryFee = ref(0);
const openPaymentDialog = ref(false);
const openPaymentQRDialog = ref(false);
const payments = ref([]);
const payment = ref(null);
const showSourceMap = ref(false);
const showDestMap = ref(false);
const openAlertDialog = ref(false);
const errorMessage = ref(null);
const user = JSON.parse(localStorage.getItem('user'));
const payment_transaction = ref({
  user_id: user.id,
  order_id: "#125$7",
  image: null,
});
const order = ref({
  source_latitude: userLocation ? userLocation.lat : 16.8404,
  source_longitude: userLocation ? userLocation.lng : 96.1725,
  source_address: userLocation ? userLocation.address : null,
  source_phone: user?.phone || null,
  dest_latitude: userLocation ? userLocation.lat : 16.8404,
  dest_longitude: userLocation ? userLocation.lng : 96.1725,
  dest_address: userLocation ? userLocation.address : null,
  dest_phone: user?.phone || null,
  order_type: "errand",
  order_number: useRandomOrderNumber(),
  restaurant_id: null,
  customer_id: user.id,
  rider_id: null,
  total_price: null,
  delivery_fee: deliveryFee.value,
  service_fee: serviceFee.value,
  payment_id: null,
  payment_status: null,
  order_status: "pending",
  delivery_status: "pending",
  user_note: null,
  item_type: null,
});

const getPayments = async () => {
  try {
    const res = await api.get("payments");
    payments.value = res.data;
  } catch (err) {
    console.log(err.response.data?.error);
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

const submitOrder = async (payStatus) => {
  errorMessage.value = null;

  order.value.payment_id = payment.value?.id;
  order.value.payment_status = payStatus;
  order.value.delivery_fee = deliveryFee.value;
  order.value.service_fee = serviceFee.value;
  try {
    const res = await api.post("/auth/orders/express/new", order.value);
    const orderId = res.data.orderId;
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
    alert("အောင်မြင်ပါသည်။");
    router.push("/");
  } catch (err) {
    if (err.response && err.response.status === 422) {
      errorMessage.value = err.response.data.error;
      console.log("Validation Errors:");
      console.error(err.response.data.errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      console.error("API Error:", err.response?.data?.error || err.message);
    }
  }
}

const handleMapUpdateForSource = (updatedData) => {
  order.value.source_latitude = updatedData.lat;
  order.value.source_longitude = updatedData.lng;
  order.value.source_address = updatedData.address;
};

const handleMapUpdateForDest = (updatedData) => {
  order.value.dest_latitude = updatedData.lat;
  order.value.dest_longitude = updatedData.lng;
  order.value.dest_address = updatedData.address;
};

const initAutocompleteForSource = () => {
  const input = document.getElementById("address-source");
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "MM" },
    fields: ["geometry", "formatted_address"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      // to show map immediately when listen autocomplete
      showSourceMap.value = true;

      order.value.source_latitude = place.geometry.location.lat();
      order.value.source_longitude = place.geometry.location.lng();
      order.value.source_address = place.formatted_address;
    }
  });
};

const initAutocompleteForDest = () => {
  const input = document.getElementById("address-dest");
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "MM" },
    fields: ["geometry", "formatted_address"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      // to show map immediately when listen autocomplete
      showDestMap.value = true;

      order.value.dest_latitude = place.geometry.location.lat();
      order.value.dest_longitude = place.geometry.location.lng();
      order.value.dest_address = place.formatted_address;
    }
  });
};

watch(
  () => [
    order.value.source_latitude,
    order.value.source_longitude,
    order.value.dest_latitude,
    order.value.dest_longitude,
  ],
  async ([newSrcLat, newSrcLng, newDestLat, newDestLng]) => {
    if (newSrcLat && newSrcLng && newDestLat && newDestLng) {
      const fee = await calculateDeliveryFee(
        newSrcLat,
        newSrcLng,
        newDestLat,
        newDestLng
      );
      deliveryFee.value = fee || 1000;
    }
  },
  { immediate: true }
);

onMounted(() => {
  initAutocompleteForSource();
  initAutocompleteForDest();
  getPayments();
});
</script>
<style scoped>
.card{
  background: linear-gradient(rgb(16, 168, 105) 3%, transparent 20%, transparent 20%);
}
.header-text{
  margin-left: -20px;
}
</style>
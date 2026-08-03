<template>
  <restaurant-navbar>
    <v-container>
      <v-row>
        <v-col cols="12">
            <div v-if="errorMessage" class="mx-auto" style="max-width: 700px;">
                <alert :message="errorMessage" type="warning" color="red-accent-4"  />
            </div>
          <v-card max-width="700" class="mx-auto">

            <v-card-text class="mt-4">

              <!-- for customer address -->
              <div class="destination">
                <!-- to show map to move pin -->
                <v-expand-transition>
                  <pure-mini-map
                    v-show="showMap"
                    :lat="orderLocation.lat"
                    :lng="orderLocation.lng"
                    @map-dragged="handleMapUpdate"
                    @close-map="showMap = false"
                  />
                </v-expand-transition>

                <!-- to type new address for order -->
                <v-text-field
                  v-model="orderLocation.address"
                  label="ပစ္စည်းလက်ခံမည့် customer လိပ်စာ"
                  prepend-inner-icon="mdi-map-marker"
                  variant="outlined"
                  density="comfortable"
                  id="address-input"
                  placeholder="ရှာဖွေရန် နေရာရိုက်ပါ..."
                  @focus="showMap = true"
                  class="mb-3"
                  :rules="[rules.required('customer address')]"
                ></v-text-field>
                <!-- <span
                  >{{ orderLocation.lat }}, {{ orderLocation.lng }}</span
                > -->
                <v-text-field
                  v-model="destPhone"
                  label="ပစ္စည်းလက်ခံမည့် customer ဖုန်းနံပါတ်"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  density="comfortable"
                  placeholder="09xxxxxxxxx"
                  class="mb-3"
                  :rules="[rules.required('customer phone number'), rules.phone]"
                ></v-text-field>
              </div>

              <!-- order summary -->
              <div>
                <p class="text-subtitle-1 font-weight-bold">Summary</p>
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

    <alert-dialog 
        :openAlertDialog="openAlertDialog" 
        :message="successMessage" 
        @closeAlertDialog="openAlertDialog=false" 
    />
    
  </restaurant-navbar>
</template>

<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import api from "@/services/api";
import { rules } from "@/services/rules";
import { onMounted, ref, watch } from "vue";
import { useRandomOrderNumber } from "@/composables/useRandomOrderNumber";
import { useDelivery } from "@/composables/useDelivery";
import PureMiniMap from "@/components/PureMiniMap.vue";
import Alert from "@/components/Alert.vue";
import AlertDialog from "@/components/AlertDialog.vue";

const restaurant = JSON.parse(localStorage.getItem('user'));
const order = ref({});
const orderLocation = ref({
    lat: 16.8409,
    lng: 96.1735,
    address: ""
});
const deliveryFee = ref(1000);
const serviceFee = ref(100);
const destPhone = ref(null);
const { calculateDeliveryFee } = useDelivery();
const showMap = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);
const openAlertDialog = ref(false);
const cashPaymentId =ref(null);

const getCashPaymentId = async() => {
  const res = await api.get('/payments');
  const payments = res.data;
  const payment = payments.find(payment => payment.name == 'cash');
  cashPaymentId.value = payment.id;
}

const makeOrder = async () => {
    errorMessage.value = null;
    order.value = {
        order_number: useRandomOrderNumber(),
        restaurant_id: restaurant.id,
        customer_id: null,
        rider_id: null,
        order_type: 'merchant',
        dest_latitude: orderLocation.value.lat,
        dest_longitude: orderLocation.value.lng,
        dest_address: orderLocation.value.address,
        dest_phone: destPhone.value,
        delivery_fee: deliveryFee.value,
        service_fee: serviceFee.value,
        payment_id: cashPaymentId.value,
        payment_status: 'accepted',
        delivery_status: 'pending',
        order_status: 'accepted'
    };
    try{
        const res = await api.post('/auth/restaurant/orders/merchant/new', order.value);
        console.log(res.data.message);
        successMessage.value = res.data.message;
        openAlertDialog.value = true;
    }catch(err){
        console.log(err.response.data.error);
        errorMessage.value = err.response.data.message;
    }

}

onMounted(() => {
    initAutocomplete();
    getCashPaymentId();
});

watch(
  () => [orderLocation.value.lat, orderLocation.value.lng],
  async ([newLat, newLng]) => {
    if (newLat && newLng) {
      const fee = await calculateDeliveryFee(
        newLat,
        newLng,
        restaurant.latitude,
        restaurant.longitude
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

// change order location by moving pin in the map
const handleMapUpdate = (updatedData) => {
  orderLocation.value.lat = updatedData.lat;
  orderLocation.value.lng = updatedData.lng;
  orderLocation.value.address = updatedData.address;
};

</script>

<style scoped>

</style>
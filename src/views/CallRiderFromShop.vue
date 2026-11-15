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
                  :label="$t('call-rider.label.dest-address')"
                  prepend-inner-icon="mdi-map-marker"
                  variant="outlined"
                  density="comfortable"
                  id="address-input"
                  :placeholder="$t('call-rider.placeholder.dest-address')"
                  @focus="showMap = true"
                  class="mb-3"
                  :rules="[rules.required('customer address')]"
                ></v-text-field>
                <!-- <span
                  >{{ orderLocation.lat }}, {{ orderLocation.lng }}</span
                > -->

                <v-textarea
                  v-model="order.dest_address"
                  :label="$t('call-rider.label.dest-address-details')"
                  prepend-inner-icon="mdi-home-map-marker"
                  variant="outlined"
                  density="comfortable"
                  :placeholder="$t('call-rider.placeholder.dest-address-details')"
                  class="mb-3"
                  persistent-placeholder
                  :rules="[rules.required('destination address in details')]"
                ></v-textarea>

                <!-- Destination Type Selection -->
                <div class="my-3">
                  <p class="text-subtitle-2 font-weight-bold mb-2">
                    {{ $t('call-rider.destination-type') }}
                  </p>
                  <v-btn-toggle
                    v-model="order.dest_type"
                    mandatory
                    color="green-darken-2"
                    variant="outlined"
                    class="w-100 d-flex"
                  >
                    <v-btn
                      v-for="item in destinationTypes"
                      :key="item.value"
                      :value="item.value"
                      class="flex-grow-1"
                    >
                      <v-icon class="mr-1">{{ item.icon }}</v-icon>
                      {{ item.label }}
                    </v-btn>
                  </v-btn-toggle>
                </div>

                <!-- showing alert when chosen destination type is gate  -->
                <v-alert
                  v-if="order.dest_type === 'express_gate'"
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="mt-2 text-caption"
                >
                  <v-icon size="small">mdi-information</v-icon>
                  {{ $t('call-rider.destination-type-alert') }}
                </v-alert>
              </div>

                <v-text-field
                  v-model="destPhone"
                  :label="$t('call-rider.label.dest-phone')"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  density="comfortable"
                  placeholder="09xxxxxxxxx"
                  class="mb-3"
                  :rules="[rules.required('customer phone number'), rules.phone]"
                ></v-text-field>

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
                            {{ $t('call-rider.summary.delivery-fee') }}</span
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
                          <span class="text-body-small"> {{ $t('call-rider.summary.service-fee') }}</span>
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
                        >{{ $t('call-rider.total') }}</span
                      > ({{ $t('call-rider.tax') }})
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
                    <p class="text-wrap text-subtitle-1 py-3">{{ $t('call-rider.button.confirm') }}</p>
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
import router from "@/router";

const restaurant = JSON.parse(localStorage.getItem('user'));
// Destination Type options
const destinationTypes = [
  { label: "Home", value: "home", icon: "mdi-home-outline" },
  { label: "Express Gate", value: "express_gate", icon: "mdi-bus-clock" },
];
const order = ref({
  'dest_address': null,
  dest_type: 'home'
});
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
        dest_address: order.value.dest_address,
        dest_type: order.value.dest_type,
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
         router.push('/restaurant');
    }catch(err){
        console.log(err.response.data.error);
        errorMessage.value = err.response.data.message;
    }

}

const isWayOrder = ref(false);
const checkWayOrder = async () => {
  try {

    const res = await api.post('auth/restaurant/check-way-order', {
      restaurant_id: restaurant.id,
      source_latitude: restaurant.latitude,
      source_longitude: restaurant.longitude,
      current_order_id: null
    });
    console.log('API Response success:', res.data);
    if(res.data.is_way_order){
      isWayOrder.value = true;
      deliveryFee.value = Number(res.data.delivery_fee);
    }else{
      isWayOrder.value = false;
      calculateFeeBasedOnDistance(
        restaurant.latitude,
        restaurant.longitude,
        orderLocation.value.lat, 
        orderLocation.value.lng
      );
    }
    
  } catch (err) {
    console.log('API Error caught:', err.response?.data || err.message);
  }
};

const calculateFeeBasedOnDistance = async (
  srcLat,
  srcLng,
  destLat,
  destLng
) => {
  if (isWayOrder.value) return;
  if (srcLat && srcLng) {
    const fee = await calculateDeliveryFee(srcLat, srcLng, destLat, destLng);
    deliveryFee.value = fee || 1000;
  }
};

watch(
  () => [orderLocation.value.lat, orderLocation.value.lng],
  async () => {
    await checkWayOrder();
  }
);

onMounted(() => {
  checkWayOrder();
  initAutocomplete();
  getCashPaymentId();
});

// watch(
//   () => [orderLocation.value.lat, orderLocation.value.lng],
//   async ([newLat, newLng]) => {
//     if (newLat && newLng) {
//       if(!isWayOrder.value){
//         const fee = await calculateDeliveryFee(
//           newLat,
//           newLng,
//           restaurant.latitude,
//           restaurant.longitude
//         );
//         deliveryFee.value = fee || 1000;
//       }
      
//     }
//   },
//   { immediate: true }
// );


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
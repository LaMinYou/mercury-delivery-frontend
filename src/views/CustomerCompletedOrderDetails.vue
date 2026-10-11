<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <div class="d-flex justify-start mt-4">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/customer/completed-orders')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4 rounded-xl elevation-2">
          <v-card-title class="font-weight-bold text-subtitle-2 text-green-darken-3 mb-3">
            Order Details (#{{ order.order_number }})
          </v-card-title>
          
          <v-divider class="mb-4"></v-divider>

          <!-- Delivery Status & Info -->
          <div class="mb-4">
            <span class="font-weight-bold text-body-2 text-green-darken-2">Destination Type: </span>
            <v-chip size="small" :color="order.dest_type === 'express_gate' ? 'indigo' : 'green'" class="text-white">
              {{ order.dest_type === 'express_gate' ? 'Express Gate' : 'Home' }}
            </v-chip>
          </div>

          <!-- Express Gate Invoice Photos Section -->
          <v-card 
            v-if="order.dest_type === 'express_gate' && order.invoice_photos?.length > 0" 
            variant="outlined" 
            class="pa-3 my-3 bg-grey-lighten-5 rounded-lg border-dashed"
          >
            <div class="text-subtitle-2 font-weight-bold mb-2 text-indigo-darken-2 d-flex align-center">
              <v-icon color="indigo" class="mr-1">mdi-file-image</v-icon>
              Invoice / Receipt
            </div>
            
            <div class="d-flex flex-wrap ga-3">
              <v-img
                v-for="photo in order.invoice_photos"
                :key="photo.id"
                :src="photo.image_url" 
                width="90"
                height="90"
                cover
                class="rounded-lg cursor-pointer border elevation-1"
                @click="openImageDialog=true;invoice=photo.image_url"
              ></v-img>
            </div>
          </v-card>

          <div class="text-body-2 text-grey-darken-2 mt-4">
            <p><strong>Date:</strong> {{ formatDate(order.updated_at) }}</p>
            <p><strong>Rider:</strong> {{ order.rider?.name }} ({{ order.rider?.phone }})</p>
            <p><strong>Delivery Fee:</strong> {{ order.delivery_fee }} MMK</p>
            <p><strong>Service Fee:</strong> {{ order.service_fee }} MMK</p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    <image-dialog
      :dialogImgUrl="invoice"
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
import ImageDialog from "@/components/ImageDialog.vue";
import { formatDate } from "@/composables/dateTimeHelper";

const props = defineProps(["id"]);
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const openImageDialog = ref(false);
const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");
const order = ref({});
const invoice = ref(null);

const fetchOrder = async () => {
  try {
    const res = await api.get(`auth/customer/orders/${props.id}`);
    order.value = res.data;
  } catch (error) {
    console.error("Fetch Error:", error);
  }
};

onMounted(async () => {
  await fetchOrder();
});


</script>

<style scoped>

</style>
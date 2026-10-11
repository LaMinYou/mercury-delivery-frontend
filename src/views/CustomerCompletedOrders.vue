<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <v-container fluid>
      <v-row v-if="completedOrders && completedOrders.length > 0">
        <v-col cols="12" v-if="completedOrders">
          <v-card
            class="mb-2 mx-auto"
            v-for="order in completedOrders"
            :key="order.id"
            max-width="900"
            @click="router.push(`/customer/completed-orders/${order.id}`)"
          >
            <v-card-text class="d-flex justify-space-between align-center">
              <div>
                 <span>#{{ order.order_number }}</span>
                 <p class="text-grey text-caption mb-3">
                  <v-icon>{{ order.order_type == 'food' ? 'mdi-food' : 'mdi-zip-box' }}</v-icon>
                  {{ order.order_type == 'food' ? 'Food & Others' : 'Express' }}
                 </p>
                <v-chip
                :color="getStatusColor(order.delivery_status)"
                size="small"
                class="font-weight-bold"
              >
                {{ order.delivery_status }}
              </v-chip>
              </div>

              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                class="cursor-pointer"
                @click.stop="showOrderItems(order)"
              ></v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" v-else>
          <div class="text-center pa-5 text-grey">
            လက်ရှိမှာယူထားသော အော်ဒါမရှိပါခင်ဗျာ။
          </div>
        </v-col>
      </v-row>
      <v-row v-else>
        <div class="pa-5 text-center text-grey w-100">
          <v-icon size="40" class="mb-2">mdi-folder-open-outline</v-icon>
          <div>There is no order history.</div>
        </div>
      </v-row>
    </v-container>
    <div v-if="openOrderItemDialog">
      <customer-order-items
      :order="selectedOrder"
      :openOrderItemDialog="openOrderItemDialog"
      @closeOrderItemDialog="openOrderItemDialog = false"
    />
    </div>
  </customer-navbar>
</template>
<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CustomerOrderItems from "@/components/CustomerOrderItems.vue";

const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");

const router = useRouter();
const completedOrders = ref([]);
const openOrderItemDialog = ref(false);
const selectedOrder = ref(null);


const getStatusColor = (status) => {
  if (status === "pending") return "orange";
  if (status === "picking") return "blue";
  if (status === "delivering") return "green";
  return "grey";
};

const getCompletedOrders = async () => {
  const res = await api.get("/auth/customer/completed-orders");
  completedOrders.value = res.data;
};

const showOrderItems = (orderItem) => {
  selectedOrder.value = orderItem;
  openOrderItemDialog.value = true;
};

onMounted(() => {
  getCompletedOrders();
});
</script>
<style scoped>
</style>
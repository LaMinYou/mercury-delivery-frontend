<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <v-container fluid>
      <v-row v-if="currentOrders && currentOrders.length > 0">
        <v-col cols="12" v-if="currentOrders">
          <v-card class="mb-2 mx-auto" v-for="order in currentOrders" :key="order.id" max-width="900" @click="router.push(`/customer/orders/${order.id}`)">
            <v-card-text class="d-flex justify-space-between align-center">
              <span>#{{ order.order_number }}</span>
              <v-chip
                :color="getStatusColor(order.delivery_status)"
                size="small"
                class="font-weight-bold"
              >
                {{ order.delivery_status }}
              </v-chip>
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
          <div>
            There is no current orders yet.
          </div>
        </div>
      </v-row>
    </v-container>
  </customer-navbar>
</template>
<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import echo from "@/services/echo";
import { useRouter } from "vue-router";

const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");

const router = useRouter();
const currentOrders = ref([]);
const customer = ref({
  id: 1,
});

const listenToRiderDeliveryStatus = (customerId) => {
  console.log(
    `customers.${customerId} Channel သို့ ချိတ်ဆက်စောင့်ကြည့်နေပါသည်..`
  );

  echo
    .channel(`customers.${customerId}`)
    .listen(".RiderDeliverStatusUpdated", (data) => {
      console.log("အော်ဒါ Live တန်းကျလာပါပြီဗျာ-", data.order);

      let index = currentOrders.value.findIndex((o) => o.id == data.order.id);
      if (index !== -1) {
        if (data.order.delivery_status === "completed") {
          currentOrders.value.splice(index, 1);
        } else {
          currentOrders.value[index] = data.order;
        }
      }
    })
    .error((error) => {
      console.error("Reverb ချိတ်ဆက်မှု အဆင်မပြေပါ-", error);
    });
};

const getStatusColor = (status) => {
  if (status === "pending") return "orange";
  if (status === "picking") return "blue";
  if (status === "delivering") return "green";
  return "grey";
};

const getCurrentOrders = async () => {
  const res = await api.get("/auth/customer/current-orders");
  currentOrders.value = res.data;
};

onMounted(() => {
  getCurrentOrders();
  listenToRiderDeliveryStatus(customer.value.id);
});
</script>
<style scoped>
</style>
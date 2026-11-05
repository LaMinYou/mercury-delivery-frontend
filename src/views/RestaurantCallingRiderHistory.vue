<template>
  <restaurant-navbar>
    <v-container fluid>
      <v-row v-if="completedOrders && completedOrders.length > 0" style="max-height: 500px;overflow-y: auto;">
        <v-col cols="12" v-if="completedOrders">
          <v-card
            class="mb-2 mx-auto"
            v-for="order in completedOrders"
            :key="order.id"
            max-width="900"
            @click="router.push(`/restaurant/call-rider-history/${order.id}`)"
          >
            <v-card-text class="d-flex justify-space-between align-center">
              <div>
                 <span>#{{ order.order_number }}</span>
                <v-chip
                color="green"
                size="small"
                class="font-weight-bold"
              >
                {{ order.delivery_status }}
              </v-chip>
              <div class="text-red">
                <v-icon>
                    {{ order.dest_type == 'home'? 'mdi-home-outline' : 'mdi-bus-clock' }}
                </v-icon>
                {{ order.dest_type == 'home'? 'Home' : 'Express Gate' }}
              </div>
              </div>

              <div>
                <p>{{ formatDate(order.updated_at) }}</p>
                
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <div class="pa-5 text-center text-grey w-100">
          <v-icon size="40" class="mb-2">mdi-folder-open-outline</v-icon>
          <div>There is no calling history.</div>
        </div>
      </v-row>
    </v-container>
  </restaurant-navbar>
</template>
<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { formatDate } from "@/composables/dateTimeHelper";

const router = useRouter();
const completedOrders = ref([]);
const selectedOrder = ref(null);


const getStatusColor = (status) => {
  if (status === "pending") return "orange";
  if (status === "picking") return "blue";
  if (status === "delivering") return "green";
  return "grey";
};

const getCompletedOrders = async () => {
  const res = await api.get("/auth/restaurant/rider-call-order-history");
  completedOrders.value = res.data;
};

onMounted(() => {
  getCompletedOrders();
});
</script>
<style scoped>
</style>
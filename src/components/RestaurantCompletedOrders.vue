<template>
  <v-container fluid>
    <v-row class="mb-2">
      <v-col cols="12" sm="6" class="pr-2">
        <v-card class="pa-3 text-center">
          <v-icon color="green-darken-2" size="17" class="mb-1"
            >mdi-wallet</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Total Wallet
          </div>
          <div class="text-subtitle-1 font-weight-black text-green-darken-3">
            {{ totalEarnings }} MMK
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="orange-darken-2" size="17" class="mb-1"
            >mdi-store</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Total Orders
          </div>
          <div class="text-subtitle-1 font-weight-black text-orange-darken-2">
            {{ totalOrderCount }} 
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-3">
      <v-col cols="12">
        <v-tabs
          v-model="activeFilter"
          bg-color="transparent"
          color="green-darken-2"
          grow
          density="compact"
          @update:model-value="handleFilterChange"
        >
          <v-tab
            value="this_week"
            class="rounded-pill font-weight-bold text-body-2 text-wrap"
            >this week</v-tab
          >
          <v-tab
            value="last_week"
            class="rounded-pill font-weight-bold text-body-2 text-wrap"
            >last week</v-tab
          >
          <v-tab
            value="this_month"
            class="rounded-pill font-weight-bold text-body-2 text-wrap"
            >this month</v-tab
          >
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="pa-0">
        <div v-if="isAdmin" class="d-flex justify-end align-center mb-3">
          <v-btn
            color="green-darken-3"
            :disabled="selectedItems.length === 0"
            variant="text"
            class="font-weight-bold"
            @click="handleBulkSettle"
          >
            Mark as Paid for {{ selectedItems.length }} Items
          </v-btn>
        </div>
        <v-card
          class="elevation-1 bg-white overflow-hidden bg-transparent"
          flat
        >
          <v-data-table
            v-model="selectedItems"
            :items-per-page="-1"
            :headers="headers"
            :items="serverItems"
            :show-select="isAdmin"
            color="green-darken-3"
            item-value="id"
            :loading="loading"
            hide-default-footer
            class="w-100 modern-table"
            fixed-header
          >
            <template v-slot:loading>
              <v-progress-linear
                indeterminate
                color="green-darken-2"
                height="2"
              ></v-progress-linear>
            </template>

            <template v-slot:item.total_price="{ item }">
              <span class="font-weight-bold text-green-darken-3">
                +{{ item.total_price }}
              </span>
              <span class="ms-5">
                <v-chip :color="item.is_shop_settled ? 'green' : 'red'">{{ item.is_shop_settled ? 'paid' : 'unpaid' }}</v-chip>
              </span>
            </template>

            <template v-slot:item.created_at="{ item }">
              <span class="text-caption text-grey-darken-2">
                {{ formatTime(item.created_at) }}
              </span>
            </template>

            <template v-slot:no-data>
              <div class="pa-5 text-center text-grey">
                <v-icon size="40" class="mb-2">mdi-folder-open-outline</v-icon>
                <div>ဤအပိုင်းတွင် အော်ဒါမှတ်တမ်း မရှိသေးပါ။</div>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import { formatDistanceToNow } from "date-fns";

const props = defineProps(['id']);
const headers = [
  {
    title: "Order No.",
    key: "order_number",
    sortable: false,
    class: "font-weight-bold",
  },
  { title: "Fee (MMK)", key: "total_price", sortable: false },
  { title: "Date/Time", key: "created_at", align: "end", sortable: false },
];

const selectedItems = ref([]);
const serverItems = ref([]);
const loading = ref(false);
const activeFilter = ref("this_week");

const totalOrderCount = computed(() => serverItems.value.length);

const totalEarnings = computed(() => {
  return serverItems.value.reduce(
    (sum, item) => sum + Number(item.total_price || 0),
    0
  );
});

const fetchAllHistory = async () => {
  loading.value = true;
  try {
    const res = await api.get("auth/restaurant/order-history", {
      params: { filter: activeFilter.value, restaurantId: props.id },
    });
    serverItems.value = res.data;
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = () => {
  fetchAllHistory();
};

const formatTime = (dateString) => {
  if (!dateString) return;
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

const isAdmin = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user.role_id == 1;
})

const handleBulkSettle = async () => {
  try{
    const res = await api.patch('auth/admin/orders/update-shop-settle', { order_ids: selectedItems.value });
    selectedItems.value = [];
    fetchAllHistory();
  }catch(err){
    console.log(err.response.data.message);
  }
}

onMounted(() => {
  fetchAllHistory();
});
</script>

<style scoped>
.modern-table :deep(.v-table__wrapper){
    max-height: 500px;
    overflow-y: auto;
}
</style>
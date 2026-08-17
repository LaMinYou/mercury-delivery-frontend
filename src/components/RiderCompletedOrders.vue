<template>
  <v-container fluid>
    <v-row class="mb-2">
      <v-col cols="12" sm="6" md="3" class="pr-2">
        <v-card class="pa-3 text-center">
          <v-icon color="green-darken-2" size="17" class="mb-1"
            >mdi-wallet</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Delivery Fee (Digital)
          </div>
          <div class="text-subtitle-1 font-weight-black text-green-darken-3">
            {{ totalDigitalEarnings }} MMK
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pr-2">
        <v-card class="pa-3 text-center">
          <v-icon color="green-darken-2" size="17" class="mb-1"
            >mdi-wallet</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Delivery Fee (COD)
          </div>
          <div class="text-subtitle-1 font-weight-black text-green-darken-3">
            {{ totalCODEarnings }} MMK
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="green-darken-2" size="17" class="mb-1"
            >mdi-wallet</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Cash Service Fee
          </div>
          <div class="text-subtitle-1 font-weight-black text-green-darken-3">
            {{ totalCashServiceFees }} MMK
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="green-darken-2" size="17" class="mb-1"
            >mdi-wallet</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Cash Collection for Shops
          </div>
          <div class="text-subtitle-1 font-weight-black text-green-darken-3">
            {{ totalCashCollection }} MMK
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="orange-darken-2" size="17" class="mb-1"
            >mdi-bike</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Total Orders
          </div>
          <div class="text-subtitle-1 font-weight-black text-orange-darken-2">
            {{ totalOrderCount }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="orange-darken-2" size="17" class="mb-1"
            >mdi-zip-box</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Errand Orders
          </div>
          <div class="text-subtitle-1 font-weight-black text-orange-darken-2">
            {{ totalErrandOrderCount }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="orange-darken-2" size="17" class="mb-1"
            >mdi-store-marker</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Merchant Orders
          </div>
          <div class="text-subtitle-1 font-weight-black text-orange-darken-2">
            {{ totalMerchantOrderCount }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3" class="pl-2">
        <v-card class="pa-3 text-center">
          <v-icon color="orange-darken-2" size="17" class="mb-1"
            >mdi-food</v-icon
          >
          <div class="text-caption text-grey-darken-1 font-weight-medium">
            Food & Other Orders
          </div>
          <div class="text-subtitle-1 font-weight-black text-orange-darken-2">
            {{ totalOtherOrderCount }}
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
            :loading="loading"
            :show-select="isAdmin"
            color="green-darken-3"
            item-value="id"
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

            <template v-slot:item.delivery_fee="{ item }">
              <span class="font-weight-bold text-green-darken-3">
                +{{ item.delivery_fee }}
              </span>
              <span class="ms-5">
                <v-chip :color="item.is_settled ? 'green' : 'red'">{{ item.is_settled ? 'paid' : 'unpaid' }}</v-chip>
              </span>
            </template>

            <template v-slot:item.payment.name="{ item }">
              <v-chip
                :color="item.payment.name == 'cash' ? 'secondary' : 'red'"
                class="font-weight-bold"
              >
                {{ item.payment.name }}
              </v-chip>
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

const props = defineProps(["id"]);
const headers = [
  {
    title: "Order No.",
    key: "order_number",
    sortable: false,
    class: "font-weight-bold",
  },
  { title: "Delivery Fee (MMK)", key: "delivery_fee", sortable: false },
  { title: "Payment Type", key: "payment.name", sortable: false },
  { title: "Date/Time", key: "created_at", align: "end", sortable: false },
];

const serverItems = ref([]);
const selectedItems = ref([]);
const loading = ref(false);
const isAdmin = computed(() => {
  let user = JSON.parse(localStorage.getItem('user'));
  return user.role_id == 1;
})
const activeFilter = ref("this_week");

const totalOrderCount = computed(() => serverItems.value.length);

const totalErrandOrderCount = computed(() => {
  return serverItems.value.filter((item) => item.order_type == "errand").length;
});

const totalMerchantOrderCount = computed(() => {
  return serverItems.value.filter((item) => item.order_type == "merchant")
    .length;
});

const totalOtherOrderCount = computed(() => {
  return serverItems.value.filter((item) => item.order_type == "food").length;
});

const codOrders = computed(() => {
  return serverItems.value.filter((item) => item.payment.name == "cash" && item.is_settled == 0);
});
const digitalOrders = computed(() => {
  return serverItems.value.filter(
    (item) => item.payment.name != "cash" && item.payment_id != null && item.is_settled == 0
  );
});
const totalCODEarnings = computed(() => {
  return codOrders.value.reduce(
    (sum, item) => sum + Number(item.delivery_fee || 0),
    0
  );
});
const totalDigitalEarnings = computed(() => {
  return digitalOrders.value.reduce(
    (sum, item) => sum + Number(item.delivery_fee || 0),
    0
  );
});

const totalCashServiceFees = computed(() => {
  return serverItems.value.filter((item) => item.payment.name == "cash").reduce(
    (sum, item) => sum + Number(item.service_fee || 0),
    0
  );
});

const codFoodOrders = computed(() => {
  return serverItems.value.filter(
    (item) => item.payment.name == "cash" && item.order_type == "food"
  );
});

const totalCashCollection = computed(() => {
  return codFoodOrders.value.reduce(
    (sum, item) => sum + Number(item.total_price || 0),
    0
  );
});

const totalEarnings = computed(() => {
  return serverItems.value.reduce(
    (sum, item) => sum + Number(item.delivery_fee || 0),
    0
  );
});

const fetchAllHistory = async () => {
  loading.value = true;
  try {
    const res = await api.get("auth/rider/order-history", {
      params: { filter: activeFilter.value, riderId: props.id },
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

const handleBulkSettle = async () => {
  try{
    const res = await api.patch('auth/admin/orders/update-settle', { order_ids: selectedItems.value });
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
.modern-table :deep(.v-table__wrapper) {
  max-height: 500px;
  overflow-y: auto;
}
</style>
<template>
  <restaurant-navbar>
    <v-card class="ma-4">
      <v-row class="pa-4" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.name"
            label="Customer"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.contact"
            label="Email or Phone Number"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.level"
            :items="['Diamond', 'Gold', 'Silver', 'All']"
            label="Level"
            density="compact"
            hide-details
            @update:model-value="fetchData"
          />
        </v-col>
      </v-row>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        class="clickable-rows"
        :items-per-page-options="[5, 10, 15]"
        @update:options="fetchData"
      >
        <template #item.phone="{ value }">
          <span>{{ value || "-" }}</span>
        </template>
        <template #item.email="{ value }">
          <span>{{ value || "-" }}</span>
        </template>
        <template #item.level="{ value }">
          <v-icon v-if="value == 'Diamond'" color="light-blue-lighten-2"
            >mdi-diamond-stone</v-icon
          >
          <v-icon v-if="value == 'Gold'" color="amber-lighten-1"
            >mdi-crown</v-icon
          >
          <v-icon v-if="value == 'Silver'" color="grey-lighten-1"
            >mdi-crown</v-icon
          >
        </template>
      </v-data-table-server>
    </v-card>
  </restaurant-navbar>
</template>

<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import { ref, reactive } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const headers = [
  { title: "Name", key: "name", sortable: true },
  { title: "Phone Number", key: "phone", align: "center", sortable: true },
  { title: "Email", key: "email", align: "center", sortable: false },
  { title: "Level", key: "level", align: "center", sortable: true },
  {
    title: "No. of orders",
    key: "customer_orders_count",
    align: "center",
    sortable: true,
  },
];

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(5);
const filters = reactive({ name: "", contact: "", level: "All" });

let timer = null;

const fetchData = async (options = {}) => {
  loading.value = true;

  // Extract all needed values from the Vuetify options object
  const { page, itemsPerPage: currentPerPage, sortBy } = options;

  try {
    const { data } = await api.get("auth/restaurant/customers", {
      params: {
        page: page || 1,
        itemsPerPage: currentPerPage || itemsPerPage.value,
        sortBy: sortBy, // Sends the sorting array to Laravel
        ...filters,
      },
    });
    serverItems.value = data.items;
    totalItems.value = data.total;
  } catch (error) {
    console.error("Fetch Error:", error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetch = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fetchData(), 500);
};
</script>

<style scoped>
</style>
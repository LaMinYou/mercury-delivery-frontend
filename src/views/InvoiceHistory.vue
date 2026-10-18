<template>
  <admin-navbar>
    <v-card class="ma-4">
      <v-row>
        <v-col>
          <v-text-field
            v-model="filters.order_number"
            label="Search invoices by order number..."
            density="compact"
            hide-details
            class="my-5 pa-3"
            @input="debouncedFetch"
          />
        </v-col>
      </v-row>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="fetchInvoices"
      >
        <!-- Order ID -->
        <template #item.order_number="{ item }">
          <span class="font-weight-bold">{{ item.order_number }}</span>
        </template>

        <template #item.created_at="{ item }">
          <span>{{ formatDate(item.created_at) }}</span>
        </template>

        <template #item.invoice_photos="{ item }">
          <div class="d-flex align-center gap-2 py-1" style="flex-wrap: wrap">
            <v-avatar
              v-for="photo in item.invoice_photos"
              :key="photo.id"
              size="50"
              rounded="lg"
              class="border mr-2"
            >
              <v-img :src="photo.image_url" cover alt="Invoice" />
            </v-avatar>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </admin-navbar>
</template>

<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import { ref, reactive } from "vue";
import api from "@/services/api";
import { formatDate } from "@/composables/dateTimeHelper";

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(10);
let timer = null;
const filters = reactive({ order_number: "" });

const headers = [
  {
    title: "Order Number",
    key: "order_number",
    align: "start",
    sortable: true,
  },
  { title: "Invoice Photos", key: "invoice_photos", sortable: false },
  { title: "Date", key: "created_at", sortable: true },
];

const fetchInvoices = async (options = {}) => {
  loading.value = true;
  const { page, itemsPerPage: currentPerPage } = options;

  try {
    const { data } = await api.get("auth/admin/invoice-history", {
      params: {
        page: page || 1,
        itemsPerPage: currentPerPage || itemsPerPage.value,
        ...filters,
      },
    });
    serverItems.value = data.items;
    totalItems.value = data.total;
  } catch (error) {
    console.error("Fetch Invoice Error:", error);
  } finally {
    loading.value = false;
  }
};

const debouncedFetch = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fetchInvoices(), 500);
};
</script>
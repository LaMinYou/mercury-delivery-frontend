<template>
  <admin-navbar>
    <v-card class="ma-4">
      <v-row class="pa-4" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.name"
            label="Rider name"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.status"
            :items="['pending', 'accepted', 'canceled', 'released', 'all']"
            label="Assigned Status"
            density="compact"
            hide-details
            @update:model-value="fetchData"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.dateFilter"
            :items="['week', 'month', 'year', 'all']"
            label="Assigned Date"
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
        :items-per-page-options="[5, 10, 15]"
        @update:options="fetchData"
      >
        <template #item.order.order_number="{ item }">
          <span class="font-weight-bold text-primary">
            # {{ item.order ? item.order.order_number : "N/A" }}
          </span>
        </template>

        <template #item.rider.name="{ item }">
          <span>{{ item.rider ? item.rider.name : "N/A" }}</span>
        </template>

        <template #item.rider.phone="{ item }">
          <span>{{ item.rider ? item.rider.phone : "N/A" }}</span>
        </template>
        <template #item.status="{ value }">
          <v-chip
            :color="value === 'accepted' ? 'success' : 'error'"
            size="x-small"
            class="text-capitalize"
          >
            {{ value }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center g-2">
            <v-btn
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="prepareDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
    <delete-dialog
      v-model="openDialog"
      :item="selectedItem"
      @close="openDialog = false"
      @confirm="confirmDelete"
    />
  </admin-navbar>
</template>

<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import { ref, reactive } from "vue";
import api from "@/services/api";
import DeleteDialog from "@/components/DeleteDialog.vue";

const openDialog = ref(false);
const selectedItem = ref(null);

const headers = [
  { title: "Order No", key: "order.order_number", sortable: true },
  { title: "Rider Name", key: "rider.name", sortable: true },
  {
    title: "Phone Number",
    key: "rider.phone",
    align: "center",
    sortable: true,
  },
  { title: "Status", key: "status", align: "center", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(5);
const filters = reactive({ name: "", status: "all", dateFilter: "all" });

let timer = null;

const fetchData = async (options = {}) => {
  loading.value = true;

  // Extract all needed values from the Vuetify options object
  const { page, itemsPerPage: currentPerPage, sortBy } = options;

  try {
    const { data } = await api.get("auth/admin/delivery-assigned-history", {
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

const prepareDelete = (item) => {
  selectedItem.value = item;
  openDialog.value = true;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    const res = await api.delete(`auth/admin/delivery-assigned-history/${selectedItem.value.id}`);
    openDialog.value = false;
    await fetchData();
  } catch (err) {
    console.error("Delete failed:", err);
  }
  loading.value = false;
};
</script>

<style scoped>
</style>
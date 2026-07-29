<template>
  <admin-navbar>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="my-2 float-right ma-4"
          color="green-darken-3"
          size="large"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="router.push('/admin/menu-category/' + 'new')"
        >
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-4">
      <v-row class="pa-4" dense>
        <v-col cols="12">
          <v-text-field
            v-model="filters.name"
            label="Name"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
      </v-row>

      <v-data-table-server
        class="text-capitalize"
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="serverItems"
        :items-length="totalItems"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="fetchData"
      >
        <template #item.index="{ index }">
          {{ (currentPage - 1) * itemsPerPage + index + 1 }}
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex justify-center g-2">
            <v-btn
              icon
              variant="text"
              color="blue-darken-2"
              size="small"
              @click="editCategory(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Edit</v-tooltip>
            </v-btn>

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
import { useRouter } from "vue-router";
import DeleteDialog from "@/components/DeleteDialog.vue";

const router = useRouter();
const openDialog = ref(false);
const selectedItem = ref(null);

const headers = [
  { title: "No.", key: "index", sortable: false },
  { title: "Menu Categories", key: "name", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(5);
const filters = reactive({ name: "" });

let timer = null;
const currentPage = ref(1); // မျက်နှာစာမျက်နှာကို သိမ်းရန်

const fetchData = async (options = {}) => {
  loading.value = true;

  // Extract all needed values from the Vuetify options object
  const { page, itemsPerPage: currentPerPage, sortBy } = options;

  // လက်ရှိ page ကို သိမ်းလိုက်ပါ
  currentPage.value = page || 1;

  try {
    const { data } = await api.get("auth/admin/menu-categories", {
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

const editCategory= (item) => {
  const id = item.id;
  router.push("/admin/menu-category/" + id);
};

const toggleBlockRestaurant = async (item) => {
  try {
    const res = await api.post(
      "auth/admin/restaurants/updatestatus/" + item.id
    );
    fetchData();
  } catch (err) {
    console.log(err);
  }
};

const prepareDelete = (item) => {
  selectedItem.value = item;
  openDialog.value = true;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    const res = await api.delete(
      `auth/admin/restaurants/${selectedItem.value.id}`
    );
    openDialog.value = false;
    await fetchData();
  } catch (err) {
    console.error("Delete failed:", err);
  }
  loading.value = false;
};
</script>
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
          @click="router.push('/admin/tag/' + 'new')"
        >
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-4">
      <div v-if="errorMessage" class="mx-auto mb-3" style="width: 100%">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
      </div>
      <v-row class="pa-4 my-3" dense>
        <v-col cols="12">
          <v-text-field
            v-model="filters.name"
            label="Tag name"
            density="compact"
            hide-details
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
        @update:options="fetchData"
      >
        <template #item.image="{ item }">
          <v-avatar size="45" rounded="lg" border>
            <v-img :src="item.image_url" cover alt="Menu Image">
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon color="grey-lighten-2">mdi-food</v-icon>
                </div>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center g-2">
            <v-btn
              icon
              variant="text"
              color="blue-darken-2"
              size="small"
              @click="editTag(item)"
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
import Alert from "@/components/Alert.vue";

const router = useRouter();
const openDialog = ref(false);
const selectedItem = ref(null);
const errorMessage = ref("");

const headers = [
  { title: "Image", key: "image", align: "start", sortable: false },
  { title: "Tag Name", key: "name", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(5);
const filters = reactive({
  name: "",
});

let timer = null;

const fetchData = async (options = {}) => {
  loading.value = true;

  // Extract all needed values from the Vuetify options object
  const { page, itemsPerPage: currentPerPage, sortBy } = options;

  try {
    const { data } = await api.get(`auth/admin/tags`, {
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

const editTag = (item) => {
  const id = item.id;
  router.push("/admin/tag/" + id);
};

const prepareDelete = (item) => {
  selectedItem.value = item;
  openDialog.value = true;
};

const confirmDelete = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    const res = await api.delete(`auth/admin/tags/${selectedItem.value.id}`);
    await fetchData();
  } catch (err) {
    console.error("Delete failed:", err);
    errorMessage.value =
      err.response.data.error ||
      err.response.data.message ||
      "Unable to connect to server";
  }
  openDialog.value = false;
  loading.value = false;
};
</script>
<template>
  <restaurant-navbar>
    <v-row>
      <v-col cols="12">
        <v-btn
          class="my-2 float-right ma-4"
          color="green-darken-3"
          size="large"
          variant="elevated"
          prepend-icon="mdi-plus"
          @click="router.push('/restaurant/menu/' + 'new')"
        >
          Add New
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="ma-4">
      <v-row class="pa-4 my-3" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.title"
            label="Menu Title"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.subtitle"
            label="Menu Subtitle"
            density="compact"
            hide-details
            @input="debouncedFetch"
          />
        </v-col>
        <v-col cols="12" md="4">
          <!-- <v-select
            v-model="filters.status"
            :items="['active', 'inactive', 'all']"
            label="Status"
            density="compact"
            hide-details
            @update:model-value="fetchData"
          /> -->
          <v-select
            v-model="filters.category_id"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Find by Category"
            density="compact"
            hide-details
            @update:model-value="fetchData()"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="filters.discount"
            :items="['All', 'Discount Menus']"
            label="Find Discounted Menus"
            density="compact"
            hide-details
            @update:model-value="fetchData()"
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

        <template #item.category_id="{ item }">
          <span class="text-capitalize">
            {{ item.category_id ? item.category.name : "no category" }}
          </span>
        </template>

        <template #item.price="{ item }">
          <span
            :class="{
              'text-decoration-line-through text-grey': item.discount_price,
            }"
          >
            {{ item.price }} MMK
          </span>
        </template>

        <template #item.discount_price="{ item }">
          {{ item.discount_price ? item.discount_price + " MMK" : "-" }}
        </template>

        <template #item.is_available="{ item }">
          <v-chip
            :color="item.is_available == 1 ? 'green' : 'red'"
            size="small"
          >
            {{ item.is_available == 1 ? "Available" : "Unavailable" }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center g-2">
            <v-btn
              icon
              variant="text"
              color="blue-darken-2"
              size="small"
              @click="editMenu(item)"
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
  </restaurant-navbar>
</template>

<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import { ref, reactive, onMounted } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import DeleteDialog from "@/components/DeleteDialog.vue";

const router = useRouter();
const openDialog = ref(false);
const selectedItem = ref(null);

const headers = [
  { title: "Image", key: "image", align: "start", sortable: false },
  { title: "Title", key: "title", sortable: true },
  { title: "Subtitle", key: "subtitle", sortable: true },
  { title: "Category", key: "category_id", align: "center", sortable: true },
  {
    title: "Available Numbers",
    key: "available_count",
    align: "center",
    sortable: true,
  },
  { title: "Price", key: "price", align: "center", sortable: true },
  { title: "Discount", key: "discount_price", align: "center", sortable: true },
  { title: "Available", key: "is_available", align: "center", sortable: true },
  { title: "Actions", key: "actions", align: "center", sortable: false },
];

const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const itemsPerPage = ref(5);
const filters = reactive({
  title: "",
  subtitle: "",
  category_id: null,
  discount: "All",
});

let timer = null;

const fetchData = async (options = {}) => {
  loading.value = true;

  // Extract all needed values from the Vuetify options object
  const { page, itemsPerPage: currentPerPage, sortBy } = options;
  const id = JSON.parse(localStorage.getItem("user")).id;

  try {
    const { data } = await api.get(`auth/restaurant/${id}/menus`, {
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

const editMenu = (item) => {
  const id = item.id;
  router.push("/restaurant/menu/" + id);
};

const prepareDelete = (item) => {
  selectedItem.value = item;
  openDialog.value = true;
};

const confirmDelete = async () => {
  loading.value = true;
  try {
    const res = await api.delete(
      `auth/restaurant/menus/${selectedItem.value.id}`
    );
    openDialog.value = false;
    await fetchData();
  } catch (err) {
    console.error("Delete failed:", err);
  }
  loading.value = false;
};

const categories = ref([]);

const allCategories = async () => {
  const res = await api.get("auth/restaurant/categories");
  categories.value = [{ id: null, name: "All" }, ...res.data];
};

onMounted(() => {
  allCategories();
});
</script>
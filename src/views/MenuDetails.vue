<template>
  <restaurant-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/restaurant/menus')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container>
      <div v-if="errorMessage">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
      </div>
      <v-card class="mx-auto px-4 py-4 card" width="100%">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="menu.title"
                :rules="[rules.required('menu title')]"
                label="Menu title (eg. ဒံပေါက်)"
                prepend-inner-icon="mdi-food-outline"
                variant="solo"
                bg-color="#fff"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="menu.subtitle"
                :rules="[rules.required('menu subtitle')]"
                label="Menu subtitle (eg. ဆိတ်သားဒံပေါက်)"
                prepend-inner-icon="mdi-food-outline"
                variant="solo"
                bg-color="#fff"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="menu.category_id"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Select Category"
                clearable
                prepend-inner-icon="mdi-tag-outline"
                variant="solo"
                bg-color="#fff"
                :rules="[rules.required('category')]"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input
                v-model="menu.available_count"
                control-variant="split"
                label="Available Count"
                suffix="plates"
                :min="1"
                variant="solo"
                bg-color="#fff"
              ></v-number-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input
                v-model="menu.price"
                :precision="2"
                hide-details="auto"
                label="Price"
                prepend-inner-icon="mdi-cash"
                variant="solo"
                bg-color="#fff"
                :rules="[rules.required('price')]"
              ></v-number-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input
                v-model="menu.discount_price"
                :precision="2"
                :disabled="id == 'new'"
                :hint="
                  id == 'new' ? 'Discount can be added after menu creation' : ''
                "
                persistent-hint
                hide-details="auto"
                label="Discount price"
                prepend-inner-icon="mdi-sale"
                variant="solo"
                bg-color="#fff"
              ></v-number-input>
            </v-col>

            <v-col cols="12">
              <div v-if="props.id !== 'new' && !menu.image" class="mb-4">
                <p class="text-caption">Current Photo:</p>
                <v-img
                  :src="menu.image_url"
                  width="150"
                  class="rounded border"
                  cover
                ></v-img>
              </div>
              <v-file-input
                v-model="menu.image"
                label="Upload Menu Photo"
                accept="image/*"
                variant="solo"
                bg-color="#fff"
                prepend-inner-icon="mdi-camera"
                :rules="id === 'new' ? [rules.required('menu photo')] : []"
                show-size
              ></v-file-input>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="menu.description"
                label="Menu Description"
                placeholder="Describe your delicious dish here..."
                prepend-inner-icon="mdi-text-long"
                variant="solo"
                bg-color="#fff"
                rows="4"
                auto-grow
                counter
                maxlength="500"
                :rules="[rules.required('description')]"
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="4">
              <h5 class="my-0">Menu Available</h5>
              <v-switch
                v-model="menu.is_available"
                :label="menu.is_available ? 'Available' : 'Out of Stock'"
                color="green-darken-2"
              ></v-switch>
            </v-col>
          </v-row>

          <v-btn
            class="my-4 btn"
            type="submit"
            block
            color="green-darken-3"
            size="large"
            variant="elevated"
            :loading="loading"
          >
            {{ id == "new" ? "CREATE" : "EDIT" }}
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </restaurant-navbar>
</template>
<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import { onMounted, ref } from "vue";
import Alert from "@/components/Alert.vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";

const props = defineProps(["id"]);
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");
const categories = ref([]);
const menu = ref({
  category_id: null,
  restaurant_id: JSON.parse(localStorage.getItem("user")).id,
  title: "",
  subtitle: "",
  price: null,
  discount_price: null,
  available_count: 1,
  is_available: true,
  image: null,
  description: null,
});

const allCategories = async () => {
  const res = await api.get("auth/restaurant/categories");
  categories.value = res.data;
};

const createMenu = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("category_id", menu.value.category_id);
  formData.append("restaurant_id", menu.value.restaurant_id);
  formData.append("title", menu.value.title);
  formData.append("subtitle", menu.value.subtitle);
  formData.append("price", menu.value.price);
  formData.append("available_count", menu.value.available_count);
  formData.append("image", menu.value.image);
  formData.append("description", menu.value.description);
  formData.append("is_available", menu.value.is_available ? 1 : 0);

  try {
    const res = await api.post("auth/restaurant/menus/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push("/restaurant/menus");
  } catch (err) {
    errorMessage.value = err;
  }
  loading.value = false;
};

const updateMenu = async () => {
  loading.value = true;
  const formData = new FormData();

  // Method Spoofing for Laravel
  formData.append("_method", "PUT");

  formData.append("category_id", menu.value.category_id);
  formData.append("title", menu.value.title);
  formData.append("subtitle", menu.value.subtitle);
  formData.append("price", menu.value.price);
  formData.append("discount_price", menu.value.discount_price || "");
  formData.append("available_count", menu.value.available_count);
  formData.append("description", menu.value.description);
  formData.append("is_available", menu.value.is_available ? 1 : 0);

  // ပုံအသစ် ရွေးထားမှသာ formData ထဲ ထည့်မယ်
  if (menu.value.image instanceof File) {
    formData.append("image", menu.value.image);
  }

  try {
    await api.post(`auth/restaurant/menus/${props.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/restaurant/menus");
  } catch (err) {
    errorMessage.value = "Update failed";
  }
  loading.value = false;
};

const handleSubmit = () => {
  if (props.id == "new") {
    createMenu();
  } else {
    updateMenu();
  }
};

const getMenuDetails = async () => {
  try {
    const res = await api.get(`auth/restaurant/menus/${props.id}`);
    const data = res.data;
    menu.value = {
      ...data,
      price: data.price ? Number(data.price) : null,
      discount_price: data.discount_price ? Number(data.discount_price) : null,
      available_count: data.available_count ? Number(data.available_count) : 0,
      image: null,
      is_available: data.is_available == 1 ? true : false,
    };
  } catch (err) {
    errorMessage.value = "Could not load menu details";
  }
};

onMounted(() => {
  allCategories();
  if (props.id == "new") {
    //
  } else {
    getMenuDetails();
  }
});
</script>
<style scoped>
</style>
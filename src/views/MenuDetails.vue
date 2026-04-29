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
                prepend-inner-icon="mdi-format-list-bulleted"
                variant="solo"
                bg-color="#fff"
                :rules="[rules.required('category')]"
              ></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-btn
                block
                height="56"
                color="green-lighten-5"
                class="text-green-darken-2"
                variant="flat"
                prepend-icon="mdi-tag-multiple"
                @click="tagDialog = true"
              >
                Tags: {{ selectedTagIds.length }} selected
              </v-btn>
              <!-- <div class="mt-2">
                <v-chip
                  v-for="id in selectedTagIds"
                  :key="id"
                  size="small"
                  color="blue-darken-2"
                  class="ma-1"
                  closable
                  @click:close="toggleTag(id)"
                >
                  {{ allTags.find(t => t.id === id)?.name }}
                </v-chip>
              </div> -->
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
                :disabled="props.id == 'new'"
                :hint="props.id == 'new' ? 'Discount can be added after menu creation' : ''"
                persistent-hint
                hide-details="auto"
                label="Discount price"
                prepend-inner-icon="mdi-sale"
                variant="solo"
                bg-color="#fff"
              ></v-number-input>
            </v-col>

            <v-col cols="12">
              <div v-if="props.id !== 'new' && !menu.image && menu.image_url" class="mb-4">
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
                :rules="props.id === 'new' ? [rules.required('menu photo')] : []"
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
            {{ props.id == "new" ? "CREATE" : "EDIT" }}
          </v-btn>
        </v-form>
      </v-card>
    </v-container>

    <v-dialog v-model="tagDialog" max-width="400" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center">
          Select Tags
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="tagDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!--<v-list>
            <v-list-item
              v-for="tag in allTags"
              :key="tag.id"
              @click="toggleTag(tag.id)"
            >
              <template v-slot:prepend>
                <v-icon :color="selectedTagIds.includes(tag.id) ? 'green' : 'grey-lighten-1'">
                  {{ selectedTagIds.includes(tag.id) ? 'mdi-check-circle' : 'mdi-plus-circle-outline' }}
                </v-icon>
              </template>
              <v-list-item-title>{{ tag.name }}</v-list-item-title>
            </v-list-item>
          </v-list> -->
          <v-chip
                  v-for="tag in allTags"
                  :key="tag.id"
                  size="small"
                  :color="selectedTagIds.includes(tag.id)? 'green-darken-2' : 'orange-darken-2'"
                  class="ma-1"
                
                  :prepend-icon="selectedTagIds.includes(tag.id) ? 'mdi-check' : 'mdi-plus' "
                  @click="toggleTag(tag.id)"
                >
                  {{ tag.name }}
                </v-chip>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn block color="green-darken-1" @click="tagDialog = false">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const allTags = ref([]); // Database ထဲက Tag အားလုံး
const selectedTagIds = ref([]); // ရွေးထားတဲ့ Tag IDs များ
const tagDialog = ref(false);

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

// Category အားလုံးယူမယ်
const fetchCategories = async () => {
  const res = await api.get("auth/restaurant/categories");
  categories.value = res.data;
};

// Tag အားလုံးယူမယ်
const fetchTags = async () => {
  const res = await api.get("auth/restaurant/tags");
  allTags.value = res.data;
};

// Tag ရွေးချယ်ခြင်း logic
const toggleTag = (id) => {
  const index = selectedTagIds.value.indexOf(id);
  if (index > -1) {
    selectedTagIds.value.splice(index, 1);
  } else {
    selectedTagIds.value.push(id);
  }
};

// FormData ပြင်ဆင်ခြင်း (Create နှင့် Update နှစ်ခုလုံးအတွက်)
const prepareFormData = () => {
  const formData = new FormData();
  formData.append("category_id", menu.value.category_id);
  formData.append("restaurant_id", menu.value.restaurant_id);
  formData.append("title", menu.value.title);
  formData.append("subtitle", menu.value.subtitle);
  formData.append("price", menu.value.price);
  formData.append("available_count", menu.value.available_count);
  formData.append("description", menu.value.description);
  formData.append("is_available", menu.value.is_available ? 1 : 0);
  
  // Tags တွေကို JSON string အနေနဲ့ ပို့မယ်
  formData.append("tags", JSON.stringify(selectedTagIds.value));

  if (menu.value.image instanceof File) {
    formData.append("image", menu.value.image);
  }
  return formData;
};

const createMenu = async () => {
  loading.value = true;
  const formData = prepareFormData();

  try {
    await api.post("auth/restaurant/menus/new", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/restaurant/menus");
  } catch (err) {
    errorMessage.value = "Create failed. Please check your data.";
  } finally {
    loading.value = false;
  }
};

const updateMenu = async () => {
  loading.value = true;
  const formData = prepareFormData();
  formData.append("_method", "PUT"); // Laravel Spoofing

  try {
    await api.post(`auth/restaurant/menus/${props.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/restaurant/menus");
  } catch (err) {
    errorMessage.value = "Update failed.";
  } finally {
    loading.value = false;
  }
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
      is_available: data.is_available == 1,
    };
    
    // Edit ဖြစ်လို့ရှိရင် လက်ရှိ menu မှာရှိတဲ့ tag IDs တွေကို Selected list ထဲထည့်မယ်
    if (data.tags) {
      selectedTagIds.value = data.tags.map(tag => tag.id);
    }
  } catch (err) {
    errorMessage.value = "Could not load menu details";
  }
};

onMounted(() => {
  fetchCategories();
  fetchTags();
  if (props.id !== "new") {
    getMenuDetails();
  }
});
</script>
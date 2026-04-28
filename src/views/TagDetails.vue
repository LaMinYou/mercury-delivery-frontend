<template>
  <admin-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/admin/tags')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container>
      <div v-if="errorMessage" style="max-width: 600px" class="mx-auto">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
      </div>
      <v-card class="mx-auto px-4 py-4 card" max-width="600" width="100%">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="tag.name"
                :rules="[rules.required('tag name')]"
                label="Tag name (eg. Spicy)"
                prepend-inner-icon="mdi-tag-outline"
                variant="solo"
                bg-color="#fff"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <div v-if="props.id !== 'new' && !tag.image" class="mb-4">
                <p class="text-caption">Current Photo:</p>
                <v-img
                  :src="tag.image_url"
                  width="150"
                  class="rounded border"
                  cover
                ></v-img>
              </div>
              <v-file-input
                v-model="tag.image"
                label="Upload Tag Photo"
                accept="image/*"
                variant="solo"
                bg-color="#fff"
                prepend-inner-icon="mdi-camera"
                :rules="id === 'new' ? [rules.required('tag photo')] : []"
                show-size
              ></v-file-input>
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
  </admin-navbar>
</template>
<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import { onMounted, ref } from "vue";
import Alert from "@/components/Alert.vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";

const props = defineProps(["id"]);
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");
const tag = ref({
  name: "",
  image: null,
});

const createTag = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("name", tag.value.name);
  formData.append("image", tag.value.image);

  try {
    const res = await api.post("auth/admin/tags/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push("/admin/tags");
  } catch (err) {
    errorMessage.value = err;
  }
  loading.value = false;
};

const updateTag = async () => {
  loading.value = true;
  const formData = new FormData();

  // Method Spoofing for Laravel
  formData.append("_method", "PUT");

  formData.append("name", tag.value.name);

  // ပုံအသစ် ရွေးထားမှသာ formData ထဲ ထည့်မယ်
  if (tag.value.image instanceof File) {
    formData.append("image", tag.value.image);
  }

  try {
    await api.post(`auth/admin/tags/${props.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/admin/tags");
  } catch (err) {
    console.error("Full Error Object:", err);
    // 1. Handle Laravel Validation Errors (422)
    if (err.response && err.response.status === 422) {
      const validationErrors = err.response.data.errors;
      // Get the first error message from the list
      errorMessage.value = Object.values(validationErrors).flat()[0];
    }
    // 2. Handle Server Errors (500)
    else if (err.response && err.response.status === 500) {
      errorMessage.value =
        err.response.data.error ||
        err.response.data.message ||
        "Internal Server Error";
    }
    // 3. Handle Network/Other Errors
    else {
      errorMessage.value = "Unable to connect to the server.";
    }
  }
  loading.value = false;
};

const handleSubmit = () => {
  if (props.id == "new") {
    createTag();
  } else {
    updateTag();
  }
};

const getTagDetails = async () => {
  try {
    const res = await api.get(`auth/admin/tags/${props.id}`);
    const data = res.data;
    tag.value = {
      ...data,
      image: null,
    };
  } catch (err) {
    errorMessage.value = "Could not load tag details";
  }
};

onMounted(() => {
  if (props.id == "new") {
    //
  } else {
    getTagDetails();
  }
});
</script>
<style scoped>
</style>
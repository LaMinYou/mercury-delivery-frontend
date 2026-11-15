<template>
  <admin-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/admin/riders')"
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
          <div>
            <div v-if="props.id != 'new' && rider.image_url" class="mb-4">
              <p class="text-caption">{{ $t('admin.rider-form.label.current-photo') }}:</p>
                <v-img
                  :src="rider.image_url"
                  width="150"
                  class="rounded border"
                  cover
                ></v-img>
            </div>
            <v-file-input
                v-model="rider.cover_image"
                :label="$t('admin.rider-form.label.photo')"
                accept="image/*"
                variant="solo"
                bg-color="#fff"
                prepend-inner-icon="mdi-camera"
                :rules="
                  props.id === 'new' ? [rules.required('rider photo')] : []
                "
                show-size
              ></v-file-input>
          </div>
          <v-text-field
            v-model="rider.name"
            :rules="[rules.required('rider name')]"
            :label="$t('admin.rider-form.label.name')"
            prepend-inner-icon="mdi-account"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-model="rider.username"
            :rules="[rules.required('username')]"
            :label="$t('admin.rider-form.label.username')"
            prepend-inner-icon="mdi-account"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-if="id == 'new'"
            v-model="rider.password"
            type="password"
            :rules="[rules.required('password'), rules.min(8)]"
            prepend-inner-icon="mdi-lock"
            variant="solo"
            :label="$t('admin.rider-form.label.password')"
            class="mt-2"
          ></v-text-field>

          <v-text-field
            v-model="rider.phone"
            :rules="[rules.required('phone number'), rules.phone]"
            :label="$t('admin.rider-form.label.phone')"
            prepend-inner-icon="mdi-phone"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

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
import { onMounted, ref, watch } from "vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";

const props = defineProps(["id"]);
const router = useRouter();
const errorMessage = ref("");
const loading = ref(false);

let rider = ref({
  name: "",
  username: "",
  password: "",
  phone: "",
  latitude: 0,
  longitude: 0,
  cover_image: null
});

const prepareFormData = () => {
  const formData = new FormData();
  formData.append('name', rider.value.name);
  formData.append('username', rider.value.username);
  formData.append('password', rider.value.password);
  formData.append('phone', rider.value.phone);
  formData.append('latitude', rider.value.latitude);
  formData.append('longitude', rider.value.longitude);

  if(rider.value.cover_image instanceof File){
    formData.append('cover_image', rider.value.cover_image);
  }
  return formData;
}

watch(
  () => rider.value.name,
  (newName) => {
    if (props.id == "new") {
      if (newName && newName.includes(" ")) {
        // Split by space and take the first part
        rider.value.username = newName.split(" ")[0].toLowerCase();
      } else {
        // Optional: keep username synced even before the space is typed
        rider.value.username = newName.toLowerCase();
      }
    }
  }
);

const addNew = async () => {
  loading.value = true;
  const formData = prepareFormData();
  try {
    const res = await api.post("/auth/admin/rider/new", formData, {
     headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/admin/riders");
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

const update = async () => {
  loading.value = true;
  const formData = prepareFormData();
  try {
    const res = await api.post("/auth/admin/rider/" + props.id, formData , {
      headers: { "Content-Type": "multipart/form-data"  },
    });
    router.push("/admin/riders");
  } catch (err) {
    console.log(err);
    errorMessage.value =
      err.response.data.error ||
      err.response.data.message ||
      "Unable to connect server";
  }
  loading.value = false;
};

const handleSubmit = async () => {
  if (props.id == "new") {
    addNew();
  } else {
    update();
  }
};

onMounted(async () => {
  if (props.id == "new") {
    //
  } else {
    const res = await api.get("auth/admin/rider/" + props.id);
    rider.value = res.data;
  }
});
</script>
<style scoped>
.card {
  background: transparent;
  backdrop-filter: blur(10px);
}
</style>
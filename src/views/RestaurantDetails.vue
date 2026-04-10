<template>
  <admin-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/admin/restaurants')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container
      class="d-flex align-center justify-center flex-column"
      style="min-height: 100vh"
    >
      <div v-if="errorMessage">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
      </div>
      <v-card class="mx-auto px-4 py-4 card" max-width="600" width="100%">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="restaurant.name"
            :rules="[rules.required('name')]"
            label="name"
            prepend-inner-icon="mdi-account"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-model="restaurant.email"
            label="email"
            prepend-inner-icon="mdi-email"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-model="restaurant.username"
            :rules="[rules.required('username')]"
            label="username"
            prepend-inner-icon="mdi-account"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-if="id == 'new'"
            v-model="restaurant.password"
            type="password"
            :rules="[rules.required('password'), rules.min(8)]"
            prepend-inner-icon="mdi-lock"
            variant="solo"
            label="password"
            class="mt-2"
          ></v-text-field>

          <v-text-field
            v-model="restaurant.phone"
            :rules="[rules.required('phone number'), rules.phone]"
            label="phone number"
            prepend-inner-icon="mdi-phone"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-textarea
            v-model="restaurant.address"
            :rules="[rules.required('address')]"
            label="address"
            prepend-inner-icon="mdi-map-marker"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-textarea>

          <div class="d-flex flex-column flex-sm-column flex-md-row">
            <v-text-field
              v-model="restaurant.latitude"
              label="Latitude (Google Maps မှ ကူးထည့်ပါ)"
              :rules="[rules.required('latitude'), rules.latitude, rules.numberOnly]"
              variant="solo"
              class="me-2"
            ></v-text-field>
            <v-text-field
              v-model="restaurant.longitude"
              label="Longitude (Google Maps မှ ကူးထည့်ပါ)"
              :rules="[rules.required('longitude'), rules.longitude, rules.numberOnly]"
              variant="solo"
            ></v-text-field>
          </div>

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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";

const props = defineProps(["id"]);
const router = useRouter();
const errorMessage = ref("");
const loading = ref(false);

let restaurant = ref({
  name: "",
  username: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  latitude: 0,
  longitude: 0,
});

watch(
  () => restaurant.value.email,
  (newEmail) => {
    if (newEmail && newEmail.includes("@")) {
      // Split by @ and take the first part
      restaurant.value.username = newEmail.split("@")[0];
    } else {
      // Optional: keep username synced even before the @ is typed
      restaurant.value.username = newEmail;
    }
  }
);

const addNew = async () => {
  loading.value = true;
  try {
    const res = await api.post("auth/admin/restaurant/new", restaurant.value);
    router.push("/admin/restaurants");
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
      errorMessage.value = err.response.data.error;
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
  try {
    const res = await api.post(
      "auth/admin/restaurants/" + props.id,
      restaurant.value
    );
    router.push("/admin/restaurants");
  } catch (err) {
    console.log(err);
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
    const res = await api.get("auth/admin/restaurant/" + props.id);
    restaurant.value = res.data;
  }
});
</script>
<style scoped>
.card {
  background: transparent;
  backdrop-filter: blur(10px);
}
</style>
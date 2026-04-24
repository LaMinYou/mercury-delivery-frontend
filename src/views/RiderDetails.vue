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
          <v-text-field
            v-model="rider.name"
            :rules="[rules.required('rider name')]"
            label="rider name"
            prepend-inner-icon="mdi-account"
            variant="solo"
            class="mt-2"
            bg-color="#fff"
          ></v-text-field>

          <v-text-field
            v-model="rider.username"
            :rules="[rules.required('username')]"
            label="username"
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
            label="password"
            class="mt-2"
          ></v-text-field>

          <v-text-field
            v-model="rider.phone"
            :rules="[rules.required('phone number'), rules.phone]"
            label="phone number"
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
});

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
  try {
    const res = await api.post("/auth/admin/rider/new", rider.value);
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
  try {
    const res = await api.post("/auth/admin/rider/" + props.id, rider.value);
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
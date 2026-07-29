<template>
  <admin-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/admin/menu-categories')"
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
      <v-card class="mx-auto px-4 py-4 card" max-width="600" width="100%">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model= "category.name"
            :rules="[rules.required('menu category')]"
            label="category name"
            prepend-inner-icon="mdi-layers"
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";

const props = defineProps(["id"]);
const router = useRouter();
const errorMessage = ref("");
const loading = ref(false);

let category = ref({
  name: ""
});

const addNew = async () => {
  loading.value = true;
  try {
    const res = await api.post("auth/admin/menu-category/new", category.value);
    router.push("/admin/menu-categories");
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
      "auth/admin/menu-categories/" + props.id,
     category.value
    );
    router.push("/admin/menu-categories");
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
    const res = await api.get("auth/admin/menu-categories/" + props.id);
    category.value = res.data;
  }
});
</script>
<style scoped>
.card {
  background: transparent;
  backdrop-filter: blur(10px);
}
</style>
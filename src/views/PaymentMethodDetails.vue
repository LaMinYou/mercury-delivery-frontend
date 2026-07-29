<template>
  <admin-navbar>
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/admin/payments')"
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
            <v-col cols="12">
              <v-text-field
                v-model="payment.name"
                :rules="[rules.required('payment method name')]"
                label="Payment method name (eg. wave)"
                prepend-inner-icon="mdi-credit-card-outline"
                variant="solo"
                bg-color="#fff"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <div v-if="props.id !== 'new' && !payment.image && payment.image_url" class="mb-4">
                <p class="text-caption">Current Payment QR:</p>
                <v-img
                  :src="payment.image_url"
                  width="150"
                  class="rounded border"
                  cover
                ></v-img>
              </div>
              <v-file-input
                v-model="payment.image"
                label="Upload Payment QR Image"
                accept="image/*"
                variant="solo"
                bg-color="#fff"
                prepend-inner-icon="mdi-camera"
                show-size
              ></v-file-input>
            </v-col>

            <v-col cols="12" v-if="id === 'new'">
              <v-file-input
                v-model="payment.logo_image"
                label="Upload Payment Icon Image"
                accept="image/*"
                variant="solo"
                bg-color="#fff"
                prepend-inner-icon="mdi-camera"
                show-size
              ></v-file-input>
            </v-col>

            <v-col cols="12" md="4">
              <h5 class="my-0">Payment Method Status</h5>
              <v-switch
                v-model="payment.is_active"
                :label="payment.is_active ? 'active' : 'inactive'"
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

const payment = ref({
  name: null,
  is_active: true,
  image: null,
  logo_image: null
});

// prepare form data for both create and update
const prepareFormData = () => {
  const formData = new FormData();
  formData.append("name", payment.value.name);
  formData.append("is_active", payment.value.is_active ? 1 : 0);

  if (payment.value.image instanceof File) {
    formData.append("image", payment.value.image);
  }
  if(payment.value.logo_image instanceof File){
    formData.append('logo_image', payment.value.logo_image);
  }

  return formData;
};

const createPaymentMethod = async () => {
  loading.value = true;
  const formData = prepareFormData();

  try {
    await api.post("auth/admin/payments/new", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/admin/payments");
  } catch (err) {
    errorMessage.value = "Create failed. Please check your data.";
  } finally {
    loading.value = false;
  }
};

const updatePaymentMethod = async () => {
  loading.value = true;
  const formData = prepareFormData();
  formData.append("_method", "PUT"); // Laravel Spoofing

  try {
    await api.post(`auth/admin/payments/${props.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push("/admin/payments");
  } catch (err) {
    errorMessage.value = err.response.data.message;
  } finally {
    loading.value = false;
  }
};

const handleSubmit = () => {
  if (props.id == "new") {
    createPaymentMethod();
  } else {
    updatePaymentMethod();
  }
};

const getPaymentDetails = async () => {
  try {
    const res = await api.get(`auth/admin/payments/${props.id}`);
    const data = res.data;
    payment.value = {
      ...data,
      image: null,
      is_active: data.is_active == 1,
    };
    
  } catch (err) {
    errorMessage.value = "Could not load payment method details";
  }
};

onMounted(() => {
  if (props.id !== "new") {
    getPaymentDetails();
  }
});
</script>
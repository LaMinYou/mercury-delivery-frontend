<template>
  <!-- <v-img src="@/assets/images/foodbg.jpg" cover class="bgimg" aspect-ratio="1.77" /> -->
  <v-img
    :aspect-ratio="1"
    class="bg-surface elevation-3 bgimg"
    src="@/assets/images/foodbg.jpg"
    cover
  ></v-img>
  <v-container
    class="d-flex align-center justify-center flex-column"
    style="min-height: 100vh"
  >
    <div v-if="errorMessage">
      <alert :message="errorMessage" type="warning" color="red-accent-4" />
    </div>
    <span class="text-display-small text-white">Enjoy Healthy</span>
    <span class="text-display-medium pb-4 text-success food">Food</span>
    <v-card class="mx-auto px-4 py-4 card" max-width="550" width="100%">
      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="username"
          :rules="[rules.required('username')]"
          label="username"
          prepend-inner-icon="mdi-account"
          variant="solo"
          class="mt-2"
          bg-color="#fff"
        ></v-text-field>

        <v-text-field
          v-model="password"
          type="password"
          :rules="[rules.required('password'), rules.min(8)]"
          prepend-inner-icon="mdi-lock"
          variant="solo"
          label="password"
          class="mt-2"
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
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { rules } from "@/services/rules";
import api from "@/services/api";
import { useRouter } from "vue-router";
import Alert from "@/components/Alert.vue";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await api.post("login", {
      username: username.value,
      password: password.value,
    });

    const token = res.data.access_token;
    const user = res.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const roleId = res.data.user.role_id;
    if (roleId == 1) {
      router.push("/admin");
    }
  } catch (err) {
    console.error(err);
    if (err.response && err.response.data) {
      errorMessage.value = err.response.data.error;
    } else {
      errorMessage.value = "Network Error: ဆာဗာနှင့် ချိတ်ဆက်၍မရပါ။";
    }
    loading.value = false;
  }
};
</script>
<style scoped>
.bgimg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  object-fit: cover; /* Ensures image covers area without stretching */
  z-index: -1; /* Puts image behind content */
}
.card {
  background: transparent;
  backdrop-filter: blur(5px);
  border: 2px solid #dbd7d7;
}
.btn {
  border: 2px solid #43a047;
}
span {
  transform: scale(0) translateY(-500px);
  animation: animate 1.5s linear forwards;
}
span.food {
  animation-delay: 0.8s;
}
@keyframes animate {
  from {
    transform: scale(0) translateY(-500px);
  }
  to {
    transform: scale(1) translateY(0);
  }
}
</style>
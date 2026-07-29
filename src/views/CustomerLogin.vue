<template>
  <login-navbar :address="currentLocation.address">
    <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="pa-6 rounded-xl elevation-3 bg-white">
          <div class="text-center mb-6">
            <v-avatar color="green-darken-2" size="64" class="mb-2">
              <v-icon size="36" color="white">mdi-bike-fast</v-icon>
            </v-avatar>
            <h2 class="text-h5 font-weight-black text-grey-darken-4">
              Mercury Delivery
            </h2>
            <p class="text-caption text-grey-darken-1 mt-1">
              {{
                isLogin
                  ? "သင့်အကောင့်ထဲသို့ လော့ဂ်အင်ဝင်ပါ"
                  : "အကောင့်အသစ် အခမဲ့ပြုလုပ်ပါ"
              }}
            </p>
          </div>

          <v-form @submit.prevent="handleSubmit" ref="formRef">
            <v-text-field
              v-if="!isLogin"
              v-model="form.name"
              label="Name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required('Name')]"
              class="mb-2"
              color="green-darken-2"
            ></v-text-field>

            <v-text-field
              v-model="form.login_target"
              label="Email or Phone Number"
              prepend-inner-icon="mdi-email-phone"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required('Email or Phone Number')]"
              class="mb-2"
              color="green-darken-2"
              placeholder="example@gmail.com သို့မဟုတ် 09xxxxxxx"
            ></v-text-field>


            <v-text-field
              v-model="form.password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              density="comfortable"
              type="password"
              :rules="[rules.required('Password'), rules.password]"
              class="mb-4"
              color="green-darken-2"
            ></v-text-field>

            <v-btn
              type="submit"
              color="green-darken-2"
              size="large"
              block
              rounded="xl"
              class="font-weight-bold"
              :loading="loading"
            >
              {{ isLogin ? "Login" : "Register" }}
            </v-btn>
          </v-form>

          <div class="d-flex align-center my-6">
            <v-divider></v-divider>
            <span class="mx-4 text-caption text-grey font-weight-medium"
              >OR</span
            >
            <v-divider></v-divider>
          </div>

          <v-btn
            variant="outlined"
            color="grey-darken-3"
            size="large"
            block
            rounded="xl"
            class="font-weight-bold text-none mb-6"
            @click="loginWithGoogle"
          >
            <!-- <v-icon color="red" class="mr-2">mdi-google</v-icon> -->
            <template v-slot:prepend>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                class="mr-2"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </template>
            Continue with Google
          </v-btn>

          <div class="text-center text-body-2 text-grey-darken-2">
            {{
              isLogin ? "Don't have an account?" : "Already have an account?"
            }}
            <a
              href="#"
              class="text-green-darken-3 font-weight-bold text-decoration-none ml-1"
              @click.prevent="isLogin = !isLogin"
            >
              {{ isLogin ? "signup" : "login" }}
            </a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  </login-navbar>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { rules } from "@/services/rules";
import LoginNavbar from "@/components/LoginNavbar.vue";

const router = useRouter();
const formRef = ref(null);
const isLogin = ref(true);
const loading = ref(false);
const currentLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");

const form = reactive({
  name: "",
  login_target: "",
  password: "",
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  const endpoint = isLogin.value
    ? "/auth/customer/login"
    : "/auth/customer/register";

  try {
    const res = await api.post(endpoint, form);

    localStorage.setItem("token", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    router.push("/");
  } catch (error) {
    alert(error.response?.data?.message || "login failed");
  } finally {
    loading.value = false;
  }
};

// redirect to Google OAuth
const loginWithGoogle = () => {
  window.location.href = `${process.env.VUE_APP_API_BASE_URL}/auth/google/redirect`;
};
</script>
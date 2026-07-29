<template>
  <v-app>
    <v-app-bar
      color="green-darken-4"
      elevation="1"
      height="60"
      extension-height="auto"
    >

      <div class="logo d-flex align-center">
        <router-link
          to="/"
          class="d-flex align-center text-decoration-none"
        >
          <v-img src="@/assets/images/mercury.png" width="120" height="115" />
          <!-- <span class="text-h6 text-white ms-2 font-weight-bold">Momo</span> -->
        </router-link>
      </div>

      <v-spacer></v-spacer>
      <div>
          <!-- တည်နေရာပြမည့်နေရာ -->
          <div
            class="mx-auto text-white mb-2 pt-1 current-location"
            style="max-width: 250px"
          >
            <v-menu location="bottom center" origin="auto">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="d-flex align-center cursor-pointer mx-4"
                >
                  <v-icon size="small" class="me-1"
                    >mdi-map-marker-outline</v-icon
                  >
                  <span class="text-caption">Your current location</span>
                </div>
              </template>

              <v-card
                v-if="address"
                class="pa-3 mt-1 "
                max-width="350"
              >
                <span class="text-caption text-grey">Current Address:</span>
                <div class="text-body-2 mt-1">{{ address }}</div>
              </v-card>
            </v-menu>
          </div>
        </div>

        <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-avatar class="me-2" size="32" color="green-lighten-4">
          <div>
            <v-icon @click="openSignupBox = true" color="green-darken-4"
              >mdi-account-outline</v-icon
            >
          </div>
        </v-avatar>
      </div>
    </v-app-bar>
    <v-main class="bg-grey-lighten-3 main">
        <slot />
    </v-main>
  </v-app>
  <signup-dialog
    :openSignupBox="openSignupBox"
    @closeSignupBox="openSignupBox = false"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/api";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { customerMenuItems } from "@/services/menus";
import SignupDialog from "./SignupDialog.vue";
import { useCart } from "@/composables/useCart";

const { groupedCart } = useCart();
const props = defineProps(["address"]);
const router = useRouter();
const { mdAndUp } = useDisplay();
const drawer = ref(mdAndUp.value);
let openSignupBox = ref(false);

</script>
<!-- light-green-accent-1 -->
 <style scoped>

</style>
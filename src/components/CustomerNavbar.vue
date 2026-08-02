<template>
  <!-- <v-app> -->
    <v-app-bar
      color="green-darken-4"
      elevation="1"
      height="60"
      extension-height="auto"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="logo d-flex align-center">
        <router-link
          to="/"
          class="d-flex align-center text-decoration-none"
        >
          <v-img :src="require('@/assets/images/mercury.png')" width="120" height="115" />
          <!-- <span class="text-h6 text-white ms-2 font-weight-bold">Momo</span> -->
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-avatar class="me-2" size="32" color="green-lighten-4">
          <div v-if="!user">
            <v-icon @click="openSignupBox = true" color="green-darken-4"
              >mdi-account-outline</v-icon
            >
          </div>
          <div v-else @click="openProfileDrawer=true" class="cursor-pointer">
            <span class="text-green-darken-4 font-weight-bold">{{
              user?.name.charAt(0).toUpperCase()
            }}</span>
          </div>
        </v-avatar>
        <!-- <span class="text-subtitle-2 d-none d-sm-flex me-5">{{
          user?.name.split(" ")[0] || ""
        }}</span> -->
      </div>

      <template v-slot:extension>
        <v-container fluid class="pa-0 px-4 pb-3 bg-green-lighten-5">
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

          <v-text-field
            v-model="searchField"
            density="compact"
            variant="solo-filled"
            label="Search for restaurants, cuisions and dishes"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            flat
            rounded="lg"
            bg-color="green-lighten-5"
            max-width="700"
            class="mx-auto"
            @keydown.enter.prevent="$emit('search', searchField)"
          ></v-text-field>
        </v-container>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp" color="green-lighten-5">
      <v-list density="compact" class="mt-5 menu-bar" nav>
        <v-list-item
          v-for="item in customerMenuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.route"
          active-color="green-darken-4"
        ></v-list-item>

        <v-list-item 
          prepend-icon="mdi-basket-outline"
          title="Cart"
          to="/customer/cart"
          active-color="green-darken-4"
        >
        <template v-slot:append>
          <v-badge 
            v-if="groupedCart.length > 0"
            :content="groupedCart.length"
            color="red"
            inline
            >
          </v-badge>
        </template>
      </v-list-item>
      </v-list>

      <template v-if="user" v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            prepend-icon="mdi-logout"
            color="error"
            variant="tonal"
            @click="handleLogout"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-3 main">
      <v-container fluid>
        <slot />
      </v-container>
      <Footer />
    </v-main>

  <!-- </v-app> -->
  <signup-dialog
    :openSignupBox="openSignupBox"
    @closeSignupBox="openSignupBox = false"
  />

  <div v-if="user">
    <profile-drawer 
    :openProfileDrawer="openProfileDrawer" 
    :user="user" 
    @closeProfileDrawer="openProfileDrawer=false" 
    @update:user="user = $event"
  />
  </div>
  
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "@/services/api";
import { useDisplay } from "vuetify";
import { useRouter, useRoute } from "vue-router";
import { customerMenuItems } from "@/services/menus";
import SignupDialog from "./SignupDialog.vue";
import { useCart } from "@/composables/useCart";
import ProfileDrawer from "./ProfileDrawer.vue";
import Footer from "./Footer.vue";

const { groupedCart } = useCart();
const props = defineProps(["address"]);
const emit = defineEmits(['search']);
const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay();
const drawer = ref(mdAndUp.value);
const searchField = ref(null);
let user = ref(null);
let openSignupBox = ref(false);
const openProfileDrawer = ref(false);

user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

const handleLogout = async () => {
  try {
    await api.post("auth/customer/logout");
  } catch (err) {
    console.error(
      "Backend logout failed, proceeding with frontend cleanup",
      err
    );
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    user.value = null;
    router.push("/");
  }
};

watch(
  () => route.query.search,
  (newSearch) => {
    searchField.value = newSearch || '';
  },
  {
    immediate: true
  }
);
</script>
<!-- light-green-accent-1 -->
 <style scoped>
/*.logo .logo-title {
  position: absolute;
  transform: translateY(-20px);
}*/
@media (min-width: 492px) {
  .current-location {
    transform: translateY(-45px);
  }
}
@media (max-width: 492px) {
  .current-location {
    color: green;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
.menu-bar,
.main {
  margin-top: 150px;
}
</style>
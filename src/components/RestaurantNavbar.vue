<template>
  <v-app>
    <v-app-bar color="green-darken-4" elevation="1" class="px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-toolbar-title>
        <div class="logo">
          <router-link to="restaurant">
            <v-img src="@/assets/images/momo.png" width="50" height="50" />
          <span class="logo-title text-white">Momo</span>
          </router-link>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar class="me-2" size="32">
        <span class="text-red"> {{ restaurant?.name.charAt(0) }}</span>
      </v-avatar>
      <span class="text-subtitle-2">{{ restaurant?.name || 'Loading...' }}</span> -->
      <div class="logo d-flex align-center">
        <router-link
          to="/admin"
          class="d-flex align-center text-decoration-none"
        >
          <v-img src="@/assets/images/mercury.png" width="120" height="115" />
          <!-- <span class="text-h6 text-white ms-2 font-weight-bold">Momo</span> -->
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <div
        class="d-flex align-center cursor-pointer"
        @click="openProfileDrawer = true"
      >
        <v-avatar class="me-2" size="32" color="green-lighten-4">
          <!-- <v-img src="https://path-to-avatar.jpg"></v-img> -->
          <span class="text-red"> {{ restaurant?.name.charAt(0) }}</span>
        </v-avatar>
        <!-- <span class="text-subtitle-2">{{
          restaurant?.name.split(" ")[0] || "Loading..."
        }}</span> -->
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.display.mdAndUp"
      color="bg-green-lighten-5"
    >
      <v-list density="compact" class="mt-5" nav>
        <v-list-item
          v-for="item in restaurantMenuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.route"
          active-color="green-darken-4"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
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

    <v-main class="bg-grey-lighten-3">
      <v-container fluid>
        <div class="d-flex justify-end align-center pe-5">
          <v-switch
            v-model="isOpen"
            color="green-darken-2"
            :label="isOpen ? 'Opening' : 'Closing'"
            @change="handleOpenCloseShop"
          >
          </v-switch>
        </div>
        <slot />
      </v-container>
    </v-main>
  </v-app>

  <!-- <div v-if="restaurant"> -->
    <profile-drawer
      :openProfileDrawer="openProfileDrawer"
      :user="restaurant"
      @closeProfileDrawer="openProfileDrawer = false"
      @update:user="restaurant = $event"
    />
  <!-- </div> -->
  <shop-close-message-dialog
      :user="restaurant"
      :openMessageDialog="openMessageDialog"
      @closeMessageDialog="closeMessageDialog"
    />
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/api";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { restaurantMenuItems } from "@/services/menus";
import ProfileDrawer from "./ProfileDrawer.vue";
import ShopCloseMessageDialog from "./ShopCloseMessageDialog.vue";

const router = useRouter();
const { mdAndUp } = useDisplay();
const drawer = ref(mdAndUp.value);
let restaurant = ref(null);
const openProfileDrawer = ref(false);
const openMessageDialog = ref(false);

restaurant = JSON.parse(localStorage.getItem("user"));
const isOpen = ref(restaurant.status === 'active');

const handleLogout = async () => {
  try {
    await api.post("auth/logout");
  } catch (err) {
    console.error(
      "Backend logout failed, proceeding with frontend cleanup",
      err
    );
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
};

const handleOpenCloseShop = () => {
  if (!isOpen.value) {
    openMessageDialog.value = true;
  } else {
    handleOpenShop();
  }
};

const handleOpenShop = async () => {
  try{
    const res = await api.put(`/auth/restaurant/${restaurant.id}/update-status`, { status: 'active' });
    restaurant = res.data;
    localStorage.setItem('user', JSON.stringify(restaurant));
  }catch(err){
    console.log(err.response.message);
  }
}

const closeMessageDialog = (id) => {
  if(id == null){
    isOpen.value = true;
  }else{
    restaurant.status = 'inactive';
    localStorage.setItem('user', JSON.stringify(restaurant));
  }
  openMessageDialog.value = false;
}
</script>
<!-- light-green-accent-1 -->
 <style scoped>
.logo .logo-title {
  position: absolute;
  transform: translateY(-20px);
}
</style>
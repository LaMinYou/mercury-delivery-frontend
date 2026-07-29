<template>
  <v-app>
    <v-app-bar color="green-darken-4" elevation="1" class="px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

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

      <div class="d-flex align-center">
        <v-avatar class="me-2" size="32" color="green-lighten-4">
          <!-- <v-img src="https://path-to-avatar.jpg"></v-img> -->
          <span class="text-red"> {{ admin?.name.charAt(0) }}</span>
        </v-avatar>
        <span class="text-subtitle-2">{{ admin?.name.split(" ")[0] || "Loading..." }}</span>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp" color="bg-green-lighten-5">
      <v-list density="compact" class="mt-5" nav>
        <v-list-item
          v-for="item in adminMenuItems"
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
        <slot />
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/api";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { adminMenuItems } from "@/services/menus";
import Footer from "./Footer.vue";

const router = useRouter();
const { mdAndUp } = useDisplay();
const drawer = ref(mdAndUp.value);
let admin = ref(null);

admin = JSON.parse(localStorage.getItem("user"));

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

// const getAdmin = async()=>{
//   try{
//       const res = await api.get('auth/admin');
//       admin.value = await res.data;
//   }catch(error){
//       console.log(error);
//   }
// }

// onMounted(() =>{
//   //getAdmin();
// })
</script>
<!-- light-green-accent-1 -->
 <style scoped>
.logo .logo-title {
  position: absolute;
  transform: translateY(-20px);
}
</style>
<template>
  <v-app>
    <v-app-bar color="green-darken-4" elevation="1" class="px-4">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <div class="logo">
          <router-link to="/admin">
            <v-img src="@/assets/images/momo.png" width="50" height="50" />
          <span class="logo-title text-white">Momo</span>
          </router-link>
        </div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar class="me-2" size="32">
        <!-- <v-img src="https://path-to-avatar.jpg"></v-img> -->
        <span class="text-red"> {{ admin?.name.charAt(0) }}</span>
      </v-avatar>
      <span class="text-subtitle-2">{{ admin?.name || 'Loading...' }}</span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :permanent="$vuetify.display.mdAndUp">
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
            <v-btn block 
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
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import api from '@/services/api';
  import { useDisplay } from 'vuetify';
  import { useRouter } from 'vue-router';
  import { adminMenuItems } from '@/services/menus';

  const router = useRouter();
  const { mdAndUp } = useDisplay();
  const drawer = ref(mdAndUp.value);
  let admin = ref(null);


  admin = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async() =>{
    try{
      await api.post('auth/logout');

    }catch(err){
      console.error("Backend logout failed, proceeding with frontend cleanup", err);
    }finally{
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }

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
  .logo .logo-title{
    position: absolute;
    transform: translateY(-20px);
  }
 </style>
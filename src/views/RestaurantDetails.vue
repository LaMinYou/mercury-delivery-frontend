<template>
  <admin-navbar>
    <v-container class="d-flex align-center justify-center flex-column" style="min-height: 100vh;">
    <div v-if="errorMessage">
        <alert :message="errorMessage" type="warning" color="red-accent-4" />
    </div>
    <v-card class="mx-auto px-4 py-4 card" max-width="600" width="100%">
      <v-form @submit.prevent="handleSubmit">
      
        <v-text-field
        v-model="restaurant.name"
        :rules="[rules.required('name')]"
        label="name"
        prepend-inner-icon="mdi-account"
        variant="solo"
        class="mt-2"
        bg-color="#fff"
        
      ></v-text-field>

      <v-text-field
        v-model="restaurant.email"
        :rules="[rules.required('email'), rules.email]"
        label="email"
        prepend-inner-icon="mdi-email"
        variant="solo"
        class="mt-2"
        bg-color="#fff"
        
      ></v-text-field>

      <v-text-field
        v-model="restaurant.username"
        :rules="[rules.required('username')]"
        label="username"
        prepend-inner-icon="mdi-account"
        variant="solo"
        class="mt-2"
        bg-color="#fff"
        
      ></v-text-field>

      <v-text-field
        v-model="restaurant.password"
        type="password"
        :rules="[rules.required('password'), rules.min(8)]"
        prepend-inner-icon="mdi-lock"
        variant="solo"
        label="password"
        class="mt-2"
      ></v-text-field>

      <v-text-field
        v-model="restaurant.phone"
        :rules="[rules.required('phone number'), rules.phone]"
        label="phone number"
        prepend-inner-icon="mdi-phone"
        variant="solo"
        class="mt-2"
        bg-color="#fff"
        
      ></v-text-field>

      <v-textarea
        v-model="restaurant.address"
        :rules="[rules.required('address')]"
        label="address"
        prepend-inner-icon="mdi-map-marker"
        variant="solo"
        class="mt-2"
        bg-color="#fff"
        
      ></v-textarea>

      <v-btn class="my-4 btn" 
            type="submit" 
            block
            color="green-darken-3"
            size="large"
            variant="elevated"
            prepend-icon="mdi-plus"
            >
        CREATE
      </v-btn>

    </v-form>
    </v-card>
  </v-container>
  </admin-navbar>
</template>

<script setup>
  import AdminNavbar from '@/components/AdminNavbar.vue';
  import { reactive, ref, watch } from 'vue'
  import { rules } from '@/services/rules';
  import api from '@/services/api';
  import { useRouter } from 'vue-router';
import Alert from '@/components/Alert.vue';

  const props = defineProps(['id']);
  const router = useRouter();
  const errorMessage = ref('');

  const restaurant = reactive({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  watch(() => restaurant.email, (newEmail) => {
    if (newEmail && newEmail.includes('@')) {
      // Split by @ and take the first part
      restaurant.username = newEmail.split('@')[0];
    } else {
      // Optional: keep username synced even before the @ is typed
      restaurant.username = newEmail;
    }
  });

  const addNew = async() =>{
    try{
      const res = await api.post('auth/admin/restaurant/new', restaurant);
      router.push('/');
      
    }catch(err){
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

  }

  const handleSubmit = async() =>{
    if(props.id == 'new'){
      addNew();
    }else{
      //
    }
  }

</script>
<style scoped>

.card{
  background: transparent;
  backdrop-filter: blur(10px);
}
</style>
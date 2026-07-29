<template>
  <div class="text-center pa-4">

    <v-dialog
      :model-value="openSignupBox"
      @update:model-value="$emit('closeSignupBox')"
      persistent
      width="auto"
    >
      <v-card max-width="400" min-width="300">
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="" @click="$emit('closeSignupBox')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card-text class="text-center">
            <p>Create an account to track your orders and get special offers.</p>
          <v-btn class="my-3" block size="large" color="green-darken-4" variant="outlined" @click="router.push('/customer/login')"> Login </v-btn>
          <v-btn block size="large" color="green-darken-4" variant="elevated">
            Sign up
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps(['openSignupBox']);
const emit = defineEmits(['closeSignupBox']);
</script>
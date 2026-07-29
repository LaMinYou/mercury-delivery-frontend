<template>
  <v-dialog
    max-width="500px"
    :model-value="openAlertDialog"
    @update:model-value="$emit('closeAlertDialog')"
    persistent
  >
    <v-card class="pa-2">
      <div class="text-center text-green-darken-2">
        <p class="text-wrap">
          {{ message }}
        </p>
        
        <v-btn 
            block
            @click="$emit('closeAlertDialog')"
            color="green-darken-2"
        >
            OK
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps([
  "openAlertDialog",
  "message",
]);
const emit = defineEmits(["closeAlertDialog"]);

</script>
<style scoped>
</style>
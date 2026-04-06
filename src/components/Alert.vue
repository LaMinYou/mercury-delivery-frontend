<template>
    <v-alert
      v-model="alert"
      border="start"
      close-label="Close Alert"
      :color="color"
      :type="type"
      closable
    >
      {{ message }}
    </v-alert>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps(['message', 'type', 'color']);
const alert = ref(true);

</script>


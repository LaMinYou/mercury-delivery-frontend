<template>
    <v-container
      class="text-center my-10 py-10 animate-fade-in"
    >
      <v-avatar size="100" color="green-lighten-4" class="mb-5">
        <v-icon size="30" color="green-darken-2"
          >mdi-wifi-strength-1-alert</v-icon
        >
      </v-avatar>
      <h3 class="text-h5 font-weight-bold grey-darken-3">
        Looks like you are offline
      </h3>
      <p class="text-grey-darken-1 mt-2 mb-6">
        Please check your internet connection and try again
      </p>

      <v-btn
        color="green-darken-4"
        size="large"
        rounded="lg"
        class="text-none px-10 text-white font-weight-bold"
        flat
        @click="$emit('retryFetch')"
      >
        Try again
      </v-btn>
    </v-container>
</template>

<script setup>
const emit = defineEmits(['retryFetch']);
</script>
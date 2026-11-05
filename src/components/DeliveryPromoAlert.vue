<template>
  <!-- activePromo ထဲမှာ Data ရှိမှသာ Banner ပေါ်မည် -->
  <v-alert
    v-if="activePromo && activePromo.id"
    color="deep-sea-blue"
    theme="dark"
    density="compact"
    class="text-center rounded-0 py-1 font-weight-bold mx-auto alert"
    closable
  >
    <div class="mt-1 text-center">
      <span class="falling-icon-wrapper mr-2">
        <v-icon icon="mdi-gift" color="amber-darken-1"></v-icon>
      </span>
      {{ activePromo.title }} is coming now!
    </div>
    <div class="text-center">
      <p>
        Enjoy 
        <span v-if="Number(activePromo.amount) === 0" class="text-yellow">FREE DELIVERY</span>
        <span v-else class="text-yellow">Delivery Fee {{ activePromo.amount }} Ks</span> 
         ({{ formatDate(activePromo.start_date) }} - {{ formatDate(activePromo.end_date) }})
      </p>
    </div>
  </v-alert>
</template>

<script setup>
import { formatDate } from '@/composables/dateTimeHelper';
const props = defineProps(['activePromo']);
</script>
<style scoped>
.alert{
  position: fixed;
  width: 95%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-top-left-radius: 16px !important;
  border-top-right-radius: 16px !important;
  overflow: hidden !important;
  z-index: 9999 !important;
}
.falling-icon-wrapper {
  display: inline-block;
  animation: fallAndRotate 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

@keyframes fallAndRotate {
  0% {
    transform: translateY(-20px) rotate(-15deg);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    transform: translateY(0px) rotate(15deg);
    opacity: 1;
  }
  85% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
}
</style>
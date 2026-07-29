<template>
  <v-card class="d-flex align-center justify-space-between px-3 position-relative" flat>
    <div>
      <v-card-title class="d-flex flex-column pa-0">
        <span class="text-title-medium font-weight-bold pb-1">{{ menu.subtitle }}</span>
        <span v-if="menu.discount_price" class="text-green-darken-2 font-weight-bold text-title-small">
          {{ menu.discount_price }} MMK
        </span>
        <span :class="{ 'text-decoration-line-through text-grey': menu.discount_price }" class="text-title-small text-green-darken-1">
          {{ menu.price }} MMK
        </span>
      </v-card-title>
      <v-card-subtitle class="text-wrap pa-0 mt-1">
        <p class="text-body-medium">{{ menu.description }}</p>
      </v-card-subtitle>
    </div>

    <div class="position-relative" style="height: 120px; width: 100px;">
      <v-card class="bg-white" flat>
        <v-img :src="menu.image_url" width="100" height="100" cover class="rounded-lg bg-grey-lighten-2">
          <template v-slot:error>
            <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
              <v-icon color="grey-darken-1" size="large">mdi-food-outline</v-icon>
            </div>
          </template>
        </v-img>
      </v-card>

      <div class="cart-action-container">
        <template v-if="quantity > 0">
          <div class="action-btn minus" @click="removeFromCart(menu.id)">
            <v-icon size="small">mdi-minus</v-icon>
          </div>
          <span class="qty-text">{{ quantity }}</span>
        </template>

        <div :class="['action-btn plus', {'is-disabled': isMaxReached}]" @click="addToCart(menu)">
          <v-icon size="small">mdi-plus</v-icon>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';

const props = defineProps(['menu']);
const { addToCart, removeFromCart, getItemQuantity } = useCart();

// လက်ရှိ Menu ရဲ့ အရေအတွက်ကို တွက်ချက်ခြင်း
const quantity = computed(() => getItemQuantity(props.menu.id));

const isMaxReached = computed(() =>{
  return quantity.value >= props.menu.available_count ; 
});
</script>

<style scoped>
.cart-action-container {
  position: absolute;
  right: 0;
  bottom: 5px;
  background: white;
  display: flex;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  padding: 2px;
}
.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
}
.plus { background: green; color: white; }
.minus { background: #f5f5f5; color: #333; }
.qty-text {
  padding: 0 8px;
  font-weight: bold;
  font-size: 14px;
}
.action-btn.plus.is-disabled {
  background: #cccccc !important;
  color: #666666 !important;
  cursor: not-allowed !important;
  pointer-events: none; /* Mouse Click ကို လုံးဝ ပိတ်ပစ်ခြင်း */
}
</style>
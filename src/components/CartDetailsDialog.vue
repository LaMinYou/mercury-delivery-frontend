<template>
<v-dialog 
    :model-value="openDetailsDialog" 
    @update:model-value="$emit('closeDetailsDialog')"
    persistent
    max-width="500px" 
    bottom>
      <v-card class="rounded-t-xl pa-4">
        <v-card-title class="d-flex justify-space-between align-center px-2">
          <div>
            <span class="font-weight-bold text-h6 d-block">ဈေးဝယ်ခြင်း</span>
            <span class="text-body-small text-grey">{{ restaurant.name }}</span>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="$emit('closeDetailsDialog')"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-list class="my-3">
          <v-list-item v-for="item in filteredItems" :key="item.id" class="px-1">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-img :src="item.image_url" width="50" height="50" cover class="rounded-lg mr-3 bg-grey-lighten-3"></v-img>
                <div>
                  <div class="font-weight-bold">{{ item.subtitle }}</div>
                  <div class="text-caption text-grey">MMK {{ item.finalPrice.toLocaleString() }}</div>
                </div>
              </div>
              
              <div class="d-flex align-center bg-grey-lighten-4 rounded-pill pa-1">
                <v-btn icon="mdi-minus" size="x-small" variant="text" @click="removeFromCart(item.id)"></v-btn>
                <span class="mx-3 font-weight-bold">{{ item.quantity }}</span>
                <v-btn icon="mdi-plus" size="x-small" variant="text" @click="addToCart(item)"></v-btn>
              </div>
            </div>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <div class="d-flex justify-space-between align-center my-4 px-2">
          <span class="font-weight-bold text-subtitle-1">စုစုပေါင်း ကျသင့်ငွေ:</span>
          <span class="font-weight-bold text-h6 text-green-darken-1">MMK {{ filteredTotalPrice.toLocaleString() }}</span>
        </div>

        <v-btn 
          color="green-darken-1" 
          block 
          size="large" 
          class="rounded-pill text-white font-weight-bold"
          @click="goCheckout"
        >
          ငွေပေးချေရန် ဆက်သွားမည်
        </v-btn>
      </v-card>
    </v-dialog>
</template>
<script setup>
import { useCart } from '@/composables/useCart';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { cart, totalPrice, addToCart, removeFromCart } = useCart();
const props = defineProps(['openDetailsDialog', 'restaurant']);
const emit = defineEmits(['closeDetailsDialog']);

const filteredItems = computed(() => {
    return cart.value.filter(item => item.restaurant_id === props.restaurant.id);
});

const filteredTotalPrice = computed(() => {
    return filteredItems.value.reduce((sum, item) => {
        return sum + (item.finalPrice * item.quantity);
    }, 0);
});

const goCheckout = () =>{
  localStorage.setItem('cartItems', JSON.stringify(filteredItems.value));
  emit('closeDetailsDialog');
  router.push('/customer/checkout');
  
}
</script>
<style scoped>

</style>
<template>
    <div class="bottom-cart-bar" v-if="filteredTotalItems" @click="openDetailsDialog=true">
      <div class="text-white totalCount">
        <span>{{ filteredTotalItems }}</span>
      </div>
      <div class="text-white d-flex flex-column align-center">
        <span class="text-title-medium font-weight-bold">
          ဈေးဝယ်ခြင်းအား ကြည့်ရန်
        </span>
        <span class="text-grey-lighten-2">{{ restaurant.name }}</span>
      </div>
      <div class="text-white font-weight-bold text-h6">
        MMK {{ filteredTotalPrice.toLocaleString() }}
      </div>
    </div>
    <cart-details-dialog 
        :openDetailsDialog="openDetailsDialog" 
        :restaurant="restaurant"
        @closeDetailsDialog="openDetailsDialog=false" 
    />
</template>
<script setup>
import CartDetailsDialog from './CartDetailsDialog.vue';
import { useCart } from '@/composables/useCart';
import { computed, ref } from 'vue';

const props = defineProps(['restaurant']);
const { cart, totalItems, totalPrice } = useCart();
const openDetailsDialog = ref(false);

const filteredItems = computed(() =>{
    return cart.value.filter(item => item.restaurant_id === props.restaurant.id);
})

const filteredTotalPrice = computed(() =>{
    return filteredItems.value.reduce((sum, item1) => {
        return sum + (item1.finalPrice * item1.quantity);
    }, 0)
});

const filteredTotalItems = computed(() => {
    return filteredItems.value.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0)
});

</script>
<style scoped>
.bottom-cart-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 900px;
  background: #43A047; /* မူရင်းပုံထဲကလို ပန်းရောင်ရင့်ရင့် */
  
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
  cursor: pointer;
  z-index: 99;
}
.totalCount span{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
}
</style>
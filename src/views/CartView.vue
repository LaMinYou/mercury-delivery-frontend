<template>
  <customer-navbar :address="userLocation.address" @search="router.push('/')">
    <div class="d-flex justify-start">
      <v-btn
        variant="text"
        color="blue-accent-3"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/')"
        size="large"
        class="text-none"
      >
        Back
      </v-btn>
    </div>
    <v-container>
      <v-row v-if="groupedCart.length > 0">
        <v-col cols="12" v-for="shop in groupedCart" :key="shop.id">
          <v-card class="px-5 py-2">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-1 font-weight-bold">
                {{ shop.name }}
              </span>
              <span @click="removeFromGroupedCart(shop.id)" class="cursor-pointer">
                <v-icon>mdi-close</v-icon>
              </span>
            </div>
            <div class="d-flex align-center overflow-x-auto py-2 mb-2">
              <div
                v-for="item in shop.items"
                :key="item.id"
                class="position-relative mr-3"
              >
                <v-badge
                  :content="item.quantity"
                  color="grey-darken-4"
                  location="bottom right"
                  offset-x="5"
                  offset-y="5"
                >
                  <v-img
                    :src="item.image_url"
                    width="40"
                    height="40"
                    cover
                    class="rounded-lg bg-grey-lighten-2"
                  ></v-img>
                </v-badge>
              </div>
            </div>
            <div class="d-flex align-center justify-space-between">
                <div>
                    စုစုပေါင်း
                </div>
                <div>
                  {{ shop.totalPrice }} MMK
                </div>
            </div>
            <div class="mt-3">
              <v-btn 
                color="green" 
                variant="outlined" 
                block
                :disabled="!isOfficeHour"
                @click="isOfficeHour ? showDetailsDialog(shop.items[0].restaurant) : null"
            >
                သင်၏ဈေးဝယ်လှည်းကို ကြည့်ရှုပါ
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else class="text-center justify-center py-12">
      <v-col cols="12">
        <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-basket-outline</v-icon>
        <div class="text-grey font-weight-bold">ဈေးဝယ်လှည်းထဲတွင် ပစ္စည်းမရှိသေးပါ</div>
      </v-col>
    </v-row>

    </v-container>
    <cart-details-dialog 
        :openDetailsDialog="openDetailsDialog" 
        :restaurant="restaurant"
        @closeDetailsDialog="openDetailsDialog=false" 
    />
  </customer-navbar>
</template>
<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import CartDetailsDialog from "@/components/CartDetailsDialog.vue";
import { useCart } from "@/composables/useCart";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userLocation = JSON.parse(localStorage.getItem("userLocation") || {});
const { groupedCart, removeFromGroupedCart } = useCart();
const openDetailsDialog = ref(false);

const restaurant = ref({});

const showDetailsDialog = (rest) =>{
    openDetailsDialog.value = true;
    restaurant.value = rest;
}

const isOfficeHour = computed(() => {
  const currentHour = new Date().getHours();
  return currentHour >= 8 && currentHour < 20;
});
</script>
<style scoped>
</style>
<template>
  <v-card
    :class="['mx-auto', 'bg-transparent', 'mb-3', !isAvailable? 'pointer-events-none cursor-text' : '']"
    max-width="300"
    flat
    cursor-pointer
    @click="isAvailable? redirectRestaurant(restaurant) : null"
  >
    <!-- Image Logic -->
    <v-card>
      <v-img
        :src="getDisplayImage(restaurant)"
        cover
        max-height="170"
        :class="['bg-grey-lighten-2', 'mx-auto', { 'cover-img': isAvailable }]"
      >
        <v-overlay :model-value="!isAvailable" contained persistent scrim="rgba(0,0,0,0.85)" class="dark-overlay d-flex justify-center align-center">
            <div class="pa-3 text-center h-100">
                <h4 class="text-white font-weight-bold">{{ reasonText }}</h4>
            </div>
        </v-overlay>
        <!-- show loading placeholder before image is shown -->
        <template v-slot:placeholder>
          <div
            class="d-flex align-center justify-center fill-height bg-grey-lighten-4"
          >
            <!-- <v-icon color="grey-darken-1" size="large">mdi-food-outline</v-icon> -->
            <v-img
              src="/images/food-placeholder.jpg"
              cover
              max-height="170"
              class="bg-grey-lighten-2 mx-auto cover-img"
            />
          </div>
        </template>
      </v-img>
    </v-card>

    <h3>{{ restaurant.name }}</h3>
    <v-card-subtitle class="pa-0 d-flex flex-column">
      <span>
        {{ 
        getDeliveryTime(
          restaurant.latitude, 
          restaurant.longitude, 
          userLoc.lat, 
          userLoc.lng, 
          restaurant.menus[0]?.prepare_time
        ) 
        }}
        .$$$. {{ restaurant.menus[0]?.subtitle }}
      </span>
      <span
        :class="{
          'text-decoration-line-through': restaurant.menus[0]?.discount_price,
        }"
      >
        Ks. {{ restaurant.menus[0]?.price }} MMK
      </span>
      <span v-if="restaurant.menus[0]?.discount_price">
        <v-chip color="green">
          <v-icon>mdi-sale</v-icon>
          Ks. {{ restaurant.menus[0]?.discount_price }} MMK
        </v-chip>
      </span>
    </v-card-subtitle>
  </v-card>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useHaversine } from "@/composables/useHaversine";
import { computed, ref } from "vue";

const { getDeliveryTime } = useHaversine();
const props = defineProps(["restaurant", "userLoc"]);
const router = useRouter();
const reasonText = ref(null);

const isAvailable = computed(() => {
  if(props.restaurant.status == 'inactive'){
    reasonText.value = `${props.restaurant.shop_message} တွင်ဖွင့်ပါမည်။`
    return false;
  }

  const currentHour = new Date().getHours();
  if(currentHour >= 24 || currentHour < 8){
    reasonText.value = "ည 8 PM မှ မနက် 8 AM အထိအသုံးပြု၍မရနိုင်ပါ။"
    return false;
  }
  return true;
});

const getDisplayImage = (restaurant) => {
  const defaultPlaceholder = "/images/restaurant-placeholder.png"; // သင့် placeholder path

  // ၁။ Tag နဲ့ ရှာလို့ ကိုက်ညီတဲ့ Menu ပုံရှိရင် အဲ့ဒါကို အရင်ယူမယ်
  if (restaurant.menus && restaurant.menus.length > 0) {
    return restaurant.menus[0].image_url;
  }

  // ၂။ Tag နဲ့ မရှာထားရင် (သို့မဟုတ်) Menu မရှိရင် Restaurant Cover ကို ယူမယ်
  if (restaurant.cover_image) {
    return restaurant.image_url;
  }

  // ၃။ နှစ်ခုလုံး မရှိရင် Placeholder ပြမယ်
  return defaultPlaceholder;
};

const redirectRestaurant = (restaurant) =>{
  router.push(`/customer/restaurant/${restaurant.id}/menus`)
}
</script>
<style scoped>
.dark-overlay{
  background-color: rgba(0,0,0, 0.5);
}
.cover-img {
  transition: 0.5s;
}
.cover-img:hover {
  transform: scale(1.3);
}
</style>
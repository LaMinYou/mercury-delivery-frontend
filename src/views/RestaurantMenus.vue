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
    <v-container fluid class="pa-0">
      <v-row no-gutters justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card flat rounded="lg" class="ma-4 overflow-hidden bg-transparent">
            <v-img
              :src="getDisplayImage(restaurant)"
              cover
              class="align-end text-white cover-img"
            >
            </v-img>
            <p class="text-center text-title-medium">{{ restaurant.name }}</p>
            <v-card-subtitle class="text-center text-wrap">
              <p class="ma-0">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ restaurant.address }}
              </p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-row class="my-3">
      <v-text-field
        density="compact"
        variant="solo-filled"
        :label="`Search menus in ${restaurant.name}`"
        prepend-inner-icon="mdi-magnify"
        single-line
        hide-details
        flat
        rounded="lg"
        bg-color="green-lighten-5"
        max-width="700"
        class="mx-auto"
        v-model="searchMenu"
        @keydown.enter="handleMenuSearch"
      ></v-text-field>
    </v-row>
    <v-row>
      <v-col v-for="menu in menus" :key="menu.id" cols="12" md="4" sm="6">
        <menu-card :menu="menu" />
      </v-col>
    </v-row>
    <bottom-cart-bar :restaurant="restaurant" />
  </customer-navbar>
</template>
<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import MenuCard from "@/components/MenuCard.vue";
import BottomCartBar from "@/components/BottomCartBar.vue";
import api from "@/services/api";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
// import { useCart } from "@/composables/useCart";

const router = useRouter();
const route = useRoute();
// const { cart, addToCart, removeFromCart, totalItems, totalPrice } = useCart();
const userLocation = JSON.parse(localStorage.getItem("userLocation") || "{}");
const props = defineProps(["id"]);
const menus = ref([]);
const restaurant = ref({});
const tagName = localStorage.getItem("tag");
const searchMenu = ref();

const getMenus = async () => {
  try {
    const res = await api.get(`restaurants/${props.id}/menus`, {
      params: {
        tag: tagName || null,
        searchMenu: route.query.searchMenu || null,
      },
    });

    menus.value = res.data;
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const getRestaurant = async () => {
  try {
    const res = await api.get(`restaurants/${props.id}`);
    restaurant.value = res.data;
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const getDisplayImage = (rest) => {
  const defaultPlaceholder = "/images/restaurant-placeholder.png";

  // ၁။ Cover Image ရှိရင် အရင်ပြ
  if (rest.cover_image) return rest.image_url;

  // ၂။ Cover မရှိရင် menus list ထဲက နောက်ဆုံးပုံကို ယူမယ်
  // menus ရှိမရှိနဲ့ count က 0 ထက်ကြီးမကြီး စစ်ပါတယ်
  if (rest.menus && rest.menus.length > 0) {
    const lastIndex = rest.menus.length - 1;
    return rest.menus[lastIndex].image_url;
  }

  return defaultPlaceholder;
};

const handleMenuSearch = () => {
  const params = [];
  if (searchMenu.value) {
    params["searchMenu"] = searchMenu.value;
  } else {
    delete params["searchMenu"];
  }
  router.push({ path: route.path, query: params });
};

watch(
  () => route.query,
  () => {
    getMenus();
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  //getMenus();
  getRestaurant();
});
</script>
<style scoped>
.cover-img {
  height: 300px;
}

@media (max-width: 450px) {
  .cover-img {
    height: 200px;
  }
}
</style>
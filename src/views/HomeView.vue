<template>
  <customer-navbar :address="userLocation.address" @search="updateFilters('search', $event)">

    <!-- show timeout and try again if data can't get -->
    <timeout-view v-if="isTimeout" @retryFetch="retryFetch" />

    <!-- show loading if data is currently fetching -->
    <customer-home-loading v-else-if="isLoading" />

    <!-- show data -->
    <div v-else>
      <!-- display tags -->
      <menu-tags-slide
        :tags="tags"
        @menuTag="(tag) => updateFilters('tag', tag)"
      />

      <!-- <v-row class="my-5">
      <v-col
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        cols="12"
        sm="6"
        md="3"
      >
        <restaurant-card :restaurant="restaurant" :userLoc="userLocation" />
      </v-col>
    </v-row> -->

      <div v-if="restaurants.foodShops && restaurants.foodShops.length > 0">
        <div class="my-5 px-3">
          <h2 class="text-subtitle-1 font-weight-bold text-green-darken-2">
            စားသောက်ဖွယ်ရာများနှင့် မုန့်မျိုးစုံ
          </h2>
        </div>

        <v-row>
          <v-col
            v-for="restaurant in restaurants.foodShops"
            :key="restaurant.id"
            cols="12"
            sm="6"
            md="3"
          >
            <restaurant-card :restaurant="restaurant" :userLoc="userLocation" />
          </v-col>
        </v-row>
      </div>

      <div v-if="restaurants.comesticShops && restaurants.comesticShops.length > 0"
      >
        <div class="my-5 px-3">
          <h2 class="text-title-medium font-weight-bold text-green-darken-2">
            အလှကုန်နှင့် လူသုံးကုန်ပစ္စည်းများ
          </h2>
        </div>

        <v-row>
          <v-col
            v-for="restaurant in restaurants.comesticShops"
            :key="restaurant.id"
            cols="12"
            sm="6"
            md="3"
          >
            <restaurant-card :restaurant="restaurant" :userLoc="userLocation" />
          </v-col>
        </v-row>
      </div>

      <div v-if="restaurants.otherShops && restaurants.otherShops.length > 0">
        <div class="my-5 px-3">
          <h2 class="text-title-medium font-weight-bold text-green-darken-2">
            အခြားအသုံးဆောင်ပစ္စည်းများ
          </h2>
        </div>

        <v-row>
          <v-col
            v-for="restaurant in restaurants.otherShops"
            :key="restaurant.id"
            cols="12"
            sm="6"
            md="3"
          >
            <restaurant-card :restaurant="restaurant" :userLoc="userLocation" />
          </v-col>
        </v-row>
      </div>

      <div v-if="restaurants.length == 0" class="pa-5 text-center text-grey w-100">
          <v-icon size="40" class="mb-2">mdi-folder-open-outline</v-icon>
          <div>
            No stores available at the moment.
          </div>
        </div>
    </div>
  </customer-navbar>
</template>

<script setup>
import CustomerNavbar from "@/components/CustomerNavbar.vue";
import RestaurantCard from "@/components/RestaurantCard.vue";
import api from "@/services/api";
import { onMounted, ref, watch } from "vue";
import MenuTagsSlide from "@/components/MenuTagsSlide.vue";
import { useRouter, useRoute } from "vue-router";
import CustomerHomeLoading from "@/components/loadings/CustomerHomeLoading.vue";
import TimeoutView from "@/components/TimeoutView.vue";

const router = useRouter();
const route = useRoute();
const tags = ref(null);
const restaurants = ref({
  foodShops: [],
  comesticShops: [],
  otherShops: [],
});
const isLoading = ref(true);
const isTimeout = ref(false);
const searchValue = ref(null);

const getTags = async () => {
  try {
    const res = await api.get("tags");
    tags.value = res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      console.log(err.response.data.message);
    } else {
      console.log("Network error or server unreachable:", err.message);
    }
  }
};

const updateFilters = (key, value) => {
  const newQuery = { ...route.query };
  if (value) {
    newQuery[key] = value;
  } else {
    delete newQuery[key];
  }

  router.push({ path: route.path, query: newQuery });
};

const getRestaurants = async () => {
  try {
    const res = await api.get("restaurants", {
      params: route.query,
    });
    restaurants.value = res.data;
    //console.log("Restaurants" + restaurants.value);
    isLoading.value = false;
  } catch (err) {
    isLoading.value = false;
    isTimeout.value = true;
    //console.log(err.response.data.errors);
  }
};

const retryFetch = () => {
  isLoading.value = true;
  isTimeout.value = false;
  getTags();
  getRestaurants();
}

// const getRestaurantsByTag = async (tag) => {
//   //alert(tag);
//   try{
//     const res = await api.get('restaurants', {
//       params: {
//         tag: tag || {}
//       }
//     });
//     restaurants.value = res.data;
//   }catch(err){
//     console.log(err.response.data.errors);
//   }
// }

const userLocation = ref({
  lat: null,
  lng: null,
  address: "",
});

// တည်နေရာ တောင်းမည့် Function
const requestLocation = () => {
  if (navigator.geolocation) {
    // ဤနေရာတွင် Browser မှ Dialog Box ကို အလိုအလျောက် ပြပါလိမ့်မည်
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLocation.value.lat = position.coords.latitude;
        userLocation.value.lng = position.coords.longitude;
        console.log("current location latitude " + position.coords.latitude);
        console.log("current location longitude " + position.coords.longitude);

        // Address ပြန်ယူခြင်း
        await getDetailedAddress(
          userLocation.value.lat,
          userLocation.value.lng
        );
        localStorage.setItem(
          "userLocation",
          JSON.stringify(userLocation.value)
        );
      },
      (error) => {
        console.error("User denied location or error occurred", error);
      }
    );
  }
};

// OpenStreetMap သုံးပြီး Address ယူခြင်း
const getDetailedAddress = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    // ဥပမာ - "နတ်မောက်လမ်း၊ ဗဟန်းမြို့နယ်၊ ရန်ကုန်"
    userLocation.value.address = data.display_name;
    console.log("Full Address:", data.display_name);
  } catch (err) {
    console.log("Address fetch error:", err);
  }
};

watch(
  () => route.query,
  () => {
    getRestaurants();
  },
  { deep: true }
);

onMounted(() => {
  getTags();
  getRestaurants();
  requestLocation();
});
</script>

<style scoped>
/* လက်နဲ့ Swipe လုပ်ရတာ ချောမွေ့စေဖို့ */
.tag-scroller-container :deep(.v-slide-group__content) {
  /* Mobile မှာ လက်နဲ့ဆွဲရင် ချောမွေ့စေရန် */
  overflow-x: auto;
  scrollbar-width: none; /* Firefox အတွက် scrollbar ဖျောက်ရန် */
  -ms-overflow-style: none; /* IE အတွက် */
  display: flex;
  user-select: none; /* စာသားတွေကို select မဖြစ်စေရန် */
}

/* Chrome, Safari, Edge အတွက် scrollbar ဖျောက်ရန် */
.tag-scroller-container :deep(.v-slide-group__content::-webkit-scrollbar) {
  display: none;
}

.tag-item {
  cursor: grab;
}

.tag-item:active {
  cursor: grabbing;
}
.menutag:hover {
  border: 4px solid green;
}
</style>

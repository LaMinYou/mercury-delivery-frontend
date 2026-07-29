<template>
  <restaurant-navbar>
    <!-- show loading if data is currently fetching -->
    <restaurant-home-loading v-if="isLoading" />

    <!-- show timeout page and try again if data can't get -->
    <timeout-view v-else-if="isTimeout" @retryFetch="retryFetch" />

    <!-- show data -->
    <v-container v-else fluid>
      <div v-if="orders.length === 0" class="text-center pa-5 text-grey">
        <span class="text-h1"><v-icon>mdi-magnify</v-icon></span>
        <p class="text-h1 font-weight-bold">လက်ရှိတွင် အော်ဒါအသစ်မရှိသေးပါ။</p>
      </div>

      <div v-else v-for="order in orders" :key="order.id" class="my-2">
        <order-card :order="order" @orderAccepted="handleOrderAccepted" />
      </div>
    </v-container>
  </restaurant-navbar>
</template>
<script setup>
import RestaurantNavbar from "@/components/RestaurantNavbar.vue";
import OrderCard from "@/components/OrderCard.vue";
import { onMounted, onUnmounted, ref } from "vue";
import api from "@/services/api";
import echo from "@/services/echo";
import RestaurantHomeLoading from "@/components/loadings/RestaurantHomeLoading.vue";
import TimeoutView from "@/components/TimeoutView.vue";

const orders = ref([]);
const user = JSON.parse(localStorage.getItem("user"));
const alertSound = new Audio("/images/noti1.wav");
const isLoading = ref(true);
const isTimeout = ref(false);

const getOrders = async () => {
  try{
    const res = await api.get(`auth/restaurant/${user.id}/orders`);
  orders.value = res.data;
  isLoading.value = false;
  }catch(err){
    isLoading.value = false;
    isTimeout.value = true;
    if(err.response && err.response.data){
      console.log(err.response.data.message);
    }else{
      console.log("Network error");
    }
  }
};

const listenToIncomingOrders = () => {
  console.log("Reverb Channel သို့ ချိတ်ဆက်နေပါသည်... ဆိုင်ရှင် ID:", user.id);

  echo
    .private(`restaurants.${user.id}`)
    .listen(".OrderCreated", (data) => {
      // 👈 Namespace အမှန်အတိုင်း ပြောင်းလဲထားပါသည်
      console.log("🎉 အော်ဒါအသစ် Live တန်းတက်လာပါပြီ-", data.order);

      //orders.value.unshift(data.order);
      getOrders();
      playAlert();
    })
    .error((error) => {
      // 💡 အကယ်၍ ချိတ်ဆက်မှု အမှားရှိပါက Console တွင် ကြည့်နိုင်ရန်
      console.error("Reverb ချိတ်ဆက်မှု အဆင်မပြေပါ-", error);
    });
};

const playAlert = () => {
  alertSound.play().catch((error) => {
    console.log("Browser Audio Restriction:", error);
  });
};

const handleOrderAccepted = (orderId) => {
  orders.value = orders.value.filter((item) => item.id !== orderId);
};
const retryFetch = () => {
  isLoading.value = true;
  isTimeout.value = false;
  getOrders();
  listenToIncomingOrders();
}

onMounted(() => {
  getOrders();
  listenToIncomingOrders();
});

onUnmounted(() => {
  echo.leave(`restaurants.${user.id}`);
});
</script>
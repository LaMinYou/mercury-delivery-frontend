<!-- <template>
  <v-card class="map-box rounded-xl mb-4 overflow-hidden position-relative" elevation="2">
    <div id="pure-mini-map" class="map-container"></div>
    
    <v-btn 
      icon="mdi-close" 
      size="x-small" 
      color="white" 
      class="position-absolute" 
      style="top: 10px; right: 10px; z-index: 99;"
      @click="$emit('close-map')"
    ></v-btn>
  </v-card>
</template>

<script setup>
import { onMounted, watch } from "vue";

// Parent ထံမှ Lat/Lng ကို တိုက်ရိုက် လက်ခံခြင်း
const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const emit = defineEmits(["map-dragged", "close-map"]);

let map = null;
let marker = null;
let geocoder = null;

onMounted(() => {
  initMap();
});

const initMap = () => {
  const currentLatLng = { lat: parseFloat(props.lat), lng: parseFloat(props.lng) };
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("pure-mini-map"), {
    center: currentLatLng,
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
  });

  marker = new google.maps.Marker({
    position: currentLatLng,
    map: map,
    draggable: true, // ပင်အပ်အား ဆွဲရွှေ့ခွင့်ပြုခြင်း
    animation: google.maps.Animation.DROP
  });

  // ပင်အပ်ကို ဆွဲရွှေ့လိုက်တဲ့အခါ တည်နေရာအသစ်ကို Parent ထံ ပြန်ပို့ခြင်း
  marker.addListener("dragend", () => {
    const position = marker.getPosition();
    const newLat = position.lat();
    const newLng = position.lng();
    
    // Coordinates ကနေ လိပ်စာစာသားကို ပြန်ပြောင်းခြင်း
    geocoder.geocode({ location: position }, (results, status) => {
      let addressText = "";
      if (status === "OK" && results[0]) {
        addressText = results[0].formatted_address;
      }
      
      // Parent ထံသို့ တည်နေရာအသစ် လှမ်းပို့ခြင်း
      emit("map-dragged", { lat: newLat, lng: newLng, address: addressText });
    });
  });
};

// Parent ဘက်က Lat/Lng ပြောင်းလဲသွားရင် မြေပုံကို လိုက်ရွှေ့ပေးရန် စောင့်ကြည့်ခြင်း (Watch)
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && marker && newLat && newLng) {
    const nextLatLng = { lat: parseFloat(newLat), lng: parseFloat(newLng) };
    map.setCenter(nextLatLng);
    marker.setPosition(nextLatLng);
  }
});
</script>

<style scoped>
.map-box {
  border: 1px solid #e0e0e0;
}
.map-container {
  width: 100%;
  height: 180px; /* မြေပုံ သီးသန့် အမြင့် */
}
</style> -->

<template>
  <v-card class="map-box rounded-xl mb-4 overflow-hidden position-relative" elevation="2">
    <div ref="mapContainer" class="map-container"></div>
    
    <v-btn 
      icon="mdi-close" 
      size="x-small" 
      color="white" 
      class="position-absolute" 
      style="top: 10px; right: 10px; z-index: 99;"
      @click="$emit('close-map')"
    ></v-btn>
  </v-card>
</template>

<script setup>
import { onMounted, watch, ref } from "vue"; // 💡 ref ကို ထည့်သွင်းပေးပါ

// Parent ထံမှ Lat/Lng ကို တိုက်ရိုက် လက်ခံခြင်း
const props = defineProps({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const emit = defineEmits(["map-dragged", "close-map"]);

// 💡 Map Container Div ကို လှမ်းချိတ်ဖို့ ref ဆောက်ရပါမယ်
const mapContainer = ref(null);

let map = null;
let marker = null;
let geocoder = null;

onMounted(() => {
  initMap();
});

const initMap = () => {
  const currentLatLng = { lat: parseFloat(props.lat), lng: parseFloat(props.lng) };
  geocoder = new google.maps.Geocoder();

  // 💡 document.getElementById အစား mapContainer.value ကို တိုက်ရိုက်ထည့်ပေးလိုက်ခြင်းဖြင့် 
  // Component တစ်ခုချင်းစီရဲ့ သီးသန့် Div ထဲမှာပဲ မြေပုံဆွဲပေးမှာ ဖြစ်ပါတယ်
  map = new google.maps.Map(mapContainer.value, {
    center: currentLatLng,
    zoom: 16,
    mapTypeControl: false,
    streetViewControl: false,
  });

  marker = new google.maps.Marker({
    position: currentLatLng,
    map: map,
    draggable: true, // ပင်အပ်အား ဆွဲရွှေ့ခွင့်ပြုခြင်း
    animation: google.maps.Animation.DROP
  });

  // ပင်အပ်ကို ဆွဲရွှေ့လိုက်တဲ့အခါ တည်နေရာအသစ်ကို Parent ထံ ပြန်ပို့ခြင်း
  marker.addListener("dragend", () => {
    const position = marker.getPosition();
    const newLat = position.lat();
    const newLng = position.lng();
    
    // Coordinates ကနေ လိပ်စာစာသားကို ပြန်ပြောင်းခြင်း
    geocoder.geocode({ location: position }, (results, status) => {
      let addressText = "";
      if (status === "OK" && results[0]) {
        addressText = results[0].formatted_address;
      }
      
      // Parent ထံသို့ တည်နေရာအသစ် လှမ်းပို့ခြင်း
      emit("map-dragged", { lat: newLat, lng: newLng, address: addressText });
    });
  });
};

// Parent ဘက်က Lat/Lng ပြောင်းလဲသွားရင် မြေပုံကို လိုက်ရွှေ့ပေးရန် စောင့်ကြည့်ခြင်း (Watch)
watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && marker && newLat && newLng) {
    const nextLatLng = { lat: parseFloat(newLat), lng: parseFloat(newLng) };
    map.setCenter(nextLatLng);
    marker.setPosition(nextLatLng);
  }
});
</script>

<style scoped>
.map-box {
  border: 1px solid #e0e0e0;
}
.map-container {
  width: 100%;
  height: 180px; /* မြေပုံ သီးသန့် အမြင့် */
}
</style>
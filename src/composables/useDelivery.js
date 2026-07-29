import { ref } from 'vue';
import axios from 'axios';

export function useDelivery() {
  const isRainy = ref(false);
  const isPeakHour = ref(false);
  const distance = ref(0); // KM ဖြင့် သိမ်းမည်
  const deliveryFee = ref(1500); // Default Base Fee
  const loading = ref(false);

  // ----------------------------------------------------
  // ၁။ Haversine Formula ဖြင့် သင်္ချာနည်းအရ KM တွက်ချက်ခြင်း
  // ----------------------------------------------------
  const calculateDistanceKM = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // ကမ္ဘာမြေကြီး၏ အချင်းဝက် (Kilometers)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // တည့်တည့်တိုင်းထွက်လာသော အကွာအဝေး (As the crow flies)
    
    // လမ်းကွေ့လမ်းကောက်များအတွက် Delivery App များသည် ပုံမှန်အားဖြင့် ၁.၃ သို့မဟုတ် ၁.၄ နှင့် မြှောက်လေ့ရှိသည်
    const realDrivingDistance = d * 1.3; 
    
    distance.value = parseFloat(realDrivingDistance.toFixed(2)); // ဒဿမ ၂ နေရာအထိ ဖြတ်ယူမည်
    return distance.value;
  };

  // ----------------------------------------------------
  // ၂။ စားချိန်သောက်ချိန် (Peak Hour) ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  // ----------------------------------------------------
  const checkIsPeakHour = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + (minutes / 60);

    const isLunchPeak = (currentTime >= 11.0 && currentTime <= 13.5); // 11:00 AM - 1:30 PM
    const isDinnerPeak = (currentTime >= 17.5 && currentTime <= 20.0); // 5:30 PM - 8:00 PM

    isPeakHour.value = isLunchPeak || isDinnerPeak;
    return isPeakHour.value;
  };

  // ----------------------------------------------------
  // ၃။ Open-Meteo API သုံးပြီး Real-time မိုးရွာ၊ မရွာ စစ်ဆေးခြင်း
  // ----------------------------------------------------
  const checkIsRainy = async (lat, lng) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=rain,showers`;
      const response = await axios.get(url);
      const current = response.data?.current;
      
      isRainy.value = (current?.rain > 0 || current?.showers > 0);
      return isRainy.value;
    } catch (error) {
      console.error("Weather API Error:", error);
      isRainy.value = false;
      return false;
    }
  };

  // ----------------------------------------------------
  // ၄။ အချက်အလက်အားလုံးကို စုစည်းပြီး ပို့ဆောင်ခ တွက်ချက်ခြင်း
  // ----------------------------------------------------
  const calculateDeliveryFee = async (customerLat, customerLng, restaurantLat, restaurantLng) => {
    loading.value = true;
    
    // အကွာအဝေး တွက်ချက်ခြင်း
    const km = calculateDistanceKM(restaurantLat, restaurantLng, customerLat, customerLng);
    
    // Peak Hour နှင့် မိုးရွာခြင်း စစ်ဆေးခြင်း
    checkIsPeakHour();
    await checkIsRainy(customerLat, customerLng);

    // တွက်ချက်မှု ပုံသေနည်း (Formula Logic)
    const baseFee = 1000;   // ၁ ကီလိုမီတာ အောက်
    const perKmRate = 500;  // ပိုလာမည့် ကီလိုမီတာအလိုက်
    const baseDistance = 1;
    
    let totalFee = baseFee;
    if (km > baseDistance) {
      const extraDistance = km - baseDistance;
      totalFee += extraDistance * perKmRate;
    }
    
    // Surge Multiplier တွက်ခြင်း
    let surge = 1.0;
    if (isPeakHour.value) surge += 0.2; // ၂၀% ပိုတောင်းမည်
    if (isRainy.value) surge += 0.3;    // ၃၀% ပိုတောင်းမည်
    
    // ရာဂဏန်း အနီးစပ်ဆုံးသို့ ဖြတ်ချခြင်း
    deliveryFee.value = Math.ceil((totalFee * surge) / 100) * 100;
    
    loading.value = false;
    return deliveryFee.value;
  };

  return {
    isRainy,
    isPeakHour,
    distance,
    deliveryFee,
    loading,
    calculateDeliveryFee
  };
}
import { ref } from 'vue';
import axios from 'axios';
import api from '@/services/api';
//import { getActiveDeliveryPromo } from './useDeliveryPromo';

export function useDelivery() {
  const isRainy = ref(false);
  const isPeakHour = ref(false);
  const distance = ref(0); // store with KM
  const deliveryFee = ref(1500); // Default Base Fee
  const loading = ref(false);

  // cacculate distance by using Haversine Formula
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

  //check for peak hour
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

  // check for Rainy real-time using Open-Meteo API
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

  const getActiveDeliveryPromo = async () => {
    try {
      const res = await api.get('/delivery-promo');
      if (res?.data && res?.data?.id) {
        return res.data;
      }
    } catch (err) {
      console.error("Error fetching promo:", err);
    }
    return null;
  };

  // calculate delivery fee
  // const calculateDeliveryFee = async (customerLat, customerLng, restaurantLat, restaurantLng) => {
  //   loading.value = true;

  //   try {
  //     const activePromo = await getActiveDeliveryPromo();
  //     if (activePromo && activePromo.id) {
  //       if (activePromo.promo_type === 'free') {
  //         deliveryFee.value = 0;
  //       } else {
  //         deliveryFee.value = Number(activePromo.amount) || 0;
  //       }
  //       return deliveryFee.value;
  //     }

  //     // calculate distance
  //     const km = calculateDistanceKM(restaurantLat, restaurantLng, customerLat, customerLng);

  //     // check for Peak Hour and Rainy
  //     checkIsPeakHour();
  //     await checkIsRainy(customerLat, customerLng);

  //     //make delivery fee to fixed for too far distance
  //     const maxDistanceThreshold = 13;
  //     const maxDeliveryFee = 7000;

  //     if (km >= maxDistanceThreshold) {
  //       deliveryFee.value = maxDeliveryFee;
  //       return deliveryFee.value;
  //     }

  //     // formula
  //     const baseFee = 500;   // below 1 km
  //     const perKmRate = 500;  // per km rate for every above 1 km
  //     const baseDistance = 1;

  //     let totalFee = baseFee;
  //     if (km > baseDistance) {
  //       const extraDistance = km - baseDistance;
  //       totalFee += extraDistance * perKmRate;
  //     }

  //     // calculate Surge Multiplier
  //     let surge = 1.0;
  //     if (isPeakHour.value) surge += 0.2; // get more 15% 
  //     if (isRainy.value) surge += 0.3;    // get more 20%

  //     let calculatedFee = Math.ceil((totalFee * surge) / 100) * 100;

  //     //control to prevent overflow Max Fee even Surge
  //     deliveryFee.value = Math.min(calculatedFee, maxDeliveryFee);

  //   } catch (err) {
  //     console.error('Error calculating delivery fee:', err);
  //   } finally{
  //     loading.value = false;
  //   }
  //   return deliveryFee.value;
  // };

  // calculate delivery fee
  const calculateDeliveryFee = async (customerLat, customerLng, restaurantLat, restaurantLng) => {
    loading.value = true;

    try {
      const activePromo = await getActiveDeliveryPromo();
      if (activePromo && activePromo.id) {
        if (activePromo.promo_type === 'free') {
          deliveryFee.value = 0;
        } else {
          deliveryFee.value = Number(activePromo.amount) || 0;
        }
        return deliveryFee.value;
      }

      // calculate distance
      const km = calculateDistanceKM(restaurantLat, restaurantLng, customerLat, customerLng);

      // check for Peak Hour and Rainy (Safe execution)
      checkIsPeakHour();
      try {
        await checkIsRainy(customerLat, customerLng);
      } catch (e) {
        console.warn("Skipping rain check due to API failure");
        isRainy.value = false;
      }

      //make delivery fee to fixed for too far distance
      const maxDistanceThreshold = 13;
      const maxDeliveryFee = 7000;

      if (km >= maxDistanceThreshold) {
        deliveryFee.value = maxDeliveryFee;
        return deliveryFee.value;
      }

      // formula
      const baseFee = 500;   // below 1 km
      const perKmRate = 500;  // per km rate for every above 1 km
      const baseDistance = 1;

      let totalFee = baseFee;
      if (km > baseDistance) {
        const extraDistance = km - baseDistance;
        totalFee += extraDistance * perKmRate;
      }

      // calculate Surge Multiplier
      let surge = 1.0;
      if (isPeakHour.value) surge += 0.2; 
      if (isRainy.value) surge += 0.3;    

      let calculatedFee = Math.ceil((totalFee * surge) / 100) * 100;

      //control to prevent overflow Max Fee even Surge
      deliveryFee.value = Math.min(calculatedFee, maxDeliveryFee);

    } catch (err) {
      console.error('Error calculating delivery fee:', err);
      deliveryFee.value = 1000; 
    } finally {
      loading.value = false;
    }
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
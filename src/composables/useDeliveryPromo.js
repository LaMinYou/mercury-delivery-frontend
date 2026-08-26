export const setDeliveryPromo = (promoData) => {
  localStorage.setItem('activeDeliveryPromo', JSON.stringify(promoData));
};

export const getActiveDeliveryPromo = () => {
  const data = localStorage.getItem('activeDeliveryPromo');
  if (!data) return null;

  try {
    const promo = JSON.parse(data);
    const now = new Date().getTime();
    const start = new Date(promo.startDate).getTime();
    const end = new Date(promo.endDate).getTime();

    // ၁။ Start Date နှင့် End Date အကြား ရောက်မှသာ Promo ပြမည်
    if (now >= start && now <= end) {
      return promo;
    }

    // ၂။ သက်တမ်း ကုန်သွားမှသာ (End Date လွန်သွားမှ) ဖျက်ထုတ်မည်
    if (now > end) {
      localStorage.removeItem('activeDeliveryPromo');
    }

    return null; // စမဖြစ်သေးပါက သို့မဟုတ် ကုန်သွားပါက null ပြန်မည်
  } catch (err) {
    console.error('Error parsing delivery promo:', err);
    return null;
  }
};
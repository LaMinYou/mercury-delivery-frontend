export function useHaversine() {
    const getDeliveryTime = (restLat, restLng, userLat, userLng, prepareTime) => {
        const toRad = (value) => (value * Math.PI) / 180;

        if (!userLat || !userLng || !restLat || !restLng) {
            return "30-50 min"; // default value တစ်ခု ထားပေးပါ
        }

        const R = 6371; // Earth Radius in KM
        const dLat = toRad(restLat - userLat);
        const dLon = toRad(restLng - userLng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(userLat)) *
            Math.cos(toRad(restLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        // ၁.၅ ကီလိုမီတာအောက် ဆိုရင် ချက်ချင်း return ပြန်မယ်
        if (distance < 1.5) return "15 - 25 min";

        // ၂။ Time ခန့်မှန်းခြင်း
        const prepTime = prepareTime;
        const minutesPerKm = 4; // ပိုမြန်အောင် ၄ မိနစ်နှုန်းပဲ ထားကြည့်ပါ
        const travelTime = Math.round(distance * minutesPerKm);
        const totalMin = prepTime + travelTime;

        // ၅ မိနစ် အတိုးအလျှော့ Range ပြချင်ရင်
        return `${totalMin} - ${totalMin + 5} min`;
    }

    return {
        getDeliveryTime
    }
}
import { ref, computed } from 'vue';

const cart = ref([]);
const CART_STORAGE_KEY = 'customer_shopping_cart';
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // take time for one day

/**
 * save cart data into localStorage
 */
const saveCartToStorage = () => {
  const cartData = {
    items: cart.value,
    expiry: Date.now() + ONE_DAY_IN_MS // add 24hr now
  };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
};

/**
 * load cart data from localStorage
 */
const loadCartFromStorage = () => {
  const rawData = localStorage.getItem(CART_STORAGE_KEY);
  if (!rawData) return;

  try {
    const cartData = JSON.parse(rawData);

    if (Date.now() > cartData.expiry) {
      localStorage.removeItem(CART_STORAGE_KEY);
      cart.value = [];
    } else {
      cart.value = cartData.items;
    }
  } catch (e) {
    console.error("Error loading cart from storage", e);
  }
};
loadCartFromStorage();

export function useCart() {

  // Cart ထဲ ပစ္စည်းထည့်ခြင်း / တိုးခြင်း
  const addToCart = (menu) => {
    const item = cart.value.find(i => i.id === menu.id);
    if (item) {
      if(item.quantity < menu.available_count){
        item.quantity++;
      }else{
        console.log('out of stock');
        return;
      }
    } else {
      if(menu.available_count <= 0) return;
      // ဈေးနှုန်းတွက်ချက်ရာမှာ discount ရှိရင် discount စျေးကို ယူမယ်
      const finalPrice = menu.discount_price ? Number(menu.discount_price) : Number(menu.price);
      cart.value.push({
        ...menu,
        finalPrice,
        quantity: 1
      });
    }
    saveCartToStorage();
  };

  // Cart ထဲက ပစ္စည်း လျှော့ခြင်း
  const removeFromCart = (menuId) => {
    const item = cart.value.find(i => i.id === menuId);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        // ၀ ဖြစ်သွားရင် ကတ်ထဲက လုံးဝ ဖျက်ထုတ်မယ်
        cart.value = cart.value.filter(i => i.id !== menuId);
      }
    }
    saveCartToStorage();
  };

  const removeFromCartAfterOrder = (menuId) => {
    cart.value = cart.value.filter(item => item.id !== menuId);
    saveCartToStorage();
  }

  // Menu တစ်ခုချင်းစီအလိုက် လက်ရှိ Cart ထဲမှာ အရေအတွက် ဘယ်လောက်ရှိလဲ သိချင်ရင်
  const getItemQuantity = (menuId) => {
    const item = cart.value.find(i => i.id === menuId);
    return item ? item.quantity : 0;
  };

  // ပစ္စည်း စုစုပေါင်း အရေအတွက် (အောက်ခြေ ဘားမှာ ပြရန်)
  const totalItems = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // ကျသင့်ငွေ စုစုပေါင်း (အောက်ခြေ ဘားမှာ ပြရန်)
  const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  });

  // grouped items in the cart that have the same restaurantId
  const groupedCart = computed(() => {
    let group = {};

    cart.value.forEach((item) => {
      const restaurantId = item.restaurant_id;
      if (!group[restaurantId]) {
        group[restaurantId] = {
          id: restaurantId,
          name: item.restaurant.name,
          items: [],
          totalPrice: 0,
          totalQty: 0,
        };
      }
      group[restaurantId].items.push(item);
      group[restaurantId].totalPrice += item.finalPrice * item.quantity;
      group[restaurantId].totalQty += item.quantity;
    });

    return Object.values(group).sort((a, b) => b.totalQty - a.totalQty);
  });

  const removeFromGroupedCart = (restaurantId) => {
    cart.value =  cart.value.filter(item => item.restaurant_id !== restaurantId);
    saveCartToStorage();
  }

  // ကတ်တစ်ခုလုံးကို ရှင်းလင်းပစ်ရန်
  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    removeFromCartAfterOrder,
    getItemQuantity,
    totalItems,
    totalPrice,
    groupedCart,
    removeFromGroupedCart,
    clearCart
  };
}
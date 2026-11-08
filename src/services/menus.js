import { icon } from "leaflet";

export const adminMenuItems = [
  { title: 'admin_menus.home', icon: 'mdi-home', route: '/admin' },
  { title: 'admin_menus.item_categories', icon: 'mdi-layers-triple', route: '/admin/menu-categories' },
  { title: 'admin_menus.tags', icon: 'mdi-tag-outline', route: '/admin/tags' },
  { title: 'admin_menus.customers', icon: 'mdi-account', route: '/admin/customers' },
  { title: 'admin_menus.shops', icon: 'mdi-store-marker', route: '/admin/restaurants' },
  { title: 'admin_menus.riders', icon: 'mdi-bike', route: '/admin/riders' },
  // { title: 'Add New Restaurant', icon: 'mdi-store-plus', route: { name: 'newRestaurant', params: { id: 'new' } } },
  { title: 'admin_menus.payment_methods', icon: 'mdi-credit-card-outline', route: '/admin/payments' },
  { title: 'admin_menus.payment_transactions', icon: 'mdi-swap-horizontal', route: '/admin/transactions' },
  { title: 'admin_menus.delivery_assigned_history', icon: 'mdi-history', route: '/admin/order-rider-offers' },
  { title: 'admin_menus.invoice_history', icon: 'mdi-note-text-outline', route: '/admin/invoice-history' },
  { title: 'admin_menus.delivery_promo', icon: 'mdi-percent-outline', route: '/admin/delivery-promo' },
  { title: 'admin_menus.settings', icon: 'mdi-cog-outline', route: '/admin/settings' },
];

export const restaurantMenuItems = [
  { title: 'restaurant_menus.pending_orders', icon: 'mdi-cart-plus', route: '/restaurant' },
  { title: 'restaurant_menus.products', icon: 'mdi-shopping', route: '/restaurant/menus' },
  { title: 'restaurant_menus.call_rider', icon: 'mdi-bike', route: '/restaurant/call-rider' },
  { title: 'restaurant_menus.call_rider_history', icon: 'mdi-history', route: '/restaurant/call-rider-history' },
  { title: 'restaurant_menus.order_history', icon: 'mdi-history', route: '/restaurant/order-history' },
  { title: 'restaurant_menus.customers', icon: 'mdi-account', route: '/restaurant/customers' }
];

export const customerMenuItems = [
  { title: 'customer_menus.home', icon: 'mdi-home', route: '/' },
  { title: 'customer_menus.mercury_express', icon: 'mdi-bike', route: '/customer/express' },
  { title: 'customer_menus.current_orders', icon: 'mdi-cart-plus', route: '/customer/current-orders' },
  { title: 'customer_menus.order_history', icon: 'mdi-history', route: '/customer/completed-orders' },

];

export const customerMobileMenuItems = [
  { title: 'customer_mobile_menus.express', icon: 'mdi-bike', route: '/customer/express' },
  { title: 'customer_mobile_menus.orders', icon: 'mdi-cart-plus', route: '/customer/current-orders' },
  { title: 'customer_mobile_menus.history', icon: 'mdi-history', route: '/customer/completed-orders' },
]

export const riderMenuItems = [
  { title: 'rider_menus.current_orders', icon: 'mdi-clock-fast', route: '/rider' },
  { title: 'rider_menus.order_history', icon: 'mdi-history', route: '/rider/order-history' }
];

export const riderMobileMenuItems = [
  { title: 'rider_mobile_menus.current_orders', icon: 'mdi-clock-fast', route: '/rider' },
  { title: 'rider_mobile_menus.history', icon: 'mdi-history', route: '/rider/order-history' }
];
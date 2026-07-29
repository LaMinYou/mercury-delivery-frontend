import { icon } from "leaflet";

export const adminMenuItems = [
  { title: 'Home', icon: 'mdi-home', route: '/admin' },
  { title: 'Item Categories', icon: 'mdi-layers-triple', route: '/admin/menu-categories' },
  { title: 'Tags', icon: 'mdi-tag-outline', route: '/admin/tags' },
  { title: 'Customers', icon: 'mdi-account', route: '/admin/customers' },
  { title: 'Shops', icon: 'mdi-store-marker', route: '/admin/restaurants' },
  { title: 'Riders', icon: 'mdi-bike', route: '/admin/riders' },
  // { title: 'Add New Restaurant', icon: 'mdi-store-plus', route: { name: 'newRestaurant', params: { id: 'new' } } },
  { title: 'Payment Methods', icon: 'mdi-credit-card-outline', route: '/admin/payments' },
  { title: 'Payment Transactions', icon: 'mdi-swap-horizontal', route: '/admin/transactions' },
  { title: 'Delivery Assigned History', icon: 'mdi-history', route: '/admin/order-rider-offers' },
  { title: 'Analytics', icon: 'mdi-chart-line', route: '' },
];

export const restaurantMenuItems = [
  { title: 'Pending Orders', icon: 'mdi-cart-plus', route: '/restaurant' },
  { title: 'Products', icon: 'mdi-shopping', route: '/restaurant/menus' },
  { title: 'Call Rider', icon: 'mdi-bike', route: '/restaurant/call-rider' },
  { title: 'Order History', icon: 'mdi-history', route: '/restaurant/order-history' },
  { title: 'Customers', icon: 'mdi-account', route: '/restaurant/customers' }
];

export const customerMenuItems = [
  { title: 'Home', icon: 'mdi-home', route: '/' },
  { title: 'Mercury Express', icon: 'mdi-bike', route: '/customer/express' },
  { title: 'Current Orders', icon: 'mdi-cart-plus', route: '/customer/current-orders' },
  { title: 'Order History', icon: 'mdi-history', route: '' },

];

export const riderMenuItems = [
  { title: 'Current Orders', icon: 'mdi-clock-fast', route: '/rider' },
  { title: 'Order History', icon: 'mdi-history', route: '/rider/order-history' }
];
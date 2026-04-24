import { icon } from "leaflet";

export const adminMenuItems = [
  { title: 'Home', icon: 'mdi-home', route: '/admin' },
  { title: 'Pending Orders', icon: 'mdi-cart-plus', route: '' },
  { title: 'Menu Categories', icon: 'mdi-layers-triple', route: '/admin/menu-categories' },
  { title: 'Customers', icon: 'mdi-account', route: '' },
  { title: 'Restaurants', icon: 'mdi-store-marker', route: '/admin/restaurants' },
  { title: 'Riders', icon: 'mdi-bike', route: '/admin/riders' },
  // { title: 'Add New Restaurant', icon: 'mdi-store-plus', route: { name: 'newRestaurant', params: { id: 'new' } } },
  { title: 'Delivery History', icon: 'mdi-history', route: '' },
  { title: 'Analytics', icon: 'mdi-chart-line', route: '' },
];

export const restaurantMenuItems = [
  { title: 'Pending Orders', icon: 'mdi-cart-plus', route: '' },
  { title: 'Menus', icon: 'mdi-silverware', route: '/restaurant/menus' },
  { title: 'Order History', icon: 'mdi-history', route: '' },
];
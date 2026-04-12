import { icon } from "leaflet";

export const adminMenuItems = [
  { title: 'Pending Orders', icon: 'mdi-cart-plus', route: '' },
  { title: 'Menu Categories', icon: 'mdi-layers-triple', route: '/admin/menu-categories' },
  { title: 'Customers', icon: 'mdi-account', route: '' },
  { title: 'Restaurants', icon: 'mdi-store-marker', route: '/admin/restaurants' },
  { title: 'Riders', icon: 'mdi-bike', route: '' },
  // { title: 'Add New Restaurant', icon: 'mdi-store-plus', route: { name: 'newRestaurant', params: { id: 'new' } } },
  { title: 'Add New Rider', icon: 'mdi-account-plus', route: '' },
  { title: 'Delivery History', icon: 'mdi-history', route: '' },
  { title: 'Analytics', icon: 'mdi-chart-line', route: '' },
];

export const restaurantMenuItems = [
  { title: 'Pending Orders', icon: 'mdi-cart-plus', route: '' },
  { title: 'Available Menus', icon: 'mdi-silverware', route: '' },
  { title: 'Order History', icon: 'mdi-history', route: '' }
];
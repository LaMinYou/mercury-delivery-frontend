
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminHome from '@/views/AdminHome.vue'
import LoginForm from '@/views/LoginForm.vue';
import RestaurantDetails from '@/views/RestaurantDetails.vue';
import Restaurants from '@/views/Restaurants.vue';
import RestaurantHome from '@/views/RestaurantHome.vue';
import Categories from '@/views/Categories.vue';
import CategoryDetails from '@/views/CategoryDetails.vue';
import MenuDetails from '@/views/MenuDetails.vue';
import Menus from '@/views/Menus.vue';
import RiderDetails from '@/views/RiderDetails.vue';
import Riders from '@/views/Riders.vue';
import TagDetails from '@/views/TagDetails.vue';
import Tags from '@/views/Tags.vue';
import RestaurantMenus from '@/views/RestaurantMenus.vue';
import CartView from '@/views/CartView.vue';
import PaymentMethodDetails from '@/views/PaymentMethodDetails.vue';
import PaymentMethods from '@/views/PaymentMethods.vue';
import Checkout from '@/views/Checkout.vue';
import PaymentTransactions from '@/views/PaymentTransactions.vue';
import RiderHome from '@/views/RiderHome.vue';
import RiderOrderHistory from '@/views/RiderOrderHistory.vue';
import CustomerCurrentOrders from '@/views/CustomerCurrentOrders.vue';
import CustomerCurrentOrderDetails from '@/views/CustomerCurrentOrderDetails.vue';
import SocialCallback from '@/views/SocialCallback.vue';
import CustomerLogin from '@/views/CustomerLogin.vue';
import MomoExpress from '@/views/MomoExpress.vue';
import CallRiderFromShop from '@/views/CallRiderFromShop.vue';
import RestaurantOrderHistory from '@/views/RestaurantOrderHistory.vue';
import DeliverAssignedHistory from '@/views/DeliverAssignedHistory.vue';
import Customers from '@/views/Customers.vue';
import RestaurantCustomers from '@/views/RestaurantCustomers.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { 
    path: '/about', 
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/admin',
    name: 'admin',       // must be a string
    component: AdminHome,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm
  },
  {
    path: '/admin/restaurant/:id',
    name: 'newRestaurant',
    component: RestaurantDetails,
    props: true,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/restaurants',
    name: 'restaurants',
    component: Restaurants,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/riders',
    name: 'riders',
     component: Riders,
     meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/rider/:id',
    name: 'rider',
    component: RiderDetails,
    props: true,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/menu-categories',
    name: 'categories',
    component: Categories,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/menu-category/:id',
    name: 'categoryDetails',
    component: CategoryDetails,
    props: true,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/tag/:id',
    name: 'tag',
    component: TagDetails,
    props: true,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/tags',
    name: 'tags',
    component: Tags,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/payments',
    name: 'payments',
    component: PaymentMethods,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/payment/:id',
    name: 'payment',
    component: PaymentMethodDetails,
    props: true,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/transactions',
    name: 'pending-transactions',
    component: PaymentTransactions,
    meta: { requiresAuth: true, role: 1}
  },
  {
    path: '/admin/order-rider-offers',
    name: 'delivery-assigned-history',
    component: DeliverAssignedHistory,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/admin/customers',
    name: 'customers',
    component: Customers,
    meta: { requiresAuth: true, role: 1 }
  },
  {
    path: '/restaurant',
    name: 'restaurant',
    component: RestaurantHome,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/restaurant/menu/:id',
    name: 'newmenu',
    component: MenuDetails,
    props: true,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/restaurant/menus',
    name: 'menus',
    component: Menus,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/restaurant/order-history',
    name: 'restaurant-order-history',
    component: RestaurantOrderHistory,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/restaurant/call-rider',
    name: 'call-rider',
    component: CallRiderFromShop,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/restaurant/customers',
    name: 'restaurant-customers',
    component: RestaurantCustomers,
    meta: { requiresAuth: true, role: 2 }
  },
  {
    path: '/customer/login',
    name: 'customer-login',
    component: CustomerLogin,
  },
  {
    path: '/customer/restaurant/:id/menus',
    name: 'restaurant-menus',
    component: RestaurantMenus,
    props: true
  },
  {
    path: '/customer/cart',
    name: 'cart-view',
    component: CartView
  },
  {
    path: '/customer/checkout',
    name: 'checkout',
    component: Checkout,
    meta: { requiresAuth: true, role: 3 },
  },
  {
    path: '/customer/current-orders',
    name: 'customer-current-orders',
    component: CustomerCurrentOrders,
    meta: { requiresAuth: true, role: 3 }
  },
  {
    path: '/customer/orders/:id',
    name: 'current-order-details',
    component: CustomerCurrentOrderDetails,
    props: true
  },
  {
    path: '/customer/express',
    name: 'momo-express',
    component: MomoExpress,
    meta: { requiresAuth: true, role: 3 }
  },
  {
    path: '/rider',
    name: 'rider-home',
    component: RiderHome,
    meta: { requiresAuth: true, role: 4 }
  },
  {
    path: '/rider/order-history',
    name: 'rider-order-history',
    component: RiderOrderHistory,
    meta: { requiresAuth: true, role: 4 }
  },
  {
    path: '/social-callback',
    name: 'social-callback',
    component: SocialCallback
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token');
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    // login မဝင်ရသေးရင် login page ပြန်လွှတ်မယ်
    if (to.meta.requiresAuth && !isAuthenticated) {
        (to.meta.role == 3) ? next('/customer/login') : next('/login');
    } 
    // Role မကိုက်ရင် တားမယ်
    else if (to.meta.role && to.meta.role != user.role_id) {
        (to.meta.role == 3) ? next('/customer/login') : next('/login');
    }
    else {
        next();
    }
});

export default router
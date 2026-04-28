
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
        next('/login');
    } 
    // Role မကိုက်ရင် တားမယ်
    else if (to.meta.role && to.meta.role != user.role_id) {
        next('/login');
    }
    else {
        next();
    }
});

export default router
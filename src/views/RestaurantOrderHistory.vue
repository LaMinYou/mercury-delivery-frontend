<template>
  <restaurant-navbar>
    <restaurant-completed-orders :id="user.id" />
  </restaurant-navbar>
</template>

<script setup>
import RestaurantNavbar from '@/components/RestaurantNavbar.vue';
import RestaurantCompletedOrders from '@/components/RestaurantCompletedOrders.vue';

const user = JSON.parse(localStorage.getItem('user'));
</script>
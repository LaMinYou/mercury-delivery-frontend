<template>
  <rider-navbar>
    <rider-completed-orders :id="rider.id" />
  </rider-navbar>
</template>

<script setup>
import RiderNavbar from '@/components/RiderNavbar.vue';
import RiderCompletedOrders from '@/components/RiderCompletedOrders.vue';

const rider = JSON.parse(localStorage.getItem('user'));
</script>
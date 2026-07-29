<template>
    <v-dialog 
        :model-value="openPicker" 
        @update:model-value="$emit('closePicker')" 
        persistent
        max-width="1000"
    >
        <v-card>
            <v-card-title class="text-right">
                <v-btn icon="mdi-close" variant="text" @click="$emit('closePicker')" />
            </v-card-title>
            <restaurant-completed-orders v-if="restaurant && restaurant.id" :key="restaurant.id" :id="restaurant.id" />
        </v-card>
    </v-dialog>
</template>

<script setup>
import RestaurantCompletedOrders from './RestaurantCompletedOrders.vue';

const props = defineProps(['openPicker', 'restaurant']);
const emit = defineEmits(['closePicker']);
</script>

<style scoped>

</style>
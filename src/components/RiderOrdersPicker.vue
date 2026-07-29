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
            <rider-completed-orders v-if="rider && rider.id" :key="rider.id" :id="rider.id" />
        </v-card>
    </v-dialog>
</template>

<script setup>
import RiderCompletedOrders from './RiderCompletedOrders.vue';

const props = defineProps(['openPicker', 'rider']);
const emit = defineEmits(['closePicker']);
</script>

<style scoped>

</style>
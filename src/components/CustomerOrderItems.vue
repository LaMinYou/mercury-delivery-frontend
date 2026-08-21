<template>
    <v-dialog 
        :model-value="openOrderItemDialog"
        @update:model-value="$emit('closeOrderItemDialog')"
        max-width="500px" 
        scrollable 
        persistent
        transition="dialog-bottom-transition">
    <v-card class="pa-2" v-if="order">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <div>
          <span class="text-h6 font-weight-bold">Your Order Details</span>
          <div class="text-subtitle-2 text-indigo-darken-2">
            #{{ order.order_number }}
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="$emit('closeOrderItemDialog')"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-2">ITEMS LIST</div>
        
        <!-- for normal order -->
        <v-list class="bg-grey-lighten-4 rounded-lg pa-2 mb-4" density="compact" v-if="order.order_type == 'food'">
          <v-list-item v-for="item in order.order_items" :key="item.id" class="py-1">
            <div class="d-flex justify-space-between align-center w-100 text-body-2">
              <div>
                <span class="font-weight-bold text-deep-orange-darken-2">{{ item.quantity }}x</span> 
                <span class="ms-2 font-weight-medium">{{ item.menu.subtitle }}</span>
              </div>
              <span class="font-weight-bold text-grey-darken-3">
                {{ Number(item.final_price * item.quantity).toLocaleString() }} MMK
              </span>
            </div>
          </v-list-item>

          <v-divider class="my-2"></v-divider>
          <div class="d-flex justify-space-between align-center px-3 pt-1">
            <span class="text-subtitle-2 font-weight-bold text-grey-darken-1">Subtotal</span>
            <span class="text-subtitle-1 font-weight-bold text-green-darken-3">
              {{ Number(order.total_price).toLocaleString() }} MMK
            </span>
          </div>
        </v-list>

        <!-- for express order -->
        <v-list class="bg-grey-lighten-4 rounded-lg pa-2 mb-4" density="compact" v-if="order.order_type == 'errand'">
            <v-list-item>
                <span class="ms-2 font-weight-medium">{{ order.item_type }}</span>
            </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import api from '@/services/api';

const props = defineProps(['order', 'openOrderItemDialog']);
const emit = defineEmits(['closeOrderItemDialog']);


</script>

<template>
    <v-dialog 
        :model-value="openOrderItemDialog"
        @update:model-value="$emit('closeOrderItemDialog')"
        max-width="500px" 
        scrollable 
        persistent
        transition="dialog-bottom-transition">
    <v-card class="pa-2">
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <div>
          <span class="text-h6 font-weight-bold">Order Details</span>
          <div class="text-subtitle-2 text-indigo-darken-2">#{{ order.order_number }}</div>
        </div>
        <v-btn icon="mdi-close" variant="text" color="grey-darken-1" @click="$emit('closeOrderItemDialog')"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-2">ITEMS LIST</div>
        
        <v-list class="bg-grey-lighten-4 rounded-lg pa-2 mb-4" density="compact">
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

        <div class="text-subtitle-2 font-weight-bold text-grey-darken-2 mb-2">CUSTOMER NOTE</div>
        <v-card 
          variant="flat" 
          :color="order.user_note ? 'amber-lighten-5' : 'grey-lighten-4'" 
          class="pa-3 rounded-lg border"
          :class="order.user_note ? 'border-amber' : ''"
        >
          <div class="d-flex align-start">
            <v-icon :color="order.user_note ? 'amber-darken-3' : 'grey-darken-1'" class="me-2 mt-1">
              {{ order.user_note ? 'mdi-message-alert-outline' : 'mdi-message-off-outline' }}
            </v-icon>
            <span class="text-body-2" :class="order.user_note ? 'text-amber-darken-4 font-weight-medium' : 'text-grey-darken-1'">
              {{ order.user_note ? order.user_note : 'မှတ်ချက် (Note) ရေးသားထားခြင်းမရှိပါ။' }}
            </span>
          </div>
        </v-card>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4 d-flex gap-2">
        <v-btn 
          text="အော်ဒါလက်ခံမည် (Accept)" 
          color="green-darken-2" 
          variant="flat" 
          rounded="lg"
          class="flex-grow-1 font-weight-bold text-white"
          prepend-icon="mdi-check-circle"
          @click="acceptOrder"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div :id="'kitchen-receipt-' + order.id" class="print-only">
    <div class="receipt-header">
      <h2>KITCHEN ORDER</h2>
      <p>Order No: <strong>#{{ order.order_number }}</strong></p>
      <p>Time: {{ new Date(order.created_at || Date.now()).toLocaleTimeString() }}</p>
    </div>
    <hr>
    <table class="receipt-table">
      <thead>
        <tr>
          <th style="text-align: left;">Item</th>
          <th style="text-align: right;">Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.order_items" :key="item.id">
          <td>{{ item.menu.subtitle }}</td>
          <td style="text-align: right;"><strong>{{ item.quantity }}</strong></td>
        </tr>
      </tbody>
    </table>
    <hr>
    <div v-if="order.user_note" class="receipt-note">
      <strong>* Note:</strong> {{ order.user_note }}
    </div>
  </div>
</template>
<script setup>
import api from '@/services/api';

const props = defineProps(['order', 'openOrderItemDialog']);
const emit = defineEmits(['closeOrderItemDialog', 'orderAccepted']);

const acceptOrder = async () =>{
    try{
        const res = await api.put(`auth/restaurant/orders/${props.order.id}`, { status: 'accepted' });
        printKitchenSlip();
        emit('closeOrderItemDialog');
        emit('orderAccepted');
    }catch(err){
        console.error("API Call Failed:", err);
    }
}

const printKitchenSlip = () => {
  const receiptHtml = document.getElementById(`kitchen-receipt-${props.order.id}`).innerHTML;
  
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);
  
  const pri = iframe.contentWindow;
  
  pri.document.open();
  pri.document.write(`
    <html>
      <head>
        <style>
          body { 
            width: 58mm; 
            margin: 0; 
            padding: 5px; 
            font-family: 'Courier New', monospace; 
            font-size: 12px; 
          }
          .receipt-header { text-align: center; margin-bottom: 10px; }
          .receipt-header h2 { font-size: 16px; margin: 0; }
          .receipt-table { width: 100%; border-collapse: collapse; }
          .receipt-table th, .receipt-table td { padding: 4px 0; }
          .receipt-note { margin-top: 10px; border: 1px dashed #000; padding: 5px; font-size: 11px; }
        </style>
      </head>
      <body>
        ${receiptHtml}
      </body>
    </html>
  `);
  pri.document.close();
  
  setTimeout(() => {
    pri.focus();
    pri.print();
    document.body.removeChild(iframe); 
  }, 500);
};
</script>
<style scoped>
@media screen {
    .print-only{
        width: 0;
        height: 0;
        visibility: hidden;
    }
}
@media print {
    .print-only{
        width: auto;
        height: auto;
        visibility: visible;
    }
}
</style>
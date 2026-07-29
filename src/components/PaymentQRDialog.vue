<template>
  <v-dialog
    max-width="500px"
    :model-value="openPaymentQRDialog"
    @update:model-value="$emit('closePaymentQRDialog')"
    persistent
  >
    <v-card class="pa-2">
      <!-- <v-card-title>
        <span
          @click="$emit('closePaymentQRDialog')"
          class="float-end cursor-pointer"
          ><v-icon>mdi-close</v-icon></span
        >
      </v-card-title> -->
      <div class="text-center text-green-darken-2">
        <p>
          စုစုပေါင်းကျသင့်ငွေ {{ totalPrice + serviceFee + deliveryFee }} MMK
        </p>
        <div class="imgBox">
          <v-img
            :src="payment.image_url"
            width="100"
            height="100"
            class="mx-auto"
          ></v-img>
        </div>
        <p>ငွေပေးချေရန် ဤနေရာတွင် scan ဖတ်ပါ</p>
        <div class="imgUpload">
          <v-file-input
            v-model="invoice_image"
            label="ပြေစာကိုဤနေရာတွင်တင်ပါ"
            accept="image/*"
            variant="outlined"
            color="green-darken-2"
            show-size
          ></v-file-input>
        </div>
        <v-btn 
            block
            @click="submitInvoice"
            color="green-darken-2"
        >
            အဆင်ပြေသည်
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps([
  "openPaymentQRDialog",
  "payment",
  "totalPrice",
  "serviceFee",
  "deliveryFee",
]);
const emit = defineEmits(["closePaymentQRDialog"]);

const invoice_image = ref(null);

const submitInvoice = () =>{
    const file = Array.isArray(invoice_image.value) 
    ? invoice_image.value[0] 
    : invoice_image.value;

  // အပြင်က Checkout Page (Parent) ဆီကို ဖိုင် Object ကို လှမ်းပို့လိုက်မယ်
  emit('closePaymentQRDialog', file);
}
</script>
<style scoped>
</style>
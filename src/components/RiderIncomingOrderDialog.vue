<template>
  <v-dialog
    :model-value="incomingOrderOffer"
    @update:model-value="$emit('closeIncomingOrderDialog')"
    max-width="700"
  >
    <v-card class="order-popup-modal pa-3 ma-3">
      <v-card-title class="text-subtitle-1">
        <p class="text-wrap">အော်ဒါ ကမ်းလှမ်းချက်အသစ် ရရှိပါသည်!</p>
      </v-card-title>
      <v-card-subtitle v-if="incomingOrderOffer.order_type == 'merchant'">
        ဆိုင်မှခေါ်ယူခြင်း
      </v-card-subtitle>
      <v-card-text>
        <p class="text-wrap font-weight-bold mb-3">
          {{ incomingOrderOffer.restaurant?.name || "Express အမြန်ချောပို့" }}
        </p>

        <p class="text-wrap text-body-1">
          အော်ဒါနံပါတ်: {{ incomingOrderOffer.order_number }}
        </p>
        <p
          class="text-wrap"
          v-if="
            incomingOrderOffer.order_type == 'errand' ||
            incomingOrderOffer.order_type == 'merchant'
          "
        >
          Delivery + Service Fee :
          {{
            Number(incomingOrderOffer.delivery_fee) +
            Number(incomingOrderOffer.service_fee)
          }}
          MMK
        </p>
        <p v-else class="text-body-1 mb-3">
          စုစုပေါင်းတန်ဖိုး: {{ incomingOrderOffer.total_price }} MMK
        </p>

        <v-divider></v-divider>
        <div class="mt-3">
          <p
            v-if="
              incomingOrderOffer.order_type == 'food' ||
              incomingOrderOffer.order_type == 'merchant'
            "
          >
            Source Address : {{ incomingOrderOffer.restaurant?.address }}
          </p>
          <p v-if="incomingOrderOffer.order_type == 'errand'">
            Source Address : {{ incomingOrderOffer?.source_address }}
          </p>
        </div>
      </v-card-text>
      <v-card-action>
        <v-btn
          block
          variant="elevated"
          color="green-darken-2"
          @click="$emit('handleAcceptOrder', incomingOrderOffer.id)"
          class="mb-2"
        >
          လက်ခံမည်
        </v-btn>

        <v-btn
          block
          variant="outlined"
          color="red-accent-4"
          @click="$emit('closeIncomingOrderDialog')"
        >
          ငြင်းပယ်မည်
        </v-btn>
      </v-card-action>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps(["incomingOrderOffer"]);
const emit = defineEmits(["closeIncomingOrderDialog", "handleAcceptOrder"]);
</script>
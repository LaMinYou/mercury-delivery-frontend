<template>
  <v-card class="order-card cursor-pointer" @click="openOrderItemDialog=true">
    <v-table>
      <tbody>
        <tr>
          <td class="text-primary font-weight-bold">
            # {{ order.order_number }}
          </td>
          <td class="text-grey font-weight-bold">
            <v-icon class="me-2">mdi-clock-outline</v-icon>
            {{ formatTime(order.created_at) }}
          </td>
          <td
            class="text-grey font-weight-bold d-flex justify-center flex-column"
          >
            <span>Total Amount</span>
            <span class="text-red">{{ order.total_price }} MMK</span>
          </td>
          <td>
            <v-chip
              size="small"
              :color="order.payment.name == 'cash' ? 'primary' : 'red'"
            >
              <v-icon>
                {{
                  order.payment.name == "cash"
                    ? "mdi-cash"
                    : "mdi-credit-card-outline"
                }}
              </v-icon>
              {{ order.payment.name }}
            </v-chip>
          </td>
          <td>
            <v-chip
              size="small"
              :color="order.payment_status == 'accepted' ? 'green' : 'warning'"
            >
              {{ order.payment_status }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
  <order-item-dialog 
    :order="order" 
    :openOrderItemDialog="openOrderItemDialog" 
    @closeOrderItemDialog="openOrderItemDialog = false" 
    @orderAccepted="$emit('orderAccepted', order.id)"
  />
</template>
<script setup>
import { ref } from "vue";
import OrderItemDialog from "./OrderItemDialog.vue";

const openOrderItemDialog = ref(false);
const props = defineProps(["order"]);
const emit = defineEmits(['orderAccepted']);
import { formatDistanceToNow } from "date-fns";

const formatTime = (dateString) => {
  if (!dateString) return;
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
</script>
<style scoped>
td {
  text-align: center;
}
.order-card{
    transition: 0.5s;
}
.order-card:hover{
    transform: scale(0.97);
}

</style>
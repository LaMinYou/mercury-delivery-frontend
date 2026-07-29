<template>
  <admin-navbar>
    <v-container fluid>
      <v-row v-if="pendingTransactions.length > 0">
        <v-col cols="12" md="8">
          <v-card class="pa-3 bg-transparent" flat>
            <v-card-title class="text-subtitle-1 font-weight-bold text-wrap"
              >စစ်ဆေးရန်ကျန်ရှိသော ငွေလွှဲမှုများ</v-card-title
            >
            <v-list lines="two" class="bg-transparent">
              <v-list-item
                v-for="tx in pendingTransactions"
                :key="tx.id"
                :active="selectedTx?.id === tx.id"
                color="green-darken-3"
                @click="selectedTx = tx"
              >
                <template v-slot:prepend>
                  <v-icon color="orange">mdi-cash-clock</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold">{{
                  tx.order.order_number
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    totalTransactionAmount(
                      tx.order.total_price,
                      tx.order.delivery_fee,
                      tx.order.service_fee
                    )
                  }}
                  MMK
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-caption text-grey-darken-1 text-right">
                    {{ formatTxDate(tx.created_at) }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" v-if="selectedTx">
          <v-card class="pa-4" flat variant="outlined">
            <div
              class="cursor-pointer text-right mb-3"
              @click="selectedTx = null"
            >
              <v-icon>mdi-close</v-icon>
            </div>
            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-h6 font-weight-bold"
                >Order ID: {{ selectedTx.order.order_number }}</span
              >
              <span class="text-h6 text-green-darken-3 font-weight-bold">
                {{
                  totalTransactionAmount(
                    selectedTx.order.total_price,
                    selectedTx.order.delivery_fee,
                    selectedTx.order.service_fee
                  )
                }}
                MMK
              </span>
            </div>
            <div
              class="d-flex justify-space-between align-center flex-wrap mb-4"
            >
              <span class="text-grey">Transaction Time</span>
              <span>{{ formatFullDateTime(selectedTx.created_at) }}</span>
            </div>

            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                class="mx-auto mb-4"
                max-width="400"
                variant="outlined"
              >
                <v-img :src="selectedTx.image_url" aspect-ratio="1" cover>
                  <v-overlay
                    :model-value="isHovering"
                    contained
                    class="align-center justify-center"
                  >
                    <v-btn
                      color="white"
                      icon="mdi-magnify"
                      @click="openImgDialog(selectedTx.image_url)"
                    ></v-btn>
                  </v-overlay>
                </v-img>
              </v-card>
            </v-hover>

            <v-row>
              <v-col cols="6">
                <v-btn
                  block
                  variant="tonal"
                  color="red-darken-2"
                  height="auto"
                  @click="rejectPayment(selectedTx.order.id, selectedTx.id)"
                  class="pa-2"
                >
                  <span class="text-wrap">ငြင်းပယ်မည် (Reject)</span>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  variant="elevated"
                  color="green-darken-2"
                  @click="acceptPayment(selectedTx.order.id, selectedTx.id)"
                  height="auto"
                  class="pa-2"
                >
                  <span class="text-wrap">အတည်ပြုမည် (Accept)</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <div class="pa-5 text-center text-grey w-100">
          <v-icon size="40" class="mb-2">mdi-folder-open-outline</v-icon>
          <div>
            ဤအပိုင်းတွင် စစ်ဆေးရန်ကျန်ရှိသော ငွေလွှဲများမှတ်တမ်း မရှိသေးပါ။
          </div>
        </div>
      </v-row>
    </v-container>

    <image-dialog
      :dialogImgUrl="dialogImgUrl"
      :openImageDialog="openImageDialog"
      @closeImageDialog="openImageDialog = false"
    />
  </admin-navbar>
</template>
<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import api from "@/services/api";
import { computed, onMounted, ref } from "vue";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import ImageDialog from "@/components/ImageDialog.vue";
import echo from "@/services/echo";

const user = ref(JSON.parse(localStorage.getItem('user')) || {});
const pendingTransactions = ref([]);
const selectedTx = ref(null);
const dialogImgUrl = ref(null);
const openImageDialog = ref(false);
const alertSound = new Audio("/images/noti.wav");

const getTransactions = async () => {
  try {
    const res = await api.get("auth/admin/transactions");
    pendingTransactions.value = res.data;
  } catch (err) {
    console.log(err.response.data.message);
  }
};

const totalTransactionAmount = (totalPrice, deliveryFee, serviceFee) => {
  return Number(totalPrice) + Number(deliveryFee) + Number(serviceFee);
};

const playAlert = () => {
  alertSound.play().catch((error) => {
    console.log("Browser Audio Restriction:", error);
  });
};

const listenToTransactions = (adminId) => {
  echo
    .private(`admin.${adminId}`)
    .listen(".PaymentTransactionCreated", (data) => {
      console.log("new payment transaction is coming -", data.paymentTransaction);
      pendingTransactions.value.unshift(data.paymentTransaction);
      playAlert();
    });
};

const acceptPayment = async (orderId, tranId) => {
  try {
    const res = await api.put(`auth/admin/orders/${orderId}`, {
      status: "accepted",
    });
    await api.delete(`auth/admin/transactions/${tranId}`);
    selectedTx.value = null;
    getTransactions();
  } catch (err) {
    console.log(err);
  }
};

const rejectPayment = async (orderId, tranId) => {
  try {
    const res = await api.put(`auth/admin/orders/${orderId}`, {
      status: "rejected",
    });
    await api.delete(`auth/admin/transactions/${tranId}`);
    selectedTx.value = null;
    getTransactions();
  } catch (err) {
    console.log(err);
  }
};

//format transaction date time
const formatTxDate = (dateString) => {
  if (!dateString) return "";

  const date =
    typeof dateString === "string"
      ? parseISO(dateString)
      : new Date(dateString);

  if (isToday(date)) {
    return format(date, "hh:mm a");
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "MMM d");
};

const formatFullDateTime = (dateString) => {
  if (!dateString) return "";
  const date =
    typeof dateString === "string"
      ? parseISO(dateString)
      : new Date(dateString);

  return format(date, "dd/MM/yyyy HH:mm:ss");
};

const openImgDialog = (imgUrl) => {
  dialogImgUrl.value = imgUrl;
  openImageDialog.value = true;
};

onMounted(() => {
  getTransactions();
  listenToTransactions(user.value.id);
});
</script>

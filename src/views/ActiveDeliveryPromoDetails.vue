<template>
  <admin-navbar>
    <v-form @submit.prevent="savePromo">
      <v-card>
        <v-card-title> Delivery Promo </v-card-title>
        <v-card-text>
          <v-text-field v-model="activePromo.title" label="Promo Title" color="green-darken-3">
          </v-text-field>

          <v-radio-group v-model="activePromo.promo_type" label="Type" inline>
            <v-radio label="Free Delivery" value="free" color="green-darken-3"></v-radio>
            <v-radio label="Flat Rate / Discount" value="flat" color="green-darken-3"></v-radio>
          </v-radio-group>

          <v-text-field
            v-if="activePromo.promo_type == 'flat'"
            v-model.number="activePromo.amount"
            label="Delivery Fee / Discount (MMK)"
            type="number"
            color="green-darken-3"
          ></v-text-field>

          <v-text-field
            v-model="activePromo.start_date"
            type="datetime-local"
            label="Start Date"
            color="green-darken-3"
          ></v-text-field>
          <v-text-field
            v-model="activePromo.end_date"
            type="datetime-local"
            label="End Date"
            color="green-darken-3"
          ></v-text-field>
        </v-card-text>
        <div>
          <v-btn 
            type="submit" 
            color="green-darken-3" 
            variant="elevated"
            block 
            class="mt-3"
            >Save Active Promo</v-btn
          >
          <v-btn
          color="red"
          variant="text"
          block
          class="mt-1"
          @click="clearPromo"
          :disabled="!activePromo?.id"
          >Clear Current Promo</v-btn
        >
        </div>
      </v-card>
    </v-form>

    <alert-dialog
      :message="message"
      :openAlertDialog="openAlertDialog"
      @closeAlertDialog="
        openAlertDialog = false;
        message = null;
      "
    />
  </admin-navbar>
</template>

<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import { formatToLocalDateTime } from "@/composables/dateTimeHelper";
import AlertDialog from "@/components/AlertDialog.vue";
const activePromo = ref({
  title: "",
  amount: 0,
  promo_type: "free",
  start_date: "",
  end_date: "",
});
const message = ref(null);
const openAlertDialog = ref(false);

const savePromo = async () => {
  try {
    const res = await api.post("/auth/admin/delivery-promo", activePromo.value);
    message.value = 'Congratulation! Your Delivery Promo is saved successfully!';
    openAlertDialog.value = true;
  } catch (err) {
    console.log(err.response.data.message);
  }finally{
    await getActivePromo();
  }
};

const getActivePromo = async () => {
  try {
    console.log("start fetching active promo...")
    const res = await api.get("/delivery-promo");
    if (res.data && res.data.id) {
      activePromo.value.id = res.data.id;
      activePromo.value.title = res.data.title;
      activePromo.value.promo_type = res.data.promo_type;
      activePromo.value.amount = res.data.amount;
      activePromo.value.start_date = formatToLocalDateTime(res.data.start_date);
      activePromo.value.end_date = formatToLocalDateTime(res.data.end_date);
    }
    console.log(res.data.id);
  } catch (err) {
    console.log(err);
  }
};

const clearPromo = async () => {
  try{
    const res = await api.delete(`/auth/admin/delivery-promo/${activePromo.value.id}`);
    activePromo.value = {
      title: "",
      amount: 0,
      promo_type: "free",
      start_date: "",
      end_date: ""
    };
    message.value = 'Promo cleared!';
    openAlertDialog.value = true;
  }catch(err){
    console.log(err);
  }
}
onMounted(async () => {
  await getActivePromo();
});
</script>
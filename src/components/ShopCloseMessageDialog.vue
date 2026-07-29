<template>
  <v-dialog
    max-width="500px"
    :model-value="openMessageDialog"
    @update:model-value="$emit('closeMessageDialog')"
    persistent
  >
    <v-card class="pa-2">
        <v-card-title class="text-right" @click="$emit('closeMessageDialog')">
            <v-icon>mdi-close</v-icon>
        </v-card-title>
      <v-form
        class="text-center text-green-darken-2"
        @submit.prevent="handleCloseShop"
      >
        <v-text-field
          v-model="message"
          :rules="[rules.required]"
          variant="outlined"
          density="conformtable"
          label="ပြန်ဖွင့်မည့်နေ့ရက်နှင့်အချိန်ကိုထည့်ပါ။"
          placeholder="eg. စနေ, 11:30 AM"
        />

        <v-btn block type="submit" color="green-darken-2"> OK </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup>
import api from "@/services/api";
import { ref } from "vue";
import { rules } from "@/services/rules";

const props = defineProps(["user", "openMessageDialog"]);
const emit = defineEmits(["closeMessageDialog"]);
const message = ref(null);

const handleCloseShop = async () => {
  try {
    const res = await api.put(
      `/auth/restaurant/${props.user.id}/update-status`,
      { message: message.value, status: 'inactive' }
    );
    message.value = null;
    emit("closeMessageDialog", res.data.id);
  } catch (err) {
    console.log(err);
  }
};
</script>
<style scoped>
</style>
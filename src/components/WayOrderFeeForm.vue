<template>
    <v-card class="pa-4 mt-5 mx-auto" max-width="500">
    <div v-if="errorMessage" class="my-2">
        <alert :message="errorMessage" type="error" color="red" />
    </div>
    <v-card-title class="mb-3">{{ $t('admin.setting.way-order-fee-form.title') }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="fee"
        :label="$t('admin.setting.way-order-fee-form.label.way-fee')"
        type="number"
        variant="outlined"
        color="green-darken-3"
      ></v-text-field>
      <v-btn color="green-darken-3" :loading="loading" @click="saveFee">Save Fee</v-btn>
    </v-card-text>
  </v-card>
</template>
<script setup>
import api from '@/services/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Alert from './Alert.vue';

const router = useRouter();
const fee = ref(2000);
const errorMessage = ref(null);
const loading = ref(false);
const saveFee = async () => {
    try{
        errorMessage.value = null;
        loading.value = true;
        const res = await api.post('auth/admin/settings/update-wayfee', {
            key: 'way_order_fee',
            value: fee.value
        });
        if(res.data?.value) fee.value = res.data?.value;
        //router.push('/admin');
    }catch(err){
        errorMessage.value = err.response.data.message;
    }finally{
        loading.value = false;
    }
}

const getFee = async () => {
    try{
        const res = await api.get('auth/admin/settings/wayfee');
        if(res.data?.value) fee.value = res.data.value; 
    }catch(err){
        console.log(err.response.data.error);
    }
}
onMounted(async () => {
    await getFee();
})
</script>
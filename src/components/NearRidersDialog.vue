<template>
  <v-dialog 
    :model-value="openRiderDialog" 
    @update:model-value="$emit('closeRiderDialog')" 
    persistent  
    scrollable
    max-width="700"
  >
    <v-card class="pa-2">
      <v-card-title
        class="d-flex align-center justify-space-between font-weight-bold text-subtitle-1"
      >
        <span class="text-wrap"
          ><v-icon color="orange" class="mr-1">mdi-account-group</v-icon>
          အနီးဆုံး ရိုက်ဒါများ</span
        >
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('closeRiderDialog')"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text style="max-height: 350px" class="pa-2 bg-grey-lighten-4">
        <v-list
          v-if="riders.length > 0"
          lines="two"
          class="bg-transparent pa-0"
        >
          <v-list-item
            v-for="rider in riders"
            :key="rider.id"
            class="bg-white mb-2 rounded-lg border"
            elevation="1"
          >
            <template v-slot:prepend>
              <v-avatar color="green-lighten-5">
                <v-icon color="green-darken-2">mdi-bike</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-bold text-body-2 text-wrap">
              {{ rider.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-grey-darken-1 text-wrap mt-1">
              <div class="d-flex align-center mb-1">
                <v-icon size="small" class="mr-1"
                  >mdi-map-marker-radius</v-icon
                >
                <span>
                  {{
                    rider.distance
                      ? Number(rider.distance).toFixed(2) + " km"
                      : "အနီးနားတွင် ရှိသည်"
                  }}
                </span>
              </div>

              <div class="d-flex align-center text-green-darken-2 font-weight-bold">
                <a :href="`tel:${rider.phone}`">
                <v-icon size="small" class="mr-1" 
                  >mdi-phone-plus</v-icon
                >
                
                {{ rider.phone }}
            </a>
              </div>
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-btn
                color="green-darken-2"
                size="small"
                variant="elevated"
                class="rounded-lg text-white font-weight-bold"
                @click="confirmHandover(rider, order)"
              >
                လွှဲမည်
              </v-btn>
            </template>
            <!-- <v-list-item-text class="text-wrap align-left">
                <v-icon>mdi-phone</v-icon> {{ rider.phone }}
              </v-list-item-text> -->
          </v-list-item>
        </v-list>

        <div v-else class="text-center py-8 text-grey-darken-1">
          <v-icon size="40" class="mb-2">mdi-account-search-outline</v-icon>
          <p class="text-body-2 font-weight-medium">
            အနီးအနားတွင် အလုပ်အားသည့် ရိုက်ဒါ ရှာမတွေ့ပါဗျာ။
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
import api from '@/services/api';
import { useRouter } from 'vue-router';


const props = defineProps(['openRiderDialog', 'order', 'riders']);
const emit = defineEmits(['closeRiderDialog', 'handOverSuccess']);
const router = useRouter();


const confirmHandover = async (rider, order) => {
    try{
        const res = await api.post(`/auth/rider/order-handover/${order.id}`,{
        new_rider_id: rider.id
    });
    emit('closeRiderDialog');
    emit('handOverSuccess', props.order.id);
    router.push('/rider');
    }catch(err){
        console.log(`Something went wrong ${err.response.data.error}`);
    }

}
</script>
<style scoped>
</style>
<template>
    <v-dialog 
        max-width="500px"
        :model-value="openPaymentDialog"
        @update:model-value="$emit('closePaymentDialog')"
        persistent
    >
        <v-card>
            <v-list>
                <v-list-item 
                    v-for="item in payments" 
                    :key="item.id"  
                    @click="$emit('closePaymentDialog', item)"
                >
                    <template v-slot:prepend>
                            <v-img :src="item.logo_url" width="35" height="20"></v-img>
                    </template>

                    <v-list-item-title class="font-weight-bold ms-3">
                        {{ item.name }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>
<script setup>
const props = defineProps(['payments', 'openPaymentDialog']);
const emit = defineEmits(['closePaymentDialog']);

</script>
<style scoped>

</style>
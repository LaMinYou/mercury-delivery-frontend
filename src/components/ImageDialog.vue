<template>
    <v-dialog 
        :model-value="openImageDialog"
        @update:model-value="$emit('closeImageDialog')"
        max-width="700" 
        transition="dialog-bottom-transition"
    >
      <v-card class="position-relative overflow-hidden rounded-lg" flat>
        <v-btn
          icon="mdi-close"
          variant="flat"
          color="black"
          density="comfortable"
          class="position-absolute open-dialog-close-btn"
          @click="$emit('closeImageDialog')"
        ></v-btn>
        
        <v-img
          :src="dialogImgUrl"
          width="100%"
          max-height="85vh"
          fit="contain"
          class="bg-grey-lighten-4"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="green-darken-2"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-card>
    </v-dialog>
</template>

<script setup>

const props = defineProps(['dialogImgUrl', 'openImageDialog']);
const emit = defineEmits(['closeImageDialog']);

</script>

<style scoped>
/* Close Button ကို ညာဘက်အပေါ်ထောင့်တွင် Floating ပုံစံတင်ရန် */
.open-dialog-close-btn {
  top: 12px;
  right: 12px;
  z-index: 10;
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}
.open-dialog-close-btn:hover {
  opacity: 1;
}
</style>
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card>
      <v-card-item class="justify-center">
        <v-icon
          color="warning"
          size="64"
          icon="mdi-alert-circle-outline"
        ></v-icon>
      </v-card-item>
      <v-card-text class="text-warning">
        Are you sure you want to delete <strong>{{ item?.name }}</strong
        >?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')">Cancel</v-btn>

        <v-btn color="error" @click="$emit('confirm')">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
const props = defineProps(["item", "modelValue"]);
const emit = defineEmits(["close", "confirm", "update:modelValue"]);
</script>
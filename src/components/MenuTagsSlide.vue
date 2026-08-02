<template>
    <div class="tag-scroller-container">
    <v-slide-group
      class="pa-2"
      direction="horizontal"
      show-arrows="never" 
    >
      <v-slide-group-item
        v-for="tag in tags"
        :key="tag.id"
      >
        <div class="tag-item mx-2 text-center menu-tag" @click="$emit('menuTag', tag.name)">
          <v-avatar size="60" rounded="circle" class="elevation-2 border menutag">
             <v-img 
               :src="tag.image_url" 
               cover
               @dragstart.prevent 
             >
                <template #placeholder>
                  <v-progress-circular indeterminate size="20" class="mt-5" color="green"></v-progress-circular>
                </template>
             </v-img>
          </v-avatar>
          <div class="text-body-2 text-center mt-1">{{ tag.name }}</div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>
<script setup>
const props = defineProps(['tags']);
const emit = defineEmits(['menuTag']);
</script>
<style scoped>
.menu-tag{
  cursor: pointer;
}
</style>
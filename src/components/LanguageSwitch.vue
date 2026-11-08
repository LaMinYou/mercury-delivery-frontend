<template>
  <v-menu location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="text" prepend-icon="mdi-translate">
        {{ currentLanguageName }}
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item @click="changeLanguage('en')">
        <v-list-item-title>English</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeLanguage('my')">
        <v-list-item-title>မြန်မာ</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeLanguage('zh')">
        <v-list-item-title>中文</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const currentLanguageName = computed(() => {
  switch (locale.value) {
    case "my":
      return "မြန်မာ";
    case "zh":
      return "中文";
    default:
      return "English";
  }
});

const changeLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem("app_locale", lang);
};
</script>
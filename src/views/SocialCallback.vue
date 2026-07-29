<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-progress-circular indeterminate color="green" size="64"></v-progress-circular>
      <div class="ml-4 text-subtitle-1">အကောင့်ဝင်ရောက်နေပါသည်... ခေတ္တစောင့်ဆိုင်းပါ</div>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.access_token;
  const userRaw = route.query.user;

  if (token && userRaw) {
    localStorage.setItem('token', token);
    
    const userString = decodeURIComponent(userRaw);
    localStorage.setItem('user', userString);

    console.log("လော့ဂ်အင် အောင်မြင်ပါပြီ။ သိမ်းဆည်းပြီးသား ဒေတာ-", JSON.parse(userString));
    router.push('/');
  } else {
    router.push('/login');
  }
});
</script>
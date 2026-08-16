<template>
  <admin-navbar>
    <!-- show loading if data is currently fetching -->
    <admin-home-loading v-if="isLoading" />

    <!-- show timeout page and try again if data can't get -->
    <timeout-view v-else-if="isTimeout" @retryFetch="retryFetch" />
    
    <!-- show data -->
    <v-container v-else fluid>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-card
            color="blue-darken-2 py-3"
            theme="dark"
            href="/admin/customers"
            elevation="3"
          >
            <v-card-text class="d-flex align-center justify-center">
              <v-icon icon="mdi-account" size="large" class="me-3"></v-icon>
              <span class="text-subtitle-1">{{ roleCount[3] || 0 }} Customers</span>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            color="teal-darken-1 py-3"
            theme="dark"
            href="/admin/restaurants"
            elevation="3"
          >
            <v-card-text class="d-flex align-center justify-center">
              <v-icon icon="mdi-store" size="large" class="me-3"></v-icon>
              <span class="text-subtitle-1">{{ roleCount[2] || 0 }} Restaurants</span>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card
            color="deep-purple-darken-1 py-3"
            theme="dark"
            href="/admin/riders"
            elevation="3"
          >
            <v-card-text class="d-flex align-center justify-center">
              <v-icon icon="mdi-bike" size="large" class="me-3"></v-icon>
              <span class="text-subtitle-1">{{ roleCount[4] || 0 }} Riders</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <v-card class="pa-4" elevation="3">
            <v-card-title>Weekly Order Trends (Last 7 Days)</v-card-title>
            <div style="height: 400px;">
            <LineChart
              v-if="loaded"
              :data="chartData"
              :options="chartOptions"
            />
              </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </admin-navbar>
</template>

<script setup>
import AdminNavbar from "@/components/AdminNavbar.vue";
import api from "@/services/api";
import { onMounted, ref } from "vue";
import LineChart from "@/components/LineChart.vue";
import { min } from "date-fns";
import AdminHomeLoading from "@/components/loadings/AdminHomeLoading.vue";
import TimeoutView from "@/components/TimeoutView.vue";
import { requestNotificationPermission } from "@/firebase";

const roleCount = ref({});
const isLoading = ref(true);
const isTimeout = ref(false);

const fetchUserCounts = async () => {
  try {
    const res = await api.get("admin/users/role-count");
    roleCount.value = res.data;
  } catch (err) {
    console.error("Error fetching role counts:", err);
  }
};

//for weekly order tracking chart
const loaded = ref(false);
const chartData = ref({ labels: [], datasets: [] });

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // This allows it to follow the div height
  plugins: {
    legend: {
      display: true,
      position: 'top',
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      //min: 0,
      //suggestedMax: 5,
      ticks: {
        stepSize: 5 // Optional: makes the Y-axis cleaner
      }
    }
  }
};

const fetchWeeklyOrders = async () => {
  try {
    loaded.value = false;
    
    const response = await api.get('auth/admin/orders/weekly-stats');
    const rawData = response.data; // Expected format: { "Mon": 12, "Tue": 5, "Wed": 14, ... }

    chartData.value = {
      labels: Object.keys(rawData), // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      datasets: [
        {
          label: 'Orders (Last 7 Days)',
          backgroundColor: 'rgba(25, 118, 210, 0.2)', 
          borderColor: '#1976D2', 
          pointBackgroundColor: '#1976D2',
          data: Object.values(rawData), // [12, 5, 14, ...]
          tension: 0.3,
          fill: true 
        }
      ]
    };
    isLoading.value = false;
    loaded.value = true;
  } catch (e) {
    isLoading.value = false;
    isTimeout.value = true;
    console.error("Error fetching weekly orders:", e);
  }
};

const retryFetch = () => {
  isLoading.value = true;
  isTimeout.value = false;
  fetchWeeklyOrders();
}

onMounted(() => {
  fetchUserCounts();
  fetchWeeklyOrders();
  requestNotificationPermission();
});
</script>
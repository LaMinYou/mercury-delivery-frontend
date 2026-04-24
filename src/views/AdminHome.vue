<template>
  <admin-navbar>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-card
            color="blue-darken-2 py-3"
            theme="dark"
            href="/customers"
            elevation="3"
          >
            <v-card-text class="d-flex align-center justify-center">
              <v-icon icon="mdi-account" size="large" class="me-3"></v-icon>
              <span class="text-h3">{{ roleCount[3] || 0 }} Customers</span>
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
              <span class="text-h3">{{ roleCount[2] || 0 }} Restaurants</span>
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
              <span class="text-h3">{{ roleCount[4] || 0 }} Riders</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <v-card class="pa-4" elevation="3">
            <v-card-title>Monthly Order Trends</v-card-title>
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

const roleCount = ref({});

const fetchUserCounts = async () => {
  try {
    const res = await api.get("admin/users/role-count");
    roleCount.value = res.data;
  } catch (err) {
    console.error("Error fetching role counts:", err);
  }
};

//for monthly order tracking chart
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
      ticks: {
        stepSize: 5 // Optional: makes the Y-axis cleaner
      }
    }
  }
};

const fetchMonthlyOrders = async () => {
  try {
    //const response = await api.get('orders/monthly-stats');
    // Assuming API returns: { "2024-05-01": 5, "2024-05-02": 12, ... }
    //const rawData = response.data; 
    const rawData = { 
      "2026-04-01": 5, 
      "2026-04-02": 12, 
      "2026-04-03": 14, 
      "2026-04-04": 10,
      "2026-04-05": 10,
      "2026-04-06": 11,
      "2026-04-07": 15,
      "2026-04-08": 14,
      "2026-04-09": 8,
      "2026-04-10": 20,
      "2026-04-11": 5, 
      "2026-04-12": 12, 
      "2026-04-13": 14, 
      "2026-04-14": 10,
      "2026-04-15": 10,
      "2026-04-16": 11,
      "2026-04-17": 15,
      "2026-04-18": 14,
      "2026-04-19": 8,
      "2026-04-20": 20,
      "2026-04-21": 5, 
      "2026-04-22": 12, 
      "2026-04-23": 14, 
      "2026-04-24": 10,
      "2026-04-25": 10,
      "2026-04-26": 11,
      "2026-04-27": 15,
      "2026-04-28": 14,
      "2026-04-29": 8,
      "2026-04-30": 20,
    }

    chartData.value = {
      labels: Object.keys(rawData), // The Dates
      datasets: [
        {
          label: 'Orders',
          backgroundColor: '#f87979',
          borderColor: '#1976D2', // Line color
          data: Object.values(rawData), // The Counts
          tension: 0.3 // Makes the line curved
        }
      ]
    };
    loaded.value = true;
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  fetchUserCounts();
  fetchMonthlyOrders();
});
</script>
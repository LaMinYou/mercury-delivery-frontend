<template>
  <v-footer class="bg-green-lighten-5 text-body-2 pt-12 pb-6 border-t mt-5" style="border-top: 2px solid #C7E5C9; transform: translateY(200px);">
    <v-container fluid>
      <!-- Main Content Grid -->
      <v-row justify="space-between">
        
        <v-col cols="12" md="4" lg="3">
          <div class="d-flex align-center gap-2 mb-3">
            <v-img :src="require('@/assets/images/mercury.png')" width="80" height="75" style="filter: drop-shadow(3px 3px 0 rgba(0,0,0,0.5));"  />
          </div>
          
          <p class="text-medium-emphasis mb-5 text-body-2 lh-relaxed text-green-darken-4 text-center">
            Your trusted partner for quick food and parcel deliveries. 
            Bringing convenience right to your doorstep, anytime, anywhere.
          </p>
        </v-col>

        <v-col cols="6" sm="4" md="2">
          <div class="font-weight-bold mb-4 text-subtitle-2 text-center text-uppercase text-green-darken-4">
            For Customers
          </div>
          <div class="d-flex flex-column gap-3 text-center">
            <a href="#" class="footer-link">Order Tracking</a>
            <a href="#" class="footer-link">Popular Restaurants</a>
            <a href="#" class="footer-link">Coverage Areas</a>
          </div>
        </v-col>

        <!-- Customer Support Card & Payments -->
        <v-col cols="12" sm="4" md="3">
          <div class="font-weight-bold mb-4 text-subtitle-2 text-center text-uppercase text-green-darken-4">
            Help & Contact
          </div>

          <!-- Hotline Card -->
          <v-card variant="flat" class="pa-4 rounded-sm border mb-4 elevation-1 bg-teal-darken-2">
            <div class="d-flex align-center">
              <v-avatar color="primary-lighten-5" size="42">
                <v-icon color="primary">mdi-headset</v-icon>
              </v-avatar>
              <div class="ms-3">
                <div class="text-caption text-medium-emphasis text-white">Helpline (8 AM - 8 PM)</div>
                <div class="font-weight-bold text-subtitle-1 text-white">09-775 121 526</div>
              </div>
            </div>
          </v-card>

          <!-- Accept Payments -->
          <div class="text-caption text-medium-emphasis mb-2 font-weight-medium text-green-darken-4">
            Mostly Accepting Payment Types
          </div>
          <div class="d-flex align-center flex-wrap">
            <v-chip size="small" variant="outlined" color="blue-darken-2" class="font-weight-bold me-2">
              KBZPay
            </v-chip>
            <v-chip size="small" variant="outlined" color="amber-darken-3" class="font-weight-bold me-2">
              WaveMoney
            </v-chip>
            <v-chip size="small" variant="outlined" color="success" class="font-weight-bold">
              COD (Cash)
            </v-chip>
          </div>
        </v-col>

      </v-row>

      <v-divider class="mb-6" />

      <!-- Copyright -->
      <div class="text-center">
        <div class="text-caption text-medium-emphasis text-green-darken-4">
          © 2026 SpeedyExpress Delivery System. All rights reserved.
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
/* Hover Effect for Links */
.footer-link {
  color: rgb(18, 111, 32);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
  font-size: 0.875rem;
}

.footer-link:hover {
  color: #1976D2; /* Primary Color */
  transform: translateX(3px);
}
/* App Button Styling */
.style-sub {
  font-size: 0.65rem !important;
  line-height: 1;
}

.style-main {
  font-size: 0.85rem !important;
  line-height: 1.2;
}
</style>
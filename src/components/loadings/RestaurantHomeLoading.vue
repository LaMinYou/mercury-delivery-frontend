<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="n in 3" :key="n" cols="12">
        <v-card>
          <div class="d-flex align-center justify-space-between flex-wrap ga-3">
            <v-skeleton-loader
              type="text"
              width="160"
              class="ma-0"
            ></v-skeleton-loader>

            <v-skeleton-loader
              type="text"
              width="100"
              class="ma-0"
            ></v-skeleton-loader>

            <div class="d-flex flex-column align-center">
              <v-skeleton-loader
                type="text"
                width="90"
                class="mb-1"
              ></v-skeleton-loader>
              
            </div>

            <v-skeleton-loader
              type="text"
              width="70"
              height="28"
            ></v-skeleton-loader>

            <v-skeleton-loader
              type="text"
              width="85"
              height="28"
            ></v-skeleton-loader>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
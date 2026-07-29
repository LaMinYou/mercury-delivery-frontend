<template>
    <v-container fluid>
        <v-row>
        <v-col v-for="n in 3" :key="n" cols="12" md="4">
          <v-card flat rounded="lg" class="pa-2">
            <v-skeleton-loader type="heading" height="60"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card flat rounded="lg" class="pa-6">
            <v-skeleton-loader type="subtitle" width="300" class="mb-4"></v-skeleton-loader>
            <v-skeleton-loader type="image" height="500" class="rounded-lg"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
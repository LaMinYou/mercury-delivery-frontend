<template>
    <v-container fluid>
      <v-row>
        
        <v-slide-group show-arrows="never">
          <v-slide-group-item v-for="n in 10" :key="n">
            <div>
              <v-skeleton-loader type="avatar" size="50" class="bg-transparent"></v-skeleton-loader>
              <v-skeleton-loader type="text" class="bg-transparent"></v-skeleton-loader>
            </div>
          </v-slide-group-item>
        </v-slide-group>
      </v-row>
      <v-row>
        <v-col v-for="n in 6" :key="n" cols="12" md="4" sm="6">
          <v-card flat rounded="lg" class="pa-4 border">
            <v-skeleton-loader
              type="image"
              height="150"
              class="rounded-lg mb-3"
            ></v-skeleton-loader>
            <v-skeleton-loader type="heading" class="mb-2"></v-skeleton-loader>
            <v-skeleton-loader type="subtitle"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>
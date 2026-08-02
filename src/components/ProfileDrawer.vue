<template>
  <!-- <v-layout> -->
    <v-navigation-drawer
      :model-value="openProfileDrawer"
      @update:model-value="$emit('closeProfileDrawer')"
      location="right"
      temporary
      style="z-index: 9999 !important"
      width="335"
    >
      <v-list-item
        prepend-icon="mdi-close"
        title="Profile"
        @click="$emit('closeProfileDrawer'), (openEditSheet = false)"
        class="cursor-pointer"
        height="60"
      ></v-list-item>

      <v-divider></v-divider>

      <div>
        <!-- user level  -->
        <v-card v-if="user.role_id == 3" class="px-3 ma-2 my-3">
          <div>
            <p class="text-grey">အသုံးပြုသူအဆင့်</p>
            <p class="font-weight-bold">
              <v-icon :color="levelDetails.color">{{
                levelDetails.icon
              }}</v-icon>
            </p>
            <p class="text-grey text-body-small">
              Total Orders : {{ userLevel?.order_count }}
            </p>
          </div>
        </v-card>
        <!-- name -->
        <v-card
          class="d-flex justify-space-between align-center px-3 ma-2 my-3"
        >
          <div>
            <p class="text-grey">အမည်</p>
            <p class="font-weight-bold">{{ user.name }}</p>
          </div>
          <div @click="showEditSheet('name')">
            <v-icon color="grey" class="cursor-pointer"
              >mdi-pencil-outline</v-icon
            >
          </div>
        </v-card>

        <!-- email -->
        <v-card
          v-if="user.email"
          class="d-flex justify-space-between align-center px-3 ma-2 my-3"
        >
          <div>
            <p class="text-grey">အီးမေးလ်</p>
            <p class="font-weight-bold">{{ user?.email }}</p>
          </div>
          <div @click="showEditSheet('email')">
            <v-icon color="grey" class="cursor-pointer"
              >mdi-pencil-outline</v-icon
            >
          </div>
        </v-card>

        <!-- phone -->
        <v-card
          v-if="user.phone"
          class="d-flex justify-space-between align-center px-3 ma-2 my-3"
        >
          <div>
            <p class="text-grey">ဖုန်းနံပါတ်</p>
            <p class="font-weight-bold">{{ user?.phone }}</p>
          </div>
          <div @click="showEditSheet('phone')">
            <v-icon color="grey" class="cursor-pointer"
              >mdi-pencil-outline</v-icon
            >
          </div>
        </v-card>
      </div>
      <!-- edit userinfo box -->
      <v-card
        class="pa-2 rounded-t-xl shadow-lg edit-card"
        v-if="openEditSheet"
      >
        <v-card-title
          class="text-wrap text-blue-grey-darken-4 text-body-small py-5"
        >
          ဤနည်းဖြင့် ကျွန်ုပ်တို့က သင့်ကို အကြောင်းကြားပါသည်။ ကျေးဇူးပြု၍
          အချက်လက်အားမှန်ကန်စွာဖြင့်သွင်းပါ။
        </v-card-title>

        <v-text-field
          v-model="editField"
          :label="currentFieldName"
          variant="outlined"
          density="conformtable"
          color="green-darken-2"
        />

        <div class="d-flex justify-end">
          <v-btn variant="text" @click="openEditSheet = false"> Cancel </v-btn>

          <v-btn color="green-darken-4" :loading="loading" @click="updateUser">
            Save
          </v-btn>
        </div>
      </v-card>
    </v-navigation-drawer>
  <!-- </v-layout> -->
</template>

<script setup>
import api from "@/services/api";
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";


const props = defineProps(["openProfileDrawer", "user"]);
const emit = defineEmits(["closeProfileDrawer", "update:user"]);
const router = useRouter();
const route = useRoute();
const openEditSheet = ref(false);
const editField = ref(null);
const currentFieldName = ref(null);
const loading = ref(false);

const userLevel = ref();
const getUserLevel = async () => {
  try{
    const res = await api.get("/auth/user-level");
    userLevel.value = res.data;
    //console.log(userLevel.value);
  }catch(err){
    console.error("Something Went Wrong - ", err);
    if (err.response && err.response.status === 403) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
};

const levelDetails = computed(() => {
  const currentLevel = userLevel.value?.user_level;
  switch (currentLevel) {
    case "Diamond":
      return {
        color: "light-blue-lighten-2",
        icon: "mdi-diamond-stone",
      };
    case "Gold":
      return {
        color: "amber-lighten-1",
        icon: "mdi-crown",
      };
    default:
      return {
        color: "grey-lighten-1",
        icon: "mdi-crown",
      };
  }
});

const showEditSheet = (fieldName) => {
  currentFieldName.value = fieldName;
  editField.value = props.user[fieldName];
  openEditSheet.value = true;
}

const updateUser = async() => {
  loading.value = true;
  try{
    const res = await api.put('/auth/user/update-profile', { fieldName: currentFieldName.value, editField: editField.value });
    console.log(res.data.message);
    localStorage.setItem('user', JSON.stringify(res.data.user));
   emit('update:user', res.data.user);
    openEditSheet.value = false;
    emit('closeProfileDrawer');

  }catch(err){
    console.log(err.response?.data?.message || err.message || err);
  }
  loading.value = false;
}

onMounted(() => {
  props.user.role_id == 3 ? getUserLevel() : '';
});
</script>

<style scoped>
.edit-card {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-top: 2px solid green;
  box-shadow: 0 -5px 7px rgba(0, 0, 0, 0.2);
  animation: animate 0.2s linear forwards;
}
@keyframes animate {
  from {
    transform: translateY(300px);
  }
  to {
    transform: translateY(0);
  }
}
</style>
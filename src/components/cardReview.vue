<template>
  <b-col lg="3" md="4" sm="6">
    <b-card class="mb-4">
      <div class="img-hover-zoom">
        <img :src="datas.image" @click="toDetailPage" class="full-imge" />
      </div>
      <div class="text-title-card">
        <span class="link-detail" @click="toDetailPage">{{ datas.title }}</span>
      </div>
      <div class="mb-3">
      <div class="text-date">
        <CalendarIcon class="mb-1 mr-1" size="18" /> {{ datas.createAt }}
      </div>
      </div>
    </b-card>
  </b-col>
</template>

<script>
import "../assets/scss/style.scss";
import { CalendarIcon } from "vue-feather-icons";

export default {
  name: "CardReview",
  props: ["datas"],
  components: {
    CalendarIcon,
  },
  methods: {
    toDetailPage() {
      this.$emit("toDetailPage", this.datas);
    },
  },
};
</script>

<style scoped>
.full-imge {
  cursor: pointer;
  width: 100%;
  height: 250px;
  object-fit: cover;
}
.text-date {
  font-size: 13px;
  color: gray;
  bottom: 12px;
  position: absolute;
}
.text-title-card {
  font-size: 20px;
  padding-bottom: 10px;
}
.text-title-card:hover {
  color: rgb(0, 0, 0);
}
</style>
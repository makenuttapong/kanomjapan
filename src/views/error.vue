<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <span class="mb-1 Page404">404</span>
        <p class="mb-3 Page404-text">ไม่พบหน้าที่คุณต้องการ</p>

        <b-button variant="primary" class="mb-3 btn-sm-block" @click="goHome">
          กลับหน้าแรก
        </b-button>

        <div class="mt-4">
          <b-img
            fluid
            :src="require('@/assets/notFound.svg')"
            alt="Error page"
            width="400px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/scss/style.scss";

export default {
  name: "error",
  created(){
    this.goHome()
  },

  methods: {
    goHome() {
        this.$router.replace("/");
    },
  },
};
</script>

<style scoped>
  .Page404 {
    font-size: 100px;
  }
  .Page404-text {
    font-size: 30px;
  }
  .misc-wrapper {
    align-items: center;
    justify-content: center;
    display: flex;
    flex-basis: 100%;
    min-height: 100vh;
  }
</style>
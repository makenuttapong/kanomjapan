<template>
  <div>
    <b-row>
      <b-col lg="3" md="3">
        <div class="text-center d-none d-lg-block d-md-block d-sm-none mt-4">
         <b-img
            fluid
            :src="require('@/assets/about.svg')"
            class="mt-4"
          />
        </div>
      </b-col>
      <b-col lg="9" md="9">
        <b-row>
          <b-col lg="12">
            <b-card class="mb-4">
               <div class="bold mb-3">เกี่ยวกับเรา</div>
              <div v-if="loading" >
                <VclList width="400px"/>
              </div>
              <div v-if="!loading">
               
                <span v-html="aboutData.detail" />
              </div>
            </b-card>
          </b-col>
          <b-col lg="12">
            <b-card class="mb-4">
               <div class="bold">ติดตามเราได้ที่</div>
                   <div v-if="loading" >
                <VclList width="400px"/>
              </div>
                <div v-if="!loading">
             
              <div class="mt-3 mb-2">
                <img
                  v-if="aboutData.follow.Facebook"
                  src="../assets/facebook-icon.svg"
                  alt="facebook"
                  width="40px"
                  rel="preload"
                  class="mr-3 pointer platform-social"
                  @click="openLink(aboutData.follow.Facebook)"
                />
                <img
                  v-if="aboutData.follow.Line"
                  src="../assets/line-icon.png"
                  alt="line"
                  width="40px"
                  rel="preload"
                  class="mr-3 pointer platform-social"
                  @click="openLink(aboutData.follow.Line)"
                />
                <img
                  v-if="aboutData.follow.Instagram"
                  src="../assets/instagram-icon.png"
                  alt="instagram"
                  width="40px"
                  rel="preload"
                  class="mr-3 pointer platform-social"
                  @click="openLink(aboutData.follow.Instagram)"
                />
                <img
                  v-if="aboutData.follow.Twitter"
                  src="../assets/twitter-icon.png"
                  alt="twitter"
                  width="40px"
                  rel="preload"
                  class="pointer platform-social"
                  @click="openLink(aboutData.follow.Twitter)"
                />
              </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import "../assets/scss/style.scss";
import { VclList } from "vue-content-loading";

export default {
  name: "AboutMe",
  data() {
    return {
      loading: false,
      aboutData: {},
    };
  },
  components: {
    VclList,
  },
  created() {
    window.scrollTo(0, 0);
    this.loadAboutMe();
  },
  methods: {
    loadAboutMe() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/ZAovlhqAMWuekijeM79c");
      settingRef
        .get()
        .then((querySnapshot) => {
          var setData = {
            detail: querySnapshot.data().detail,
            follow: querySnapshot.data().follow,
          };
          this.aboutData = setData;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    openLink(link) {
      window.open(link);
    },
  },
};
</script>

<style scoped>
.platform-social:hover{
  opacity: 0.5;
}
</style>
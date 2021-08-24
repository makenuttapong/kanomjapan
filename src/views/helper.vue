<template>
  <div>
    <section id="faq-tabs">
      <b-tabs
        vertical
        content-class="col-12 col-md-8 col-lg-9"
        pills
        nav-wrapper-class="faq-navigation col-md-4 col-lg-3 col-12"
        nav-class="nav-left"
      >
      
        <div v-if="loading">
          <b-card class="mb-4 p-2">
            <vcl-facebook></vcl-facebook>
          </b-card>
        </div>

        <b-tab
          v-for="(helperlist, index) in helperData"
          :key="index"
          :active="!index"
        >
        
          <template #title>
            <icon :class="helperlist.icon" size="18" />
            <span class="ml-1"> {{ helperlist.name }}</span>
          </template>

          <ListHelpers :options="helperlist" :index="index"/>
        </b-tab>
  
        <template #tabs-end>
          <b-img
            fluid
            :src="require('@/assets/images/illustration/faq-illustrations.svg')"
            class="d-none d-md-block mt-4"
          />
        </template>
     
      </b-tabs>
    </section>

    <section class="faq-contact pb-4">
      <b-row class="mt-5 pt-75 text-center match-height">
        <b-col cols="12" class="mb-4">
          <h3>ติดต่อเราได้ทางช่องทางดังต่อไปนี้</h3>
        </b-col>
        <b-col sm="4">
          <b-card class="shadow-none py-1 faq-contact-card mb-2">
            <b-avatar size="42" rounded  class="mb-2 phone-icon">
              <i class="fa fa-phone" color="#F73739" />
            </b-avatar>
            <h5>{{ dataSetting.phone }}</h5>
            <span class="text-body"
              >สามารถติดต่อได้ทุกวัน 09:00 - 20.00 น.</span
            >
          </b-card>
        </b-col>
        <b-col sm="4">
          <b-card class="shadow-none py-1 faq-contact-card mb-2">
            <b-avatar size="42" rounded variant="light-primary" class="mb-2">
              <i class="fa fa-envelope" />
            </b-avatar>
            <h5>{{ dataSetting.email }}</h5>
            <span class="text-body">เราจะติดต่อกลับอย่างเร็วที่สุด</span>
          </b-card>
        </b-col>
        <b-col sm="4">
          <b-card class="shadow-none py-1 faq-contact-card mb-2">
            <b-avatar
              size="42"
              rounded
            
              class="mb-2 line-icon"
            >
              <i class="fab fa-line" color="#06C152"/>
            </b-avatar>
            <h5>{{ dataSetting.line }}</h5>
            <span class="text-body">มี @ ด้วยนะ</span>
          </b-card>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<script>
import "../assets/scss/style.scss";
import ListHelpers from "../components/listHelper";
import "../assets/scss/style.scss";
import firebaseApp from "../firebase/firebase_app";
import { VclFacebook } from "vue-content-loading";

export default {
  name: "helper",
  components: {
    ListHelpers,
    VclFacebook,
  },
  created() {
    window.scrollTo(0, 0);
    this.loadSetting();
    this.loadHelper();
  },
  data() {
    return {
      loading: false,
      dataSetting: {
        email: "-",
        phone: "-",
        line: "-",
      },
      helperData: [],
    };
  },
  methods: {
    loadSetting() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/kZDbReBlckvBVjqzLJ1g");
      settingRef
        .get()
        .then((querySnapshot) => {
          var setData = {
            email: querySnapshot.data().email,
            phone: querySnapshot.data().phone,
            line: querySnapshot.data().line,
          };
          this.dataSetting = setData;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    loadHelper() {
      this.loading = true;
      const helperRef = firebaseApp
        .firestore()
        .doc("setting/b9AARtqbGH4JOZvYTZQk");
      helperRef
        .get()
        .then((querySnapshot) => {
          this.helperData = querySnapshot.data().helpers;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },
};
</script>

<style>
.line-icon svg {
  font-size: 25px;
}
.line-icon{
  background-color: #e0ffec;
}
.phone-icon{
background-color: #ffecec;
}
</style>
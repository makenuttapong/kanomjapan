<template>
  <div class="pb-4">
    <b-tabs
      vertical
      content-class="col-12 col-md-9 mt-1 mt-md-0"
      pills
      nav-wrapper-class="col-md-3 col-12"
    >
      <!-- general tab -->
      <b-tab active>
        <template #title>
          <i size="18" class="fa fa-user mr-2" />
          <span class="f-500">ข้อมูลทั่วไป</span>
        </template>
        <General
          :data="userProfile"
          @newData="saveNewDataGeneral"
          :loading="loading"
        />
      </b-tab>

      <!-- addtess info -->
      <b-tab>
        <template #title>
          <i size="18" class="fa fa-map-marker-alt mr-2" />
          <span class="f-500">ข้อมูลที่อยู่</span>
        </template>
        <Address
          :data="userProfile"
          @newData="saveNewDataAddress"
          :loading="loading"
        />
      </b-tab>

      <!-- change password tab -->
      <b-tab v-if="userProfile.signinWith == 'email'">
        <template #title>
          <i size="18" class="fa fa-lock mr-2" />
          <span class="f-500">เปลี่ยนรหัสผ่าน</span>
        </template>
        <ChangePassword />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import General from "../../components/general.vue";
import ChangePassword from "../../components/changePassword";
import Address from "../../components/address";
import "../../assets/scss/style.scss";
import moment from "moment";
import imageDF from "../../assets/userDF.png";

export default {
  name: "profile",
  components: {
    General,
    ChangePassword,
    Address,
  },
  data() {
    return {
      imageDF,
      loading: false,
      userProfile: {
        signinWith: "",
        email: "",
        name: "",
        phone: "",
        gender: "",
        birthdate: "",
        lineID: "",
        address: {
          name: "",
          phone: "",
          district: "",
          amphoe: "",
          province: "",
          zipcode: "",
          road: "",
          soy: "",
          houseNumber: "",
        },
      },
    };
  },
  created() {
    this.loadProfile();
  },
  methods: {
    loadProfile() {
      this.loading = true;
      const currentAdmin = firebaseApp.auth().currentUser;
      const adminDetailRef = firebaseApp
        .firestore()
        .doc("users/" + currentAdmin.uid);
      return adminDetailRef.get().then((doc) => {
        var setData = {
          uid: doc.id,
          signinWith: doc.data().signinWith,
          email: doc.data().email,
          name: doc.data().name,
          phone: doc.data().phone ? doc.data().phone : "",
          gender: doc.data().gender ? doc.data().gender : "",
          image: doc.data().image ? doc.data().image : "",
          lineID: doc.data().lineID,
          birthdate: doc.data().birthdate
            ? this.formatDate(doc.data().birthdate)
            : "",
          address: {
            name: doc.data().address.name ? doc.data().address.name : "",
            phone: doc.data().address.phone ? doc.data().address.phone : "",
            district: doc.data().address.district
              ? doc.data().address.district
              : "",
            amphoe: doc.data().address.amphoe ? doc.data().address.amphoe : "",
            province: doc.data().address.province
              ? doc.data().address.province
              : "",
            zipcode: doc.data().address.zipcode
              ? doc.data().address.zipcode
              : "",
            road: doc.data().address.road ? doc.data().address.road : "",
            houseNumber: doc.data().address.houseNumber
              ? doc.data().address.houseNumber
              : "",
            soy: doc.data().address.soy ? doc.data().address.soy : "",
          },
        };
        this.loading = false;
        this.userProfile = setData;
      });
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    saveNewDataAddress(newdata) {
      this.loading = true;
      var address = {
        address: {
          name: newdata.name,
          phone: newdata.phone,
          district: newdata.district,
          amphoe: newdata.amphoe,
          province: newdata.province,
          zipcode: newdata.zipcode,
          road: newdata.road,
          soy: newdata.soy,
          houseNumber: newdata.houseNumber,
        },
      };
      const updataData = firebaseApp
        .firestore()
        .doc("users/" + this.userProfile.uid);
      updataData
        .update(address)
        .then(() => {
          this.loading = false;
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadProfile();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    saveNewDataGeneral(newdata) {
      this.loading = true;

      var generalData = {
        image: newdata.image,
        name: newdata.name,
        phone: newdata.phone,
        gender: newdata.gender,
        birthdate : "",
        lineID: newdata.lineID,
      };

      if (newdata.date) {
        var preFormat = moment(newdata.date, "DD/MM/YYYY");
        var format = moment(preFormat).format("MM/DD/YYYY");
        var dateToTimeStame = new Date(Date.parse(format));
        generalData.birthdate = dateToTimeStame;
      }

      this.updateProfile(generalData);
    },

    updateProfile(data) {
      localStorage.setItem("userProfileImage", data.image);
      var userData = {
        name: data.name,
        role: "user",
        image: data.image ? data.image : "",
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      const updataData = firebaseApp
        .firestore()
        .doc("users/" + this.userProfile.uid);
      updataData
        .update(data)
        .then(() => {
          this.loading = false;
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });

          var selectMenuImage = document.querySelector(
            "#fullSidebar >span > img"
          );
          selectMenuImage.src = localStorage.getItem("userProfileImage") ? localStorage.getItem("userProfileImage"): imageDF;

          var selectName = document.querySelector("#fullName");
          selectName.innerHTML = data.name;

          this.loadProfile();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
  },
};
</script>

<style>
</style>
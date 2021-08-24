<template>
  <div>
    <b-tabs
      vertical
      content-class="col-12 col-md-9 mt-1 mt-md-0"
      pills
      nav-wrapper-class="col-md-3 col-12"
      nav-class="nav-left"
    >
      <!-- general tab -->
      <b-tab active>
        <template #title>
          <i size="18" class="fa fa-user mr-2" />
          <span class="f-500">ข้อมูลทั่วไป</span>
        </template>
        <General
          :data="adminProfile"
          @newData="saveNewDataGeneral"
          :loading="loading"
        />
      </b-tab>

      <!-- change password tab -->
      <b-tab>
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
import "../../assets/scss/style.scss";
import moment from "moment";
import imageDF from "../../assets/bot.png";

export default {
  name: "AdminProfile",
  components: {
    General,
    ChangePassword,
  },
  data() {
    return {
      loading: false,
      adminProfile: {
        email: "",
        name: "",
        phone: "",
        gender: "",
        birthdate: "",
        lineID : ""
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
          email: doc.data().email,
          name: doc.data().name,
          phone: doc.data().phone ? doc.data().phone : "",
          gender: doc.data().gender ? doc.data().gender : "",
          image: doc.data().image ? doc.data().image : "",
          lineID : doc.data().lineID,
          birthdate: doc.data().birthdate
            ? this.formatDate(doc.data().birthdate)
            : "",
        };
        this.loading = false;

        this.adminProfile = setData;
      });
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    saveNewDataGeneral(newdata) {
      this.loading = true;
     

      var generalData = {
        image: newdata.image,
        name: newdata.name,
        phone: newdata.phone,
        gender: newdata.gender,
        birthdate: '',
        lineID : newdata.lineID
      };

        if (newdata.date) {
        var preFormat = moment(newdata.date, "DD/MM/YYYY");
              var format = moment(preFormat).format("MM/DD/YYYY");
              var dateToTimeStame = new Date(Date.parse(format));
              generalData.birthdate = dateToTimeStame
        }
      this.updateProfile(generalData);
    },
    updateProfile(data) {
      localStorage.setItem("userProfileImage", data.image);
      const updataData = firebaseApp
        .firestore()
        .doc("users/" + this.adminProfile.uid);
      updataData.update(data).then(() => {
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

        selectMenuImage.src = localStorage.getItem("userProfileImage") ?localStorage.getItem("userProfileImage")  : imageDF;

        this.loadProfile();
      }).catch((err) => {
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
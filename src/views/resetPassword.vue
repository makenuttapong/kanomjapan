<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <b-overlay :show="loading" rounded="sm" class="setOverlay">
        <b-card v-if="!successReset" class="mb-0">
          <div class="brand-logo text-center" >
            <img :src="require('../assets/logoW.svg')" width="90px" @click="goHomePage" />
          </div>

          <b-card-title class="mb-1 center"> รีเซตรหัสผ่าน </b-card-title>


          <validation-observer ref="simpleRules">
            <b-form
              method="POST"
              class="auth-reset-password-form mt-2"
              @submit.prevent="submit"
            >
    
              <b-form-group label="รหัสผ่านใหม่" label-for="reset-password-new">
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="Password"
                  rules="required|min:8"
                >
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    type="password"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    name="reset-password-new"
                    placeholder="กรอกรหัสผ่านใหม่"
                  />

                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label-for="reset-password-confirm"
                label="ยืนยันรหัสผ่าน"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="password2"
                    type="password"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false : null"
                    name="reset-password-confirm"
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  />

                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-button block type="submit" variant="primary">
                รีเซตรหัสผ่าน
              </b-button>
            </b-form>
          </validation-observer>
        </b-card>

        <b-card v-if="successReset" class="mb-0">
          <div class="img-done center">
            <img src="../assets/reset-done.svg" width="300px" />
            <div class="mt-4">
              <b-link class="" @click="goHome">กลับไปยังหน้าเข้าสู่ระบบ </b-link>
              </div>
          </div>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "../helper/validations";
import "../assets/scss/style.scss";
export default {
  name: "resetPass",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      password: "",
      password2: "",
      successReset: false,
      // validation
      required,
      email,
      loading: false,
      mode: "",
      oobCode: "",
      apikey: "",
      lang: "",
    };
  },
  created() {
    this.mode = this.$route.query.mode;
    this.oobCode = this.$route.query.oobCode;
    this.apikey = this.$route.query.apiKey;
    this.lang = this.$route.query.lang;
    if (!this.mode && this.oobCode) {
      this.$router.replace("/*");
    }
  },
  methods: {
    submit() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          if (this.mode == "resetPassword") {
            this.loading = true;
            firebaseApp
              .auth()
              .confirmPasswordReset(this.oobCode, this.password)
              .then(() => {
                this.loading = false;
                this.success();
              })
              .catch((err) => {
                this.loading = false;
                this.error();
                console.log(err);
              });
          }
        }
      });
    },
    goHome(){
      this.$router.replace("/login");
    },
    success() {
      this.$swal({
        title: "สำเร็จ!",
        text: "เปลี่ยนรหัสผ่านเรียบร้อย",
        icon: "success",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        this.successReset = true;
      });
    },
    error() {
      this.$swal({
        title: "ผิดพลาด!",
        text: " รหัสมีการแก้ไขไม่ถูกต้อง หมดอายุ หรือมีการแก้ไขแล้ว",
        icon: "error",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
    },
  },
};
</script>

<style>
</style>
<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Forgot Password v1 -->
      <b-overlay :show="loading" rounded="sm" class="setOverlay">
        <b-card class="mb-0">
          <div class="brand-logo text-center" >
            <img :src="require('../assets/logoW.svg')" width="90px" @click="goHomePage" />
          </div>

          <b-card-title class="mb-1 center"> ลืมรหัสผ่าน </b-card-title>

          <!-- form -->
          <validation-observer ref="simpleRules">
            <b-form
              class="auth-forgot-password-form mt-2"
              @submit.prevent="submit"
            >
              <!-- email -->
              <b-form-group label="อีเมล" label-for="forgot-password-email">
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="forgot-password-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false : null"
                    name="forgot-password-email"
                    placeholder="กรอกอีเมล"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- submit button -->
              <b-button variant="primary" block type="submit">
                ส่งลิงก์ไปยังอีเมล
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-4">
            <b-link :to="{ name: 'login' }">
              <ChevronLeftIcon size="1.2x" />เข้าสู่ระบบ
            </b-link>
          </b-card-text>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import { ChevronLeftIcon } from "vue-feather-icons";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "../helper/validations";
import "../assets/scss/style.scss";

export default {
  name: "forget",
  components: {
    ValidationProvider,
    ValidationObserver,
    ChevronLeftIcon,
  },
  data() {
    return {
      userEmail: "",
      // validation
      required,
      email,
      loading: false,
    };
  },
  methods: {
    submit() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.loading = true;
          firebaseApp
            .auth()
            .sendPasswordResetEmail(this.userEmail)
            .then(() => {
              this.loading = false;
              this.success();
            })
            .catch((err) => {
              this.loading = false;
              this.error()
              console.log(err.message);
            });
        }
      });
    },
    goHomePage() {
      this.$router.replace("/home");
    },
    success() {
      this.$swal({
        title: "สำเร็จ!",
        text: "ระบบได้ส่งลิงก์ไปยังอีเมลของท่านแล้ว",
        icon: "success",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        this.$router.replace("/login");
      });
    },
     error() {
      this.$swal({
        title: "ผิดพลาด!",
        text: "ไม่พบอีเมลนี้ในระบบ",
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
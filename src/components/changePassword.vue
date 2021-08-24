<template>
  <b-card>
    <!-- form -->
    <div class="d-flex align-items-center mb-2">
      <h4 class="mb-4 ml-75">
        <i size="18" class="fa fa-lock" color="#7367f0" /> เปลี่ยนรหัสผ่าน
      </h4>
    </div>
    <validation-observer ref="Rules">
      <b-form @submit.prevent="confirmPass">
        <b-row>
          <!-- old password -->
          <b-col md="6">
            <b-form-group label="รหัสผ่านเดิม" label-for="account-old-password">
              <ValidationProvider
                #default="{ errors }"
                name="Oldpassword"
                vid="Oldpassword"
                rules="required|min:8"
              >
                <b-form-input
                  id="account-old-password"
                  v-model="oldpass"
                  name="old-password"
                  type="password"
                  :state="errors.length > 0 ? false : null"
                  placeholder="กรอกรหัสผ่านเดิม"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <!-- new password -->
          <b-col md="6">
            <b-form-group label-for="account-new-password" label="รหัสผ่านใหม่">
              <ValidationProvider
                #default="{ errors }"
                name="Password"
                vid="Password"
                rules="required|min:8"
              >
                <b-form-input
                  id="account-new-password"
                  type="password"
                  v-model="newpass"
                  :state="errors.length > 0 ? false : null"
                  name="new-password"
                  placeholder="กรอกรหัสผ่านใหม่"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <!-- retype password -->
          <b-col md="6">
            <b-form-group
              label-for="account-retype-new-password"
              label="ยืนยันรหัสผ่านใหม่"
            >
              <ValidationProvider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|confirmed:Password"
              >
                <b-form-input
                  id="account-retype-new-password"
                  v-model="newrepass"
                  type="password"
                  name="retype-password"
                  :state="errors.length > 0 ? false : null"
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                />

                <small class="text-danger">{{ errors[0] }}</small>
              </ValidationProvider>
            </b-form-group>
          </b-col>

          <!-- buttons -->
          <b-col cols="12">
            <b-button type="submit" variant="primary" class="mt-1 mr-1">
              บันทึก
            </b-button>
            <b-button
              @click="resetPassInput"
              variant="outline-primary"
              class="mt-1"
            >
              รีเซต
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "../helper/validations";
import firebaseApp from "../firebase/firebase_app";

export default {
  name: "changePassword",
  data() {
    return {
      oldpass: "",
      newpass: "",
      newrepass: "",
      required,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    confirmPass() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          var user = firebaseApp.auth().currentUser;
          firebaseApp
            .auth()
            .signInWithEmailAndPassword(user.email, this.oldpass)
            .then(() => {
              user
                .updatePassword(this.newpass)
                .then(() => {
                  this.success();
                  this.resetPassInput();
                })
                .catch((error) => {
                  this.error();
                  console.log(error);
                });
            })
            .catch((err) => {
              this.error();
              console.log(err);
            });
        }
      });
    },
    resetPassInput() {
      this.oldpass = "";
      this.newpass = "";
      this.newrepass = "";
      this.$refs.Rules.reset();
    },
    signOut() {
      this.$store.dispatch("changePage", 0);
      firebaseApp
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/");
          this.$store.commit("setUser", {});
          window.localStorage.setItem("userData", {});
          localStorage.setItem("userProfileImage", "");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    success() {
      this.$swal({
        title: "สำเร็จ!",
        text: "เปลี่ยนรหัสผ่านสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        this.signOut();
      });
    },
    error() {
      this.$swal({
        title: "ผิดพลาด!",
        text: "รหัสผ่านไม่ถูกต้อง",
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
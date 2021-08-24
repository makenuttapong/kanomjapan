<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Register  -->
      <b-overlay :show="loading" rounded="sm" class="setOverlay">
        <b-card class="mb-2">
          <div class="brand-logo text-center" >
            <img :src="require('../assets/logoW.svg')" width="90px" @click="goHomePage" />
          </div>

          <b-card-title class="mb-1 center"> สมัครสมาชิก </b-card-title>
          <!-- form -->
          <validation-observer ref="Rules">
            <b-form class="auth-login-form mt-2" @submit.prevent="submit">
              <b-form-group label-for="name" label="ชื่อ">
                <ValidationProvider
                  #default="{ errors }"
                  name="Display Name"
                  rules="required"
                >
                  <b-form-input
                    id="input-name"
                    v-model="name"
                    type="text"
                    placeholder="กรอกชื่อ"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>

              <!-- Email -->
              <b-form-group label-for="email" label="อีเมล">
                <ValidationProvider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="input-email"
                    v-model="emailVaue"
                    type="email"
                    placeholder="กรอกอีเมล"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>

              <!-- Password -->
              <b-form-group label-for="password" label="รหัสผ่าน">
                <ValidationProvider
                  #default="{ errors }"
                  name="Password"
                  vid="Password"
                  rules="required|min:8"
                >
                  <b-form-input
                    id="input-password"
                    v-model="password"
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>

              <!-- RePassword -->
              <b-form-group label-for="password" label="ยืนยันรหัสผ่าน">
                <ValidationProvider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="required|confirmed:Password"
                >
                  <b-form-input
                    id="input-password2"
                    v-model="password2"
                    type="password"
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    :state="errors.length > 0 ? false : null"
                  ></b-form-input>
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="register-privacy-policy"
                  v-model="status"
                  name="checkbox-1"
                  class="checkPolicy"
                >
                  <span>ยอมรับ</span>
                  <b-link @click="openRule"> ข้อตกลงการใช้งาน</b-link>
                </b-form-checkbox>
              </b-form-group>

              <!-- submit button -->
              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="!status || loading"
              >
                สมัครสมาชิก
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-4">
            <b-link @click="goToLogin">
              <ChevronLeftIcon size="1.2x" />เข้าสู่ระบบ
            </b-link>
          </b-card-text>
        </b-card>
      </b-overlay>
    </div>

    <b-modal id="modal-Rule" hide-footer size="lg" title="ข้อตกลงการใช้งาน">
      <template>
        <div v-for="(poli, index) in policyData" :key="index">
          <div class="bold">{{index + 1}}. {{ poli.name }}</div>
          <div class="pl-3 pr-3 pb-2">{{ poli.detail }}</div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import { ChevronLeftIcon } from "vue-feather-icons";
import { required, email } from "../helper/validations";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import "../assets/scss/style.scss";
export default {
  name: "login",
  data() {
    return {
      policyData: [],
      name: "",
      emailVaue: "",
      password: "",
      password2: "",
      status: false,
      required,
      email,
      loading: false,
      Showoverlay: false,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    ChevronLeftIcon,
  },
  created() {
    this.loadPolicy();
  },
  methods: {
    loadPolicy() {
      const policyRef = firebaseApp
        .firestore()
        .doc("policy/0XEEyC4PRY8p3i8bzMph");
      policyRef
        .get()
        .then((querySnapshot) => {
    
           this.policyData = querySnapshot.data().policys
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          this.loading = true;
          firebaseApp
            .auth()
            .createUserWithEmailAndPassword(this.emailVaue, this.password)
            .then((data) => {
              data.user
                .updateProfile({
                  displayName: this.name,
                })
                .then(() => {
                  // เพิ่มข้อมูลเข้า db user
                  var uidAuth = data.user.uid;
                  const addUser = firebaseApp.firestore().collection("users");
                  return addUser
                    .doc(uidAuth)
                    .set({
                      name: this.name,
                      email: this.emailVaue,
                      image: "",
                      phone: "",
                      role: "user",
                      gender: "",
                      birthdate : "",
                      signinWith: "email",
                      lineID : "",
                      address : {
                          name: "",
                          phone : "",
                          amphoe: "",
                          district : "",
                          houseNumber : "",
                          province : "",
                          road : "",
                          soy : "",
                          zipcode : ""
                      },
                      createAt: new Date(),
                    })
                    .then(() => {
                      this.loading = false;
                      this.success();
                    });
                })
                .catch((err) => {
                  this.loading = false;
                  this.error();
                  console.log(err.message);
                });
            })
            .catch((err) => {
              this.loading = false;
              this.error();
              console.log(err.message);
            });
        }
      });
    },
    goToLogin() {
      this.$router.replace("/login");
    },
    goHomePage() {
      this.$router.replace("/");
    },
    openRule() {
      this.$bvModal.show("modal-Rule");
    },
    error() {
      this.$swal({
        title: "ผิดพลาด!",
        text: " อีเมลนี้ถูกใช้แล้ว",
        icon: "error",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      });
    },
    success() {
      this.$swal({
        title: "สำเร็จ!",
        text: " คุณสามารถเข้าสู่ระบบได้แล้วตอนนี้",
        icon: "success",
        confirmButtonText: "ตกลง",
        width: "500px",
        customClass: {
          confirmButton: "btn btn-primary",
        },
        buttonsStyling: false,
      }).then(() => {
        this.goToLogin();
      });
    },
  },
};
</script>
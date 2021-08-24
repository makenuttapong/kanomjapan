<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner bg-auth py-2">
      <b-overlay :show="loading" rounded="sm" class="setOverlay">
        <b-card class="mb-0">
          <div class="brand-logo text-center" >
            <img :src="require('../assets/logoW.svg')" width="90px" @click="goHomePage" />
          </div>
          
          <b-card-title class="mb-1 center"> ยินดีต้อนรับ </b-card-title>
          <validation-observer ref="Rules">
            <b-form class="auth-login-form mt-2" @submit.prevent="submit">
              <!-- Email -->
              <b-form-group label-for="emailValue" label="อีเมล">
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
                <div class="forget">
                  <b-link :to="{ name: 'forget' }">
                    <small>ลืมรหัสผ่าน?</small>
                  </b-link>
                </div>
              </b-form-group>
              <div class="center">
                <b-button
                  variant="primary"
                  type="submit"
                  block
                  :disabled="loading"
                >
                  <span>เข้าสู่ระบบ</span>
                </b-button>
              </div>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>ถ้าคุณยังไม่ได้เป็นสมาชิก </span>
            <b-link>
              <span @click="signUp">สมัครสมาชิก</span>
            </b-link>
          </b-card-text>
          <div class="divider my-2 center">
            <div class="divider-text">หรือ เข้าสู่ระบบด้วย</div>
          </div>
          <div class="center row">
            <div class="col mb-2">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
                block
                @click="googleSignIn"
              >
                <img
                  src="../assets/google-icon.svg"
                  width="18px"
                  rel="preload"
                />
                <span class="ml-2">Google</span>
              </b-button>
            </div>
            <div class="col mb-2">
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
                block
                @click="facebookSignIn"
              >
                <img
                  src="../assets/facebook-icon.svg"
                  width="18px"
                  rel="preload"
                />
                <span class="ml-2">Facebook</span>
              </b-button>
            </div>
          </div>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<script>
import firebaseApp, { providerG, providerF } from "../firebase/firebase_app";
import { required, email } from "../helper/validations";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import "../assets/scss/style.scss";
import icontoast from "../components/toast.vue";

export default {
  name: "login",
  data() {
    return {
      emailVaue: "",
      password: "",
      status: "",
      required,
      email,
      loading: false,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  methods: {
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          this.loading = true;
          firebaseApp
            .auth()
            .signInWithEmailAndPassword(this.emailVaue, this.password)
            .then((res) => {
              const uid = res.user.uid;
              this.loginGetData(uid);
            })
            .catch((err) => {
              this.loading = false;
              this.error();
              console.log(err.message);
            });
        }
      });
    },
    signUp() {
      this.$router.push("/register");
    },
    goHomePage() {
      this.$router.replace("/");
    },
    googleSignIn() {
      this.loading = true;
      firebaseApp
        .auth()
        .signInWithPopup(providerG)
        .then((result) => {
          var uidAuth = result.user.uid;
          var authData = {
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
            phone: result.user.phoneNumber ? result.user.phoneNumber : "",
            signinWith: "google",
            role: "user",
            createAt: new Date(),
            gender: "",
            birthdate: "",
            lineID : "",
            address: {
              name: "",
              phone : "",
              amphoe: "",
              district: "",
              houseNumber: "",
              province: "",
              road: "",
              soy: "",
              zipcode: "",
            },
          };

          const usersRef = firebaseApp
            .firestore()
            .collection("users")
            .doc(uidAuth);

          // เช็คว่ามีข้อมูลยัง
          usersRef.get().then((docSnapshot) => {
            if (docSnapshot.exists) {
              this.loginGetData(uidAuth);
            } else {
              //บันทึกข้อมูล
              usersRef.set(authData).then(() => {
                this.loginGetData(uidAuth);
              });
            }
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    facebookSignIn() {
      this.loading = true;
      firebaseApp
        .auth()
        .signInWithPopup(providerF)
        .then((result) => {
          var uidAuth = result.user.uid;
          var authData = {
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
            phone: result.user.phoneNumber ? result.user.phoneNumber : "",
            signinWith: "facebook",
            role: "user",
            createAt: new Date(),
            gender: "",
            birthdate: "",
            lineID : "",
            address: {
              name: "",
              phone : "",
              amphoe: "",
              district: "",
              houseNumber: "",
              province: "",
              road: "",
              soy: "",
              zipcode: "",
            },
          };

          const usersRef = firebaseApp
            .firestore()
            .collection("users")
            .doc(uidAuth);

          // เช็คว่ามีข้อมูลยัง
          usersRef.get().then((docSnapshot) => {
            if (docSnapshot.exists) {
              this.loginGetData(uidAuth);
            } else {
              usersRef.set(authData).then(() => {
                this.loginGetData(uidAuth);
              });
            }
          });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    loginGetData(uid) {
      const userRole = firebaseApp.firestore().doc("users/" + uid);
      return userRole
        .get()
        .then((res) => {
          this.loading = false;
          const data = res.data();
          var userData = {
            name: data.name,
            role: data.role,
            image: data.image ? data.image : "",
          };
          this.$store.commit("setUser", userData);
          window.localStorage.setItem("userData", JSON.stringify(userData));

          //เช็ค role
          if (data.role == "admin") {
            localStorage.setItem("userProfileImage", userData.image);
            this.$router.replace("/admin").then(() => {
              this.$toast(`ยินดีต้อนรับ ${userData.name}`, {
                position: "top-right",
                closeOnClick: true,
                hideProgressBar: true,
                timeout: 3000,
                icon: icontoast,
              });
            });
          } else {
            localStorage.setItem("userProfileImage", userData.image);
            this.$router.replace("/").then(() => {
              this.$toast(`ยินดีต้อนรับ ${userData.name}`, {
                position: "top-right",
                closeOnClick: true,
                hideProgressBar: true,
                timeout: 3000,
                icon: icontoast,
              });
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.error();
          console.log(err.message);
        });
    },
    error() {
      this.$swal({
        title: "ผิดพลาด!",
        text: " อีเมลหรือรหัสผ่านไม่ถูกต้อง",
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
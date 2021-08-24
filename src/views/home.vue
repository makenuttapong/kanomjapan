<template>
  <div>
    <!-- FULL NAVBAR -->
    <b-navbar toggleable="lg" type="light" variant="info">
      <b-navbar-brand :to="{ name: 'home' }"
        ><img :src="require('../assets/logoP.svg')" width="50px"
      /></b-navbar-brand>

      <!-- HEMBERGER -->
      <b-navbar-toggle>
        <div class="cart-drop" v-if="role != 'admin'"><CartDropdown /></div>
        <b-button v-b-toggle.sidebar-right class="home-toggle"
          ><MenuIcon color="#fff" />
        </b-button>
      </b-navbar-toggle>
      <!-- HEMBERGER -->

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="main">
          <b-nav-item
            @click="menutSelect('home')"
            :class="{ active: isActive('home') }"
            ><i class="fa fa-home mr-1 home-icon" /><span
              >หน้าแรก</span
            ></b-nav-item
          >
          <b-nav-item
            @click="menutSelect('products')"
            :class="{ active: isActive('products') }"
            ><i class="fa fa-cookie-bite mr-1 home-icon" /><span
              >สินค้า</span
            ></b-nav-item
          >
          <b-nav-item
            @click="menutSelect('reviews')"
            :class="{ active: isActive('reviews') }"
            ><i class="fa fa-newspaper mr-1 home-icon" /><span
              >บทความรีวิว</span
            ></b-nav-item
          >
          <b-nav-item
            @click="menutSelect('about_me')"
            :class="{ active: isActive('about_me') }"
            ><i class="fas fa-house-user mr-1 home-icon" /><span
              >เกี่ยวกับเรา</span
            ></b-nav-item
          >
          <b-nav-item
            @click="menutSelect('helper')"
            :class="{ active: isActive('helper') }"
            ><i class="fa fa-question-circle mr-1 home-icon" /><span
              >ช่วยเหลือ</span
            ></b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <div class="roleAdmin" v-if="role == 'admin'">
            <b-button :to="{ name: 'dashboard' }" variant="outline-primary"
              >ไปที่คอนโซล <i class="fa fa-cogs"
            /></b-button>
          </div>

          <div class="roleUser">
            <div
              class="cart-btn"
              :class="role == '' || role == 'user' ? 'forUser' : 'forAdmin'"
            >
              <CartDropdown />
            </div>

            <b-nav-item-dropdown
              right
              class="nav-menu"
              no-caret
              v-if="role != 'admin' && role != ''"
            >
              <template #button-content>
                <div class="d-sm-flex d-none user-nav">
                  <p class="user-name mb-0" id="fullName">{{ nameUser }}</p>
                  <span class="user-status">ยินดีต้อนรับ</span>
                </div>
                <b-avatar
                  :src="imageAvatar"
                  id="fullSidebar"
                  class="border-white"
                />
              </template>
              <b-dropdown-item @click="menutSelect('profile')"
                ><i class="fa fa-user" /> ข้อมูลส่วนตัว</b-dropdown-item
              >
              <b-dropdown-item @click="menutSelect('user-order')"
                ><i class="fa fa-clipboard-list" /> คำสั่งซื้อ</b-dropdown-item
              >
              <b-dropdown-item @click="toggleModal"
                ><i class="fa fa-sign-out-alt" /> ออกจากระบบ</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </div>

          <div class="NoUser" v-if="role == ''">
            <b-button variant="outline-primary" @click="menutSelect('login')"
              >เข้าสู่ระบบ</b-button
            >
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- FULL NAVBAR -->

    <!-- MIM NAVBAR -->
    <b-sidebar id="sidebar-right" title="เมนู" right shadow backdrop>
      <div class="px-3">
        <nav class="mb-3 mini">
          <b-nav vertical>
            <b-nav-item
              @click="menutSelect('home')"
              :class="{ active: isActive('home') }"
              ><i class="fa fa-home" /> หน้าแรก</b-nav-item
            >

            <b-nav-item
              @click="menutSelect('products')"
              :class="{ active: isActive('products') }"
              ><i class="fa fa-cookie-bite" /> สินค้า</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('reviews')"
              :class="{ active: isActive('reviews') }"
              ><i class="fa fa-newspaper" /> บทความรีวิว</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('about_me')"
              :class="{ active: isActive('about_me') }"
              ><i class="fas fa-house-user" /> เกี่ยวกับเรา</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('helper')"
              :class="{ active: isActive('helper') }"
              ><i class="fa fa-question-circle" /> ช่วยเหลือ</b-nav-item
            >
          </b-nav>
        </nav>
      </div>
      <template #footer>
        <div class="px-3">
          <nav class="mb-3 mini">
            <b-nav vertical>
              <div class="divider my-2 center">
                <div class="divider-full"></div>
              </div>
              <b-nav-item v-if="role == ''" @click="menutSelect('login')"
                ><i class="fa fa-sign-in-alt" /> เข้าสู่ระบบ</b-nav-item
              >
              <b-nav-item
                v-if="role == 'user'"
                @click="menutSelect('profile')"
                :class="{ active: isActive('profile') }"
                ><i class="fa fa-user" /> ข้อมูลส่วนตัว</b-nav-item
              >
              <b-nav-item
                v-if="role == 'user'"
                @click="menutSelect('user-order')"
                :class="{ active: isActive('user-order') }"
                ><i class="fa fa-clipboard-list" /> คำสั่งซื้อ</b-nav-item
              >
              <b-nav-item v-if="role == 'user'" @click="toggleModal"
                ><i class="fa fa-sign-out-alt" /> ออกจากระบบ</b-nav-item
              >
              <b-nav-item v-if="role == 'admin'" @click="menutSelect('admin')"
                ><i class="fa fa-cogs" /> ไปที่คอลโซล</b-nav-item
              >
            </b-nav>
          </nav>
        </div>
      </template>
    </b-sidebar>
    <!-- MIN NAVBAR -->

    <!-- EXIT -->
    <b-modal id="modal-exit" hide-footer size="md" title="ออกจากระบบ">
      <template>
        <div class="center">คุณต้องการที่จะออกจากระบบ ?</div>
        <div class="btn-delete text-center mt-2">
          <b-row>
            <b-col cols="12" class="mt-2 mb-2">
              <b-button @click="signOut" variant="primary" class="mr-1"
                >ยืนยัน</b-button
              >
              <b-button @click="toggleModalExit" variant="outline-primary"
                >ยกเลิก</b-button
              >
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
    <!-- EXIT -->

    <!-- CONTENT -->
    <div class="content-route">
      <div class="header-navbar-shadow n"></div>
      <router-view />
    </div>
    <!-- CONTENT -->
  </div>
</template>


<script>
import firebase from "../firebase/firebase_app";
import { MenuIcon } from "vue-feather-icons";
import imageDF from "../assets/userDF.png";
import CartDropdown from "./customer/cartDropdown";
import "../assets/scss/style.scss";

export default {
  name: "home",
  data() {
    return {
      imageAvatar: localStorage.getItem("userProfileImage")
        ? localStorage.getItem("userProfileImage")
        : imageDF,
      nameUser: "",
      role: "",
      activeItem: "home",
    };
  },
  components: {
    MenuIcon,
    CartDropdown,
  },
  created() {
    var nameData = localStorage.getItem("userData");
    var nameUserdata = JSON.parse(nameData);
    this.nameUser = nameUserdata.name;

    //เช็ค role เพื่อเซต UI
    this.checkrout(this.$route.name);
    const user = firebase.auth().currentUser;

    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.role) {
          this.role = idTokenResult.claims.role;
        } else {
          this.role = "user";
        }
      });
    }
  },
  watch: {
    $route(to) {
      this.checkrout(to.name);
    },
  },
  methods: {
    signIn() {
      this.$router.push("/login");
    },

    checkrout(rout) {
      if (rout == "home") {
        this.activeItem = "home";
      } else if (rout == "products" || rout == "productDetail") {
        this.activeItem = "products";
      } else if (rout == "reviews" || rout == "reviewsDetail") {
        this.activeItem = "reviews";
      } else if (rout == "about_me") {
        this.activeItem = "about_me";
      } else if (rout == "helper") {
        this.activeItem = "helper";
      } else if (rout == "profile") {
        this.activeItem = "profile";
      } else if (rout == "user-order" || rout == "user-order-detail") {
        this.activeItem = "user-order";
      } else if (rout == "checkout") {
        this.activeItem = "checkout";
      }
    },
    menutSelect(menu) {
      this.$store.dispatch("changePage", 0);
      if (menu == "home") {
        this.$router.push("/home");
        this.activeItem = menu;
      } else if (menu == "products") {
        this.$router.push("/products");
        this.activeItem = menu;
      } else if (menu == "reviews") {
        this.$router.push("/reviews");
        this.activeItem = menu;
      } else if (menu == "profile") {
        this.$router.push("/profile");
        this.activeItem = menu;
      } else if (menu == "user-order") {
        this.$router.push("/user-order");
        this.activeItem = menu;
      } else if (menu == "admin") {
        this.$router.push("/admin/dashboard");
      } else if (menu == "login") {
        this.$router.push("/login");
      } else if (menu == "about_me") {
        this.$router.push("/about_me");
      } else if (menu == "helper") {
        this.$router.push("/helper");
      }
    },
    isActive(menuItem) {
      return this.activeItem == menuItem;
    },
    toggleModal() {
      this.$bvModal.show("modal-exit");
    },
    toggleModalExit() {
      this.$bvModal.hide("modal-exit");
    },
    signOut() {
      this.$store.dispatch("changePage", 0);
      this.$bvModal.hide("modal-exit");
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.success();
          this.$router.push("/home");
          
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
        text: " ออกจากระบบเรียบร้อย",
        icon: "success",
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

<style scoped>
.main .nav-item a {
  color: white;
}
.navbar-light .navbar-nav .nav-link:hover {
  color: #ffff00;
}
.navbar-light .navbar-nav .nav-link:focus {
  color: #ffff00;
}
.main .nav-item.active a {
  color: white;
  text-decoration: underline;
  text-decoration-thickness: 3px;
}

.main .nav-item.active a:hover {
  color: #ffff00;
  text-decoration: underline !important;
  text-decoration-thickness: 3px !important;
}
.main .nav-item.active a:focus {
  color: white;
  text-decoration: underline !important;
  text-decoration-thickness: 3px !important;
}
.user-nav {
  float: left;
  margin-right: 0.8rem;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: end;
  -ms-flex-align: end;
  align-items: flex-end;
}
.user-name {
  font-size: 15px;
  color: white;
}
.user-status {
  margin-top: -2px;
  color: white;
  font-size: 13px;
}
.forUser {
  margin-top: 0px !important;
  margin-left: -72px;
}
.forAdmin {
  display: none;
}
.nav-item .home-icon {
  display: none;
}
.nav-item.active .home-icon {
  display: inline;
  position: absolute;
  margin-top: 5px;
}
.nav-item.active span {
  margin-left: 20px;
}
</style>
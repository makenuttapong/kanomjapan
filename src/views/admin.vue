<template>
  <div class="menu">
    <b-button v-b-toggle.sidebar-1 class="btn-menu" variant="primary"
      ><MenuIcon
    /></b-button>

    <!-- side bar min -->
    <b-sidebar id="sidebar-1" shadow backdrop>
      <div class="logoMenu">
        <b-link class="brand-logo" :to="{ name: 'home' }" v-b-tooltip.hover title="หน้าแรก"
          ><img :src="require('../assets/logoW.svg')" width="50px" class="ml-custom"
        /></b-link>
      </div>
      <template #footer>
        <div class="px-3">
          <nav class="mb-3">
            <b-nav vertical>
              <div class="divider my-2 center">
                <div class="divider-full"></div>
              </div>
              <b-nav-item
                @click="menutSelect('adminProfile')"
                :class="{ active: isActive('adminProfile') }"
                ><i class="fa fa-user" /> ข้อมูลส่วนตัว</b-nav-item
              >
              <b-nav-item @click="toggleModal"
                ><i class="fa fa-sign-out-alt" /> ออกจากระบบ</b-nav-item
              >
            </b-nav>
          </nav>
        </div>
      </template>
      <div class="px-3 py-2 mt-3">
        <nav class="mb-3">
          <b-nav vertical>
            <b-nav-item
              @click="menutSelect('home')"
              :class="{ active: isActive('home') }"
              ><i class="fa fa-chart-pie" /> แดชบอร์ด</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('order')"
              :class="{ active: isActive('order') }"
              ><i class="fa fa-truck-loading" /> ออเดอร์</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('product')"
              :class="{ active: isActive('product') }"
              ><i class="fa fa-cookie-bite" /> สินค้า</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('review')"
              :class="{ active: isActive('review') }"
              ><i class="fa fa-newspaper" /> บทความรีวิว</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('customer')"
              :class="{ active: isActive('customer') }"
              ><i class="fa fa-users" /> ลูกค้า</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('shipping')"
              :class="{ active: isActive('shipping') }"
              ><i class="fa fa-clipboard-list" /> สั่งซื้อสินค้า</b-nav-item
            >
            <b-nav-item
              @click="menutSelect('setting')"
              :class="{ active: isActive('setting') }"
              ><i class="fa fa-cog" /> ตั้งค่า</b-nav-item
            >
          </b-nav>
        </nav>
      </div>
    </b-sidebar>

    <!-- side bar full -->
    <sidebar-menu
      :menu="menu"
      :collapsed="true"
      :widthCollapsed="`60px`"
      :hideToggle="true"
      @item-click="onItemClick"
    >
      <div slot="header" class="header-menu center p-2">
        <b-link class="brand-logo" :to="{ name: 'home' }"   v-b-tooltip.hover title="หน้าแรก"
          ><img :src="require('../assets/logoP.svg')" width="50px" class="ml-custom"
        /></b-link>
      </div>

      <div slot="footer">
        <b-dropdown
          class="drop-avatar"
          size="sm"
          variant="link"
          toggle-class="text-decoration-none"
          :class="{ active: isActive('adminProfile') }"
          no-caret
        >
          <template #button-content>
            <b-avatar :src="imageAvatar" id="fullSidebar" class="border-white"/>
          </template>
          <b-dropdown-item @click="menutSelect('adminProfile')"
            ><i class="fa fa-user" /> ข้อมูลส่วนตัว</b-dropdown-item
          >
          <b-dropdown-item @click="toggleModal"
            ><i class="fa fa-sign-out-alt" /> ออกจากระบบ</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </sidebar-menu>
    <div class="container-admin">
      <div class="padding-20">
        <router-view />
      </div>
    </div>

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
  </div>
</template>



<script>
import firebase from "../firebase/firebase_app";
import { SidebarMenu } from "vue-sidebar-menu";
import { MenuIcon } from "vue-feather-icons";
import "../assets/scss/style.scss";
import imageDF from "../assets/bot.png";

export default {
  name: "admin",
  components: {
    SidebarMenu,
    MenuIcon,
  },
  created() {
    this.checkrout(this.$route.name);
  },
  watch: {
    $route(to) {
      this.checkrout(to.name);
    },
  },
  data() {
    return {
      activeItem: "home",
      imageAvatar: localStorage.getItem("userProfileImage")
        ? localStorage.getItem("userProfileImage")
        : imageDF,
      menu: [
        {
          href: "/admin/dashboard",
          title: "แดชบอร์ด",
          icon: "fa fa-chart-pie",
           alias: ["/admin/income","/admin/income-list","/admin/last-order",'/admin/best-sale','/admin/comments','/admin/best-delivery','/admin/top-rate','/admin/lineNotify'],
        },
        {
          href: "/admin/order",
          title: "ออเดอร์",
          icon: "fa fa-truck-loading",
          alias: "/admin/order/:id",
        },
        {
          href: "/admin/product",
          title: "สินค้า",
          icon: "fa fa-cookie-bite",
          alias: "/admin/product/:id",
        },
        {
          href: "/admin/review-product",
          title: "บทความรีวิว",
          icon: "fa fa-newspaper",
          alias: "/admin/review-product/:id",
        },
        {
          href: "/admin/customer",
          title: "ลูกค้า",
          icon: "fa fa-users",
          alias: "/admin/customer/:id",
        },
        {
          href: "/admin/shipping",
          title: "สั่งซื้อสินค้า",
          icon: "fa fa-clipboard-list",
        },
        {
          href: "/admin/setting",
          title: "ตั้งค่า",
          icon: "fa fa-cog",
        },
      ],
    };
  },
  methods: {
    checkrout(rout) {
      if (rout == "dashboard" || rout == "income" || rout == "income-list") {
        this.activeItem = "home";
      } else if (rout == "order" || rout == "orderDetail") {
        this.activeItem = "order";
      } else if (rout == "product" || rout == "productDetail") {
        this.activeItem = "product";
      } else if (rout == "review-product" || rout == "review-productDetail") {
        this.activeItem = "review";
      } else if (rout == "customer" || rout == "customerDetail") {
        this.activeItem = "customer";
      } else if (rout == "shipping") {
        this.activeItem = "shipping";
      } else if (rout == "setting") {
        this.activeItem = "setting";
      } else if (rout == "adminProfile") {
        this.activeItem = "adminProfile";
      }
    },
    menutSelect(menu) {
      this.$store.dispatch("changePage", 0);
      if (menu == "home") {
        this.$router.push("/admin/dashboard");
        this.activeItem = menu;
      } else if (menu == "order") {
        this.$router.push("/admin/order");
        this.activeItem = menu;
      } else if (menu == "product") {
        this.$router.push("/admin/product");
        this.activeItem = menu;
      } else if (menu == "review") {
        this.$router.push("/admin/review-product");
        this.activeItem = menu;
      } else if (menu == "customer") {
        this.$router.push("/admin/customer");
        this.activeItem = menu;
      } else if (menu == "shipping") {
        this.$router.push("/admin/shipping");
        this.activeItem = menu;
      } else if (menu == "setting") {
        this.$router.push("/admin/setting");
        this.activeItem = menu;
      } else if (menu == "adminProfile") {
        this.$router.push("/admin/profile");
        this.activeItem = menu;
      }
    },
    isActive(menuItem) {
      return this.activeItem == menuItem;
    },
    onItemClick() {
      this.$store.dispatch("changePage", 0);
    },
    signOut() {
      firebase.auth().signOut().then(() => {
          this.toggleModalExit();
          this.success();
          this.$router.push("/home");
           this.$store.commit("setUser", {});
            window.localStorage.setItem("userData", {});
            localStorage.setItem("userProfileImage", "");
      })

    },
    toggleModal() {
      this.$bvModal.show("modal-exit");
    },
    toggleModalExit() {
      this.$bvModal.hide("modal-exit");
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
      })
    },
  },
};
</script>

<style scoped>
.container-admin {
  padding-left: 60px;
  transition: 0.3s;
}
.padding-20 {
  padding: 30px;
}
::v-deep .vsm--mobile-item {
  max-width: 160px !important;
}
::v-deep .v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  margin-left: 3px;
}
::v-deep .v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  background-color: transparent;
}
::v-deep .v-sidebar-menu .vsm--mobile-bg {
  border: 3px solid;
  border-color: #7367f0 !important;
  background-color: white !important;
}
::v-deep .v-sidebar-menu .vsm--link_mobile-item {
  color: #7367f0 !important;
}
::v-deep
  .v-sidebar-menu.vsm_collapsed
  .vsm--link_level-1.vsm--link_hover
  .vsm--icon,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  color: #7367f0;
  background-color: white !important;
}
::v-deep .v-sidebar-menu {
  background-color: #7367f0 !important;
}
::v-deep .v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  box-shadow: 4px 0px 0px 0px white inset;
}
::v-deep .v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active svg {
  color: yellow;
}
::v-deep .v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  box-shadow: 4px 0px 0px 0px white inset;
}
::v-deep .v-sidebar-menu .vsm--link_level-1.vsm--link_active svg {
  color: yellow;
}
.ml-custom{
  margin-left: -3px;
}
</style>
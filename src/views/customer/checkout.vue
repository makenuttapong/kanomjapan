<template>
  <b-overlay :show="showOverlay" rounded="sm" class="setOverlay">
    <div class="list-view product-checkout-all mt-0">
      <div
        v-if="$store.state.cartItems.length == 0"
        class="text-center non-cart p-4"
      >
        <h4 class="mb-4">ไม่พบรายการสินค้า</h4>
        <img
          :src="require('../../assets/empty_cart.svg')"
          width="400px"
          class="mt-4"
        />
      </div>

      <div
        class="wizard-checkout-items"
        v-if="$store.state.cartItems.length != 0"
      >
        <div class="icon-title-wizard">
          <div class="checkout-title">ยืนยันคำสั่งซื้อ</div>
          <div class="text-right row">
            <b-col lg="8">
              <span class="pr-3"> Step {{ step }} / 4 </span></b-col
            >
          </div>
          <!-- <div class="mr-3 center-flex">
            <icon class="size-30 mr-2"/> <
            </div>
          <div class="mr-3 center-flex">
            <icon class="fa fa-map-marker-alt size-30 mr-2 ml-2" /> <span> ที่อยู่</span><icon class="fa fa-angle-right ml-4"/>
            </div>
          <div class="mr-3 center-flex">
            <icon class="fa fa-truck-loading size-30 mr-2 ml-2" /><span> ขนส่ง</span><icon class="fa fa-angle-right ml-4"/>
            </div>
          <div class="mr-3 center-flex"><icon class="fa fa-credit-card size-30 mr-2 ml-2" /><span> ชำระเงิน</span></div> -->
        </div>
        <form-wizard
          ref="refFormWizard"
          color="#7367F0"
          :title="null"
          :subtitle="null"
          finish-button-text="Submit"
          back-button-text="Previous"
          hide-buttons
          class="checkout-form-wizard steps-transparent"
        >
          <!-- product -->
          <tab-content title="รถเข็น" icon="fas fa-shopping-cart">
            <CheckoutCart
              @next-step="formWizardNextStep"
              :role="role"
              @update-step="updateStep"
            />
          </tab-content>

          <!-- address -->
          <tab-content title="ที่อยู่" icon="fa fa-map-marker-alt">
            <CheckoutAddress
              :addressDetails="userData"
              @updataAddress="updateAddress"
              @next-step="formWizardNextStep"
              @prev-step="formWizardPrevStep"
              @addressData="addressData"
              @update-step="updateStep"
              @changDataAddress="changDataAddress"
            />
          </tab-content>

          <!-- Truck -->
          <tab-content title="ขนส่ง" icon="fa fa-truck-loading">
            <CheckoutDeliver
              @next-step="formWizardNextStep"
              @prev-step="formWizardPrevStep"
              @update-step="updateStep"
            />
          </tab-content>

          <!-- payment -->
          <tab-content title="ชำระเงิน" icon="fa fa-credit-card">
            <CheckoutPayment
              @next-step="formWizardNextStep"
              @prev-step="formWizardPrevStep"
              @save-later="saveDataOrder"
              @save-confirm="saveDataConfirm"
              @update-step="updateStep"
            />
          </tab-content>
        </form-wizard>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { ref } from "@vue/composition-api";

import CheckoutCart from "./checkout_cart";
import CheckoutAddress from "./checkout_address";
import CheckoutDeliver from "./checkout_deliver";
import CheckoutPayment from "./checkout_payment";
export default {
  name: "Checkout",

  components: {
    FormWizard,
    TabContent,

    // ShoppingCartIcon
    // SFC
    CheckoutCart,
    CheckoutAddress,
    CheckoutDeliver,
    CheckoutPayment,
  },
  data() {
    return {
      loading: false,
      showOverlay: false,
      step: 1,
      role: "",
      userID: "",
      userData: {
        name: "",
        phone: "",
        road: "",
        soy: "",
        houseNumber: "",
        district: "",
        amphoe: "",
        province: "",
        zipcode: "",
      },
      addressSelect: {},
      nextOrderID: "OR00001",
    };
  },
  created() {
    const user = firebaseApp.auth().currentUser;
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        this.role = idTokenResult.claims.role
          ? idTokenResult.claims.role
          : "user";
        if (this.role != "admin") {
          this.loadUserData();
        }
      });
    }
  },
  methods: {
    loadUserData() {
      this.loading = true;
      const currentUser = firebaseApp.auth().currentUser;
      const UserRef = firebaseApp.firestore().doc("users/" + currentUser.uid);
      return UserRef.get().then((doc) => {
        this.userID = doc.id;
        var setData = {
          displayName : doc.data().name,
          image : doc.data().image,
          name: doc.data().address.name ? doc.data().address.name : "",
          phone: doc.data().address.phone ? doc.data().address.phone : "",
          district: doc.data().address.district
            ? doc.data().address.district
            : "",
          amphoe: doc.data().address.amphoe ? doc.data().address.amphoe : "",
          province: doc.data().address.province
            ? doc.data().address.province
            : "",
          zipcode: doc.data().address.zipcode ? doc.data().address.zipcode : "",
          road: doc.data().address.road ? doc.data().address.road : "",
          houseNumber: doc.data().address.houseNumber
            ? doc.data().address.houseNumber
            : "",
          soy: doc.data().address.soy ? doc.data().address.soy : "",
        };
        this.loading = false;
        this.userData = setData;
      });
    },
    addressData(data) {
      if (!data) {
        // ที่อยู่ปัจจุบัน
        this.addressSelect = this.userData;
        this.$store.dispatch("selectAddress", this.addressSelect.province);
      } else {
        // ที่อยู่อื่น
        this.addressSelect = data;
        this.$store.dispatch("selectAddress", this.addressSelect.province);
      }
    },
    updateAddress() {
      var setData = {
        address: {
          name: this.userData.name,
          phone: this.userData.phone,
          road: this.userData.road,
          soy: this.userData.soy,
          houseNumber: this.userData.houseNumber,
          district: this.userData.district,
          amphoe: this.userData.amphoe,
          province: this.userData.province,
          zipcode: this.userData.zipcode,
        },
      };

      const updataData = firebaseApp.firestore().doc("users/" + this.userID);
      updataData
        .update(setData)
        .then(() => {
          this.loadUserData();
          this.$toast.success(`อัปเดตข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
        })
        .catch((err) => {
          this.$toast.error(`อัปเดตข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    saveDataOrder() {
      var totalPrices = this.$store.state.totalPrice;
      var deliverPrice = this.$store.state.deliverCompany.price;
      var deliverCompany = this.$store.state.deliverCompany.name;
      var items = this.$store.state.cartItems;

      var itemData = [];
      items.map((ele) => {
        var data = {
          quantity: ele.qty,
          productID: ele.productID,
          id: ele.id,
          name: ele.name,
          price: ele.price,
          catagory: ele.catagory,
          discount: ele.discount,
          fullprice: ele.fullprice,
          image: ele.image,
          detail: ele.detail,
        };
        itemData.push(data);
      });

      const orderData = firebaseApp.firestore().collection("orders");
      orderData
        .orderBy("createAt", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var orderID = doc.data().orderID;
            var cutStr = orderID.substring(2, 7);
            var orderInt = parseInt(cutStr) + 1;
            var orderStringLength = orderInt.toString().length;

            if (orderStringLength == 1) {
              this.nextOrderID = "OR0000" + orderInt;
            } else if (orderStringLength == 2) {
              this.nextOrderID = "OR000" + orderInt;
            } else if (orderStringLength == 3) {
              this.nextOrderID = "OR00" + orderInt;
            } else if (orderStringLength == 4) {
              this.nextOrderID = "OR0" + orderInt;
            }
          });

          var setDataOrder = {
            orderID: this.nextOrderID,
            userID: this.userID,
            items: itemData,
            slipImage: "",
            slipDate: "",
            payon: "",
            address: this.addressSelect,
            deliverPrice: deliverPrice,
            deliverCompany: deliverCompany,
            deliverNumber: "",
            createAt: new Date(),
            updateAt: new Date(),
            status: "รอชำระ",
            totalPrice: totalPrices,
            totalAll: totalPrices + deliverPrice,
            note: "",
            formBank: "",
          };
          this.addNewOrder(setDataOrder);
        });
    },

    saveDataConfirm(data) {
      this.showOverlay = true;
      var totalPrices = this.$store.state.totalPrice;
      var deliverPrice = this.$store.state.deliverCompany.price;
      var deliverCompany = this.$store.state.deliverCompany.name;
      var items = this.$store.state.cartItems;

      var itemData = [];
      items.map((ele) => {
        var datas = {
          quantity: ele.qty,
          productID: ele.productID,
          id: ele.id,
          name: ele.name,
          price: ele.price,
          catagory: ele.catagory,
          discount: ele.discount,
          fullprice: ele.fullprice,
          image: ele.image,
          detail: ele.detail,
        };
        itemData.push(datas);
      });

      const orderData = firebaseApp.firestore().collection("orders");
      orderData
        .orderBy("createAt", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var orderID = doc.data().orderID;
            var cutStr = orderID.substring(2, 7);
            var orderInt = parseInt(cutStr) + 1;
            var orderStringLength = orderInt.toString().length;

            if (orderStringLength == 1) {
              this.nextOrderID = "OR0000" + orderInt;
            } else if (orderStringLength == 2) {
              this.nextOrderID = "OR000" + orderInt;
            } else if (orderStringLength == 3) {
              this.nextOrderID = "OR00" + orderInt;
            } else if (orderStringLength == 4) {
              this.nextOrderID = "OR0" + orderInt;
            }
          });

          var setDataOrder = {
            orderID: this.nextOrderID,
            userID: this.userID,
            items: itemData,
            slipImage: "",
            slipDate: data.dateTime,
            payon: new Date(),
            address: this.addressSelect,
            deliverPrice: deliverPrice,
            deliverCompany: deliverCompany,
            deliverNumber: "",
            createAt: new Date(),
            updateAt: new Date(),
            status: "รอการตรวจสอบ",
            totalPrice: totalPrices,
            totalAll: totalPrices + deliverPrice,
            note: data.note,
            formBank: data.bank,
          };

          var imgFile = data.image;
          if (imgFile != "") {
            var timestamp = new Date();
            const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์

            firebaseApp
              .storage()
              .ref("slips")
              .child(filename)
              .put(imgFile)
              .then((response) => {
                response.ref
                  .getDownloadURL()
                  .then((photoURL) => {
                    setDataOrder.slipImage = photoURL;

                    const orderRef = firebaseApp
                      .firestore()
                      .collection("orders");
                    return orderRef
                      .add(setDataOrder)
                      .then(() => {
                        this.showOverlay = false;
                        this.sentMessageLineBot(setDataOrder);
                        this.$store.dispatch("clearItem", []);
                        this.$swal({
                          title: "สำเร็จ!",
                          text: "ยืนยันคำสั่งซื้อเรียบร้อย",
                          icon: "success",
                          confirmButtonText: "ตกลง",
                          width: "500px",
                          customClass: {
                            confirmButton: "btn btn-primary",
                          },
                          buttonsStyling: false,
                        });
                        this.$router.replace("/user-order");
                      })
                      .catch((err) => {
                        this.showOverlay = false;
                        console.log(err);
                      });
                  })
                  .catch((err) => {
                    this.showOverlay = false;
                    console.log(err);
                  });
              })
              .catch((err) => {
                this.showOverlay = false;
                console.log(err);
              });
          }
        });
    },
    changDataAddress(address) {
      this.userData.district = address.district;
      this.userData.amphoe = address.amphoe;
      this.userData.province = address.province;
      this.userData.zipcode = address.zipcode;
    },
    sentMessageLineBot(data) {
      var setData = {
        name: this.userData.displayName,
        image : this.userData.image,
        payon: data.payon,
        totalAll: data.totalAll,
        totalItem: data.items.length,
        orderID: data.orderID,
        slip: data.slipImage,
      };
      const oderRef = firebaseApp.firestore().collection("oders");
      return oderRef.add(setData).then(() => {});
    },
    addNewOrder(order) {
      this.showOverlay = true;
      const orderRef = firebaseApp.firestore().collection("orders");
      return orderRef
        .add(order)
        .then(() => {
          this.showOverlay = false;
          this.$store.dispatch("clearItem", []);
          this.$swal({
            title: "สำเร็จ!",
            text: "บันทึกคำสั่งซื้อเรียบร้อย",
            icon: "success",
            confirmButtonText: "ตกลง",
            width: "500px",
            customClass: {
              confirmButton: "btn btn-primary",
            },
            buttonsStyling: false,
          });
          this.$router.replace("/user-order");
        })
        .catch((err) => {
          this.showOverlay = false;
          console.log(err);
        });
    },
    updateStep(step) {
      this.step = step;
    },
  },

  setup() {
    const refFormWizard = ref(null);
    const formWizardNextStep = () => {
      refFormWizard.value.nextTab();
    };
    const formWizardPrevStep = () => {
      refFormWizard.value.prevTab();
    };

    return {
      refFormWizard,
      formWizardNextStep,
      formWizardPrevStep,
      // Dummy Details
    };
  },
};
</script>

<style>
.wizard-nav.wizard-nav-pills {
  display: none;
}
.size-30 {
  width: 30px !important;
  height: 30px !important;
}
.center-flex {
  justify-content: center;
  align-items: center;
  display: flex;
}
.checkout-title {
  font-size: 20px;
}
</style>
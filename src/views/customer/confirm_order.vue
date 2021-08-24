<template>
 <b-overlay :show="showOverlay" rounded="sm" class="setOverlay">
  <div class="list-view product-checkout">
    
    <div class="payment-page">
      <b-card class="mb-4">
        <div v-if="loading"  class="p-4">
          <vcl-twitch> </vcl-twitch>
        </div>
        <div v-if="!loading">
          <span class="bold color-primary">#หมายเลขออเดอร์ : </span
          ><span>{{ orderData.orderID }}</span>
          <h5 class="mt-2 mb-2 d-flex justify-content-center ">
            <div class="price-all">
            จำนวนเงินที่ต้องโอน
            {{ formatPrice(orderData.totalAll) }}
            บาท
            </div>
          </h5>

          <validation-observer ref="Rules">
            <b-form class="list-view" @submit.prevent="submit">
              <b-row class="">
                <b-col md="6" class="text-center mb-2">
                  <Qrgenerate
                    id="0802767401"
                    :amount="orderData.totalAll"
                  ></Qrgenerate>
                </b-col>
                <b-col md="6" class="mt-3 mb-2">
                  <div class="mb-2">สแกน QR code เพื่อชำระเงิน</div>
                  <div class="mb-2">
                    <span class="bold">พร้อมเพย์ : </span><span class="num-pay pointer"
                    v-clipboard:copy="message1"
                    v-clipboard:success="onCopy"
                    >080-276-7401</span>
                  </div>

                  <div class="separator">หรือ</div>
                  <div class="mt-2 mb-2">ธนาคาร ไทยพาณิชย์ (SCB)</div>
                  <div class="mb-2">
                    <span class="bold">ชื่อบัญชี : </span>ณัฐพงศ์ ยูวิหค
                  </div>
                  <div class="mb-2">
                    <span class="bold">เลขที่บัญชี : </span>
                    <span class="num-pay pointer"
                    v-clipboard:copy="message"
                    v-clipboard:success="onCopy"
                    >264-281783-1</span>
                  </div>
                </b-col>
                </b-row>
                <b-row class="mt-3">
                <b-col md="6">
                  <b-form-group
                    label="โอนจากธนาคาร"
                    label-for="bank-type"
                    class="mb-2"
                  >
                  <ValidationProvider
                      #default="{ errors }"
                      name="Bank"
                      rules="required"
                    >
                    <b-form-select
                      id="bank-type"
                      v-model="form.bank"
                      :options="options"
                    
                       :state="errors.length > 0 ? false : null"
                    />
                         <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="dateTime" label="วัน-เวลาที่โอน">
                    <ValidationProvider
                      #default="{ errors }"
                      name="DateTime"
                      rules="required"
                    >
                      <date-picker
                        v-model="form.dateTime"
                        valueType="format"
                        format="DD-MM-YYYY HH:mm"
                        type="datetime"
                        placeholder="เลือกวัน-เวลา ตามหลักฐานการชำระ"
                         :class="errors.length > 0 ? `non-valid` : `valid`"
                      >
                      </date-picker>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="Note" label="หมายเหตุ">
                    <b-form-textarea
                      id="Note"
                      v-model="form.note"
                      placeholder="รายละเอียดเพิ่มเติม"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <ValidationProvider
                    #default="{ errors }"
                    name="Slip"
                    rules="required"
                  >
                    <b-form-group
                      label-for="Slip"
                      label="หลักฐานการชำระ (สลิป)"
                    >
                      <b-button
                        variant="primary"
                        size="sm"
                        class="mb-75 mr-75"
                        @click="$refs.refInputEl.$el.click()"
                      >
                        อัปโหลด
                      </b-button>

                      <b-form-file
                        ref="refInputEl"
                        @input="pickFile"
                        v-model="form.image"
                        accept=".jpg, .png"
                        :hidden="true"
                        plain
                        :state="errors.length > 0 ? false : null"
                      />
                    </b-form-group>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                  <div class="mb-3">
                    <img
                      v-if="preview != ''"
                      ref="refPreviewEl"
                      :src="preview"
                      height="150"
                      width="150"
                      class="rounded mr-2 mb-1 mb-md-0 custom-show-img-table"
                    />
                  </div>
                </b-col>
                
              </b-row>
              <div class="mt-3">
                <b-button variant="primary" type="submit" block
                  >ยืนยันการชำระเงิน</b-button
                >
              </div>
            </b-form>
          </validation-observer>
        </div>
      </b-card>
    </div>

    <div class="checkout-options">
      <b-card class="priceDetail">
        <div v-if="loading">
          <vcl-list> </vcl-list>
        </div>
        <div v-if="!loading">
          <label class="section-label mb-1">รายละเอียดราคา</label>
          <hr />
          <div class="price-details">
            <h6 class="price-title"></h6>
            <ul class="list-unstyled">
              <li class="price-detail">
                <div class="detail-title">จำนวนสินค้า</div>
                <div class="detail-amt">
                  {{ orderData.items.length }} รายการ
                </div>
              </li>
              <li class="price-detail">
                <div class="detail-title">ราคาสินค้ารวม</div>
                <div class="detail-amt">
                  {{ formatPrice(orderData.totalPrice) }} บาท
                </div>
              </li>
              <li class="price-detail">
                <div class="detail-title">ค่าจัดส่ง</div>
                {{
                  orderData.deliverPrice == 0
                    ? "ฟรี"
                    : formatPrice(orderData.deliverPrice) + " บาท"
                }}
              </li>
            </ul>
            <hr />
            <ul class="list-unstyled">
              <li class="price-detail all">
                <div class="detail-title detail-total bold">ยอดรวม</div>
                <div class="detail-amt font-weight-bolder">
                  {{ formatPrice(orderData.totalAll) }} บาท
                </div>
              </li>
            </ul>
          </div>
        </div>
      </b-card>
    </div>
  
  </div>
    </b-overlay>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import Qrgenerate from "../../components/qrGenerate.vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { VclTwitch, VclList } from "vue-content-loading";
import { required } from "../../helper/validations";
export default {
  name: "ConfirmOrder",
  created() {
    this.loadUserData();
    this.loadOrder();
    const user = firebaseApp.auth().currentUser;
    this.uidUser = user.uid;
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    Qrgenerate,
    VclTwitch,
    VclList,
  },
  data() {
    return {
      loading: false,
      message1 : '080-276-7401',
      message: "264-281783-1",
      orderId: this.$route.params.id,
      orderData: {},
      required,
      showOverlay : false,
      preview: "",
      options: [
        { value: "ไทยพาณิชย์", text: "ไทยพาณิชย์" },
        { value: "กสิกรไทย", text: "กสิกรไทย" },
        { value: "กรุงไทย", text: "กรุงไทย" },
        { value: "กรุงเทพ", text: "กรุงเทพ" },
        { value: "กรุงศรี", text: "กรุงศรี" },
        { value: "ธนชาต", text: "ธนชาต" },
        { value: "ทหารไทย", text: "ทหารไทย" },
        { value: "ออมสิน", text: "ออมสิน" },
        { value: "ธ.ก.ส.", text: "ธ.ก.ส." },
        { value: "เกียรตินาคิน", text: "เกียรตินาคิน" },
      ],
      form: {
        info: "",
        note: "",
        bank: "",
        image: "",
        dateTime: "",
      },
    };
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
          name: doc.data().name,
          phone: doc.data().phone ? doc.data().phone : "",
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
      })
     },
    loadOrder() {
      this.loading = true;
      const orderConfirmRef = firebaseApp
        .firestore()
        .doc("orders/" + this.orderId);
      return orderConfirmRef
        .get()
        .then((doc) => {
          var uidOrder = doc.data().userID
          if(uidOrder == this.uidUser){
            this.orderData = doc.data();
            this.loading = false;
          }else{
              this.$router.replace("/error");
          }
          
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
        });
    },
    pickFile() {
      let input = this.$refs.refInputEl;
      let file = input.files;
      this.fileUpload = file[0];
      if (this.fileUpload.size < 800000) {
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(file[0]);
        this.form.image = file[0];
      }
      }
    },
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
        
          this.showOverlay = true
          var setDataOrder = {
            slipImage: "",
            slipDate: this.form.dateTime,
            payon: new Date(),
            updateAt: new Date(),
            status: "รอการตรวจสอบ",
            note: this.form.note,
            formBank: this.form.bank,
          };

          var imgFile = this.form.image;
            if (imgFile != "") {
                var timestamp = new Date();
                const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์
                   firebaseApp
          .storage()
          .ref("slips")
          .child(filename)
          .put(imgFile)
          .then((response) => {
            response.ref.getDownloadURL().then((photoURL) => {
              setDataOrder.slipImage = photoURL;

              const orderRef = firebaseApp.firestore().doc("orders/" + this.orderId);
              return orderRef
                .update(setDataOrder)
                .then(() => {
                   this.showOverlay = false
                   this.sentMessageLineBot(setDataOrder);
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
                   this.showOverlay = false
                  console.log(err);
                });
            }).catch((err) => {
                   this.showOverlay = false
                  console.log(err);
                });
          }).catch((err) => {
                   this.showOverlay = false
                  console.log(err);
                });


            }
        }
      });
    },
    sentMessageLineBot(data) {
      var setData = {
          name: this.userData.displayName,
          image : this.userData.image,
          payon: data.payon,
          totalAll : this.orderData.totalAll,
          totalItem : this.orderData.items.length,
          orderID :  this.orderData.orderID,
          slip: data.slipImage
      }
      const oderRef = firebaseApp.firestore().collection("oders");
      return oderRef.add(setData).then(() => {});
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    onCopy: function (e) {
      console.log(e.text);
      this.$toast(`คัดลอกแล้ว`, {
        position: "top-center",
        closeOnClick: true,
        hideProgressBar: true,
        timeout: 1500,
        icon: "fas fa-copy",
      });
    },
  },
};
</script>

<style scoped>
.payment-page .save-later-btn {
  margin-bottom: 2rem;
}
.separator {
  color: gray;
  display: flex;
  align-items: center;
  text-align: center;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #989898;
}

.separator:not(:empty)::before {
  margin-right: 0.25em;
}

.separator:not(:empty)::after {
  margin-left: 0.25em;
}
.discount-amt{
    color: #989898;
}
.price-detail.all{
    padding: 10px 7px;
    background-color: #dedbfd;
    border-radius: 0.428rem;
}
.list-unstyled{
    margin-bottom: 0rem;
}
</style>

<template>
  <div class="list-view product-checkout">
    <div class="payment-page">
      <b-card class="mb-4">
        <h5 class="mt-2 mb-2 d-flex justify-content-center">
          <div class="price-all">
            จำนวนเงินที่ต้องโอน
            {{
              formatPrice(
                $store.state.totalPrice + $store.state.deliverCompany.price
              )
            }}
            บาท
          </div>
        </h5>
        <validation-observer ref="Rules">
          <b-form class="list-view" @submit.prevent="submit">
            <b-row class="">
              <b-col md="6" class="text-center mb-2">
                <Qrgenerate
                  id="0802767401"
                  :amount="
                    $store.state.totalPrice + $store.state.deliverCompany.price
                  "
                ></Qrgenerate>
              </b-col>
              <b-col md="6" class="mt-3 mb-2">
                <div class="mb-2">สแกน QR code เพื่อชำระเงิน</div>
                <div class="mb-2">
                  <span class="bold">พร้อมเพย์ : </span
                  ><span class="num-pay pointer"
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
                  <span class="bold">เลขที่บัญชี : </span
                  ><span
                    class="num-pay pointer"
                    v-clipboard:copy="message"
                    v-clipboard:success="onCopy"
                    >264-281783-1</span
                  >
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
                  <b-form-group label-for="Slip" label="หลักฐานการชำระ (สลิป)">
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
      </b-card>
      <div class="text-between mb-4">
        <b-button variant="outline-primary" @click="prevTab"
          ><i class="fa fa-angle-left" /> ย้อนกลับ</b-button
        >
        <b-button variant="outline-success" @click="saveLater"
          >ยืนยันคำสั่งซื้อและชำระเงินภายหลัง</b-button
        >
      </div>
    </div>
    <TotalPrice />
  </div>
</template>

<script>
import { required } from "../../helper/validations";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import TotalPrice from "../../components/totalPrice";
import Qrgenerate from "../../components/qrGenerate.vue";
export default {
  name: "CheckoutPayment",
  components: {
    ValidationProvider,
    ValidationObserver,
    TotalPrice,
    Qrgenerate,
  },
  data() {
    return {
      required,
      preview: "",
      message1 : '080-276-7401',
      message: "264-281783-1",
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
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          this.$emit("save-confirm", this.form);
        }
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
    saveLater() {
      this.$emit("save-later");
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    prevTab() {
      this.$emit("prev-step");
      this.$emit("update-step", 3);
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
</style>

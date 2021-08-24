<template>
  <div>
    <b-form class="list-view product-checkout" @submit.prevent="submit">
      <!-- user address -->
      <div class="customer-card">
        <b-card class="mb-4">
          <b-card-text class="mb-3" @click="changeAddress(`old`)">
            <b-form-radio
              v-model="selected"
              value="old"
              :class="firstCollapsed ? `address-use` : `address-not-use`"
            >
              ใช้ที่อยู่ปัจจุบัน
            </b-form-radio>
          </b-card-text>
          <div class="text-center mt-2 mb-2 saveAddress" v-if="firstCollapsed">
            <b-button
              size="sm"
              variant="outline-success"
              @click="updateAddress"
              class="pointer"
              v-b-tooltip.hover
              title="อัปเดตที่อยู่ปัจจุบัน"
            >
              <SaveIcon />
            </b-button>
          </div>
          <validation-observer ref="Rules">
            <b-collapse v-model="firstCollapsed">
              <b-row>
                <b-col md="6">
                  <b-form-group label-for="Name" label="ชื่อ-สกุล">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Name"
                      rules="required"
                    >
                      <b-form-input
                        id="Name"
                        v-model="addressDetails.name"
                        placeholder="กรอกชื่อ-สกุล"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="Phone" label="เบอร์โทรศัพท์">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Phone"
                      rules="required"
                    >
                      <b-input-group>
                        <cleave
                          id="phone"
                          v-model="addressDetails.phone"
                          class="form-control"
                          :raw="false"
                          :options="optionsMark.phoneNumber"
                          placeholder="08x xxx xxxx"
                          :class="errors.length > 0 ? `non-valid` : `valid`"
                        />
                      </b-input-group>

                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label-for="houseNumber" label="บ้านเลขที่">
                    <ValidationProvider
                      #default="{ errors }"
                      name="houseNumber"
                      rules="required"
                    >
                      <b-form-input
                        id="houseNumber"
                        v-model="addressDetails.houseNumber"
                        placeholder="กรอกบ้านเลขที่"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label-for="soy" label="ซอย">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Soy"
                      rules="required"
                    >
                      <b-form-input
                        id="soy"
                        v-model="addressDetails.soy"
                        placeholder="กรอกซอย"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="road" label="ถนน">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Road"
                      rules="required"
                    >
                      <b-form-input
                        id="road"
                        v-model="addressDetails.road"
                        placeholder="กรอกชื่อถนน"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="district" label="ตำบล/แขวง">
                    <ValidationProvider
                      #default="{ errors }"
                      name="District"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="addressDetails.district"
                        type="district"
                        @select="select"
                        color="#7367f0"
                        size="default"
                        placeholder="ตำบล/แขวง"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="amphoe" label="อำเภอ/เขต">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Amphoe"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="addressDetails.amphoe"
                        type="amphoe"
                        size="default"
                        @select="select"
                        color="#7367f0"
                        placeholder="อำเภอ/เขต"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="province" label="จังหวัด">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Province"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="addressDetails.province"
                        type="province"
                        @select="select"
                        size="default"
                        color="#7367f0"
                        placeholder="จังหวัด"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="zipcode" label="รหัสไปรษณีย์">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Zipcode"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="addressDetails.zipcode"
                        type="zipcode"
                        @select="select"
                        size="default"
                        color="#7367f0"
                        placeholder="รหัสไปรษณีย์"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-collapse>
          </validation-observer>
          <hr />

          <b-card-text class="mb-3" @click="changeAddress(`new`)">
            <b-form-radio
              v-model="selected"
              value="new"
              :class="!firstCollapsed ? `address-use` : `address-not-use`"
            >
              ใช้ที่อยู่อื่น</b-form-radio
            >
          </b-card-text>
          <validation-observer ref="Rules2">
            <b-collapse v-model="secondCollapsed">
              <b-row>
                <b-col md="6">
                  <b-form-group label-for="Name" label="ชื่อ-สกุล">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Name"
                      rules="required"
                    >
                      <b-form-input
                        id="name"
                        v-model="newform.name"
                        placeholder="กรอกชื่อ-สกุล"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="Phone" label="เบอร์โทรศัพท์">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Phone"
                      rules="required"
                    >
                      <b-input-group>
                        <cleave
                          id="phone"
                          v-model="newform.phone"
                          class="form-control"
                          :raw="false"
                          :options="optionsMark.phoneNumber"
                          placeholder="08x xxx xxxx"
                          :class="errors.length > 0 ? `non-valid` : `valid`"
                        />
                      </b-input-group>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label-for="houseNumber" label="บ้านเลขที่">
                    <ValidationProvider
                      #default="{ errors }"
                      name="houseNumber"
                      rules="required"
                    >
                      <b-form-input
                        id="houseNumber2"
                        v-model="newform.houseNumber"
                        placeholder="กรอกบ้านเลขที่"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label-for="soy" label="ซอย">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Soy"
                      rules="required"
                    >
                      <b-form-input
                        id="soy2"
                        v-model="newform.soy"
                        placeholder="กรอกซอย"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="road" label="ถนน">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Road"
                      rules="required"
                    >
                      <b-form-input
                        id="road2"
                        v-model="newform.road"
                        placeholder="กรอกชื่อถนน"
                        autocomplete="off"
                        :state="errors.length > 0 ? false : null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="district" label="ตำบล/แขวง">
                    <ValidationProvider
                      #default="{ errors }"
                      name="District"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="newform.district"
                        type="district"
                        @select="selectNew"
                        color="#7367f0"
                        size="default"
                        placeholder="ตำบล/แขวง"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="amphoe" label="อำเภอ/เขต">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Amphoe"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="newform.amphoe"
                        type="amphoe"
                        size="default"
                        @select="selectNew"
                        color="#7367f0"
                        placeholder="อำเภอ/เขต"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label-for="province" label="จังหวัด">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Province"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="newform.province"
                        type="province"
                        @select="selectNew"
                        size="default"
                        color="#7367f0"
                        placeholder="จังหวัด"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label-for="zipcode" label="รหัสไปรษณีย์">
                    <ValidationProvider
                      #default="{ errors }"
                      name="Zipcode"
                      rules="required"
                    >
                      <ThailandAutoComplete
                        v-model="newform.zipcode"
                        type="zipcode"
                        @select="selectNew"
                        size="default"
                        color="#7367f0"
                        placeholder="รหัสไปรษณีย์"
                        :class="errors.length > 0 ? `non-valid` : `valid`"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-collapse>
          </validation-observer>
        </b-card>
        <div class="text-between mb-4">
          <b-button variant="outline-primary" @click="prevTab"
            ><i class="fa fa-angle-left" /> ย้อนกลับ</b-button
          >
          <b-button variant="primary" type="submit"
            >เลือกขนส่ง <i class="fa fa-angle-right"
          /></b-button>
        </div>
      </div>
      <TotalPrice />
    </b-form>
  </div>
</template>


<script>
import "../../assets/scss/style.scss";
import { required } from "../../helper/validations";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import TotalPrice from "../../components/totalPrice";
import { SaveIcon } from "vue-feather-icons";
import Cleave from "vue-cleave-component";
import "cleave.js/dist/addons/cleave-phone.th";

export default {
  name: "CheckoutAddress",
  components: {
    ValidationProvider,
    ValidationObserver,
    TotalPrice,
    SaveIcon,
    Cleave,
  },
  data() {
    return {
      optionsMark: {
        phoneNumber: {
          phone: true,
          phoneRegionCode: "TH",
          delimiter: "-",
        },
      },
      firstCollapsed: true,
      secondCollapsed: false,
      selected: "old",
      required,
      newform: {
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
    };
  },
  methods: {
    select(address) {
      this.$emit("changDataAddress", address);
    },
    selectNew(address) {
      this.newform.district = address.district;
      this.newform.amphoe = address.amphoe;
      this.newform.province = address.province;
      this.newform.zipcode = address.zipcode;
    },
    changeAddress(type) {
      if (type == "old") {
        this.firstCollapsed = true;
        this.secondCollapsed = false;
        this.selected = "old";
        this.$refs.Rules.reset();
      } else {
        this.firstCollapsed = false;
        this.secondCollapsed = true;
        this.selected = "new";
        this.$refs.Rules2.reset();
      }
    },
    updateAddress() {
      this.$emit("updataAddress");
    },
    submit() {
      if (this.firstCollapsed) {
        this.$refs.Rules.validate().then((success) => {
          if (success) {
            this.$emit("addressData", "");
            this.$emit("next-step");
            this.$emit("update-step", 3);
          }
        });
      } else {
        this.$refs.Rules2.validate().then((success) => {
          if (success) {
            this.$emit("addressData", this.newform);
            this.$emit("update-step", 3);
            this.$emit("next-step");
          }
        });
      }
    },
    prevTab() {
      this.$emit("prev-step");
      this.$emit("update-step", 1);
    },
  },
  props: ["addressDetails"],
};
</script>

<style scoped>
::v-deep .vth-addr-input-container > input {
  font-family: "Mitr";
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px) !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  color: #495057 !important;
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #ced4da !important;
  border-radius: 0.25rem !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
  box-shadow: none;
}
::v-deep .vth-addr-input-container > input:active {
  box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
  border: 1px solid #7367f0 !important;
}
::v-deep .vth-addr-input-container > input:focus {
  border: 1px solid #7367f0 !important;
  box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
}
::v-deep .vth-addr-label {
  font-family: "Mitr";
}
::v-deep .vth-addr-container.non-valid > .vth-addr-input-container > input {
  border-color: #ea5455 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.form-control.non-valid {
  border-color: #ea5455 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
.saveAddress {
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 10;
  transition: 0.3s;
}
</style>
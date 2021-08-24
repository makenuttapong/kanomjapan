<template>
  <b-card>
    <div v-if="loading" class="p-2">
      <vcl-facebook></vcl-facebook>
    </div>

    <div v-if="!loading">
      <b-form>
        <b-row>
          <b-col cols="12">
            <div class="d-flex align-items-center mb-2">
              <h4 class="mb-4 ml-75">
                <i size="18" class="fa fa-map-marker-alt" color="#7367f0"/> ที่อยู่ในการจัดส่ง
              </h4>
            </div>
          </b-col>

           <b-col md="6">
            <b-form-group label-for="fullname" label="ชื่อ-สกุล (ผู้รับ)">
              <b-form-input
                v-if="mode == 'edit'"
                id="fullname"
                v-model="name"
                placeholder="กรอกชื่อ-สกุล (ผู้รับ)"
                 autocomplete="off"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="fullname"
                v-model="data.address.name"
                disabled
              />
            </b-form-group>
          </b-col>
           <b-col md="6">
            <b-form-group label-for="phone" label="เบอร์โทรศัพท์">
              <b-input-group v-if="mode == 'edit'">
                  <cleave
                    id="phone"
                    v-model="phone"
                    class="form-control"
                    :raw="false"
                    :options="optionsMark.phoneNumber"
                    placeholder="08x xxx xxxx"
                  />
                </b-input-group>
              <b-form-input
                v-if="mode == 'show'"
                id="phone"
                v-model="data.address.phone"
                disabled
              />
            </b-form-group>
          </b-col>
       
          <b-col md="3">
            <b-form-group label-for="houseNumber" label="บ้านเลขที่">
              <b-form-input
                v-if="mode == 'edit'"
                id="houseNumbers"
                v-model="houseNumber"
                placeholder="กรอกบ้านเลขที่"
                 autocomplete="off"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="houseNumber"
                v-model="data.address.houseNumber"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label-for="soy" label="ซอย">
              <b-form-input
                v-if="mode == 'edit'"
                id="soys"
                v-model="soy"
                placeholder="กรอกซอย"
                 autocomplete="off"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="soy"
                v-model="data.address.soy"
                disabled
              />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label-for="road" label="ถนน">
              <b-form-input
                v-if="mode == 'edit'"
                id="roads"
                v-model="road"
                placeholder="กรอกชื่อถนน"
                 autocomplete="off"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="road"
                v-model="data.address.road"
                disabled
              />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label-for="district" label="ตำบล/แขวง">
              <ThailandAutoComplete
                v-if="mode == 'edit'"
                v-model="district"
                type="district"
                @select="select"
                color="#7367f0"
                size="default"
                placeholder="ตำบล/แขวง"
              />

              <b-form-input
                v-if="mode == 'show'"
                id="district"
                v-model="data.address.district"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="amphoe" label="อำเภอ/เขต">
              <ThailandAutoComplete
                v-if="mode == 'edit'"
                v-model="amphoe"
                type="amphoe"
                size="default"
                @select="select"
                color="#7367f0"
                placeholder="อำเภอ/เขต"
              />

              <b-form-input
                v-if="mode == 'show'"
                id="amphoe"
                v-model="data.address.amphoe"
                disabled
              />
            </b-form-group>
          </b-col>

          <b-col md="6">
            <b-form-group label-for="province" label="จังหวัด">
              <ThailandAutoComplete
                v-if="mode == 'edit'"
                v-model="province"
                type="province"
                @select="select"
                size="default"
                color="#7367f0"
                placeholder="จังหวัด"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="province"
                v-model="data.address.province"
                disabled
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label-for="zipcode" label="รหัสไปรษณีย์">
              <ThailandAutoComplete
                v-if="mode == 'edit'"
                v-model="zipcode"
                type="zipcode"
                @select="select"
                size="default"
                color="#7367f0"
                placeholder="รหัสไปรษณีย์"
              />
              <b-form-input
                v-if="mode == 'show'"
                id="zipcode"
                v-model="data.address.zipcode"
                disabled
              />
            </b-form-group>
          </b-col>

          <!-- buttons -->
          <b-col cols="12" v-if="mode == 'show'">
            <b-button @click="changeMode" variant="primary" class="mt-1 mr-1">
              แก้ไข
            </b-button>
          </b-col>
          <b-col cols="12" v-if="mode == 'edit'">
            <b-button @click="saveData" variant="primary" class="mt-1 mr-1">
              ยืนยัน
            </b-button>
            <b-button
              type="reset"
              class="mt-1 ml-25"
              variant="outline-primary"
              @click="changeMode"
            >
              ยกเลิก
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </b-card>
</template>

<script>
import { VclFacebook } from "vue-content-loading";
import Cleave from 'vue-cleave-component'
import 'cleave.js/dist/addons/cleave-phone.th'

export default {
  name: "AddressPage",
  props: ["data", "loading"],
  components: {
    VclFacebook,
    Cleave
  },
  data() {
    return {
       optionsMark: {
        phoneNumber: {
          phone: true,
          phoneRegionCode: "TH",
          delimiter: '-',
        },
      },
      mode: "show",
      name : "",
      phone : "",
      road: "",
      soy: "",
      houseNumber: "",
      district: "",
      amphoe: "",
      province: "",
      zipcode: "",
    };
  },
  methods: {
    select(address) {
      this.district = address.district;
      this.amphoe = address.amphoe;
      this.province = address.province;
      this.zipcode = address.zipcode;
    },
    saveData() {
      var setAddress = {
        name : this.name,
        phone : this.phone,
        road: this.road,
        soy: this.soy,
        houseNumber: this.houseNumber,
        district: this.district,
        amphoe: this.amphoe,
        province: this.province,
        zipcode: this.zipcode,
      };
      this.$emit("newData", setAddress);
      this.changeMode();
    },
    changeMode() {
      this.name = this.data.address.name;
      this.phone = this.data.address.phone;
      this.road = this.data.address.road;
      this.soy = this.data.address.soy;
      this.houseNumber = this.data.address.houseNumber;
      this.district = this.data.address.district;
      this.amphoe = this.data.address.amphoe;
      this.province = this.data.address.province;
      this.zipcode = this.data.address.zipcode;
      this.mode = this.mode == "show" ? "edit" : "show";
    },
  },
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
</style>
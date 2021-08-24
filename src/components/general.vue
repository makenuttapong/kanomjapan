<template>
  <b-card>
    <div v-if="loading" class="p-2">
      <vcl-facebook></vcl-facebook>
    </div>

    <div v-if="!loading">
      <div class="d-flex align-items-center mb-2">
        <h4 class="mb-4 ml-75">
          <i size="18" class="fa fa-user" color="#7367f0" /> ข้อมูลส่วนตัว
        </h4>
      </div>
      <validation-observer ref="Rules">
        <b-form class="mt-2">
          <b-row>
            <b-col sm="12">
              <b-form-group label="รูป">
                <b-media no-body class="editImage">
                  <b-media-aside>
                    <b-avatar
                      v-if="mode == 'edit'"
                      ref="previewEl"
                      class="img-avatar edit"
                      :src="preview ? preview : imageDF"
                    />
                    <b-avatar
                      v-if="mode == 'show'"
                      class="img-avatar edit"
                      :src="data.image ? data.image : imageDF"
                    />
                  </b-media-aside>
                  <b-media-body
                    class="mt-75 ml-75 imageUp"
                    v-if="mode == 'edit'"
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
                      accept=".jpg, .png, .gif"
                      :hidden="true"
                      plain
                    />

                    <b-card-text class="font14 mt-1"
                      >รูปภาพขนาดไม่เกิน 0.8 mb</b-card-text
                    >
                  </b-media-body>
                </b-media>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group label="ชื่อ" label-for="account-name">
                <ValidationProvider
                  #default="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <b-form-input
                    v-if="mode == 'edit'"
                    v-model="form.name"
                    :state="errors.length > 0 ? false : null"
                    placeholder="กรอกชื่อ"
                    name="name"
                    autocomplete="off"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </ValidationProvider>
                <b-form-input
                  v-if="mode == 'show'"
                  v-model="data.name"
                  disabled
                />
              </b-form-group>
            </b-col>

            <b-col sm="6">
              <b-form-group label="อีเมล" label-for="account-e-mail">
                <b-form-input v-model="data.email" disabled />
              </b-form-group>
            </b-col>

            <b-col sm="6">
              <b-form-group label="เพศ" label-for="account-gender">
                <b-form-select
                  v-if="mode == 'edit'"
                  name="gender"
                  v-model="form.gender"
                  :options="options"
                  placeholder="เลือกเพศ"
                  autocomplete="off"
                />
                <b-form-input
                  v-if="mode == 'show'"
                  v-model="data.gender"
                  disabled
                />
              </b-form-group>
            </b-col>

            <b-col sm="6">
              <b-form-group label="วันเกิด" label-for="account-birthdate">
                <date-picker
                  v-if="mode == 'edit'"
                  v-model="form.date"
                  valueType="format"
                  format="DD-MM-YYYY"
                ></date-picker>
                <b-form-input
                  v-if="mode == 'show'"
                  v-model="data.birthdate"
                  disabled
                />
              </b-form-group>
            </b-col>

            <b-col sm="6">
              <b-form-group label="เบอร์โทรศัพท์" label-for="account-phone">
                <!-- <b-form-input
                  v-if="mode == 'edit'"
                  name="phone"
                  v-model="form.phone"
                  placeholder="กรอกเบอร์โทรศัพท์"
                   autocomplete="off"
                /> -->
                <b-input-group v-if="mode == 'edit'">
                  <cleave
                    id="phone"
                    v-model="form.phone"
                    class="form-control"
                    :raw="false"
                    :options="optionsMark.phoneNumber"
                    placeholder="08x xxx xxxx"
                  />
                </b-input-group>
                <b-form-input
                  v-if="mode == 'show'"
                  v-model="data.phone"
                  disabled
                />
              </b-form-group>
            </b-col>

            <b-col sm="6">
              <b-form-group label="Line ID" label-for="line-id">
                <b-form-input
                  v-if="mode == 'edit'"
                  name="LineID"
                  v-model="form.lineID"
                  placeholder="กรอก Line ID"
                  autocomplete="off"
                />
                <b-form-input
                  v-if="mode == 'show'"
                  v-model="data.lineID"
                  disabled
                />
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-button
                v-if="mode == 'show'"
                variant="primary"
                class="mt-2 mr-1"
                @click="changeMode"
              >
                แก้ไข
              </b-button>
              <b-button
                v-if="mode == 'edit'"
                variant="primary"
                class="mt-2 mr-1"
                @click="saveData"
              >
                ยืนยัน
              </b-button>
              <b-button
                v-if="mode == 'edit'"
                variant="outline-primary"
                class="mt-2 mr-1"
                @click="changeMode"
              >
                ยกเลิก
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "../helper/validations";
import { VclFacebook } from "vue-content-loading";
import imageDF from "../assets/userDF.png";
import Cleave from 'vue-cleave-component'
import 'cleave.js/dist/addons/cleave-phone.th'

export default {
  name: "general",
  props: ["data", "loading"],
  components: {
    ValidationProvider,
    ValidationObserver,
    VclFacebook,
    Cleave
  },
  data() {
    return {
      imageDF,
      mode: "show",
      required,
      preview: "",
      optionsMark: {
        phoneNumber: {
          phone: true,
          phoneRegionCode: "TH",
          delimiter: '-',
        },
      },
      options: [
        { value: "ชาย", text: "ชาย" },
        { value: "หญิง", text: "หญิง" },
      ],
      form: {
        name: "",
        phone: null,
        date: "",
        gender: "",
        image: "",
      },
    };
  },

  methods: {
    changeMode() {
      this.form = {
        name: this.data.name,
        phone: this.data.phone,
        gender: this.data.gender,
        date: this.data.birthdate,
        image: this.data.image,
        lineID: this.data.lineID,
      };
      this.preview = this.data.image;
      this.$refs.Rules.reset();
      this.mode = this.mode == "show" ? "edit" : "show";
    },

    saveData() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          this.$emit("newData", this.form);
          this.changeMode();
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
            this.form.image = e.target.result;
          };
          reader.readAsDataURL(file[0]);
        }
      }
    },
  },
};
</script>

<style>
.font14 {
  font-size: 14px;
}
</style>
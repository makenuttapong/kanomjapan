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
              <i size="18" class="fa fa-share-alt" color="#7367f0"/> ลิงก์โซเชียล
            </h4>
          </div>
        </b-col>

        <!-- twitter -->
        <b-col md="6">
          <b-form-group label-for="account-twitter" label="Twitter">
            <b-form-input
              v-if="mode == 'edit'"
              id="account-twitter"
              v-model="form.twitter"
              placeholder="เพิ่มลิงก์"
               autocomplete="off"
            />
            <b-form-input
              v-if="mode == 'show'"
              id="account-twitter"
              v-model="data.social.twitter"
              disabled
            />
          </b-form-group>
        </b-col>

        <!-- facebook -->
        <b-col md="6">
          <b-form-group label-for="account-facebook" label="Facebook">
            <b-form-input
              v-if="mode == 'edit'"
              id="account-facebook"
              v-model="form.facebook"
              placeholder="เพิ่มลิงก์"
               autocomplete="off"
            />
            <b-form-input
              v-if="mode == 'show'"
              id="account-facebook"
              v-model="data.social.facebook"
              disabled
            />
          </b-form-group>
        </b-col>

        <!-- instagram -->
        <b-col md="6">
          <b-form-group label="Instagram" label-for="account-instagram">
            <b-form-input
              v-if="mode == 'edit'"
              id="account-instagram"
              v-model="form.instagram"
              placeholder="เพิ่มลิงก์"
               autocomplete="off"
            />
            <b-form-input
              v-if="mode == 'show'"
              id="account-instagram"
              v-model="data.social.instagram"
              disabled
            />
          </b-form-group>
        </b-col>

        <!-- Line -->
        <b-col md="6">
          <b-form-group label-for="account-line" label="Line">
            <b-form-input
              id="account-line"
              v-if="mode == 'edit'"
              v-model="form.line"
              placeholder="เพิ่มลิงก์"
               autocomplete="off"
            />
            <b-form-input
              v-if="mode == 'show'"
              id="account-line"
              v-model="data.social.line"
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
export default {
  name: "social",
  props: ["data","loading"],
  data() {
    return {
      mode: "show",
      form: {
        facebook: "",
        line: "",
        twitter: "",
        instagram: "",
      },
    };
  },
  components:{
    VclFacebook,
  },
  methods: {
    saveData() {
      this.$emit("newData", this.form);
      this.changeMode();
    },
    changeMode() {
      this.form = {
        facebook: this.data.social.facebook,
        line: this.data.social.line,
        twitter: this.data.social.twitter,
        instagram: this.data.social.instagram,
      };
      this.mode = this.mode == "show" ? "edit" : "show";
    },
  },
};
</script>

<style>
</style>
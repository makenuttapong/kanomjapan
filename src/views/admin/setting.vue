<template>
  <b-card>
    <h5 class="mb-4"><i class="fa fa-cog" color="#7367f0" /> ตั้งค่า</h5>
    <b-tabs pills>
      <b-tab active>
        <template #title>
          <i class="fa fa-at" />
          <span class="d-none d-sm-inline"> ช่องทางติดต่อ</span>
        </template>

        <div v-if="loading" class="p-4">
          <VclList />
        </div>
        <div v-if="!loading" class="p-4">
          <b-form class="mt-2">
            <b-row>
              <b-col md="6">
                <b-form-group label-for="email-contect" label="อีเมล">
                  <b-form-input
                    v-if="mode == 'edit'"
                    id="email-contect"
                    v-model="form.email"
                    placeholder="เพิ่มอีเมล"
                    autocomplete="off"
                  />
                  <b-form-input
                    v-if="mode == 'show'"
                    id="email-contect"
                    v-model="dataSetting.email"
                    disabled
                  />
                </b-form-group>
              </b-col>

              <b-col md="6">
                <b-form-group label-for="phone-contect" label="โทรศัพท์">
                  <b-form-input
                    v-if="mode == 'edit'"
                    id="phone-contect"
                    v-model="form.phone"
                    placeholder="เพิ่มเบอร์โทรศัพท์"
                    autocomplete="off"
                  />
                  <b-form-input
                    v-if="mode == 'show'"
                    id="phone-contect"
                    v-model="dataSetting.phone"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label-for="line-contect" label="Line@">
                  <b-form-input
                    v-if="mode == 'edit'"
                    id="line-contect"
                    v-model="form.line"
                    placeholder="เพิ่ม Line@"
                    autocomplete="off"
                  />
                  <b-form-input
                    v-if="mode == 'show'"
                    id="line-contect"
                    v-model="dataSetting.line"
                    disabled
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" v-if="mode == 'show'">
                <b-button
                  @click="changeMode"
                  variant="primary"
                  class="mt-1 mr-1"
                >
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
      </b-tab>

      <b-tab>
        <template #title>
          <i class="fas fa-house-user" />
          <span class="d-none d-sm-inline"> เกี่ยวกับเรา</span>
        </template>
        <div v-if="loading" class="p-4">
          <VclList />
        </div>
        <div v-if="!loading" class="p-4">
          <div v-if="modeAboutMe == 'show'" class="mt-2">
            <div class="bold">เกี่ยวกับเรา</div>
            <div class="pl-3 pr-3 pb-2 pt-2">
              <span v-html="aboutData.detail" />
            </div>
          </div>

          <div v-if="modeAboutMe == 'edit'" class="mt-2">
            <b-form-group
              label="เกี่ยวกับเรา"
              label-for="blog-content"
              class="mb-2"
            >
              <quill-editor
                class="about_me_form mb-3"
                id="blog-content"
                v-model="formAbout.detail"
                :options="snowOption"
              />
            </b-form-group>
          </div>

          <div v-if="modeAboutMe == 'show'" class="mt-2 mb-3">
            <div class="bold">ติดตามเราได้ที่</div>
            <div class="mt-2 mb-4 pl-3 pr-3">
  
              <img
                v-if="aboutData.follow.Facebook"
                  src="../../assets/facebook-icon.svg"
                  width="40px"
                  rel="preload"
                  class="mr-3 pointer platform-social"
                  @click="openLink(aboutData.follow.Facebook)"
                />
               <img
                v-if="aboutData.follow.Line"
                  src="../../assets/line-icon.png"
                  width="40px"
                  rel="preload"
                    class="mr-3 pointer platform-social"
                    @click="openLink(aboutData.follow.Line)"
                />
                <img
                 v-if="aboutData.follow.Instagram"
                  src="../../assets/instagram-icon.png"
                  width="40px"
                  rel="preload"
                    class="mr-3 pointer platform-social"
                    @click="openLink(aboutData.follow.Instagram)"
                />
                <img
                 v-if="aboutData.follow.Twitter"
                  src="../../assets/twitter-icon.png"
                  width="40px"
                  rel="preload"
                  class="pointer platform-social"
                  @click="openLink(aboutData.follow.Twitter)"
                />
            </div>
          </div>

          <div v-if="modeAboutMe == 'edit'" class="mt-2">
            <div class="mb-2 text-underline">ติดตามเราได้ที่</div>

            <b-form>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Facebook">
                    <b-form-input
                      id="Facebook"
                      v-model="formAbout.follow.Facebook"
                      placeholder="เพิ่มลิงก์"
                      autocomplete="off"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Line">
                    <b-form-input
                      id="Line"
                      v-model="formAbout.follow.Line"
                      placeholder="เพิ่มลิงก์"
                      autocomplete="off"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Instagram">
                    <b-form-input
                      id="Instagram"
                      v-model="formAbout.follow.Instagram"
                      placeholder="เพิ่มลิงก์"
                      autocomplete="off"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Twitter">
                    <b-form-input
                      id="Twitter"
                      v-model="formAbout.follow.Twitter"
                      placeholder="เพิ่มลิงก์"
                      autocomplete="off"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>
          </div>

          <div class="">
            <b-row>
              <b-col cols="12" v-if="modeAboutMe == 'show'">
                <b-button
                  @click="changeModeAboutMe"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  แก้ไข
                </b-button>
              </b-col>
              <b-col cols="12" v-if="modeAboutMe == 'edit'">
                <b-button
                  @click="saveDataAboutMe"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  ยืนยัน
                </b-button>
                <b-button
                  type="reset"
                  class="mt-1 ml-25"
                  variant="outline-primary"
                  @click="changeModeAboutMe"
                >
                  ยกเลิก
                </b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-tab>

      <b-tab>
        <template #title>
          <i class="fa fa-question-circle" />
          <span class="d-none d-sm-inline"> ช่วยเหลือ</span>
        </template>
        <div v-if="loading" class="p-4">
          <VclList />
        </div>
        <div v-if="!loading" class="p-4">
          <div v-if="modeHelper == 'show'" class="mt-2">
            <div v-for="(help, index) in helperData" :key="index" class="mb-4">
              <div class="bold">
                <i :class="help.icon" color="#7367f0"/> {{ help.name }}
              </div>

              <div class="pl-3 pr-3 pb-2 pt-2">{{ help.detail }}</div>
            </div>
          </div>
          <div v-if="modeHelper == 'edit'" class="mt-2">
            <b-form>
              <b-row
                v-for="(helpform, index) in formHelper"
                :key="index"
                class="mb-4"
              >
                <b-col md="4">
                  <b-row>
                    <b-col md="12">
                      <b-form-group
                        label-for="help-name"
                        :label="`หัวข้อ: ` + (index + 1)"
                      >
                        <b-form-input
                          id="help-name"
                          v-model="helpform.name"
                          autocomplete="off"
                          placeholder="เพิ่มหัวข้อ"
                        />
                      </b-form-group>
                    </b-col>

                    <b-col md="12">
                      <b-form-group
                        label-for="help-icon"
                        :label="`ไอคอน: ` + (index + 1)"
                      >
                        <b-form-input
                          id="help-icon"
                          v-model="helpform.icon"
                          autocomplete="off"
                          placeholder="เพิ่มไอคอน font awesome"
                        />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col md="8">
                  <b-form-group
                    label-for="help-detail"
                    :label="`รายละเอียดหัวข้อ: ` + (index + 1)"
                  >
                    <b-form-textarea
                      id="textarea-large"
                      rows="5"
                      max-rows="8"
                      v-model="helpform.detail"
                      placeholder="เพิ่มรายละเอียดหัวข้อ"
                    ></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>

              <div class="text-center pt-2 pb-2">
                <b-button
                  class="mr-2"
                  variant="outline-success"
                  @click="addHelperTopic('add')"
                  >เพิ่มหัวข้อ <i class="fa fa-plus"
                /></b-button>
                <b-button
                  variant="outline-danger"
                  @click="removeHelperTopic(formHelper.length)"
                  v-if="formHelper.length != 0"
                  >ลบหัวข้อ <i class="fa fa-times"
                /></b-button>
              </div>
            </b-form>
          </div>
          <div>
            <b-row>
              <b-col cols="12" v-if="modeHelper == 'show'">
                <b-button
                  @click="changeModeHelper"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  แก้ไข
                </b-button>
              </b-col>
              <b-col cols="12" v-if="modeHelper == 'edit'">
                <b-button
                  @click="saveDataHelper"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  ยืนยัน
                </b-button>
                <b-button
                  type="reset"
                  class="mt-1 ml-25"
                  variant="outline-primary"
                  @click="changeModeHelper"
                >
                  ยกเลิก
                </b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-tab>

      <b-tab>
        <template #title>
          <i class="fa fa-shield-alt" />
          <span class="d-none d-sm-inline"> ข้อตกลงการใช้งาน</span>
        </template>

        <div v-if="loading" class="p-4">
          <VclList />
        </div>

        <div v-if="!loading" class="p-4">
          <div v-if="modePolicy == 'show'" class="mt-2">
            <div v-for="(poli, index) in policyData" :key="index" class="mb-4">
              <div class="bold">{{ index + 1 }}. {{ poli.name }}</div>
              <div class="pl-3 pr-3 pb-2">{{ poli.detail }}</div>
            </div>
          </div>

          <div v-if="modePolicy == 'edit'" class="mt-2">
            <b-form class="">
              <b-row
                v-for="(policy, index) in formPolicy"
                :key="index"
                class="mb-4"
              >
                <b-col md="4">
                  <b-form-group
                    label-for="poli-name"
                    :label="`หัวข้อ: ` + (index + 1)"
                  >
                    <b-form-input
                      id="poli-name"
                      v-model="policy.name"
                      autocomplete="off"
                      placeholder="เพิ่มหัวข้อ"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="8">
                  <b-form-group
                    label-for="poli-detail"
                    :label="`คำอธิบายหัวข้อ: ` + (index + 1)"
                  >
                    <b-form-textarea
                      id="textarea-large"
                      rows="5"
                      max-rows="8"
                      v-model="policy.detail"
                      autocomplete="off"
                      placeholder="เพิ่มคำอธิบายหัวข้อ"
                    ></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-row>
              <div class="text-center pt-2 pb-2">
                <b-button
                  class="mr-2"
                  variant="outline-success"
                  @click="addTopic('add')"
                  >เพิ่มหัวข้อ <i class="fa fa-plus"
                /></b-button>
                <b-button
                  variant="outline-danger"
                  @click="removeTopic(formPolicy.length)"
                  v-if="formPolicy.length != 0"
                  >ลบหัวข้อ <i class="fa fa-times"
                /></b-button>
              </div>
            </b-form>
          </div>
          <div>
            <b-row>
              <b-col cols="12" v-if="modePolicy == 'show'">
                <b-button
                  @click="changeModePolicy"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  แก้ไข
                </b-button>
              </b-col>
              <b-col cols="12" v-if="modePolicy == 'edit'">
                <b-button
                  @click="saveDataPolicy"
                  variant="primary"
                  class="mt-1 mr-1"
                >
                  ยืนยัน
                </b-button>
                <b-button
                  type="reset"
                  class="mt-1 ml-25"
                  variant="outline-primary"
                  @click="changeModePolicy"
                >
                  ยกเลิก
                </b-button>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-tab>
      
    </b-tabs>
  </b-card>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import "../../assets/scss/style.scss";
import { VclList } from "vue-content-loading";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.snow.css";
import "../../assets/scss/style.scss";

export default {
  name: "setting",
  components: {
    VclList,
    quillEditor,
  },
  data() {
    return {
      policyData: [],
      formPolicy: [],
      helperData: [],
      formHelper: [],
      mode: "show",
      modePolicy: "show",
      modeAboutMe: "show",
      modeHelper: "show",
      loading: false,
      dataSetting: {
        email: "",
        phone: "",
        line: "",
      },
      aboutData: {},
      form: {
        email: "",
        phone: "",
        line: "",
      },
      formAbout: {
        detail: "",
        follow: {
          Facebook: "",
          line: "",
          Instagram: "",
          Twitter: "",
        },
      },
      snowOption: {
        placeholder: "กรอกรายละเอียดที่นี่",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"],
              [{ header: 1 }, { header: 2 }],
              [{ list: "ordered" }, { list: "bullet" }], // List
              [{ indent: "-1" }, { indent: "+1" }], // Indent
              [{ size: ["small", false, "large", "huge"] }], // font size
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }], // font color
              [{ align: [] }],
            ],
          },
        },
      },
    };
  },
  created() {
    this.loadSetting();
    this.loadAboutMe();
    this.loadHelper();
    this.loadPolicy();
  },
  methods: {
    loadSetting() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/kZDbReBlckvBVjqzLJ1g");
      settingRef
        .get()
        .then((querySnapshot) => {
          var setData = {
            email: querySnapshot.data().email,
            phone: querySnapshot.data().phone,
            line: querySnapshot.data().line,
          };
          this.dataSetting = setData;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    loadAboutMe() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/ZAovlhqAMWuekijeM79c");
      settingRef
        .get()
        .then((querySnapshot) => {
          var setData = {
            detail: querySnapshot.data().detail,
            follow: querySnapshot.data().follow,
          };
          this.aboutData = setData;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    loadHelper() {
      this.loading = true;
      const helperRef = firebaseApp
        .firestore()
        .doc("setting/b9AARtqbGH4JOZvYTZQk");
      helperRef
        .get()
        .then((querySnapshot) => {
          this.helperData = querySnapshot.data().helpers;

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    loadPolicy() {
      this.loading = true;
      const policyRef = firebaseApp
        .firestore()
        .doc("policy/0XEEyC4PRY8p3i8bzMph");
      policyRef
        .get()
        .then((querySnapshot) => {
          this.policyData = querySnapshot.data().policys;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    saveData() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/kZDbReBlckvBVjqzLJ1g");
      settingRef
        .update(this.form)
        .then(() => {
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadSetting();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });

      this.changeMode();
    },
    saveDataHelper() {
      this.loading = true;
      const helperRef = firebaseApp
        .firestore()
        .doc("setting/b9AARtqbGH4JOZvYTZQk");
      helperRef
        .set({ helpers: this.formHelper })
        .then(() => {
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadHelper();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });

      this.changeModeHelper();
    },
    saveDataPolicy() {
      this.loading = true;
      const policyRef = firebaseApp
        .firestore()
        .doc("policy/0XEEyC4PRY8p3i8bzMph");
      policyRef
        .set({ policys: this.formPolicy })
        .then(() => {
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadPolicy();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });

      this.changeModePolicy();
    },
    changeMode() {
      this.form = {
        email: this.dataSetting.email,
        phone: this.dataSetting.phone,
        line: this.dataSetting.line,
      };
      this.mode = this.mode == "show" ? "edit" : "show";
    },
    changeModePolicy() {
      var item = [];
      this.policyData.forEach((doc) => {
        var setdata = {
          name: doc.name,
          detail: doc.detail,
        };
        item.push(setdata);
      });
      this.formPolicy = item;

      this.modePolicy = this.modePolicy == "show" ? "edit" : "show";
    },
    addTopic() {
      var setdata = {
        name: "",
        detail: "",
      };
      this.formPolicy.push(setdata);
    },
    removeTopic(index) {
      this.formPolicy.splice(this.formPolicy.indexOf(index), 1);
    },
    changeModeAboutMe() {
      this.formAbout = {
        detail: this.aboutData.detail,
        follow: {
          Facebook: this.aboutData.follow.Facebook,
          Line: this.aboutData.follow.Line,
          Instagram: this.aboutData.follow.Instagram,
          Twitter: this.aboutData.follow.Twitter,
        },
      };
      this.modeAboutMe = this.modeAboutMe == "show" ? "edit" : "show";
    },
    saveDataAboutMe() {
      this.loading = true;
      const settingRef = firebaseApp
        .firestore()
        .doc("setting/ZAovlhqAMWuekijeM79c");
      settingRef
        .update(this.formAbout)
        .then(() => {
          this.$toast.success(`แก้ไขข้อมูลเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadAboutMe();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไขข้อมูลไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });

      this.changeModeAboutMe();
    },
    changeModeHelper() {
      var item = [];
      this.helperData.forEach((doc) => {
        var setdata = {
          name: doc.name,
          detail: doc.detail,
          icon: doc.icon,
        };
        item.push(setdata);
      });

      this.formHelper = item;

      this.modeHelper = this.modeHelper == "show" ? "edit" : "show";
    },
    addHelperTopic() {
      var setdata = {
        name: "",
        detail: "",
        icon: "",
      };
      this.formHelper.push(setdata);
    },
    removeHelperTopic(index) {
      this.formHelper.splice(this.formHelper.indexOf(index), 1);
    },
    openLink(link){
      window.open(link)
    }
  },
};
</script>

<style>
.color-icon {
  color: #ffa125;
}
.about_me_form .ql-editor {
  height: 140px !important;
}

.platform-social:hover{
  opacity: 0.5;
}
</style>
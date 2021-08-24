<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fa fa-newspaper" color="#7367f0" /> บทความรีวิว
      </h5>

      <div class="addData" v-if="!loading">
        <b-button @click="toggleModal('add', '')" variant="primary"
          ><span class="d-none d-sm-inline">เพิ่มบทความ </span>
          <i class="fa fa-plus-circle"
        /></b-button>
      </div>

      <div class="mb-3 mx-2">
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>แสดง</label>
            <b-select
              v-model="itemPerPage"
              :options="perPageOptions"
              :clearable="false"
              @change="changeItemPerPage"
              class="
                per-page-selector
                d-inline-block
                mx-50
                select-per-page
                ml-2
                mr-2
              "
            />
            <label>รายการ</label>
          </b-col>

          <!-- Search -->
          <b-col cols="12" lg="6" md="6" class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-end">
              <b-form @submit.prevent="searchReview">
                <b-input-group class="input-group-merge pr-2">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block"
                    placeholder="ค้นหาบทความรีวิว"
                  />
                  <b-input-group-append
                    is-text
                    @click="searchReview"
                    class="pointer"
                  >
                    <i class="fas fa-search" />
                  </b-input-group-append>
                </b-input-group>
              </b-form>
            </div>
          </b-col>

          <b-col cols="12" lg="6" md="6" class="d-md-none">
            <div class="mb-3  text-right custom-filters">
              <b-button size="sm" variant="outline-info" v-b-toggle="'collapse-filter'" class="collapse-icon">ฟิลเตอร์
              <div class="col-1 icon-coll d-inline">
                <i class="fa fa-chevron-up icon-coll-open-filter" />
              </div>
              </b-button>
            </div>

            <b-collapse id="collapse-filter">
               <div class="d-flex align-items-center justify-content-end">
              <b-form @submit.prevent="searchReview">
                <b-input-group class="input-group-merge pr-2">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block"
                    placeholder="ค้นหาบทความรีวิว"
                  />
                  <b-input-group-append
                    is-text
                    @click="searchReview"
                    class="pointer"
                  >
                    <i class="fas fa-search" />
                  </b-input-group-append>
                </b-input-group>
              </b-form>
               </div>
            </b-collapse>
          </b-col>
        </b-row>
      </div>

      <div v-if="loading" class="p-5">
        <vcl-table> </vcl-table>
      </div>
      <div v-if="!loading">
        <b-card-body>
          <div class="text-mute mb-2" v-if="this.reviewProductData.length != 0">
            บทความที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
          </div>
          <b-table
            :items="reviewProductData"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            tbody-tr-class="tableHover"
          >
            <template #cell(actions)="row">
              <b-dropdown
                size="md"
                variant="link"
                right
                class="dropdown-right"
                no-caret
              >
                <template #button-content>
                  <i class="fa fa-ellipsis-v" color="#7367f0" />
                </template>
                <b-dropdown-item @click="getDetail(row.item)"
                  ><i class="fa fa-search" /> รายละเอียด</b-dropdown-item
                >
                <b-dropdown-item @click="toggleModal('edit', row.item)"
                  ><i class="fa fa-edit" /> แก้ไข</b-dropdown-item
                >
                <b-dropdown-item @click="toggleModal('delete', row.item)"
                  ><i class="fa fa-trash" /> ลบ</b-dropdown-item
                >
              </b-dropdown>
            </template>
            <template #cell(title)="row">
              <span
                @click="getDetail(row.item)"
                class="title-name link-detail"
                >{{ row.item.title }}</span
              >
            </template>
            <template #cell(status)="row">
              <span v-if="row.item.status" class="badge-5"
                ><b-badge class="status-check-style" pill>แสดง</b-badge></span
              >
              <span v-if="!row.item.status" class="badge-5"
                ><b-badge class="status-cancle-style" pill
                  >ไม่แสดง</b-badge
                ></span
              >
            </template>
            <template #cell(productIdRef)="row">
              <span class="color-primary">{{
                row.item.productID ? row.item.productID : "-"
              }}</span>
            </template>
            <template #cell(createAt)="row">
              <div class="timeCreatWidth">{{ row.item.createAt }}</div>
            </template>
            <template #cell(image)="row">
              <img
                :src="
                  row.item.image
                    ? row.item.image
                    : require(`@/assets/NoImage.png`)
                "
                width="70px"
                height="70px"
                class="custom-show-img-table"
                @click="getDetail(row.item)"
              />
            </template>
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="this.reviewProductData.length != 0">
          <b-row>
            <b-col
              cols="12"
              sm="6"
              class="
                d-flex
                align-items-center
                justify-content-center justify-content-sm-start
              "
            >
              <span class="text-mute total-data"
                >บทความที่ {{ itemStart }} - {{ itemEnd }} จาก
                {{ totalDatas }}</span
              >
            </b-col>
            <b-col
              cols="12"
              sm="6"
              class="
                d-flex
                align-items-center
                justify-content-center justify-content-sm-end
              "
            >
              <Pagination
                @selectedPage="loadMore"
                :currentPage="this.$store.state.currentP + 1"
                :totalItem="totalDatas"
                :itemPerPage="itemPerPage"
                :start="itemStart"
                :end="itemEnd"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </b-card>

    <!-- MODAL -->
    <b-modal
      class="modalClass"
      id="modal-1"
      :title="formMode == 'add' ? `เพิ่มบทความรีวิว` : `แก้ไขบทความรีวิว`"
      hide-footer
      size="lg"
    >
      <template>
        <validation-observer ref="Rules">
          <b-form @submit.prevent="submit">
            <b-card-text class="text-small text-mute mt-1"
              ><i class="fa fa-info-circle mr-2" />รูปภาพขนาดไม่เกิน 0.8 mb
              (800*800 พิกเซล)</b-card-text
            >
            <b-row>
              <b-col md="12" lg="3" class="mb-2">
                <b-form-group label="ปกรูป" label-for="blog-image" class="mb-2">
                  <div class="itemsContainer">
                    <div class="image">
                      <b-img
                        ref="refPreviewEl"
                        :src="
                          preview ? preview : require('@/assets/NoImage.png')
                        "
                        height="120"
                        width="120"
                        class="
                          rounded
                          mr-2
                          mb-1 mb-md-0
                          custom-show-img-table
                          img-border
                        "
                        @click="$refs.refInputEl.$el.click()"
                      />
                    </div>
                    <div class="play">
                      <UploadIcon
                        size="35"
                        class="pointer"
                        @click="$refs.refInputEl.$el.click()"
                      />
                    </div>
                  </div>

                  <ValidationProvider
                    #default="{ errors }"
                    name="Image"
                    rules="required"
                  >
                    <b-form-file
                      ref="refInputEl"
                      v-model="form.image"
                      @input="pickFile"
                      accept=".jpg, .png"
                      :hidden="true"
                      plain
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger d-lg-inline-block d-md-flex">{{
                      errors[0]
                    }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <!-- CONTENT -->
              <b-col lg="9" md="12">
                <b-form-group
                  label="เนื้อหา"
                  label-for="blog-content"
                  class="mb-2"
                >
                  <quill-editor
                    class="detail-h"
                    id="blog-content"
                    v-model="form.detail"
                    :options="snowOption"
                  />
                </b-form-group>
              </b-col>

              <!-- NAME -->
              <b-col md="7" sm="12">
                <b-form-group
                  label="ชื่อเรื่อง"
                  label-for="blog-title"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Title"
                    rules="required"
                  >
                    <b-form-input
                      id="blog-edit-title"
                      v-model="form.title"
                      placeholder="กรอกชื่อเรื่อง"
                      autocomplete="off"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <!-- STATUS -->
              <b-col md="2" cols="2">
                <b-form-group
                  label="สถานะ"
                  label-for="blog-status"
                  class="mb-2"
                >
                  <b-form-checkbox
                    name="check-button"
                    switch
                    v-model="form.status"
                  />
                </b-form-group>
              </b-col>

              <!-- Product -->
              <b-col lg="3" md="12" cols="10">
                <b-form-group
                  label="รหัสสินค้าอ้างอิง"
                  label-for="blog-content"
                  class="mb-2"
                >
                  <b-form-input
                    id="blog-edit-product"
                    v-model="form.productID"
                    autocomplete="off"
                    placeholder="กรอกรหัสสินค้า"
                  />
                </b-form-group>
              </b-col>

              <b-col
                cols="12"
                v-for="(detail, index) in form.moreDetail"
                :key="index"
                class="mt-3 mb-2"
              >
                <b-row>
                  <b-col lg="3" md="12" class="mb-2">
                    <b-form-group
                      :label="`รูปเพิ่มเติม ` + (index + 1)"
                      label-for="more-detail"
                      class="mb-2"
                    >
                      <div class="itemsContainer">
                        <div class="image">
                          <b-img
                            ref="refPreviewEl"
                            :src="
                              detail.preview
                                ? detail.preview
                                : require('@/assets/NoImage.png')
                            "
                            height="120"
                            width="120"
                            class="
                              rounded
                              mr-2
                              mb-1 mb-md-0
                              custom-show-img-table
                              img-border
                            "
                            @click="selectFile(`refInputEl` + index)"
                          />
                        </div>
                        <div class="play">
                          <UploadIcon
                            size="35"
                            class="pointer"
                            @click="selectFile(`refInputEl` + index)"
                          />
                        </div>
                      </div>

                      <b-form-file
                        :ref="`refInputEl` + index"
                        @input="pickFileMore(`refInputEl` + index, index)"
                        v-model="detail.image"
                        accept=".jpg, .png"
                        :hidden="true"
                        plain
                      />
                    </b-form-group>
                  </b-col>
                  <b-col lg="9" md="12">
                    <b-form-group
                      :label="`เนื้อหาเพิ่มเติม ` + (index + 1)"
                      label-for="blog-content"
                      class="mb-2"
                    >
                      <quill-editor
                        class="detail-h"
                        id="blog-content"
                        v-model="detail.detail"
                        :options="snowOption"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>

              <b-col cols="12" class="mt-2">
                <div class="text-center pt-2 pb-2">
                  <b-button
                    class="mr-2"
                    variant="outline-success"
                    v-if="form.moreDetail.length < 5"
                    @click="addMoreDetail"
                    >เพิ่มเนื้อหา <i class="fa fa-plus"
                  /></b-button>
                  <b-button
                    variant="outline-danger"
                    @click="removeMoreDetail"
                    v-if="form.moreDetail.length != 0"
                    >ลบเนื้อหา <i class="fa fa-times"
                  /></b-button>
                </div>
              </b-col>

              <b-col cols="12" class="mt-2">
                <b-button variant="primary" class="mr-1" type="submit">
                  บันทึก
                </b-button>
                <b-button variant="outline-primary" @click="closeModal">
                  ยกเลิก
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
    </b-modal>

    <b-modal id="modal-delete" hide-footer size="md" title="ลบบทความรีวิว">
      <template>
        <div class="center">แน่ใจหรือว่าต้องการลบบทความรีวิวนี้ ?</div>
        <div class="btn-delete text-center mt-2">
          <b-row>
            <b-col cols="12" class="mt-2 mb-2">
              <b-button @click="deleteData" variant="primary" class="mr-1"
                >ยืนยัน</b-button
              >
              <b-button @click="toggleModalDelete" variant="outline-primary"
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
import firebaseApp from "../../firebase/firebase_app";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.snow.css";
import "../../assets/scss/style.scss";
import { VclTable } from "vue-content-loading";
import Pagination from "../../components/pagination";
import moment from "moment";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { UploadIcon } from "vue-feather-icons";
import { required } from "../../helper/validations";

export default {
  name: "reviewProduct",
  components: {
    quillEditor,
    VclTable,
    Pagination,
    UploadIcon,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      loading: false,
      itemSelected: {},
      reviewProductData: [],
      required,
      formMode: "",
      preview: "",
      form: {
        title: "",
        image: "",
        detail: "",
        status: false,
        productID: "",
        moreDetail: [],
      },
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
      snowOption: {
        placeholder: "กรอกเนื้อหาที่นี่",
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

      searchQuery: "",
      fields: [
        { key: "image" },
        { key: "title", sortable: true, tdClass: "titleReview" },
        { key: "status", sortable: true },
        { key: "productIdRef", sortable: true },
        { key: "createAt", sortable: true, tdClass: "dateReview" },
        { key: "actions" },
      ],
    };
  },
  created() {
    this.loadReviewProduct();
  },
  methods: {
    loadReviewProduct() {
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      this.loading = true;

      var reviewQuery;

      if (this.searchQuery != "") {
        reviewQuery = firebaseApp
          .firestore()
          .collection("productReview")
          .where("title", ">=", this.searchQuery)
          .where("title", "<=", this.searchQuery + "\uf8ff");
      } else {
        reviewQuery = firebaseApp
          .firestore()
          .collection("productReview")
          .orderBy("createAt", "desc");
      }
      return reviewQuery
        .get()
        .then((document) => {
          let last = document.docs[indexOf];
          var itemCount = document.docs.length;
          var page = this.$store.state.currentP + 1;
          var start = page * this.itemPerPage - (this.itemPerPage - 1);
          var end = Math.min(start + this.itemPerPage - 1, itemCount);
          this.itemStart = start;
          this.itemEnd = end;
          this.totalDatas = itemCount;
          if (last) {
            var queryRef = reviewQuery.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = reviewQuery.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  uid: doc.id,
                  image: doc.data().image,
                  title: doc.data().title,
                  detail: doc.data().detail,
                  status: doc.data().status,
                  productID: doc.data().productID,
                  updateAt: doc.data().updateAt,
                  createAt: doc.data().createAt
                    ? this.formatDate(doc.data().createAt)
                    : "",
                  moreDetail: doc.data().moreDetail,
                };
                items.push(setData);
              });

              this.reviewProductData = items;
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    getDetail(row) {
      this.$router.push("/admin/review-product/" + row.uid);
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadReviewProduct();
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadReviewProduct();
    },
    toggleModal(mode, item) {
      this.formMode = mode;
      if (mode == "edit") {
        var items = [];
        item.moreDetail.forEach((ele) => {
          var setData = {
            preview: ele.image ? ele.image : "",
            image: ele.image ? ele.image : "",
            detail: ele.detail ? ele.detail : "",
          };
          items.push(setData);
        });

        this.form = {
          title: item.title,
          image: item.image,
          status: item.status,
          detail: item.detail,
          productID: item.productID,
          moreDetail: items,
        };
        this.preview = item.image;
        this.itemSelected = item;
        this.$bvModal.show("modal-1");
      } else if (mode == "add") {
        this.form = {
          title: "",
          image: "",
          status: true,
          productID: "",
          detail: "",
          moreDetail: [],
        };
        this.preview = "";
        this.$bvModal.show("modal-1");
      } else if (mode == "delete") {
        this.itemSelected = item;
        this.$bvModal.show("modal-delete");
      }
    },
    toggleModalDelete() {
      this.$bvModal.hide("modal-delete");
    },
    closeModal() {
      this.$bvModal.hide("modal-1");
    },
    addData(data) {
      this.loading = true;

      var item = [];
      data.moreDetail.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else if (ele.image != "") {
          item.push(ele.image);
        }
      });
      Promise.all(item).then((values) => {
        var newitem = [];
        data.moreDetail.forEach((ele, index) => {
          var setMoreData = {
            image: values[index] ? values[index] : "",
            detail: ele.detail,
          };
          newitem.push(setMoreData);
        });

        var formData = {
          title: data.title,
          status: data.status,
          detail: data.detail,
          productID: data.productID,
          updateAt: new Date(),
          createAt: new Date(),
          moreDetail: newitem,
        };

        var imgFile = data.image;
        if (imgFile != "") {
          var timestamp = new Date();
          const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์
          firebaseApp
            .storage()
            .ref("imageProductReview")
            .child(filename)
            .put(imgFile)
            .then((response) => {
              response.ref.getDownloadURL().then((photoURL) => {
                formData.image = photoURL;

                const reviewRef = firebaseApp
                  .firestore()
                  .collection("productReview");
                return reviewRef
                  .add(formData)
                  .then(() => {
                    this.loading = false;
                    this.$toast.success(`เพิ่มบทความรีวิวเรียบร้อย`, {
                      position: "top-right",
                      closeOnClick: true,
                      hideProgressBar: true,
                      timeout: 3000,
                      icon: "fa fa-check-circle",
                    });
                    this.loadReviewProduct();
                  })
                  .catch((err) => {
                    this.loading = false;
                    this.$toast.error(`เพิ่มบทความรีวิวไม่สำเร็จ`, {
                      position: "top-right",
                      closeOnClick: true,
                      hideProgressBar: true,
                      timeout: 3000,
                      icon: "fa fa-exclamation-triangle",
                    });
                    console.log(err);
                  });
              });
            });
        } else {
          this.loading = false;
        }
      });
    },

    editData(data) {
      this.loading = true;

      var item = [];
      data.moreDetail.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else if (ele.image != "") {
          item.push(ele.image);
        }
      });

      Promise.all(item).then((values) => {
        this.itemSelected.moreDetail.map((ele, index) => {
          if (ele.image != values[index] && ele.image != "") {
            this.deleteOldImage(ele.image);
          }
        });

        var newitem = [];
        data.moreDetail.forEach((ele, index) => {
          var setMoreData = {
            image: values[index] ? values[index] : "",
            detail: ele.detail,
          };
          newitem.push(setMoreData);
        });

        var formData = {
          title: data.title,
          status: data.status,
          detail: data.detail,
          productID: data.productID,
          updateAt: new Date(),
          moreDetail: newitem,
        };
        var imgFile = data.image;

        if (imgFile != "" && imgFile != this.itemSelected.image) {
          var timestamp = new Date();
          const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์

          firebaseApp
            .storage()
            .ref("imageProductReview")
            .child(filename)
            .put(imgFile)
            .then((response) => {
              response.ref.getDownloadURL().then((photoURL) => {
                formData.image = photoURL;
                this.deleteOleImage();
                this.updateData(formData, this.itemSelected.uid);
              });
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          formData.image = data.image;
          this.updateData(formData, this.itemSelected.uid);
        }
      });
    },
    updateData(formData, id) {
      const reviewRef = firebaseApp.firestore().doc("productReview/" + id);
      return reviewRef
        .update(formData)
        .then(() => {
          this.loading = false;
          this.$toast.success(`แก้ไขบทความรีวิวเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadReviewProduct();
        })
        .catch((err) => {
          this.loading = false;
          this.loading = false;
          this.$toast.error(`แก้ไขบทความรีวิวไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    deleteData() {
      this.loading = true;
      this.$bvModal.hide("modal-delete");

      this.itemSelected.moreDetail.map((ele) => {
        if (ele.image != "") {
          this.deleteOldImage(ele.image);
        }
      });

      this.deleteOleImage();
      const reviewRef = firebaseApp
        .firestore()
        .doc("productReview/" + this.itemSelected.uid);
      return reviewRef
        .delete()
        .then(() => {
          this.loading = false;
          this.$toast.success(`ลบบทความรีวิวเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadReviewProduct();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`ลบบทความรีวิวไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    deleteOleImage() {
      const oldImage = this.itemSelected.image;
      if (oldImage) {
        firebaseApp.storage().refFromURL(oldImage).delete();
      }
    },
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          if (this.formMode == "add") {
            this.addData(this.form);
          } else {
            this.editData(this.form);
          }
          this.$bvModal.hide("modal-1");
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
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    searchReview() {
      this.loadReviewProduct();
    },
    addMoreDetail() {
      if (this.form.moreDetail.length < 5) {
        this.form.moreDetail.push({ preview: "", image: "", detail: "" });
      }
    },
    removeMoreDetail() {
      if (this.form.moreDetail.length > 0) {
        this.form.moreDetail.pop();
      }
    },
    selectFile(ref) {
      this.$refs[ref][0].$el.click();
    },
    pickFileMore(ref, index) {
      let input = this.$refs[ref][0];
      let file = input.files;
      this.fileUpload = file[0];
      //800k = 0.8 byte || 800000
      if (this.fileUpload.size < 800000) {
        if (file && file[0]) {
          let reader = new FileReader();
          reader.onload = (e) => {
            this.form.moreDetail[index].preview = e.target.result;
          };
          reader.readAsDataURL(file[0]);
          this.form.moreDetail[index].image = file[0];
        }
      }
    },
    deleteOldImage(imgDel) {
      firebaseApp.storage().refFromURL(imgDel).delete();
    },
    uploadImageAsPromise(imageFile) {
      return new Promise(function (resolve, reject) {
        let randomName = (
          Math.random().toString(36).substring(2, 16) +
          Math.random().toString(36).substring(2, 16)
        ).toUpperCase();

        var storageRef = firebaseApp
          .storage()
          .ref("/imageProductReview/" + randomName);

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on(
          "state_changed",
          function progress(snapshot) {
            var percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("percentage" + percentage);
            this.progressUpload = percentage;
          },
          function error(err) {
            console.log(err);
            reject(err);
          },
          function complete() {
            console.log("done");
            var downloadURL = task.snapshot.ref.getDownloadURL();

            resolve(downloadURL);
          }
        );
      });
    },
  },
};
</script>

<style>
.custom-control-input {
  cursor: pointer !important;
}
.titleReview {
  width: 500px;
}
.dateReview {
  width: 200px;
}
.title-name {
  min-width: 200px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.timeCreatWidth {
  width: 95px;
}
.detail-h .ql-editor {
  height: 150px !important;
}
</style>
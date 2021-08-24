<template>
  <div>
    <b-card>
      <h5 class="mb-4"><i class="fa fa-star" color="#7367f0"/> ให้คะแนนสินค้า</h5>
      <div v-if="loading" class="p-4">
        <b-row>
          <b-col md="4">
            <vcl-twitch> </vcl-twitch>
          </b-col>
          <b-col md="8" class="pr-4 pl-4">
            <vcl-list> </vcl-list>
          </b-col>
        </b-row>
      </div>

      <div v-if="!loading">
        <span class="bold text-primary">#หมายเลขคำสั่งซื้อ : </span>
        <span>{{ orderData.orderID }}</span>

        <div v-for="(item, index) in orderData.items" :key="index">
          <b-card class="mt-2 card-border collapse-icon">
            <b-row class="content-order">
              <b-col md="5" sm="12">
                <div class="img-rating mb-3">
                  <div class="d-flex">
                    <div class="custom-img-rating mr-2">
                      <img :src="item.image" width="100px" height="100px"/>
                    </div>
                    <div>
                      <div class="name">{{ item.name }}</div>
                     
                      <div class="font-14 text-primary">{{ item.productID }}</div>
                    
                    </div>
                  
                  </div>
                </div>
              </b-col>

              <b-col md="7" sm="=12" class="borderLeft">
                <b-row>
                  <b-col md="9">
                    <div v-if="commentsData.length > 0">
                      <div
                      v-for="(commentData, indexx) in commentsData"
                      :key="indexx"
                    >
                      <div v-if="orderData.items[index].id == commentsData[indexx].productIdRef" class="mb-2">
                        <div class="pro-star">
                          คะแนน :
                          <ul class="unstyled-list list-inline">
                            <li
                              v-for="star in 5"
                              :key="star"
                              class="ratings-list-item mr-25"
                            >
                              <i
                                class="fa fa-star"
                                :class="[
                                  {
                                    'fill-current': star <= commentData.rating,
                                  },
                                  star <= commentData.rating
                                    ? 'text-warning'
                                    : 'text-muted',
                                ]"
                              />
                            </li>
                          </ul>
                        </div>
                        <div class="comment-mar">คอมเมนต์ : {{ commentData.comment ? commentData.comment : '-'}}</div>
                        <div class="mt-2">
                          <div v-for="(imgData , indexx) in commentData.moreImages" :key="indexx" class="d-inline">
                                <b-img :src="imgData" class="cart-drop-img mr-1 border"/>
                          </div> 
                        </div>
                      </div>
                      <!-- <div v-if="orderData.items[index].id != commentsData[indexx].productIdRef  && orderData.items[indexx].id == commentData.productIdRef" class="text-muted font-italic mb-2">ยังไม่ได้ให้คะแนน</div> -->
                    </div>
                    </div>
                    <div v-if="commentsData.length == 0" class="text-muted font-italic mb-2">
                      ยังไม่ได้ให้คะแนน
                    </div>
                    
                  </b-col>
                  <b-col md="3">
                    <div class="icon-pay">
                      <div class="">
                        <b-button
                          v-if="checkComment(item)"
                          variant="outline-primary"
                          :id="`pay-order-` + item.accId"
                          @click="toggleModal('edit', item)"
                        >
                          <EditIcon
                            size="18"
                            class="mr-2 mb-1"
                          />แก้ไขคะแนน</b-button
                        >
                        <b-button
                          v-if="!checkComment(item)"
                          variant="primary"
                          :id="`pay-order-` + item.accId"
                          @click="toggleModal('add', item)"
                        >
                          <StarIcon
                            size="18"
                            class="mr-2 mb-1"
                          />ให้คะแนน</b-button
                        >
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card>
        </div>
      </div>
    </b-card>

    <!-- MODAL -->
    <b-modal
      class="modalClass"
      id="modal-1"
      :title="formMode == 'add' ? `เพิ่มคอมเมนต์` : `แก้ไขคอมเมนต์`"
      hide-footer
      size="lg"
    >
      <template>
        <validation-observer ref="Rules">
          <b-form @submit.prevent="submit">
            <b-row>
              <b-col md="12 j">
                <ValidationProvider
                  #default="{ errors }"
                  name="Rating"
                  rules="required"
                >
                  <star-rating
                    class="custom-rating"
                    v-model="form.rating"
                    :state="errors.length > 0 ? false : null"
                    :border-width="4"
                    border-color="#d8d8d8"
                    :rounded-corners="true"
                    :star-points="[
                      23, 2, 14, 17, 0, 19, 10, 34, 7, 50, 23, 43, 38, 50, 36,
                      34, 46, 19, 31, 17,
                    ]"
                  ></star-rating>
                  <div class="text-center mt-2">
                    <small class="text-danger">{{ errors[0] }}</small>
                  </div>
                </ValidationProvider>
              </b-col>

              <!-- COMMENT -->
              <b-col md="12">
                <b-form-group
                  label="คอมเมนต์"
                  label-for="blog-title"
                  class="mb-2"
                >
                  <b-form-textarea
                    id="blog-edit-title"
                    v-model="form.comment"
                    rows="4"
                    placeholder="กรอกคอมเมนต์"
                  />
                </b-form-group>
              </b-col>

              <!-- MORE IMAGE -->
              <b-col
                lg="3"
                md="4"
                cols="4"
                class="mt-2"
                v-for="(image, index) in form.moreImages"
                :key="index"
              >
                <b-form-group
                  :label="`รูปภาพเพิ่มเติม ` + (index + 1)"
                  label-for="more-image"
                  class="mb-2"
                >
                  <div class="itemsContainer">
                    <div class="image">
                      <b-img
                        ref="refPreviewEl"
                        :src="
                          image.preview
                            ? image.preview
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
                    v-model="image.image"
                    accept=".jpg, .png"
                    :hidden="true"
                    plain
                  />
                </b-form-group>
              </b-col>

              <b-col md="12" class="mt-2">
                <div class="text-center pt-2 pb-2">
                  <b-button
                    @click="addMoreImage"
                    v-if="form.moreImages.length < 3"
                    class="mr-2"
                    variant="outline-success"
                    >เพิ่มรูปภาพ <i class="fa fa-plus"
                  /></b-button>
                  <b-button
                    @click="removeMoreImage"
                    v-if="form.moreImages.length > 0"
                    variant="outline-danger"
                    >ลบรูปภาพ <i class="fa fa-times"
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
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclTwitch, VclList } from "vue-content-loading";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "../../helper/validations";
import StarRating from "vue-star-rating";
import { StarIcon, UploadIcon, EditIcon } from "vue-feather-icons";

export default {
  name: "RatingPage",
  created() {
    this.loadComment();
    const user = firebaseApp.auth().currentUser;
    this.uidUser = user.uid;
  },
  components: {
    VclTwitch,
    VclList,
    ValidationProvider,
    ValidationObserver,
    StarRating,
    StarIcon,
    UploadIcon,
    EditIcon,
  },
  data() {
    return {
      loading: false,
      required,
      formMode: "",
      preview: "",
      form: {
        rating: null,
        comment: "",
        moreImages: [],
      },
      uidser: "",
      orderId: this.$route.params.id,
      orderData: {},
      customerDetail: {},
      itemSelected: {},
      commentMatch: {},
      commentsData: [],
    };
  },
  methods: {
    loadComment() {
      this.loading = true;
      const commentRef = firebaseApp
        .firestore()
        .collection("comments")
        .where("orderIdRef", "==", this.orderId);
      return commentRef
        .get()
        .then((querySnapshot) => {
          var items = [];
          querySnapshot.forEach((doc) => {
            var setData = {
              id: doc.id,
              comment: doc.data().comment,
              createAt: doc.data().createAt,
              moreImages: doc.data().moreImages,
              orderIdRef: doc.data().orderIdRef,
              productIdRef: doc.data().productIdRef,
              rating: doc.data().rating,
              userProfile : doc.data().userProfile
            };

            items.push(setData);
          });
          this.commentsData = items;
          this.loadOrder();
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    loadOrder() {
      this.loading = true;
      const orderConfirmRef = firebaseApp
        .firestore()
        .doc("orders/" + this.orderId);
      return orderConfirmRef
        .get()
        .then((doc) => {
          var uidUser = doc.data().userID;
          if (uidUser == this.uidUser) {
            var setData = {
              uid: doc.id,
              items: doc.data().items,
              orderID: doc.data().orderID,
              userID: doc.data().userID,
            };

            this.orderData = setData;

            this.loadCustomer(setData.userID);
            this.loading = false;
          } else {
            this.$router.replace("/error");
          }
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.$router.replace("/error");
        });
    },
    loadCustomer(userID) {
      const customerDetailRef = firebaseApp.firestore().doc("users/" + userID);
      return customerDetailRef
        .get()
        .then((doc) => {
          var detailData = {
            uid: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            image: doc.data().image
              ? doc.data().image
              : require("@/assets/userDF.png"),
            phone: doc.data().phone,
            gender: doc.data().gender,
          };
          this.customerDetail = detailData;
          this.loadUser = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadUser = false;
        });
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
    addData(data) {
      this.loading = true;
      firebaseApp
        .firestore()
        .doc("users/" + this.customerDetail.uid)
        .get()
        .then((document) => {
            var item = [];
      data.moreImages.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else if (ele.image != "") {
          item.push(ele.image);
        }
      });

      Promise.all(item).then((values) => {
        var formData = {
          rating: data.rating,
          comment: data.comment,
          updateAt: new Date(),
          createAt: new Date(),
          orderIdRef: this.orderId,
          productIdRef: this.itemSelected.id,
          userProfile: {
                      image: document.data().image,
                      email: document.data().email,
                      name: document.data().name,
                      userID: document.id,
                    },
          moreImages: values,
        };

        const commentRef = firebaseApp.firestore().collection("comments");
        return commentRef
          .add(formData)
          .then(() => {
            this.loading = false;
            this.loadComment();
            this.$toast.success(`ให้คะแนนสินค้าเรียบร้อย`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-check-circle",
            });
          })
          .catch((err) => {
            this.loading = false;
            this.$toast.error(`ให้คะแนนสินค้าไม่สำเร็จ`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-exclamation-triangle",
            });
            console.log(err);
          });
      });
        })
      
    },
    editData(data) {
      this.loading = true;

      var item = [];
      data.moreImages.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else if (ele.image != "") {
          item.push(ele.image);
        }
      });

      Promise.all(item).then((values) => {
        this.commentMatch.moreImages.map((ele, index) => {
          if (ele != values[index] && ele != "") {
            this.deleteOldImage(ele);
          }
        });

        var formData = {
          rating: data.rating,
          comment: data.comment,
          updateAt: new Date(),
          orderIdRef: this.orderId,
          productIdRef: this.itemSelected.id,
          moreImages: values,
        };

        const commentRef = firebaseApp
          .firestore()
          .doc("comments/" + this.commentMatch.id);
        return commentRef
          .update(formData)
          .then(() => {
            this.loading = false;
            this.$toast.success(`แก้ไขคะแนนสินค้าเรียบร้อย`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-check-circle",
            });
            this.loadComment();
          })
          .catch((err) => {
            this.loading = false;

            this.$toast.error(`แก้ไขคะแนนสินค้าไม่สำเร็จ`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-exclamation-triangle",
            });
            console.log(err);
          });
      });
    },
    toggleModal(mode, item) {
      this.formMode = mode;
      if (mode == "edit") {

        this.commentsData.forEach((ele) => {
          if (ele.productIdRef == item.id) {
            var items = [];
            ele.moreImages.forEach((ele) => {
              var setData = {
                preview: ele ? ele : "",
                image: ele ? ele : "",
              };
              items.push(setData);
            });

            this.form = {
              rating: ele.rating,
              comment: ele.comment,
              moreImages: items,
            };

            this.itemSelected = item;
            this.commentMatch = ele;
            this.$bvModal.show("modal-1");
          }
        });
      } else if (mode == "add") {
        this.form = {
          rating: null,
          comment: "",
          moreImages: [],
        };

        this.itemSelected = item;
        this.$bvModal.show("modal-1");
      }
    },
    checkComment(item) {
      var checked = false;
      this.commentsData.forEach((ele) => {
        if (ele.productIdRef == item.id) {
          checked = true;
        }
      });
      return checked;
    },
    addMoreImage() {
      if (this.form.moreImages.length < 3) {
        this.form.moreImages.push({ preview: "", image: "" });
      }
    },
    removeMoreImage() {
      if (this.form.moreImages.length > 0) {
        this.form.moreImages.pop();
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
            this.form.moreImages[index].preview = e.target.result;
          };
          reader.readAsDataURL(file[0]);
          this.form.moreImages[index].image = file[0];
        }
      }
    },
    closeModal() {
      this.$bvModal.hide("modal-1");
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
          .ref("/commentImage/" + randomName);

        //Upload file
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on(
          "state_changed",
          function progress(snapshot) {
            var percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("percentage" + percentage);
          },
          function error(err) {
            console.log(err);
            reject(err);
          },
          function complete() {
            var downloadURL = task.snapshot.ref.getDownloadURL();

            resolve(downloadURL);
          }
        );
      });
    },
  },
};
</script>

<style scoped>
.custom-rating {
  justify-content: center;
}
.comment-mar{
  margin-top: -12px;
}
.borderLeft{
  border-left: 1px solid #c5c4c4;
}
.custom-img-rating img{
  object-fit: cover;
}
</style>
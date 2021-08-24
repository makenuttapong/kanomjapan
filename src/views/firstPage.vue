<template>
  <div>
    <div class="mb-4 pad-swip">
      <div v-if="role == 'admin'" class="text-right pb-2">
        <SettingsIcon size="18" class="link-detail" @click="toggleModal" />
      </div>

      <div>
        <swiper class="swiper-autoplay swip-h" :options="swiperOptions">
          <swiper-slide v-for="(data, index) in imagePromotion" :key="index">
            <ExpandableImage :src="data" />
          </swiper-slide>
          <div slot="pagination" class="swiper-pagination" />
          <div slot="button-next" class="swiper-button-next" />
          <div slot="button-prev" class="swiper-button-prev" />
        </swiper>
      </div>
    </div>

    <!-- ขายดี -->
    <div class="pad-card">
      <h4 class="color-primary">สินค้าขายดี</h4>
      <div v-if="loadingBest">
        <vue-content-loading :width="300" :height="80">
          <rect x="0" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="75" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="150" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="225" y="0" rx="0" ry="0" width="70" height="70" />
        </vue-content-loading>
      </div>
      <div v-if="!loadingBest">
        <swiper class="swiper-responsive-breakpoints" :options="swiperOptions1">
          <swiper-slide v-for="(data, index) in productDataBest" :key="index">
            <CardShowProduct :datas="data" @toDetailPage="todetail" />
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!--  แนะนำ -->
    <div class="pad-card">
      <h4 class="color-primary">สินค้าแนะนำ</h4>
      <div v-if="loadingRecom">
        <vue-content-loading :width="300" :height="80">
          <rect x="0" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="75" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="150" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="225" y="0" rx="0" ry="0" width="70" height="70" />
        </vue-content-loading>
      </div>
      <div v-if="!loadingRecom">
        <swiper class="swiper-responsive-breakpoints" :options="swiperOptions2">
          <swiper-slide v-for="(data, index) in productDataRecom" :key="index">
            <CardShowProduct :datas="data" @toDetailPage="todetail" />
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- สินค้าใหม่ล่าสุด -->
    <div class="pad-card">
      <h4 class="color-primary">สินค้าใหม่</h4>
      <div v-if="loadingNew">
        <vue-content-loading :width="300" :height="80">
          <rect x="0" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="75" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="150" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="225" y="0" rx="0" ry="0" width="70" height="70" />
        </vue-content-loading>
      </div>
      <div v-if="!loadingNew">
        <swiper class="swiper-responsive-breakpoints" :options="swiperOptions1">
          <swiper-slide v-for="(data, index) in productDataNew" :key="index">
            <CardShowProduct :datas="data" @toDetailPage="todetail" />
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- ลดราคา -->
    <div class="pad-card">
      <h4 class="color-primary">สินค้าราคาพิเศษ</h4>
      <div v-if="loadingSale">
        <vue-content-loading :width="300" :height="80">
          <rect x="0" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="75" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="150" y="0" rx="0" ry="0" width="70" height="70" />
          <rect x="225" y="0" rx="0" ry="0" width="70" height="70" />
        </vue-content-loading>
      </div>
      <div v-if="!loadingSale">
        <swiper class="swiper-responsive-breakpoints" :options="swiperOptions2">
          <swiper-slide v-for="(data, index) in productDataSale" :key="index">
            <CardShowProduct :datas="data" @toDetailPage="todetail" />
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <b-modal
      class="modalClass product-modal"
      id="modal-1"
      title="จัดการแบนเนอร์"
      hide-footer
      size="lg"
    >
      <template>
        <b-form @submit.prevent="submit">
          <b-card-text class="text-small text-mute mt-1"
            ><i class="fa fa-info-circle mr-2" />รูปภาพขนาดไม่เกิน 0.8 mb
            (1980*660 พิกเซล)</b-card-text
          >

          <b-row>
            <b-col
              cols="12"
              lg="4"
              md="6"
              sm="6"
              class="mb-2 mt-2"
              v-for="(item, index) in form"
              :key="index"
            >
              <b-form-group
                :label="`รูปที่ ` + (index + 1)"
                label-for="product-image"
                class="mb-2"
              >
                <div class="itemsContainer">
                  <div class="image">
                    <b-img
                      ref="refPreviewEl"
                      :src="
                        item.preview
                          ? item.preview
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
                        baner-img
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
                  @input="pickFile(`refInputEl` + index, index)"
                  v-model="item.image"
                  accept=".jpg, .png"
                  :hidden="true"
                  plain
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" class="mt-2 text-right">
              <b-button variant="primary" class="mr-1" type="submit">
                บันทึก
              </b-button>
              <b-button variant="outline-primary" @click="closeModal">
                ยกเลิก
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </b-modal>
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { BImg } from "bootstrap-vue";
import "swiper/css/swiper.css";
import "swiper/swiper.scss";
import CardShowProduct from "../components/cardShowProduct.vue";
import { SettingsIcon, UploadIcon } from "vue-feather-icons";
import { VueContentLoading } from "vue-content-loading";
import ExpandableImage from "../components/expandableImage.vue";

export default {
  name: "FirstPage",
  components: {
    Swiper,
    SwiperSlide,
    BImg,
    CardShowProduct,
    SettingsIcon,
    VueContentLoading,
    UploadIcon,
    ExpandableImage,
  },
  data() {
    return {
      role: "",
      form: [],
      loadingPromotion: false,
      loadingBest: false,
      loadingRecom: false,
      loadingNew: false,
      loadingSale: false,
      imagePromotion: [
        require("@/assets/banner.png"),
        require("@/assets/banner.png"),
        require("@/assets/banner.png"),
        require("@/assets/banner.png"),
        require("@/assets/banner.png"),
      ],
      productDataBest: [],
      productDataRecom: [],
      productDataNew: [],
      productDataSale: [],
      progressUpload: null,
      oldImageData: [],
      swiperOptions: {
        spaceBetween: 30,
        centeredSlides: true,

        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },

        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      swiperOptions1: {
        slidesPerView: 5,
        spaceBetween: 50,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        breakpoints: {
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          470:{
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
        },
      },
      swiperOptions2: {
        slidesPerView: 5,
        spaceBetween: 50,
        autoplay: {
          delay: 2700,
          disableOnInteraction: false,
        },
        breakpoints: {
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          470:{
            slidesPerView: 2,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        },
      },
    };
  },
  created() {
    window.scrollTo(0, 0);
    const user = firebaseApp.auth().currentUser;
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.role) {
          this.role = idTokenResult.claims.role;
        } else {
          this.role = "user";
        }
      });
    }
    this.loadImagePromotion();
    this.loadProductBest();
    this.loadProductRecommend();
    this.loadProductNew();
    this.loadProductSale();
    // let rand = (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase()
    // console.log(rand);
  },
  methods: {
    loadImagePromotion() {
      this.loadingPromotion = true;
      const imageRef = firebaseApp
        .firestore()
        .doc("imagePromotion/IukOcZE4qmLBaF0Pcctw");
      imageRef
        .get()
        .then((querySnapshot) => {
          this.imagePromotion = querySnapshot.data().images;
          this.loadingPromotion = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingPromotion = false;
        });
    },
    loadProductBest() {
      this.loadingBest = true;
      const productData = firebaseApp
        .firestore()
        .collection("products")
        .where("productType", "==", "สินค้าขายดี")
        .where('show' ,'==' ,true)
        .where("stock", ">=", 1)
        .limit(10);
      return productData
        .get()
        .then((document) => {
          var items = [];
          document.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            items.push(data);
          });

          this.productDataBest = items;
          this.loadingBest = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingBest = false;
        });
    },
    loadProductRecommend() {
      this.loadingRecom = true;
      const productData = firebaseApp
        .firestore()
        .collection("products")
        .where("productType", "==", "สินค้าแนะนำ")
        .where("stock", ">=", 1)
        .where('show' ,'==' ,true)
        .limit(10);
      return productData
        .get()
        .then((document) => {
          var items = [];
          document.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            items.push(data);
          });

          this.productDataRecom = items;
          this.loadingRecom = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingRecom = false;
        });
    },
    loadProductNew() {
      this.loadingNew = true;
      const productData = firebaseApp
        .firestore()
        .collection("products")
        .where('show' ,'==' ,true)
        .orderBy("createAt", "desc")
        .limit(20);

      productData
        .get()
        .then((document) => {
          var items = [];
          document.forEach((doc) => {
            if (items.length < 10) {
              var data = doc.data();
              data.id = doc.id;
              if (doc.data().stock != 0) {
                items.push(data);
              }
            }
          });

          this.productDataNew = items;
          this.loadingNew = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingNew = false;
        });
    },
    loadProductSale() {
      this.loadingSale = true;
      const productData = firebaseApp
        .firestore()
        .collection("products")
        .where("discount", "==", true)
        .where('show' ,'==' ,true)
        .where("stock", ">=", 1)
        .limit(10)
      return productData
        .get()
        .then((document) => {
          var items = [];
          document.forEach((doc) => {
            var data = doc.data();
            data.id = doc.id;
            items.push(data);
          });

          this.productDataSale = items;
          this.loadingSale = false;
        })
        .catch((err) => {
          console.log(err);
          this.loadingSale = false;
        });
    },
    todetail(data) {
      this.$router.push("/product-detail/" + data.id);
    },
    toggleModal() {
      this.oldImageData = this.imagePromotion;
      var items = [];
      this.imagePromotion.forEach((ele) => {
        var setData = {
          preview: ele,
          image: ele,
        };
        items.push(setData);
      });

      this.form = items;
      this.$bvModal.show("modal-1");
    },
    closeModal() {
      this.$bvModal.hide("modal-1");
    },
    selectFile(ref) {
      this.$refs[ref][0].$el.click();
    },
    pickFile(ref, index) {
      let input = this.$refs[ref][0];
      let file = input.files;
      this.fileUpload = file[0];
      //800k = 0.8 byte || 800000
      if (this.fileUpload.size < 800000) {
        if (file && file[0]) {
          let reader = new FileReader();
          reader.onload = (e) => {
            this.form[index].preview = e.target.result;
          };
          reader.readAsDataURL(file[0]);
          this.form[index].image = file[0];
        }
      }
    },
    submit() {
      this.closeModal();
      var item = [];
      this.form.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else {
          item.push(ele.image);
        }
      });

      Promise.all(item).then((values) => {
        //ถ้ารูปก่อนเปลี่ยนไม่เท่ากับหลังเปลี่ยนให้ลบรูปเก่าทิ้งซะ

        this.oldImageData.map((ele, index) => {
          if (ele != values[index]) {
            this.deleteOldImage(ele);
          }
        });

        //ถ้าลบเรียบร้อยให้ เซฟ
        const imagePromo = firebaseApp
          .firestore()
          .doc("imagePromotion/IukOcZE4qmLBaF0Pcctw");

        imagePromo
          .set({ images: values })
          .then(() => {
            this.loadImagePromotion();
          })
          .catch((err) => {
            console.log(err);
          });
      });
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
          .ref("/imagePromotion/" + randomName);

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
<style scoped>

.baner-img {
  width: 210px;
}
</style>
<template>
  <div style="height: inherit">
    <div class="content-detached content-right">
      <div class="content-wrapper">
        <div class="content-body">
          <div class="row">
            <div class="col-sm-12">
              <div class="ecommerce-header-items">
                <div
                  class="result-toggler"
                  @click="mqShallShowLeftSidebar = true"
                >
                  <i class="d-block d-lg-none fa fa-bars pointer" />

                  <span
                    class="search-results text-mute"
                    v-if="!loading && dataList.length != 0"
                    >สินค้าที่ {{ itemStart }} - {{ itemEnd }} จาก
                    {{ totalDatas }}</span
                  >
                </div>
                <div class="view-options d-flex">
                  <b-dropdown
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    :text="sortBy.text"
                    right
                    variant="outline-primary"
                  >
                    <b-dropdown-item
                      v-for="sortOption in sortByOptions"
                      :key="sortOption.value"
                      @click="changeType(sortOption)"
                    >
                      {{ sortOption.text }}
                    </b-dropdown-item>
                  </b-dropdown>

                  <b-form-radio-group
                    v-model="itemView"
                    class="ml-1 list item-view-radio-group"
                    buttons
                    size="sm"
                    button-variant="outline-primary"
                  >
                    <b-form-radio
                      v-for="option in itemViewOptions"
                      :key="option.value"
                      :value="option.value"
                      class="btn-view"
                    >
                      <i :class="option.icon" size="18" />
                    </b-form-radio>
                  </b-form-radio-group>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="row p-3">
            <vue-content-loading :width="300" :height="100">
              <rect x="0" y="0" rx="0" ry="0" width="70" height="100" />
              <rect x="75" y="0" rx="0" ry="0" width="70" height="100" />
              <rect x="150" y="0" rx="0" ry="0" width="70" height="100" />
              <rect x="225" y="0" rx="0" ry="0" width="70" height="100" />
            </vue-content-loading>
          </div>

          <cardProduct
            v-if="!loading"
            :datas="dataList"
            :role="role"
            @toDetailPage="detailPage"
            :itemView="itemView"
          />

          <b-row v-if="!loading && dataList.length != 0">
            <b-col cols="12">
               <span
              class="search-results text-mute d-none d-lg-inline"
              v-if="!loading && dataList.length != 0"
              >สินค้าที่ {{ itemStart }} - {{ itemEnd }} จาก
              {{ totalDatas }}</span
            >
            <div class="text-center">
              <span
                class="search-results text-mute d-lg-none "
                v-if="!loading && dataList.length != 0"
                >สินค้าที่ {{ itemStart }} - {{ itemEnd }} จาก
                {{ totalDatas }}</span
              >
            </div>
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

          <div v-if="!loading && dataList.length == 0" class="text-center">
            <h4 class="mb-4">ไม่พบสินค้า</h4>
            <img
              :src="require('../assets/Empty.svg')"
              width="400px"
              class="mt-4"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->

    <sidebarProduct
      :mq-shall-show-left-sidebar.sync="mqShallShowLeftSidebar"
      :searchP="searchQuery"
      @searchValue="searchProduct"
      :catagorys="catagorysFilter"
      :selectedCatagory="catagorySelected"
      @changeCatagory="changeCatagory"
      :rangeValue="rangeValue"
      :rangeOptions="rangeOptions"
      @checkPrice="checkedPriceSelect"
    />
  </div>
</template>

<script>
import firebaseApp from "../firebase/firebase_app";
import cardProduct from "../components/cardProduct";
import Pagination from "../components/pagination";
import sidebarProduct from "../components/sidebarproduct";
import "../assets/scss/style.scss";
import { VueContentLoading } from "vue-content-loading";
import Ripple from "vue-ripple-directive";
export default {
  name: "productList",
  directives: {
    Ripple,
  },
  data() {
    return {
      rangeValue: 2000,
      rangeOptions: {
        height: 5,
        min: 0,
        max: 2000,
      },
      dataList: [],
      role: "",
      loading: false,
      mqShallShowLeftSidebar: false,
      itemView: "grid-view",
      itemViewOptions: [
        { icon: "fa fa-th", value: "grid-view" },
        { icon: "fa fa-list", value: "list-view" },
      ],
      sortBy: { text: "สินค้าทั้งหมด", value: "สินค้าทั้งหมด" },
      sortByOptions: [
        { text: "สินค้าทั้งหมด", value: "สินค้าทั้งหมด" },
        { text: "สินค้าขายดี", value: "สินค้าขายดี" },
        { text: "สินค้าแนะนำ", value: "สินค้าแนะนำ" },
        { text: "สินค้าลดราคา", value: "สินค้าลดราคา" },
      ],
      filters: {
        q: "",
        priceRangeDefined: "all",
        priceRange: [0, 5000],
        categories: ["s", "a"],
        brands: [],
        ratings: null,
        page: 1,
        perPage: 9,
      },
      catagorySelected: "ทั้งหมด",
      catagorysFilter: [
        "ทั้งหมด",
        "คุกกี้ บิสกิต",
        "ช็อกโกแลต",
        "ลูกอม เยลลี่",
        "โมจิ",
        "มาร์ชแมลโลว์",
        "มันฝรั่ง ถั่ว ธัญพืช",
        "น้ำผลไม้",
        "น้ำอัดลม",
        "ชา กาแฟ",
        "สาหร่าย",
        "ข้าวเกรียบ",
        "อาหารแปรรูป",
        "บะหมี่กึ่งสำเร็จรูป",
        "อื่นๆ",
      ],
      searchQuery: "",
      totalDatas: null,
      itemPerPage: 20,
      itemStart: null,
      itemEnd: null,
    };
  },
  components: {
    cardProduct,
    Pagination,
    sidebarProduct,
    VueContentLoading,
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
    this.loadProduct();
  },
  methods: {
    loadProduct() {
      this.loading = true;
      this.rangeValue = 2000;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const productData = firebaseApp.firestore().collection("products");
    
      var filterCatagory;
      if (this.catagorySelected != "ทั้งหมด") {
        if (this.searchQuery != "" && this.sortBy.value != "สินค้าทั้งหมด") {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where(
              this.sortBy.value == "สินค้าลดราคา" ? "discount" : "productType",
              "==",
              this.sortBy.value == "สินค้าลดราคา" ? true : this.sortBy.value
            )
            .where('show' ,'==' ,true)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (
          this.searchQuery != "" &&
          this.sortBy.value == "สินค้าทั้งหมด"
        ) {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where('show' ,'==' ,true)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (
          this.searchQuery == "" &&
          this.sortBy.value != "สินค้าทั้งหมด"
        ) {
          filterCatagory = productData

            .where("catagory", "==", this.catagorySelected)
            .where(
              this.sortBy.value == "สินค้าลดราคา" ? "discount" : "productType",
              "==",
              this.sortBy.value == "สินค้าลดราคา" ? true : this.sortBy.value
            )
            .where('show' ,'==' ,true)
        } else {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where('show' ,'==' ,true)
            .orderBy("createAt", "desc");
        }
      } else {
        if (this.searchQuery != "" && this.sortBy.value != "สินค้าทั้งหมด") {
          filterCatagory = productData
            .where(
              this.sortBy.value == "สินค้าลดราคา" ? "discount" : "productType",
              "==",
              this.sortBy.value == "สินค้าลดราคา" ? true : this.sortBy.value
            )
            .where('show' ,'==' ,true)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (
          this.searchQuery != "" &&
          this.sortBy.value == "สินค้าทั้งหมด"
        ) {
          filterCatagory = productData
          .where('show' ,'==' ,true)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (
          this.searchQuery == "" &&
          this.sortBy.value != "สินค้าทั้งหมด"
        ) {
          filterCatagory = productData
          .where(
            this.sortBy.value == "สินค้าลดราคา" ? "discount" : "productType",
            "==",
            this.sortBy.value == "สินค้าลดราคา" ? true : this.sortBy.value
          )
          .where('show' ,'==' ,true)
        } else {
          filterCatagory = productData.where('show' ,'==' ,true).orderBy("createAt", "desc")
        }
      }

      return filterCatagory
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
            var queryRef = filterCatagory.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = filterCatagory.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  id: doc.id,
                  name: doc.data().name,
                  price: doc.data().price,
                  sale: doc.data().sale,
                  discount: doc.data().discount,
                  catagory: doc.data().catagory,
                  productID: doc.data().productID,
                  stock: doc.data().stock,
                  productType: doc.data().productType,
                  brand: doc.data().brand,
                  image: doc.data().image,
                  detail: doc.data().detail,
                  productEXP: doc.data().productEXP,
                  sold: doc.data().sold,
                  rating: doc.data().rating,
                  ratingCount: doc.data().ratingCount,
                  weight: doc.data().weight,
                  createAt: doc.data().createAt,
                  updateAt: doc.data().updateAt,
                };

                items.push(setData);
              });
              this.loading = false;
              this.dataList = items;
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
    loadMore(page) {
       window.scrollTo(0, 0);
      this.$store.dispatch("changePage", page);
      if (this.rangeValue != this.rangeOptions.max) {
        this.checkedPriceSelect(this.rangeValue);
      } else {
        this.loadProduct();
      }
    },
    detailPage(data) {
      this.$router.push("/product-detail/" + data.id);
    },
    changeType(type) {
      this.sortBy = type;
      this.loadProduct();
    },
    searchProduct(value) {
      this.searchQuery = value;
      this.loadProduct();
    },
    changeCatagory(value) {
      
      this.catagorySelected = value;
      this.loadProduct();
    },
    checkedPriceSelect(value) {
      this.loading = true;
      this.rangeValue = value;
      this.catagorySelected = "ทั้งหมด";
      this.searchQuery = "";
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const productData = firebaseApp.firestore().collection("products");

      var filterPrice = productData.where("price", "<=", value).where('show' ,'==' ,true)

      return filterPrice
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
            var queryRef = filterPrice.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = filterPrice.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  id: doc.id,
                  name: doc.data().name,
                  price: doc.data().price,
                  sale: doc.data().sale,
                  discount: doc.data().discount,
                  catagory: doc.data().catagory,
                  productID: doc.data().productID,
                  stock: doc.data().stock,
                  productType: doc.data().productType,
                  brand: doc.data().brand,
                  image: doc.data().image,
                  detail: doc.data().detail,
                  productEXP: doc.data().productEXP,
                  sold: doc.data().sold,
                  rating: doc.data().rating,
                  ratingCount: doc.data().ratingCount,
                  weight: doc.data().weight,
                  createAt: doc.data().createAt,
                  updateAt: doc.data().updateAt,
                };

                items.push(setData);
              });
              this.loading = false;
              this.dataList = items;
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
  },
};
</script>


<style scoped>
.ecommerce-header-items {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
.ecommerce-header-items .result-toggler {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 2px;
}
@media (max-width: 991.98px) {
  .ecommerce-header-items .result-toggler .search-results {
    display: none;
  }
}
@media (min-width: 992px) {
  .d-lg-none {
    display: none !important;
  }
}
.btn-view svg {
  margin-top: 6px;
}
.scroll-area {
  position: relative;
  margin: auto;
  width: 400px;
  height: 300px;
}
</style>
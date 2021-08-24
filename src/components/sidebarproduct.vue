<template>
  <div class="sidebar-detached sidebar-left">
    <div class="sidebar">
      <div class="sidebar-shop" :class="{ show: mqShallShowLeftSidebar }">
        <b-row>
          <b-col cols="12">
            <h6 class="filter-heading d-none d-lg-block">ฟิลเตอร์</h6>
          </b-col>
        </b-row>

        <b-card class="card-sidebar-filter">
          <div class="ecommerce-searchbar mt-3">
            <b-row>
              <b-col cols="12">
                <b-form @submit.prevent="searchProduct(searchP)">
                  <b-input-group class="input-group-merge">
                    <b-form-input
                      v-model="searchP"
                      placeholder="ค้นหาสินค้า"
                      class="search-product"
                    />
                    <b-input-group-append
                      is-text
                      @click="searchProduct(searchP)"
                      class="pointer"
                    >
                      <i class="fas fa-search" />
                    </b-input-group-append>
                  </b-input-group>
                </b-form>
              </b-col>
            </b-row>
          </div>

          <div class="price-slider mt-3">
            <h6 class="filter-title">กำหนดช่วงราคา</h6>
            <div class="text-center">
              <span class="text-small">0 - {{rangeValue}} บาท</span>
            </div>
            
            <vue-slider v-model="rangeValue" v-bind="rangeOptions" />
            <div class="text-center mt-3">
              <b-button variant="primary" @click="searchByPrice(rangeValue)"
                >ค้นหาราคา</b-button
              >
            </div>
          </div>

          <div class="product-categories mt-4 mb-4">
            <h6 class="filter-title bold">หมวดหมู่สินค้า</h6>
            <b-form-radio-group
              v-model="selectedCatagory"
              class="categories-radio-group"
              stacked
              :options="catagorys"
              @change="changeCatagory"
            />
          </div>
          
          <!-- <div class="ratings">
            <h6 class="filter-title bold">คะแนนสินค้า</h6>
            <div
              v-for="rating in filterOptions.ratings"
              :key="rating.rating"
              class="ratings-list"
            >
              <b-link>
                <div class="d-flex">
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="fa fa-star"
                    size="17"
                    :class="[
                      { 'fill-current': star <= rating.rating },
                      star <= rating.rating ? 'text-warning' : 'text-muted',
                    ]"
                  />
                </div>
              </b-link>
            </div>
          </div> -->

        </b-card>
      </div>
    </div>
    <div
      class="body-content-overlay"
      :class="{ show: mqShallShowLeftSidebar }"
      @click="$emit('update:mq-shall-show-left-sidebar', false)"
    />
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  name: "sidebarProduct",
  components: {
    VueSlider,
  },
  methods: {
    searchProduct(value) {
      this.$emit("searchValue", value);
    },
    changeCatagory(value) {
      this.$emit("changeCatagory", value);
    },
    searchByPrice(value) {
      this.$emit("checkPrice", value);
    },
  },
  data() {
    return {
      filterOptions:{
        ratings : [
        { rating : 5},
        { rating :4},
        { rating : 3},
        { rating : 2},
        { rating : 1}
      ]
      }
       
      
    };
  },

  props: ["mqShallShowLeftSidebar", "searchP", "catagorys", "selectedCatagory","rangeValue","rangeOptions"],
};
</script>

<style lang="scss" scoped>
</style>

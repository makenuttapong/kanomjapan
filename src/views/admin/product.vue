<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fa fa-cookie-bite" color="#7367f0" /> สินค้า
      </h5>

      <div class="addData" v-if="!loading">
        <b-button @click="toggleModal('add', '')" variant="primary"
          ><span class="d-none d-sm-inline">เพิ่มสินค้า </span>
          <i class="fa fa-plus-circle"
        /></b-button>
      </div>
      <div class="mb-3 mx-2">
        <b-row>
          <!-- Per Page -->
          <b-col
            cols="12"
            lg="3"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1"
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

          <b-col cols="12" lg="6" md="6" class="d-md-none">
            <div class="mb-3 text-right custom-filters">
              <b-button
                size="sm"
                variant="outline-info"
                v-b-toggle="'collapse-filter'"
                class="collapse-icon"
                >ฟิลเตอร์
                <div class="col-1 icon-coll d-inline">
                  <i class="fa fa-chevron-up icon-coll-open-filter" />
                </div>
              </b-button>
            </div>

            <b-collapse id="collapse-filter">
              <div class="d-flex align-items-center justify-content-end mb-1">
                <label class="catagory-width">หมวดหมู่</label>
                <b-form-select
                  id="product-catagory"
                  v-model="catagorySelected"
                  :clearable="false"
                  :options="catagorysFilter"
                  @change="changeCatagory"
                  class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
                />
              </div>
              <div class="d-flex align-items-center justify-content-start mb-1">
                <label class="catagory-width">ประเภท</label>
                <b-form-select
                  id="product-type"
                  v-model="typeSelected"
                  :clearable="false"
                  :options="typeFilter"
                  @change="changeType"
                  class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
                />
              </div>
              <div class="d-flex align-items-center justify-content-end">
                <b-form @submit.prevent="searchProduct">
                  <b-input-group class="input-group-merge pr-2">
                    <b-form-input
                      v-model="searchQuery"
                      class="d-inline-block"
                      placeholder="ค้นหาสินค้า"
                      autocomplete="off"
                    />
                    <b-input-group-append
                      is-text
                      @click="searchProduct"
                      class="pointer"
                    >
                      <i class="fas fa-search" />
                    </b-input-group-append>
                  </b-input-group>
                </b-form>
              </div>
            </b-collapse>
          </b-col>

          <b-col cols="12" lg="3" md="6" class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-end mb-1">
              <label class="catagory-width">หมวดหมู่</label>
              <b-form-select
                id="product-catagory"
                v-model="catagorySelected"
                :clearable="false"
                :options="catagorysFilter"
                @change="changeCatagory"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>
          </b-col>

          <b-col cols="12" lg="3" md="6" class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-start mb-1">
              <label class="catagory-width">ประเภท</label>
              <b-form-select
                id="product-type"
                v-model="typeSelected"
                :clearable="false"
                :options="typeFilter"
                @change="changeType"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>
          </b-col>

          <!-- Search -->
          <b-col cols="12" lg="3" md="6" class="d-none d-md-inline">
            <div class="d-flex align-items-center justify-content-end">
              <b-form @submit.prevent="searchProduct">
                <b-input-group class="input-group-merge pr-2">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block"
                    placeholder="ค้นหาสินค้า"
                    autocomplete="off"
                  />
                  <b-input-group-append
                    is-text
                    @click="searchProduct"
                    class="pointer"
                  >
                    <i class="fas fa-search" />
                  </b-input-group-append>
                </b-input-group>
              </b-form>
            </div>
          </b-col>
        </b-row>
      </div>

      <div v-if="loading" class="p-5">
        <vcl-table> </vcl-table>
      </div>

      <div v-if="!loading">
        <b-card-body>
          <div class="text-mute mb-2" v-if="products.length != 0">
            สินค้าที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
          </div>
          <b-table
            :items="products"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            :tbody-tr-class="rowClass"
          >
            <template #cell(image)="row">
              <img
                :src="
                  row.item.image
                    ? row.item.image
                    : require(`@/assets/NoImage.png`)
                "
                width="70px"
                height="70px"
                :class="
                  row.item.stock == 0 ? 'img-gray' : 'custom-show-img-table'
                "
                @click="getDetail(row.item)"
              />
              <span class="fa-stack fa-lg" v-if="row.item.discount">
                <i class="fa fa-certificate fa-stack-2x"></i>
                <i class="fa fa-tag fa-stack-1x fa-inverse"></i>
              </span>
            </template>
            <template #cell(name)="row">
              <div class="pro-name" @click="getDetail(row.item)">
                {{ row.item.name }}
              </div>
              <div class="pro-id">{{ row.item.productID }}</div>
              <div class="pro-star">
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
                          'fill-current':
                            star <=
                            calStar(row.item.rating, row.item.ratingCount),
                        },
                        star <= calStar(row.item.rating, row.item.ratingCount)
                          ? 'text-warning'
                          : 'text-muted',
                      ]"
                    />
                  </li>
                </ul>
              </div>
            </template>
            <template #cell(catagory)="row">
              <div class="pro-catagory">
                {{ formatCatagory(row.item.catagory) }}
              </div>
            </template>
            <template #cell(type)="row">
              <div class="pro-type">
                <span v-if="row.item.productType == ''">-</span>
                <div v-if="row.item.productType == 'สินค้าขายดี'">
                  <b-badge class="status-check-style" pill>สินค้าขายดี</b-badge>
                </div>
                <span v-if="row.item.productType == 'สินค้าแนะนำ'"
                  ><b-badge class="status-wait-style" pill
                    >สินค้าแนะนำ</b-badge
                  ></span
                >
              </div>
            </template>
            <template #cell(price)="row">
              <div class="pro-price">
                <div v-if="!row.item.discount">
                  {{ formatPrice(row.item.price) }} บาท
                </div>
                <div v-if="row.item.discount">
                  <div class="font-dis">
                    {{ formatPrice(row.item.price) }} บาท
                  </div>
                  <div>{{ formatPrice(row.item.sale) }} บาท</div>
                </div>
              </div>
            </template>
            <template #cell(stock)="row">
              <div class="pro-stock">
                <span v-if="row.item.stock == 0" class="wern-text"
                  ><b-badge class="status-cancle-style" pill
                    >สินค้าหมด</b-badge
                  ></span
                >
                <span
                  v-if="row.item.stock < 10 && row.item.stock != 0"
                  class="wern-text"
                >
                  <AlertTriangleIcon size="20" class="mr-1 mb-1" />{{
                    row.item.stock
                  }}
                  ชิ้น</span
                >
                <span v-if="row.item.stock >= 10"
                  >{{ row.item.stock }} ชิ้น</span
                >
              </div>
            </template>
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
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="products.length != 0">
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
                >สินค้าที่ {{ itemStart }} - {{ itemEnd }} จาก
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

    <b-modal
      class="modalClass product-modal"
      id="modal-1"
      :title="formMode == 'add' ? `เพิ่มสินค้า` : `แก้ไขสินค้า`"
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
              <b-col cols="12" lg="3" md="12" class="mb-2">
                <b-form-group
                  label="รูปสินค้า"
                  label-for="product-image"
                  class="mb-2"
                >
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
                      @input="pickFile"
                      v-model="form.image"
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

              <!-- NAME -->

              <b-col lg="9" md="12">
                <b-form-group
                  label="ชื่อสินค้า"
                  label-for="product-name"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Name"
                    rules="required"
                  >
                    <b-form-input
                      id="product-name"
                      v-model="form.name"
                      placeholder="กรอกชื่อสินค้า"
                      autocomplete="off"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <b-col lg="12">
                <b-row>
                  <!-- DETAIL -->
                  <b-col lg="8" md="12">
                    <b-form-group
                      label="รายละเอียดสินค้า"
                      label-for="product-detail"
                      class="mb-2"
                    >
                      <b-form-textarea
                        class="cus-text-area"
                        id="product-detail"
                        v-model="form.detail"
                        rows="3"
                        placeholder="กรอกรายละเอียดของสินค้า"
                      />
                    </b-form-group>
                  </b-col>

                  <!-- PRODUCT ID -->
                  <b-col lg="4" md="12">
                    <b-row>
                      <b-col lg="12" md="12">
                        <b-form-group
                          label="รหัสสินค้า"
                          label-for="product-id"
                          class="mb-2"
                        >
                            <b-form-input
                              id="product-code"
                              v-model="form.productID"
                              placeholder="กรอกรหัสสินค้า"
                              autocomplete="off"
                              disabled
                            />  
                        </b-form-group>
                      </b-col>

                      <!-- discount -->
                      <b-col lg="12" md="12">
                        <b-form-group
                          label="แสดงสินค้า"
                          label-for="product-show"
                          class="mb-2"
                        >
                          <b-form-checkbox
                            id="product-show"
                            switch
                            v-model="form.show"
                          />
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
              <!-- BRAND -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="ยี่ห้อ"
                  label-for="product-brand"
                  class="mb-2"
                >
                  <b-form-input
                    id="product-brand"
                    v-model="form.brand"
                    placeholder="ยี่ห้อสินค้า"
                    autocomplete="off"
                  />
                </b-form-group>
              </b-col>

              <!-- TYPE -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="หมวดหมู่"
                  label-for="product-catagory"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Catagory"
                    rules="required"
                  >
                    <b-form-select
                      id="product-type"
                      v-model="form.catagory"
                      :options="catagorys"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <b-col lg="4" md="12">
                <b-form-group
                  label="ประเภทสินค้า"
                  label-for="product-type"
                  class="mb-2"
                >
                  <b-select
                    id="product-type"
                    v-model="form.productType"
                    :options="productTypes"
                  />
                </b-form-group>
              </b-col>

              <!-- PRICE -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="ราคาสินค้า (บาท)"
                  label-for="product-price"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Price"
                    rules="required"
                  >
                    <b-form-input
                      id="product-total"
                      type="number"
                      v-model.number="form.price"
                      placeholder="กรอกราคาสินค้า"
                      min="0"
                      autocomplete="off"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <!-- discount -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="ลดราคา"
                  label-for="product-discount"
                  class="mb-2"
                >
                  <b-form-checkbox
                    id="product-discount"
                    switch
                    v-model="form.discount"
                  />
                </b-form-group>
              </b-col>

              <!-- PRICE -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="ราคาที่เหลือ"
                  label-for="product-sale"
                  class="mb-2"
                >
                  <b-form-input
                    v-if="form.discount"
                    id="product-sale"
                    type="number"
                    v-model.number="form.sale"
                    placeholder="กรอกราคาที่เหลือ"
                    min="0"
                    autocomplete="off"
                  />
                  <b-form-input
                    v-if="!form.discount"
                    id="product-sale"
                    type="number"
                    v-model="form.sale"
                    disabled
                    autocomplete="off"
                  />
                </b-form-group>
              </b-col>

              <!-- stock -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="สต๊อกสินค้า"
                  label-for="product-stock"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Stock"
                    rules="required"
                  >
                    <b-form-input
                      type="number"
                      id="product-stock"
                      v-model.number="form.stock"
                      placeholder="กรอกสต๊อกสินค้า"
                      autocomplete="off"
                      min="0"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <!-- EXP -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="วันหมดอายุ"
                  label-for="product-stock"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Product EXP"
                    rules="required"
                  >
                      <b-form-input
                      id="product-exp"
                      v-model.number="form.productEXP"
                      placeholder="กรอกวันหมดอายุสินค้า"
                      autocomplete="off"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <!-- weight -->
              <b-col lg="4" md="12">
                <b-form-group
                  label="น้ำหนัก (กรัม:หน่วย)"
                  label-for="product-weight"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Weight"
                    rules="required"
                  >
                    <b-form-input
                      type="number"
                      id="product-weight"
                      v-model.number="form.weight"
                      placeholder="น้ำหนักสินค้า"
                      min="0"
                      :state="errors.length > 0 ? false : null"
                      autocomplete="off"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
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

              <b-col cols="12" class="mt-3">
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

    <b-modal id="modal-delete" hide-footer size="md" title="ลบสินค้า">
      <template>
        <div class="center">แน่ใจหรือว่าต้องการลบสินค้านี้ ?</div>
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
import { VclTable } from "vue-content-loading";
import Pagination from "../../components/pagination";
import moment from "moment";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "../../helper/validations";
import { AlertTriangleIcon, UploadIcon } from "vue-feather-icons";
import "../../assets/scss/style.scss";

export default {
  name: "product",
  components: {
    VclTable,
    Pagination,
    AlertTriangleIcon,
    ValidationProvider,
    ValidationObserver,
    UploadIcon,
  },
  data() {
    return {
      required,
      products: [],
      loading: false,
      preview: "",
      itemSelected: {},
      formMode: "",
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
      form: {
        name: "",
        image: "",
        productID: "",
        brand: "",
        stock: null,
        productType: "",
        catagory: "",
        weight: null,
        productEXP: "",
        discount: false,
        detail: "",
        price: null,
        sale: null,
        moreImages: [],
      },
      defaultImage: "",
      searchQuery: "",
      catagorys: [
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
      productTypes: ["", "สินค้าขายดี", "สินค้าแนะนำ"],
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
      typeSelected: "ทั้งหมด",
      typeFilter: ["ทั้งหมด", "สินค้าขายดี", "สินค้าแนะนำ"],
      fields: [
        { key: "image" },
        { key: "name", sortable: true },
        { key: "catagory", sortable: true },
        { key: "type", sortable: true },
        { key: "price", sortable: true },
        { key: "stock", sortable: true },
        { key: "actions" },
      ],
      nextProductID : 'KJ00001'
    };
  },
  created() {
    this.loadProduct();
   
  },
  methods: {
    // async LoadsearchProduct(searchValue) {
    //      this.loading = true;
    //   const postRef = firebaseApp.firestore().collection("products");

    //   const titles = postRef
    //     .where("name", ">=", searchValue)
    //     .where("name", "<=", searchValue + "\uf8ff")
    //     .get();
    //   const titlesR = postRef
    //     .where("productID", ">=", searchValue)
    //     .where("productID", "<=", searchValue + "\uf8ff")
    //     .get();

    //   const [titleSnap, titlesRSnap] = await Promise.all([titles, titlesR]);

    //   var responseData = titleSnap.docs.concat(titlesRSnap.docs);

    //       let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
    //       let last = document.docs[indexOf];
    //       var itemCount = document.docs.length;
    //       var page = this.$store.state.currentP + 1;
    //       var start = page * this.itemPerPage - (this.itemPerPage - 1);
    //       var end = Math.min(start + this.itemPerPage - 1, itemCount);
    //       this.itemStart = start;
    //       this.itemEnd = end;
    //       this.totalDatas = itemCount;
    //       if (last) {
    //         var queryRef = responseData.startAt(last).limit(this.itemPerPage);
    //       } else {
    //         queryRef = responseData.limit(this.itemPerPage);
    //       }

    //   var items = [];
    //   queryRef.forEach((doc) => {
    //     var setData = {
    //               uid: doc.id,
    //               name: doc.data().name,
    //               price: doc.data().price,
    //               newPrice: doc.data().newPrice,
    //               discount: doc.data().discount,
    //               productID: doc.data().productID,
    //               type: doc.data().type,
    //               image: doc.data().image,
    //               detail: doc.data().detail,
    //               createAt: doc.data().createAt
    //                 ? this.formatDate(doc.data().createAt)
    //                 : "",
    //               orginalCreateFormat: doc.data().createAt
    //                 ? doc.data().createAt
    //                 : "",
    //               updateAt: doc.data().updateAt,
    //             };
    //             items.push(setData);
    //   })
    //    this.loading = false;
    //     this.products = items;
    // },
    loadProduct() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const productData = firebaseApp.firestore().collection("products");

      var filterCatagory;
      if (this.catagorySelected != "ทั้งหมด") {
        if (this.searchQuery != "" && this.typeSelected != "ทั้งหมด") {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where("productType", "==", this.typeSelected)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (this.searchQuery != "" && this.typeSelected == "ทั้งหมด") {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (this.searchQuery == "" && this.typeSelected != "ทั้งหมด") {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .where("productType", "==", this.typeSelected);
        } else {
          filterCatagory = productData
            .where("catagory", "==", this.catagorySelected)
            .orderBy("createAt", "desc");
        }
      } else {
        if (this.searchQuery != "" && this.typeSelected != "ทั้งหมด") {
          filterCatagory = productData
            .where("productType", "==", this.typeSelected)
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (this.searchQuery != "" && this.typeSelected == "ทั้งหมด") {
          filterCatagory = productData
            .where("name", ">=", this.searchQuery)
            .where("name", "<=", this.searchQuery + "\uf8ff");
        } else if (this.searchQuery == "" && this.typeSelected != "ทั้งหมด") {
          filterCatagory = productData.where(
            "productType",
            "==",
            this.typeSelected
          );
        } else {
          filterCatagory = productData.orderBy("createAt", "desc");
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
                  uid: doc.id,
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
                  show: doc.data().show ? doc.data().show : false,
                  ratingCount: doc.data().ratingCount,
                  weight: doc.data().weight,
                  createAt: doc.data().createAt,
                  updateAt: doc.data().updateAt,
                  moreImage: doc.data().moreImage,
                };

                items.push(setData);
              });
              this.loading = false;
              this.products = items;
              this.lastestProduct()
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
    lastestProduct(){
      const productData = firebaseApp.firestore().collection("products");
      productData.orderBy('createAt','desc').limit(1).get().then(querySnapshot =>{
        querySnapshot.forEach(doc =>{
          var productID = doc.data().productID
          var cutStr =  productID.substring(2,7)
          var proInt = parseInt(cutStr) + 1
          var proStringLength = proInt.toString().length

          if(proStringLength == 1){
            this.nextProductID = 'KJ0000' + proInt
          }else if(proStringLength == 2){
            this.nextProductID = 'KJ000' + proInt
          }
          else if(proStringLength == 3){
            this.nextProductID = 'KJ00' + proInt
          }
           else if(proStringLength == 4){
            this.nextProductID = 'KJ0' + proInt
          }
        })
      })
    },
    getDetail(row) {
      this.$router.push("/admin/product/" + row.uid);
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadProduct();
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadProduct();
    },
    toggleModal(mode, item) {
      this.formMode = mode;
      if (mode == "edit") {
        var items = [];
        item.moreImage.forEach((ele) => {
          var setData = {
            preview: ele ? ele : "",
            image: ele ? ele : "",
          };
          items.push(setData);
        });

        this.form = {
          id: item.uid,
          name: item.name,
          price: item.price,
          discount: item.discount,
          productType: item.productType,
          sale: item.sale,
          image: item.image,
          detail: item.detail,
          productEXP: item.productEXP,
          catagory: item.catagory,
          weight: item.weight,
          stock: item.stock,
          show: item.show,
          brand: item.brand,
          productID: item.productID,
          moreImages: items,
        };
        this.preview = item.image;
        this.itemSelected = item;
        this.$bvModal.show("modal-1");
      } else if (mode == "add") {
        this.form = {
          name: "",
          image: "",
          productID: this.nextProductID,
          brand: "",
          stock: null,
          weight: null,
          productType: "",
          catagory: "",
          productEXP: "",
          discount: false,
          detail: "",
          show: true,
          price: null,
          sale: null,
          moreImages: [],
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
    pickFile() {
      let input = this.$refs.refInputEl;
      let file = input.files;
      this.fileUpload = file[0];
      //800k = 0.8 byte || 800000
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
    closeModal() {
      this.$bvModal.hide("modal-1");
    },
    addData(data) {
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
        var formData = {
          name: data.name,
          price: data.price,
          sale: data.sale,
          stock: data.stock,
          catagory: data.catagory,
          discount: data.discount,
          detail: data.detail,
          productID: data.productID,
          brand: data.brand,
          weight: data.weight,
          sold: 0,
          rating: 0,
          ratingCount: 0,
          ratingSearch : 0,
          show: data.show,
          productEXP: data.productEXP,
          productType: data.productType,
          updateAt: new Date(),
          createAt: new Date(),
          moreImage: values,
        };

        var imgFile = data.image;
        if (imgFile != "") {
          var timestamp = new Date();
          const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์

          firebaseApp
            .storage()
            .ref("imageProduct")
            .child(filename)
            .put(imgFile)
            .then((response) => {
              response.ref.getDownloadURL().then((photoURL) => {
                formData.image = photoURL;

                const productRef = firebaseApp
                  .firestore()
                  .collection("products");
                return productRef
                  .add(formData)
                  .then(() => {
                    this.loading = false;
                    this.$toast.success(`เพิ่มสินค้าเรียบร้อย`, {
                      position: "top-right",
                      closeOnClick: true,
                      hideProgressBar: true,
                      timeout: 3000,
                      icon: "fa fa-check-circle",
                    });
                    this.loadProduct();
                  })
                  .catch((err) => {
                    this.loading = false;
                    this.$toast.error(`เพิ่มสินค้าไม่สำเร็จ`, {
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
      data.moreImages.forEach((ele) => {
        if (typeof ele.image === "object") {
          var imageData = this.uploadImageAsPromise(ele.image);
          item.push(imageData);
        } else if (ele.image != "") {
          item.push(ele.image);
        }
      });

      Promise.all(item).then((values) => {
        this.itemSelected.moreImage.map((ele, index) => {
          if (ele != values[index] && ele != "") {
            this.deleteOldImage(ele);
          }
        });

        var formData = {
          name: data.name,
          discount: data.discount,
          price: data.price,
          sale: data.sale,
          stock: data.stock,
          catagory: data.catagory,
          productID: data.productID,
          brand: data.brand,
          weight: data.weight,
          show: data.show,
          productEXP: data.productEXP,
          productType: data.productType,
          detail: data.detail,
          updateAt: new Date(),
          moreImage: values,
        };
        var imgFile = data.image;

        if (imgFile != "" && imgFile != this.itemSelected.image) {
          var timestamp = new Date();
          const filename = timestamp.valueOf().toString(); //สุ่มชื่อไฟล์

          firebaseApp
            .storage()
            .ref("imageProduct")
            .child(filename)
            .put(imgFile)
            .then((response) => {
              response.ref.getDownloadURL().then((photoURL) => {
                formData.image = photoURL;
                this.deleteOleImage();
                this.updateData(formData, data.id);
              });
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          formData.image = data.image;
          this.updateData(formData, data.id);
        }
      });
    },
    updateData(formData, id) {
      const productRef = firebaseApp.firestore().doc("products/" + id);
      return productRef
        .update(formData)
        .then(() => {
          this.loading = false;
          this.$toast.success(`แก้ไขสินค้าเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadProduct();
        })
        .catch((err) => {
          this.loading = false;

          this.$toast.error(`แก้ไขสินค้าไม่สำเร็จ`, {
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

      this.itemSelected.moreImage.map((ele) => {
        if (ele != "") {
          this.deleteOldImage(ele);
        }
      });

      this.deleteOleImage();

      const productRef = firebaseApp
        .firestore()
        .doc("products/" + this.itemSelected.uid);
      return productRef
        .delete()
        .then(() => {
          this.loading = false;
          this.$toast.success(`ลบสินค้าเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadProduct();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`ลบสินค้าไม่สำเร็จ`, {
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
    searchProduct() {
      this.loadProduct();
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
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY");
      return formatTimeShow;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatCatagory(value) {
      var str = value;
      return str.replace(/\s/g, ", ");
    },
    changeCatagory(item) {
      this.catagorySelected = item;
      this.loadProduct();
    },
    changeType(item) {
      this.typeSelected = item;
      this.loadProduct();
    },
    calStar(total, ratingCount) {
      return (total / ratingCount).toFixed(1);
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
    deleteOldImage(imgDel) {
      firebaseApp.storage().refFromURL(imgDel).delete();
    },
    rowClass(item) {
      if (item.show == true) {
        return "showItem";
      } else {
        return "notShowItem";
      }
    },
    uploadImageAsPromise(imageFile) {
      return new Promise(function (resolve, reject) {
        let randomName = (
          Math.random().toString(36).substring(2, 16) +
          Math.random().toString(36).substring(2, 16)
        ).toUpperCase();

        var storageRef = firebaseApp
          .storage()
          .ref("/imageProduct/" + randomName);

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
.custom-control-input {
  cursor: pointer !important;
}
#modal-1 {
  padding-left: 0px !important;
}
.pro-name {
  min-width: 200px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pro-name:hover {
  cursor: pointer;
  color: #7367f0;
}
.pro-id {
  margin-top: 2px;
  font-size: 13px;
  color: #7367f0;
}
.pro-type .badge {
  font-weight: 500;
}

.pro-price {
  width: 80px;
}
.pro-stock {
  width: 65px;
}
.font-dis {
  color: gray;
  font-size: 13px;
  text-decoration: line-through;
  text-decoration-color: gray;
}
.pro-star ul {
  margin-bottom: 0rem !important;
}
.catagory-width {
  width: 105px;
}
.wern-text {
  color: orange;
}
#product-detail {
  min-height: 50px;
  height: 120px;
}
::v-deep .notShowItem {
  background-color: rgba(0, 0, 0, 0.075) !important;
}
::v-deep .showItem:hover {
  background-color: rgba(95, 37, 255, 0.075) !important;
}

</style>
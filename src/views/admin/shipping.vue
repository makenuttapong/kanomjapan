<template>
  <b-card class="overflow-hidden">
    <h5 class="mb-4">
      <i class="fa fa-clipboard-list" color="#7367f0" /> รายการสั่งซื้อสินค้า
    </h5>

    <div class="addData" v-if="!loading">
      <b-button @click="toggleModal('add', '')" variant="primary"
        ><span class="d-none d-sm-inline">เพิ่มรายการสั่งซื้อ </span>
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

        <b-col cols="12" lg="4" md="6" class="d-none d-md-inline">
          <div class="d-flex align-items-center justify-content-end mb-1">
            <label>สถานะ</label>
            <b-select
              v-model="statusFilter"
              :options="filterStatus"
              :clearable="false"
              @change="changeStatus"
              class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
            />
          </div>
        </b-col>

        <!-- Search -->
        <b-col cols="12" lg="5" md="6" class="d-none d-md-inline">
          <div class="d-flex align-items-center justify-content-end">
            <b-form @submit.prevent="searchShippingID">
              <b-input-group class="input-group-merge pr-2">
                <b-form-input
                  v-model="searchQuery"
                  class="d-inline-block"
                  placeholder="ค้นหาออเดอร์"
                  autocomplete="off"
                />
                <b-input-group-append
                  is-text
                  @click="searchShippingID"
                  class="pointer"
                >
                  <i class="fas fa-search" />
                </b-input-group-append>
              </b-input-group>
            </b-form>
          </div>
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
              <label>สถานะ</label>
              <b-select
                v-model="statusFilter"
                :options="filterStatus"
                :clearable="false"
                @change="changeStatus"
                class="per-page-selector d-inline-block mx-50 ml-2 mr-2"
              />
            </div>

            <div class="d-flex align-items-center justify-content-end">
              <b-form @submit.prevent="searchShippingID">
                <b-input-group class="input-group-merge pr-2">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block"
                    placeholder="ค้นหาไอดี"
                    autocomplete="off"
                  />
                  <b-input-group-append
                    is-text
                    @click="searchShippingID"
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
        <div class="text-mute mb-2" v-if="orderShipping.length != 0">
          รายการสั่งซื้อที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
        </div>

        <b-table
          :items="orderShipping"
          :fields="fields"
          :hover="true"
          responsive
          show-empty
          empty-text="ไม่พบข้อมูล"
          empty-filtered-text="ไม่พบข้อมูล"
          tbody-tr-class="tableHover"
        >
          <template #cell(orderID)="row">
            <div class="orderId-width">
              <span class="color-primary">
                <PackageIcon size="18" class="mb-1 mr-1" />{{
                  row.item.shippingID
                }}
              </span>
            </div>
          </template>

          <template #cell(company)="row">
            {{ row.item.companyName }}
          </template>

          <template #cell(status)="row">
            <div v-if="row.item.status == 'อยู่ระหว่างการสั่งซื้อ'">
              <b-badge class="status-wait-style" pill
                ><i class="fa fa-clock" /> {{ row.item.status }}</b-badge
              >
            </div>
            <div v-if="row.item.status == 'จ่ายค่าสั่งซื้อสินค้าแล้ว'">
              <b-badge class="status-sent-style" pill
                ><i class="fas fa-credit-card" /> {{ row.item.status }}</b-badge
              >
            </div>
            <div v-if="row.item.status == 'จ่ายค่าขนส่งสินค้าแล้ว'">
              <b-badge class="status-ready-style" pill
                ><i class="fas fa-ship" /> {{ row.item.status }}</b-badge
              >
            </div>
            <div v-if="row.item.status == 'ได้รับรับสินค้าแล้ว'">
              <b-badge class="status-check-style" pill
                ><i class="fa fa-check" /> {{ row.item.status }}</b-badge
              >
            </div>
          </template>

          <template #cell(price)="row">
            <div class="pro2-price text-small">
              <i class="fas fa-credit-card" />
              {{ row.item.price1 ? formatPrice(row.item.price1) : "-" }}
              บาท
            </div>
            <div class="pro2-price text-small">
              <i class="fas fa-ship" />
              {{ row.item.price2 ? formatPrice(row.item.price2) : "-" }}
              บาท
            </div>
          </template>

          <template #cell(date)="row">
            <div class="time2-width">
              <div class="text-small">
                <i class="fas fa-calendar" />
                {{ row.item.orderDate ? formatDate(row.item.orderDate) : '-' }}
              </div>
              <div class="text-small">
                <i class="fas fa-calendar-check" />
                {{
                  row.item.receivedDate
                    ? formatDate(row.item.receivedDate)
                    : "-"
                }}
              </div>
            </div>
          </template>

          <template #cell(file)="row">
            <div class="file-width">
              <span @click="getDetail(row.item)" class="link-detail text-small">
                <i class="fa fa-download color-primary" /> ดาวน์โหลด
              </span>
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
      <div class="mx-2" v-if="orderShipping.length != 0">
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
              >รายการสั่งซื้อที่ {{ itemStart }} - {{ itemEnd }} จาก
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

    <b-modal
      class="modalClass product-modal"
      id="modal-1"
      :title="formMode == 'add' ? `เพิ่มรายการสั่งซื้อ` : `แก้ไขรายการสั่งซื้อ`"
      hide-footer
      size="lg"
    >
      <template>
        <validation-observer ref="Rules">
          <b-form @submit.prevent="submit">
            <b-row>
              <b-col lg="12" class="mb-1">
                <label>เอกสาร รายการสั่งซื้อ</label>
                <div>
                  <b-button
                    v-if="!form.file"
                    size="sm"
                    variant="outline-success"
                    @click="$refs.refInputEl.$el.click()"
                  >
                    เลือกไฟล์ .xlsx
                  </b-button>
                  <b-button
                    v-if="form.file"
                    size="sm"
                    variant="success"
                    @click="$refs.refInputEl.$el.click()"
                  >
                    เปลี่ยนไฟล์ .xlsx
                  </b-button>
                  <span
                    v-if="form.file && fileName"
                    class="text-small text-mute ml-3"
                    >{{ itemSelected.fileName }}.xlsx</span
                  >
                  <span
                    v-if="form.file && fileName == ''"
                    class="text-small text-mute ml-3"
                    >{{ form.file.name }}</span
                  >
                  <span v-if="!form.file" class="text-small text-mute ml-3"
                    >ยังไม่ได้เลือกไฟล์</span
                  >
                </div>

                <ValidationProvider
                  #default="{ errors }"
                  name="File"
                  rules="required"
                >
                  <b-form-file
                    ref="refInputEl"
                    @input="pickFile"
                    v-model="form.file"
                    accept=".xls , .xlsx"
                    :hidden="true"
                    plain
                    :state="errors.length > 0 ? false : null"
                  />
                  <small class="text-danger d-lg-inline-block d-md-flex mb-2">{{
                    errors[0]
                  }}</small>
                </ValidationProvider>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="ชื่อบริษัทที่สั่งซื้อ"
                  label-for="companyName"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Company Name"
                    rules="required"
                  >
                    <b-form-input
                      id="shipping-name"
                      v-model="form.companyName"
                      placeholder="กรอกชื่อบริษัท"
                      autocomplete="off"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="สถานะการสั่งซื้อ"
                  label-for="status"
                  class="mb-2"
                >
                  <ValidationProvider
                    #default="{ errors }"
                    name="Status"
                    rules="required"
                  >
                    <b-form-select
                      id="status"
                      v-model="form.status"
                      :options="statusOption"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </ValidationProvider>
                </b-form-group>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="ราคาสั่งสั่งซื้อสินค้า (มัดจำ)"
                  label-for="status"
                  class="mb-2"
                >
                  <b-form-input
                    id="product-total"
                    type="number"
                    v-model.number="form.price1"
                    placeholder="กรอกราคาสั่งซื้อสินค้าทั้งหมด"
                    min="0"
                    autocomplete="off"
                  />
                </b-form-group>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="ราคาส่งสินค้ามาไทย (พร้อมเคลียภาษี)"
                  label-for="status"
                  class="mb-2"
                >
                  <b-form-input
                    id="product-total2"
                    type="number"
                    v-model.number="form.price2"
                    placeholder="กรอกราคาส่งสินค้าทั้งหมด"
                    min="0"
                    autocomplete="off"
                  />
                </b-form-group>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="วันที่สั่งซื้อ"
                  label-for="orderDate"
                  class="mb-2"
                >
                  <date-picker
                    v-model="form.orderDate"
                    valueType="format"
                    format="DD-MM-YYYY"
                  ></date-picker>
                </b-form-group>
              </b-col>

              <b-col lg="6">
                <b-form-group
                  label="วันที่ได้รับสินค้า"
                  label-for="received Date"
                  class="mb-2"
                >
                  <date-picker
                    v-model="form.receivedDate"
                    valueType="format"
                    format="DD-MM-YYYY"
                  ></date-picker>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
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

    <b-modal
      id="modal-delete"
      hide-footer
      size="md"
      title="ลบรายการสั่งซื้อสินค้า"
    >
      <template>
        <div class="center">แน่ใจหรือว่าต้องการลบรายการสั่งซื้อนี้ ?</div>
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
  </b-card>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import Pagination from "../../components/pagination";
import { VclTable } from "vue-content-loading";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "../../helper/validations";
import moment from "moment";
import "../../assets/scss/style.scss";
import { PackageIcon } from "vue-feather-icons";

export default {
  name: "pre-order",
  data() {
    return {
      required,
      loading: false,
      preview: "",
      fileName: "",
      searchQuery: "",
      orderShipping: [],
      itemSelected: {},
      formMode: "",
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
      form: {
        file: null,
      },
      statusOption: [
        "อยู่ระหว่างการสั่งซื้อ",
        "จ่ายค่าสั่งซื้อสินค้าแล้ว",
        "จ่ายค่าขนส่งสินค้าแล้ว",
        "ได้รับรับสินค้าแล้ว",
      ],
      statusFilter: "ทั้งหมด",
      filterStatus: [
        "ทั้งหมด",
        "อยู่ระหว่างการสั่งซื้อ",
        "จ่ายค่าสั่งซื้อสินค้าแล้ว",
        "จ่ายค่าขนส่งสินค้าแล้ว",
        "ได้รับรับสินค้าแล้ว",
      ],
      fields: [
        { key: "orderID" },
        { key: "file", sortable: true },
        { key: "companyName", sortable: true },
        { key: "status", sortable: true },
        { key: "price" },
        { key: "date", sortable: true },

        { key: "actions" },
      ],
      nextShippingID: "SH00001",
    };
  },
  components: {
    VclTable,
    Pagination,
    ValidationProvider,
    ValidationObserver,
    PackageIcon,
  },
  created() {
    this.loadOrderShiping();
  },
  methods: {
    loadOrderShiping() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const shippingOrderData = firebaseApp
        .firestore()
        .collection("shippingOrder");

      var statusName;
      if (this.statusFilter != "ทั้งหมด") {
        if (this.searchQuery != "") {
          statusName = shippingOrderData
            .where("status", "==", this.statusFilter)
            .where("shippingID", ">=", this.searchQuery)
            .where("shippingID", "<=", this.searchQuery + "\uf8ff");
        } else {
          statusName = shippingOrderData
            .where("status", "==", this.statusFilter)
            .orderBy("createAt", "desc");
        }
      } else {
        if (this.searchQuery != "") {
          statusName = shippingOrderData
            .where("shippingID", ">=", this.searchQuery)
            .where("shippingID", "<=", this.searchQuery + "\uf8ff");
        } else {
          statusName = shippingOrderData.orderBy("createAt", "desc");
        }
      }
      return statusName
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
            var queryRef = statusName.startAt(last).limit(this.itemPerPage);
          } else {
            queryRef = statusName.limit(this.itemPerPage);
          }

          queryRef
            .get()
            .then((querySnapshot) => {
              var items = [];
              querySnapshot.forEach((doc) => {
                var setData = {
                  uid: doc.id,
                  file: doc.data().file,
                  fileName: doc.data().fileName,
                  shippingID: doc.data().shippingID,
                  companyName: doc.data().companyName,
                  status: doc.data().status,
                  price1: doc.data().price1,
                  price2: doc.data().price2,
                  orderDate: doc.data().orderDate,
                  receivedDate: doc.data().receivedDate,
                  createAt: doc.data().createAt,
                  updateAt: doc.data().updateAt,
                };

                items.push(setData);
              });

              this.loading = false;
              this.orderShipping = items;
              this.lastestShipping();
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
    lastestShipping() {
      const shippingData = firebaseApp.firestore().collection("shippingOrder");
      shippingData
        .orderBy("createAt", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var shippingID = doc.data().shippingID;
            var cutStr = shippingID.substring(2, 7);
            var shipInt = parseInt(cutStr) + 1;
            var shipStringLength = shipInt.toString().length;

            if (shipStringLength == 1) {
              this.nextShippingID = "SH0000" + shipInt;
            } else if (shipStringLength == 2) {
              this.nextShippingID = "SH000" + shipInt;
            } else if (shipStringLength == 3) {
              this.nextShippingID = "SH00" + shipInt;
            } else if (shipStringLength == 4) {
              this.nextShippingID = "SH0" + shipInt;
            }
          });
        });
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadOrderShiping();
    },
    closeModal() {
      this.fileName = "";
      this.form.file = null;
      this.$bvModal.hide("modal-1");
    },
    toggleModal(mode, item) {
      this.formMode = mode;
      if (mode == "edit") {
        this.form = {
          file: item.file,
          companyName: item.companyName,
          status: item.status,
          price1: item.price1,
          price2: item.price2,
          orderDate: item.orderDate ? this.formatDate(item.orderDate) : "",
          receivedDate: item.receivedDate
            ? this.formatDate(item.receivedDate)
            : "",
        };
        console.log(this.form);
        this.itemSelected = item;
        this.fileName = item.fileName;
        this.$bvModal.show("modal-1");
      } else if (mode == "add") {
        this.form = {
          file: null,
          companyName: "",
          status: "อยู่ระหว่างการสั่งซื้อ",
          price1: null,
          price2: null,
          orderDate: "",
          receivedDate: "",
        };
        this.fileName = "";
        this.$bvModal.show("modal-1");
      } else if (mode == "delete") {
        this.itemSelected = item;
        this.$bvModal.show("modal-delete");
      }
    },
    pickFile() {
      var XLSX = require("xlsx");
      let input = this.$refs.refInputEl;
      let file = input.files;
      this.fileUpload = file[0];

      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          var data = e.target.result;
          var workbook = XLSX.read(data, { type: "binary" });
          let sheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[sheetName];
          let rowObject = XLSX.utils.sheet_to_row_object_array(worksheet);
          const finalJsonData = JSON.stringify(rowObject, undefined, 4);
          this.preview = finalJsonData;
        };
        reader.readAsBinaryString(file[0]);
        this.fileName = "";
        this.form.file = file[0];
      }
    },
    submit() {
      this.$refs.Rules.validate().then((success) => {
        if (success) {
          if (this.formMode == "add") {
            this.addData(this.form);
            this.closeModal();
          } else if (this.formMode == "edit") {
            this.editData(this.form);
            this.closeModal();
          }
        }
      });
    },
    addData(data) {
      this.loading = true;

      var dateToTimeStame1 = "";
      if (data.orderDate != "") {
        var preFormat = moment(data.orderDate, "DD/MM/YYYY");
        var format = moment(preFormat).format("MM/DD/YYYY");
        dateToTimeStame1 = new Date(Date.parse(format));
      }

      var dateToTimeStame2 = "";
      if (data.receivedDate != "") {
        var preFormat2 = moment(data.receivedDate, "DD/MM/YYYY");
        var format2 = moment(preFormat2).format("MM/DD/YYYY");
        dateToTimeStame2 = new Date(Date.parse(format2));
      }

      var formData = {
        shippingID: this.nextShippingID,
        companyName: data.companyName,
        status: data.status,
        price1: data.price1,
        price2: data.price2,
        orderDate: dateToTimeStame1,
        receivedDate: dateToTimeStame2,
        createAt: new Date(),
        updateAt: new Date(),
      };

      this.checkIncome(data.status, formData, formData.shippingID);

      firebaseApp
        .storage()
        .ref("shippingFile")
        .child(formData.shippingID + ".xlsx")
        .put(data.file)
        .then((response) => {
          response.ref.getDownloadURL().then((fileURL) => {
            formData.file = fileURL;
            formData.fileName = formData.shippingID;

            const shippingRef = firebaseApp
              .firestore()
              .collection("shippingOrder");
            return shippingRef
              .add(formData)
              .then(() => {
                this.loading = false;
                this.$toast.success(`เพิ่มรายการสั่งซื้อเรียบร้อย`, {
                  position: "top-right",
                  closeOnClick: true,
                  hideProgressBar: true,
                  timeout: 3000,
                  icon: "fa fa-check-circle",
                });
                this.loadOrderShiping();
              })
              .catch((err) => {
                this.loading = false;
                this.$toast.error(`เพิ่มรายการสั่งซื้อไม่สำเร็จ`, {
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
    },
    editData(data) {
      this.loading = true;
      var preFormat = moment(data.orderDate, "DD/MM/YYYY");
      var format = moment(preFormat).format("MM/DD/YYYY");
      var dateToTimeStame = new Date(Date.parse(format));

      var dateToTimeStame2 = "";
      if (data.receivedDate != "") {
        var preFormat2 = moment(data.receivedDate, "DD/MM/YYYY");
        var format2 = moment(preFormat2).format("MM/DD/YYYY");
        dateToTimeStame2 = new Date(Date.parse(format2));
      }

      var formData = {
        companyName: data.companyName,
        status: data.status,
        price1: data.price1,
        price2: data.price2,
        orderDate: dateToTimeStame,
        receivedDate: dateToTimeStame2,
        updateAt: new Date(),
      };

      this.checkIncome(data.status, formData, this.itemSelected.shippingID);

      if (typeof data.file === "object") {
        // มีการเปลี่ยนไฟล์

        //ลบไฟล์เก่า
        this.deleteFile(this.itemSelected.file);

        firebaseApp
          .storage()
          .ref("shippingFile")
          .child(this.itemSelected.shippingID + ".xlsx")
          .put(data.file)
          .then((response) => {
            response.ref.getDownloadURL().then((fileURL) => {
              formData.file = fileURL;
              formData.fileName = this.itemSelected.shippingID;

              const shippingRef = firebaseApp
                .firestore()
                .doc("shippingOrder/" + this.itemSelected.uid);
              return shippingRef
                .update(formData)
                .then(() => {
                  this.loading = false;
                  this.$toast.success(`แก้ไขรายการสั่งซื้อเรียบร้อย`, {
                    position: "top-right",
                    closeOnClick: true,
                    hideProgressBar: true,
                    timeout: 3000,
                    icon: "fa fa-check-circle",
                  });
                  this.loadOrderShiping();
                })
                .catch((err) => {
                  this.loading = false;
                  this.$toast.error(`แก้ไขรายการสั่งซื้อไม่สำเร็จ`, {
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
        // ถ้าใช้ไฟล์เดิม

        const shippingRef = firebaseApp
          .firestore()
          .doc("shippingOrder/" + this.itemSelected.uid);
        return shippingRef
          .update(formData)
          .then(() => {
            this.loading = false;
            this.$toast.success(`แก้ไขรายการสั่งซื้อเรียบร้อย`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-check-circle",
            });
            this.loadOrderShiping();
          })
          .catch((err) => {
            this.loading = false;
            this.$toast.error(`แก้ไขรายการสั่งซื้อไม่สำเร็จ`, {
              position: "top-right",
              closeOnClick: true,
              hideProgressBar: true,
              timeout: 3000,
              icon: "fa fa-exclamation-triangle",
            });
            console.log(err);
          });
      }
    },
    checkIncome(status, data, shipID) {
      const user = firebaseApp.auth().currentUser;
      firebaseApp
        .firestore()
        .doc("users/" + user.uid)
        .get()
        .then((document) => {
          const checkRef = firebaseApp.firestore().collection("incomes");

          if (status == "จ่ายค่าสั่งซื้อสินค้าแล้ว") {
            return checkRef
              .where("orderID", "==", shipID)
              .where("description", "==", "ชำระเงินจากการนำเข้าสินค้า รอบแรก")
              .get()
              .then((querySnapshot) => {
                var size = querySnapshot.size;
                if (size == 0) {
                  var setNewData = {
                    createAt: new Date(),
                    description: "ชำระเงินจากการนำเข้าสินค้า รอบแรก",
                    orderID: shipID,
                    status: "cash-out",
                    price: data.price1 ? data.price1 : 0,
                    userProfile: {
                      image: document.data().image,
                      email: document.data().email,
                      name: document.data().name,
                      role: document.data().role,
                      userID: document.id,
                    },
                  };
                  checkRef.add(setNewData);
                } else {
                  var newUpdate = {
                    price: data.price1 ? data.price1 : 0,
                  };
                  querySnapshot.forEach((ele) => {
                    checkRef.doc(ele.id).update(newUpdate);
                  });
                }
              });
          } else if (status == "จ่ายค่าขนส่งสินค้าแล้ว") {
            return checkRef
              .where("orderID", "==", shipID)
              .where("description", "==", "ชำระเงินจากการนำเข้าสินค้า รอบสอง")
              .get()
              .then((querySnapshot) => {
                var size = querySnapshot.size;
                if (size == 0) {
                  var setNewData = {
                    createAt: new Date(),
                    description: "ชำระเงินจากการนำเข้าสินค้า รอบสอง",
                    orderID: shipID,
                    status: "cash-out",
                    price: data.price2 ? data.price2 : 0,
                    userProfile: {
                      image: document.data().image,
                      email: document.data().email,
                      name: document.data().name,
                      role: document.data().role,
                      userID: document.id,
                    },
                  };
                  checkRef.add(setNewData);
                } else {
                  var newUpdate = {
                    price: data.price2 ? data.price2 : 0,
                  };
                  querySnapshot.forEach((ele) => {
                    checkRef.doc(ele.id).update(newUpdate);
                  });
                }
              });
          }
        });
    },
    toggleModalDelete() {
      this.$bvModal.hide("modal-delete");
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
    getDetail(item) {
      window.open(item.file);
    },
    deleteData() {
      this.loading = true;
      this.$bvModal.hide("modal-delete");

      if (this.itemSelected.file) {
        this.deleteFile(this.itemSelected.file);
      }

      const shippingRef = firebaseApp
        .firestore()
        .doc("shippingOrder/" + this.itemSelected.uid);
      return shippingRef
        .delete()
        .then(() => {
          this.loading = false;
          this.$toast.success(`ลบรายการสั่งซื้อสินค้าเรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadOrderShiping();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`ลบรายการสั่งซื้อสินค้าไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    deleteFile(file) {
      firebaseApp.storage().refFromURL(file).delete();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadOrderShiping();
    },
    changeStatus(status) {
      this.statusFilter = status;
      this.loadOrderShiping();
    },
    searchShippingID() {
      this.loadOrderShiping();
    },
  },
};
</script>

<style>
.orderId-width {
  width: 110px;
}
.pro2-price {
  width: 105px;
}
.file-width {
  width: 85px;
}
</style>
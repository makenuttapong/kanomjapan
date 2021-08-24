<template>
  <div>
    <b-card class="overflow-hidden">
      <h5 class="mb-4">
        <i class="fa fa-truck-loading" color="#7367f0" /> ออเดอร์
      </h5>

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
              <b-form @submit.prevent="searchOrderID">
                <b-input-group class="input-group-merge pr-2">
                  <b-form-input
                    v-model="searchQuery"
                    class="d-inline-block"
                    placeholder="ค้นหาออเดอร์"
                    autocomplete="off"
                  />
                  <b-input-group-append
                    is-text
                    @click="searchOrderID"
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
                <b-form @submit.prevent="searchOrderID">
                  <b-input-group class="input-group-merge pr-2">
                    <b-form-input
                      v-model="searchQuery"
                      class="d-inline-block"
                      placeholder="ค้นหาออเดอร์"
                      autocomplete="off"
                    />
                    <b-input-group-append
                      is-text
                      @click="searchOrderID"
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
          <div class="text-mute mb-2" v-if="this.orders.length != 0">
            ออเดอร์ที่ {{ itemStart }} - {{ itemEnd }} จาก {{ totalDatas }}
          </div>
          <b-table
            :items="orders"
            :fields="fields"
            :hover="true"
            responsive
            show-empty
            empty-text="ไม่พบข้อมูล"
            empty-filtered-text="ไม่พบข้อมูล"
            tbody-tr-class="tableHover"
          >
            <template #cell(status)="row">
              <div>
                <div v-if="row.item.status == `รอชำระ`">
                  <b-badge pill class="status-wait-style"
                    ><i class="fa fa-clock" /> {{ row.item.status }}</b-badge
                  >
                </div>
                <div v-if="row.item.status == `รอการตรวจสอบ`">
                  <b-badge pill class="status-checkSlip-style"
                    ><i class="fa fa-search-dollar" />
                    {{ row.item.status }}</b-badge
                  >
                </div>
                <div v-if="row.item.status == `เตรียมจัดส่ง`">
                  <b-badge pill class="status-ready-style">
                    <i class="fa fa-truck-loading" />
                    {{ row.item.status }}</b-badge
                  >
                </div>
                <div v-if="row.item.status == `อยู่ระหว่างการจัดส่ง`">
                  <b-badge pill class="status-sent-style">
                    <i class="fa fa-shipping-fast" />
                    {{ row.item.status }}</b-badge
                  >
                </div>
                <div v-if="row.item.status == `จัดส่งแล้ว`">
                  <b-badge pill class="status-check-style"
                    ><i class="fa fa-check" /> {{ row.item.status }}</b-badge
                  >
                </div>
                <div v-if="row.item.status == `ยกเลิก`">
                  <b-badge pill class="status-cancle-style"
                    ><i class="fa fa-times" /> {{ row.item.status }}</b-badge
                  >
                </div>
              </div>
            </template>
            <template #cell(orderID)="row">
              <div class="orderId-width">
                <span @click="getDetail(row.item)" class="color-primary pointer"
                  ><FileTextIcon size="18" class="mb-1 mr-1" />{{
                    row.item.orderID
                  }}</span
                >
              </div>
            </template>
            <template #cell(listItem)="row">
              <div class="width-list">{{ row.item.listItem }} รายการ</div>
            </template>
            <template #cell(totalPrice)="row">
              <div class="price-width">
                {{ formatPrice(row.item.totalPrice) }} บาท
              </div>
            </template>
            <template #cell(createAt)="row">
              <div
                class="time-width"
                :class="checkTimeOut(row.item) ? 'over-time' : ''"
              >
                {{ formatDate(row.item.createAt) }}
              </div>
            </template>
            <template #cell(updateAt)="row">
              <div
                class="time-width"
                :class="checkTimeOut(row.item) ? 'over-time' : ''"
              >
                {{ formatDate(row.item.updateAt) }}
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
              </b-dropdown>
            </template>
          </b-table>
        </b-card-body>
        <div class="mx-2" v-if="this.orders.length != 0">
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
                >ออเดอร์ที่ {{ itemStart }} - {{ itemEnd }} จาก
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
      :title="formMode == 'edit' ? `แก้ไขออเดอร์ ` + itemSelected.orderID : ``"
      hide-footer
      size="md"
    >
      <template>
        <b-form @submit.prevent="submit">
          <b-row>
            <!-- STATUS -->
            <b-col md="6">
              <b-form-group
                label="สถานะสินค้า"
                label-for="product-status"
                class="mb-2"
              >
                <b-form-select
                  id="product-status"
                  v-model="form.status"
                  :options="optionStatus"
                />
              </b-form-group>
            </b-col>

            <!-- TRUUCK NUMBER -->
            <b-col md="12">
              <b-form-group
                :label="
                  `หมายเลขพัสดุ (` + this.itemSelected.deliverCompany + `)`
                "
                label-for="deliverNumber"
                class="mb-2"
              >
                <b-form-input
                  id="deliverNumber"
                  v-model="form.deliverNumber"
                  autocomplete="off"
                  placeholder="กรอกหมายเลขพัสดุ"
                />
              </b-form-group>
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
      </template>
    </b-modal>
  </div>
</template>

<script>
import firebaseApp from "../../firebase/firebase_app";
import { VclTable } from "vue-content-loading";
import moment from "moment";
import Pagination from "../../components/pagination";
import { FileTextIcon } from "vue-feather-icons";
import "../../assets/scss/style.scss";

export default {
  name: "orders",
  components: {
    VclTable,
    Pagination,
    FileTextIcon,
  },
  data() {
    return {
      orders: [],
      loading: false,
      itemSelected: {},
      formMode: "",
      form: {},
      perPageOptions: ["25", "50", "75"],
      totalDatas: null,
      itemPerPage: 25,
      itemStart: null,
      itemEnd: null,
      searchQuery: "",
      optionStatus: [
        "รอชำระ",
        "รอการตรวจสอบ",
        "เตรียมจัดส่ง",
        "อยู่ระหว่างการจัดส่ง",
        "จัดส่งแล้ว",
        "ยกเลิก",
      ],
      filterStatus: [
        "ทั้งหมด",
        "รอชำระ",
        "รอการตรวจสอบ",
        "เตรียมจัดส่ง",
        "อยู่ระหว่างการจัดส่ง",
        "จัดส่งแล้ว",
        "ยกเลิก",
      ],
      statusFilter: "ทั้งหมด",
      fields: [
        { key: "orderID", sortable: true },
        { key: "status", sortable: true },
        { key: "listItem", sortable: true },
        { key: "totalPrice", sortable: true },
        { key: "createAt", sortable: true },
        { key: "updateAt", sortable: true },
        { key: "actions" },
      ],
    };
  },
  created() {
    this.loadOrder();
  },
  methods: {
    loadOrder() {
      this.loading = true;
      let indexOf = this.itemPerPage * this.$store.state.currentP; //itemperPage = totalitem/limit
      const orderData = firebaseApp.firestore().collection("orders");
      var statusName;
      if (this.statusFilter != "ทั้งหมด") {
        if (this.searchQuery != "") {
          statusName = orderData
            .where("status", "==", this.statusFilter)
            .where("orderID", ">=", this.searchQuery)
            .where("orderID", "<=", this.searchQuery + "\uf8ff");
        } else {
          statusName = orderData
            .where("status", "==", this.statusFilter)
            .orderBy("createAt", "desc");
        }
      } else {
        if (this.searchQuery != "") {
          statusName = orderData
            .where("orderID", ">=", this.searchQuery)
            .where("orderID", "<=", this.searchQuery + "\uf8ff");
        } else {
          statusName = orderData.orderBy("createAt", "desc");
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
                var order = {
                  orderID: doc.data().orderID,
                  uid: doc.id,
                  status: doc.data().status,
                  deliverNumber: doc.data().deliverNumber,
                  deliverCompany:
                    doc.data().deliverCompany != "ฟรี"
                      ? doc.data().deliverCompany
                      : "kerry",
                  listItem: doc.data().items.length,
                  totalPrice: doc.data().totalAll,
                  userID: doc.data().userID,
                  items: doc.data().items,
                  createAt: doc.data().createAt,
                  updateAt: doc.data().updateAt,
                };
                items.push(order);
              });
              this.loading = false;
              this.orders = items;
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
      this.$router.push("/admin/order/" + row.uid);
    },
    changeStatus(item) {
      this.statusFilter = item;
      this.loadOrder();
    },
    changeItemPerPage(item) {
      this.itemPerPage = item;
      this.loadOrder();
    },
    loadMore(page) {
      this.$store.dispatch("changePage", page);
      this.loadOrder();
    },
    toggleModal(mode, item) {
      this.formMode = mode;
      this.itemSelected = item;
      if (mode == "edit") {
        this.form = {
          id: item.uid,
          status: item.status,
          deliverNumber: item.deliverNumber,
        };

        this.$bvModal.show("modal-1");
      }
    },
    closeModal() {
      this.$bvModal.hide("modal-1");
    },
    submit() {
      this.$bvModal.hide("modal-1");
      this.loading = true;
      var formData = {
        status: this.form.status,
        deliverNumber: this.form.deliverNumber,
      };
      var toastName = "";
      if (this.itemSelected.status != this.form.status) {
        toastName = "สถานะ";
        formData.updateAt = new Date();
        if (this.form.status == "เตรียมจัดส่ง") {
          this.checkRemoveStock(this.itemSelected.orderID);
        } else if (this.form.status == "จัดส่งแล้ว") {
          this.checkIncome(this.itemSelected);
        }
      } else {
        toastName = "ข้อมูล";
      }

      const orderRef = firebaseApp.firestore().doc("orders/" + this.form.id);
      return orderRef
        .update(formData)
        .then(() => {
          this.loading = false;
          this.$toast.success(`แก้ไข` + toastName + `เรียบร้อย`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-check-circle",
          });
          this.loadOrder();
        })
        .catch((err) => {
          this.loading = false;
          this.$toast.error(`แก้ไข` + toastName + `ไม่สำเร็จ`, {
            position: "top-right",
            closeOnClick: true,
            hideProgressBar: true,
            timeout: 3000,
            icon: "fa fa-exclamation-triangle",
          });
          console.log(err);
        });
    },
    checkRemoveStock(orderID) {
      var logRef = firebaseApp.firestore().collection("logRemoveStock");
      return logRef
        .where("orderID", "==", orderID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size == 0) {
            // เพิ่ม Data
            var countItemRemove = [];
            this.itemSelected.items.map((ele) => {
              var dataRemove = {
                productIDRef: ele.id,
                quantity: ele.quantity,
              };
              countItemRemove.push(dataRemove);
            });

            var setData = {
              itemRemove: countItemRemove,
              orderID: orderID,
              createAt: new Date(),
            };

            logRef.add(setData);
            // ลบ data
            this.removeItemStock();
          }
        });
    },
    checkIncome(item) {
      firebaseApp
        .firestore()
        .doc("users/" + item.userID)
        .get()
        .then((document) => {
          const checkRef = firebaseApp.firestore().collection("incomes");
          return checkRef
            .where("orderID", "==", item.orderID)
            .get()
            .then((querySnapshot) => {
              var size = querySnapshot.size;
              if (size == 0) {
                var setNewData = {
                  createAt: new Date(),
                  description: "ได้รับเงินจากการซื้อสินค้า",
                  orderID: item.orderID,
                  status: "cash-in",
                  price: item.totalPrice,
                  userProfile: {
                    image: document.data().image,
                    email: document.data().email,
                    name: document.data().name,
                    role: document.data().role,
                    userID: document.id,
                  },
                };
                checkRef.add(setNewData);
              }
            });
        });
    },
    formatDate(date) {
      var time = date.toDate();
      var formatTimeShow = moment(time).format("DD-MM-YYYY HH:mm");
      return formatTimeShow;
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0);
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    searchOrderID() {
      this.loadOrder();
    },
    removeItemStock() {
      this.itemSelected.items.map(async (ele) => {
        var productIDRef = ele.id;
        var qtyRef = ele.quantity;
        await this.updateProductStock(productIDRef, qtyRef);
      });
    },
    updateProductStock(id, qty) {
      const productRef = firebaseApp.firestore().doc("products/" + id);
      return productRef.get().then((ele) => {
        var stockPro = ele.data().stock;
        var soldPro = ele.data().sold;

        var newStock = stockPro - qty;
        var newSold = soldPro + qty;
        var setData = {
          stock: newStock,
          sold: newSold,
        };

        return productRef.update(setData).then(() => {});
      });
    },
    checkTimeOut(item) {
      if (item.status == "รอชำระ") {
        var time = item.createAt.toDate();
        var checkItem = moment(time).format("YYYY-MM-DD 00:00");
        var fomatItem = new Date(checkItem);

        var checkD = moment().subtract(4, "day").format("YYYY-MM-DD 00:00");
        var fomatCheck = new Date(checkD);

        if (fomatItem < fomatCheck) {
          return true;
        }
      }
    },
  },
};
</script>

<style>
.orderId-width {
  width: 110px;
}
.width-list {
  width: 70px;
}
.price-width {
  width: 77px;
}
.time-width.over-time {
  color: #ff4343;
}
</style>
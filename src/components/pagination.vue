<template>
  <div class="overflow-auto">
    <div class="pagination-item">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        @input="updatePage(currentPage)"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["currentPage","totalItem", "itemPerPage", "start", "end"],
  data() {
    return {
      perPage: this.itemPerPage,
    };
  },
  methods: {
    updatePage(page) {
      this.$emit("selectedPage", page - 1);
    },
  },
  computed: {
    rows() {
      return this.totalItem;
    },
  },
};
</script>

<style scoped>
.pagination-item {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.numItem {
  margin-top: 2rem;
}
::v-deep .page-item.active .page-link {
  background-color: #7367f0;
  border-color: #7367f0;
  color: white;
}
::v-deep .page-link,
::v-deep .page-link:hover{
  color:#7367f0;
}
</style>
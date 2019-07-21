<template>
  <Table
    :loading="loading"
    :columns="tableColumns"
    :data="tableList"
    style="margin:0 10px;"
    :max-height="560"
    @on-select="selectHanlder"
    @on-select-cancel="unselectHanlder"
    @on-select-all="selectAllHanlder"
    @on-select-all-cancel="unselectAllHanlder"
  ></Table>
</template>
<script>
import DataBaseUtil from "@/libs/database";

export default {
  name: "TableList",
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  data() {
    return {
      tableList: [], //表
      tableColumns: [
        {
          type: "selection",
          title: "编号",
          width: 45
        },
        {
          title: "表名",
          key: "tableName"
        },
        {
          title: "备注",
          key: "comment"
        }
      ],
      tables: this.value,
      loading: false
    };
  },
  methods: {
    clear(){
      this.tableList = [];
    },
    setProps(props) {
      if (props && props != null) {
        let dbUtil = new DataBaseUtil(props);
        this.loading = true;
        dbUtil.listTable().then(result => {
          result.forEach(item => {
            this.tableList.push({
              tableName: item.table_name,
              comment: item.table_comment,
              _checked: this.tables.findIndex(it => it === item.table_name) >= 0
            });
          });
          this.loading = false;
        },(err)=>{
          this.loading = false;
        });
      }
    },
    selectAllHanlder(selection) {
      this.tables.splice(0, this.tables.length);
      selection.forEach(item => {
        this.tables.push(item.tableName);
      });
      this.$emit("update", this.tables);
    },
    unselectAllHanlder(selection) {
      this.tables.splice(0, this.tables.length);
      this.$emit("update", this.tables);
    },
    unselectHanlder(selection, row) {
      this.tables.splice(this.tables.findIndex(it => it === row.tableName), 1);
      this.$emit("update", this.tables);
    },
    selectHanlder(selection, row) {
      this.tables.push(row.tableName);
      this.$emit("update", this.tables);
    }
  }
};
</script>
<style scoped>
</style>

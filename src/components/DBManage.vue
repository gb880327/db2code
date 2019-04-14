<template>
  <div>
    <div class="row">
      <span class="labelName">数据库类型：</span>
      <Select v-model="type" style="width:200px">
        <Option v-for="item in dbTypeList" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </div>
    <mysql ref="mysql" v-if="type === 'mysql'"></mysql>
  </div>
</template>
<script>
import config from "@/libs/config";
import mysql from "@/components/dbType/mysql";

export default {
  name: "DBManage",
  components: {
    mysql
  },
  data() {
    return {
      height: 0,
      dbTypeList: config.dbType,
      dbList: [],
      type: "mysql"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height - 32;
    }
  },
  methods: {
    clear(){
      this.$refs[this.type].clear();
    },
    getData(){
      let props = this.$refs[this.type].getData();
      if(!props){return false;}
      return {
        dbType: this.type,
        props: props
      };
    },
    setData(data){
      this.type = data.dbType && this.dbTypeList.findIndex(it=>it===data.dbType) >=0 ? data.dbType : this.dbTypeList[0];
      this.$nextTick(()=>{
        this.$refs[this.type].setData(data.props);
      });
    }
  }
};
</script>

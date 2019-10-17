<template>
  <div :style="{height: getHeight+'px'}">
    <div class="left">
      <div class="add" @click="clear">
        <Icon type="ios-add" size="22" />
      </div>
      <Row
        class="item"
        v-for="item,i of $root.dbList"
        :key="i"
        :class="isSelect(item.id) ? 'select' : ''"
      >
        <Col span="20" style="padding-left:10px;cursor: pointer;">
          <span @click="edit(item.id)" style="display:inline-block;width:100%;">{{item.name}}</span>
        </Col>
        <Col span="4" style="text-align:right;">
          <Icon
            type="ios-close-circle-outline"
            class="item-icon"
            color="#f10606"
            @click="onclose(item.id)"
          />
        </Col>
      </Row>
    </div>
    <div class="right">
      <div class="row">
        <span class="labelName">名称：</span>
        <Input v-model="name" placeholder="请输入名称！" style="width: 198px" />
      </div>
      <div class="row">
        <span class="labelName">数据库类型：</span>
        <Select v-model="type" style="width:200px">
          <Option v-for="item in dbTypeList" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </div>
      <mysql ref="mysql" v-if="type === 'mysql'"></mysql>
      <Button type="primary" style="width:300px;" @click="save">保存</Button>
    </div>
  </div>
</template>
<script>
import mysql from "./type/mysql";
import config from "@/libs/config";

export default {
  components: {
    mysql
  },
  data() {
    return {
      height: 0,
      dbTypeList: config.dbType,
      id: "",
      type: "mysql",
      name: ""
    };
  },
  created() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    isSelect(id) {
      return this.id === id;
    },
    edit(id) {
      let item = this.$root.dbList.find(it => it.id === id);
      this.name = item.name;
      this.type = item.type;
      this.id = id;
      this.$refs[this.type].setData(item.props);
    },
    onclose(id) {
      const _this = this;
      this.$confirm("确认删除？", () => {
        let index = _this.$root.dbList.findIndex(it => it.id === id);
        _this.$root.dbList.splice(index, 1);
        this.$root.saveConfig();
        _this.$success(this, "删除成功！");
      });
    },
    clear() {
      this.$refs[this.type].clear();
      this.name = "";
      this.id = "";
    },
    save() {
      if (this.name === "") {
        this.$error(this, "请填写名称！");
        return;
      }
      let props = this.$refs[this.type].getData();
      if (!props || props == null) {
        this.$error(this, "数据库配置为空，保存失败！");
        return;
      }
      let item = {
        id: this.id === "" ? this.$genId() : this.id,
        name: this.name,
        type: this.type,
        props: props
      };
      if (this.id != "") {
        let index = this.$root.dbList.findIndex(it => it.id === this.id);
        this.$root.dbList.splice(index, 1);
      }
      this.$root.dbList.push(item);
      this.$root.saveConfig();
      this.$success(this, "保存成功！");
    }
  }
};
</script>
<style scoped>
@import "./index.css";
</style>

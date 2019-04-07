<template>
  <div>
    <Split v-model="split" :style="{height: getHeight+'px'}">
      <div slot="left" class="split-left">
        <div class="left-opt">
          <Button type="text" style="width:100%;" @click="addItem">新增</Button>
        </div>
        <div class="left-list" :style="{height: (getHeight - 38)+'px'}">
          <ul class="itemList">
            <li v-for="item in dbList" :key="item.id" :id="item.id" @click="itemClick(item)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div slot="right" class="pane split-right" :style="{height:getHeight+'px'}">
        <div class="row">
          <span class="labelName">名称：</span>
          <Input v-model="data.name" placeholder="请输入自定义名称..." style="width: 198px"/>
        </div>
        <div class="row">
          <span class="labelName">数据库类型：</span>
          <Select v-model="data.type" style="width:200px">
            <Option v-for="item in dbTypeList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </div>
        <mysql ref="mysql" v-if="data.type === 'mysql'"></mysql>
        <div class="row">
          <br>
          <span class="labelName"></span>
          <Button type="primary" class="btn" @click="saveItem">保存</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="error" @click="delItem" class="btn" v-if="currentId > 0">删除</Button>
        </div>
      </div>
    </Split>
  </div>
</template>
<script>
import config from "@/libs/config";
import mysql from "@/views/dbType/mysql";

export default {
  components: {
    mysql
  },
  data() {
    return {
      split: 0.2,
      height: 0,
      select: [],
      dbTypeList: config.dbType,
      dbList: [],
      data: {
        name: "",
        type: "mysql"
      },
      currentId: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
    this.init();
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    init() {
      let data = this.$getDataForObj(config.dbList);
      this.dbList = data === "" ? [] : data;
      this.$saveData(config.dbList, this.dbList);
    },
    itemClick(item) {
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        it.className =
          parseInt(it.getAttribute("id")) == item.id ? "selected" : "";
      }
      this.currentId = item.id;
      this.data.name = item.name;
      this.data.type = item.type;
      this.$nextTick(() => {
        this.$refs[item.type].setData(item.props);
      });
    },
    addItem() {
      this.currentId = 0;
      this.data.name = "";
      this.data.type = "mysql";
      this.$refs[this.data.type].clean();
      let list = document
        .getElementsByClassName("itemList")[0]
        .getElementsByTagName("li");
      for (let it of list) {
        it.className = "";
      }
    },
    saveItem() {
      let props = this.$refs[this.data.type].getData();
      if (props) {
        if (this.currentId > 0) {
          let index = this.dbList.findIndex(item => item.id == this.currentId);
          this.dbList[index].name = this.data.name;
          this.dbList[index].type = this.data.type;
          this.dbList[index].props = props;
        } else {
          let id = new Date().getTime();
          this.dbList.push({
            id: id,
            name: this.data.name,
            type: this.data.type,
            props: props
          });
          this.addItem();
        }
        this.$success("保存成功！");
        this.$saveData(config.dbList, this.dbList);
      }
    },
    delItem() {
      let index = this.dbList.findIndex(it => it.id == this.currentId);
      if (index >= 0) {
        this.$confirm("确认删除该数据库配置？", () => {
          this.dbList.splice(index, 1);
          this.$saveData(config.dbList, this.dbList);
          this.addItem();
          this.$success("删除成功！");
        });
      }
    }
  }
};
</script>

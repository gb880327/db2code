<template>
  <div class="layout">
    <Layout>
      <div class="header">
        <span class="title">代码生成工具-2.0</span>
      </div>
      <Content :style="{margin: '55px 0px 0', background: '#fff', height: (height-96)+'px'}">
        <Tabs @on-click="gotoPath" v-model="current">
          <TabPane label="项目" icon="md-cube" name="ProjectManage"></TabPane>
          <TabPane label="数据源" icon="ios-analytics" name="DataSource"></TabPane>
          <TabPane label="模板" icon="ios-browsers-outline" name="TemplateManage"></TabPane>
          <TabPane label="系统设置" icon="ios-browsers-outline" name="Setting"></TabPane>
        </Tabs>
        <router-view ref="view"></router-view>
      </Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src
import config from "@/libs/config";

export default {
  data() {
    return {
      height: document.documentElement.clientHeight,
      current: ""
    };
  },
  created(){
    this.current = this.$getDataForStr("currentPath");
    this.current = this.current == null ? "ProjectManage" : this.current;
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    gotoPath(path) {
      this.$router.push({ path: path });
      this.$saveData("currentPath", path);
    },
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
      this.$nextTick(() => {
        this.$refs.view.height = this.height - 96;
      });
    }
  }
};
</script>
<style>
.title {
  display: inline-block;
  height: 40px;
  padding-left: 40px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-image: url(/img/logo.95452ff1.png);
  background-size: 32px;
  background-position: left 8px;
  background-repeat: no-repeat;
}
.ivu-tabs-bar {
  margin-bottom: 0;
}
.header {
  position: fixed;
  height: 50px;
  line-height: 50px;
  width: 100%;
  background-color: #515a6e;
}
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.menu {
  width: 100%;
  position: fixed;
}
.layout-footer-center {
  text-align: center;
  padding: 10px 0 10px 0;
}
.content {
  border-top: 1px solid #dcdee2;
}
.pane {
  padding: 10px;
}
.split-left {
  border-top: 1px solid #dcdee2;
  border-left: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
}
.split-right {
  padding: 10px 20px;
  border-top: 1px solid #dcdee2;
  border-right: 1px solid #dcdee2;
  border-bottom: 1px solid #dcdee2;
  overflow-y: scroll;
}
.left-list {
  width: 100%;
  overflow-y: scroll;
}
.left-opt {
  border-bottom: 1px solid #dcdee2;
  width: 100%;
  height: 35px;
}
.itemList {
  list-style: none;
  padding: 0;
  margin: 0;
}
.itemList li {
  padding: 5px 10px;
  margin: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: #dcdee2;
  border-radius: 5px;
  color: black;
}
.itemList li:hover {
  background-color: #b0b4bb;
}
.itemList .selected {
  background-color: #515a6c;
  color: #ffffff;
}
.row {
  margin: 10px 0;
}
.col {
  display: inline-block;
}
.labelName {
  display: inline-block;
  min-width: 100px;
  text-align: right;
}
.btn {
  margin: 0 5px;
}
.moduleTitle {
  padding: 4px 10px;
  font-size: 14px;
  font-weight: bold;
  background-color: #b0b4bb69;
  margin-bottom: 2px;
}
.addItem {
  width: 100%;
  font-weight: bold;
}
.tips {
  padding-left: 15px;
}
.tips a {
  color: red;
}
</style>


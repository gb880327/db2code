<template>
  <div id="app">
    <div class="layout">
      <Layout>
        <div class="header">
          <span class="title">代码生成工具-2.0</span>
        </div>
        <Content :style="{background: '#fff', height: (height-120)+'px'}">
          <Tabs @on-click="gotoPath" v-model="current">
            <TabPane label="项目" icon="md-cube" name="project"></TabPane>
            <TabPane label="数据源" icon="ios-analytics" name="dataSource"></TabPane>
            <TabPane label="模板" icon="ios-browsers-outline" name="templateManage"></TabPane>
            <TabPane label="系统设置" icon="ios-cog-outline" name="setting"></TabPane>
          </Tabs>
          <keep-alive>
            <component ref="view" v-bind:is="current"></component>
          </keep-alive>
        </Content>
        <Footer>
          <div class="layout-footer-center">2019 &copy; Rookie</div>
        </Footer>
      </Layout>
    </div>
  </div>
</template>
<script>
import config from "@/libs/config";
const fs = require("fs");

export default {
  data() {
    return {
      height: document.documentElement.clientHeight,
      current: "project"
    };
  },
  created() {
    if (!fs.existsSync(config.dataPath)) {
      fs.mkdir(config.dataPath, err => {
        if (err) {
          this.$error(err);
        }
      });
    }
    if (!fs.existsSync(config.template)) {
      fs.mkdir(config.template, err => {
        if (err) {
          this.$error(err);
        }
      });
    }
    this.current = this.$getDataForStr("currentPath");
    this.current = this.current == null || this.current.startsWith('/') ? "project" : this.current;
    this.gotoPath(this.current);
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    gotoPath(path) {
      this.current = path;
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
.icon-template{
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAmUlEQVQ4y2NgoBbw7Dwh49Z+wpgSDDKDoWLF1SUXHn78TQkGmcFQs/L6wv9A8ODDv//XXpOGQXpAAGQG3KCNN//+n3GGNAzSQzuDXnyBeI8UDNKDYdDlV//+H3mMie9/+A/G2ORAejAMOvH03/9tdzDx9TcQjE0OpGfUoIE06OXX//8ffcTE779DMDY5kB64QVTLtFQrRqgFAL7fvOgdnxBgAAAAAElFTkSuQmCC') !important;
}
.title {
  display: inline-block;
  height: 40px;
  padding-left: 40px;
  margin-left: 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-image: url(assets/logo.png);
  background-size: 32px;
  background-position: left 8px;
  background-repeat: no-repeat;
}
.header {
  /* position: fixed; */
  height: 50px;
  line-height: 50px;
  width: 100%;
  border-radius: 0;
  background-color: #515a6e;
}
.layout {
  background: #f5f7f9;
  position: relative;
  /* border-radius: 4px; */
  overflow: hidden;
}
.menu {
  width: 100%;
  position: fixed;
}
.layout-footer-center {
  text-align: center;
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
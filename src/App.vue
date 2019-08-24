<template>
  <div id="app">
    <div class="layout">
      <Layout>
        <div class="header"></div>
        <Content :style="{background: '#fff', height: (height-4)+'px'}">
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
      </Layout>
    </div>
    <Modal v-model="about" :closable="false">
      <div class="about">
        <Row>
          <Col span="8" style="text-align:right;">
            <img src="./assets/logo.png" width="64" />
          </Col>
          <Col span="16" style="padding-left:30px;">
            <div class="title">{{info.name}}</div>
            <ul>
              <li>版本：{{info.version}}</li>
              <li>Electron: {{info.devDependencies.electron.replace('^','')}}</li>
              <li>node：{{info.nodejs}}</li>
              <li>chrome：{{info.chrome}}</li>
              <li>v8：{{info.v8}}</li>
              <li>iview：{{info.dependencies.iview.replace('^','')}}</li>
              <li>vue：{{info.dependencies.vue.replace('^','')}}</li>
            </ul>
            <div class="copy">2019 &copy; Rookie</div>
          </Col>
        </Row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import config from "@/libs/config";
const fs = require("fs");
const { ipcRenderer } = require("electron");

export default {
  data() {
    return {
      about: false,
      info: {
        name: '',
        version: '',
        nodejs:'',
        chrome:'',
        v8:'',
        dependencies:{iview:'',vue:''},
        devDependencies:{electron:''}
      },
      height: document.documentElement.clientHeight,
      current: "project"
    };
  },
  created() {
    const _this = this;
    ipcRenderer.on("about", (event, args) => {
      _this.about = true;
      let info = require("../package.json");
      _this.info = info;
      let run = process.versions;
      _this.info.nodejs = run.node;
      _this.info.chrome = run.chrome;
      _this.info.v8 = run.v8;
    });

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
    this.current =
      this.current == null || this.current.startsWith("/")
        ? "project"
        : this.current;
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
.icon-template {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABmJLR0QA/wD/AP+gvaeTAAAAmUlEQVQ4y2NgoBbw7Dwh49Z+wpgSDDKDoWLF1SUXHn78TQkGmcFQs/L6wv9A8ODDv//XXpOGQXpAAGQG3KCNN//+n3GGNAzSQzuDXnyBeI8UDNKDYdDlV//+H3mMie9/+A/G2ORAejAMOvH03/9tdzDx9TcQjE0OpGfUoIE06OXX//8ffcTE779DMDY5kB64QVTLtFQrRqgFAL7fvOgdnxBgAAAAAElFTkSuQmCC") !important;
}
.header {
  height: 4px;
  width: 100%;
  border-radius: 0;
  background-color: #2d8cf0;
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
.about {
  padding: 30px;
}
.about .title {
  font-size: 18px;
  font-weight: bold;
}
.about ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}
.about ul li {
  font-size: 14px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.about .copy{
  margin-top:10px;
  font-size: 14px;
}
</style>
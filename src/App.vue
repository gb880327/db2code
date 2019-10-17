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
          this.$error(this, err);
        }
      });
    }
    if (!fs.existsSync(config.template)) {
      fs.mkdir(config.template, err => {
        if (err) {
          this.$error(this, err);
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
@import './assets/index.css';
</style>
<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%', padding: '0 10px'}">
        <Button type="primary" shape="circle" icon="md-home" @click="gotoPath('/')"></Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          icon="ios-briefcase"
          @click="gotoPath('/ProjectManage')"
        >项目管理</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          icon="ios-construct-outline"
          @click="gotoPath('/DBManage')"
        >数据库配置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          icon="md-code-working"
          @click="gotoPath('/TemplateManage')"
        >模板配置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      </Header>
      <Content :style="{margin: '75px 10px 0', background: '#fff', height: (height-116)+'px'}">
        <router-view ref="view" v-if="is_show"></router-view>
      </Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>

    <Modal v-model="setDataPath" title="设置系统配置保存路径！" :mask-closable="false">
      <div style="padding: 10px; text-align:center;">
        <pathChoose @change="changeHanlder" :showLabel="false"></pathChoose>
        <br>
        <Button type="primary" @click="save">保存</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import pathChoose from "@/views/pathChoose";
import config from "@/libs/config";
const { dialog } = require("electron").remote;
const fs = require("fs");

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      height: document.documentElement.clientHeight,
      setDataPath: false,
      dataPath: "",
      is_show: false
    };
  },
  mounted() {
    this.checkPath();
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    gotoPath(path) {
      let tempPath = localStorage.getItem(config.templatePath);
      this.$router.push({ path: path });
    },
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
      this.$nextTick(() => {
        this.$refs.view.height = this.height - 116;
      });
    },
    changeHanlder(path) {
      this.dataPath = path;
    },
    save() {
      if (this.dataPath === "") {
        this.$error("请选择系统配置保存路径！");
        return;
      }
      this.$saveData(config.dataPath, this.dataPath);
      this.setDataPath = false;
      this.is_show = true;
    },
    checkPath() {
      let dataPath = this.$getDataForStr(config.dataPath);
      if (dataPath === "") {
        this.setDataPath = true;
        return;
      }
      this.is_show = true;
      if (!fs.existsSync(dataPath + "/" + config.template)) {
        fs.mkdir(dataPath + "/" + config.template, err => {
          if (err) {
            this.$error(err);
          }
        });
      }
      if (!fs.existsSync(dataPath + "/" + config.project)) {
        fs.mkdir(dataPath + "/" + config.project, err => {
          if (err) {
            this.$error(err);
          }
        });
      }
    }
  }
};
</script>
<style>
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
.labelName {
  display: inline-block;
  min-width: 100px;
  text-align: right;
}
.btn {
  margin: 0 5px;
}
.moduleTitle{
  padding: 4px 10px;
  font-size:14px;
  font-weight: bold;
  background-color: #b0b4bb69;
}
</style>


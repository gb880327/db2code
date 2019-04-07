<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%', padding: '0 10px'}">
        <Button type="primary" shape="circle" icon="md-home" @click="gotoPath('/')"></Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          icon="ios-construct-outline"
          @click="gotoPath('/DBManage')"
          :disabled="dbManage"
        >数据库配置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          icon="md-code-working"
          @click="gotoPath('/TemplateManage')"
          :disabled="templateManage"
        >模板配置</Button>&nbsp;&nbsp;&nbsp;&nbsp;
      </Header>
      <Content :style="{margin: '75px 10px 0', background: '#fff', height: (height-116)+'px'}">
        <router-view ref="view"></router-view>
      </Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>
    <Modal v-model="setTempPath" title="设置模板保存路径！" :mask-closable="false">
      <div style="padding:10px 30px 20px 30px;text-align:center;">
        <Input v-model="tempPath" :readonly="true">
          <Button type="primary" slot="append" @click="selectPath">选择</Button>
        </Input>
        <br>
        <Button type="primary" :disabled="tempPath===''" @click="next">继续</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import config from "@/libs/config";
const { dialog } = require("electron").remote;
const fs = require("fs");

export default {
  data() {
    return {
      height: document.documentElement.clientHeight,
      setTempPath: false,
      tempPath: ""
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  computed: {
    dbManage() {
      return this.$route.path === "/DBManage";
    },
    templateManage() {
      return this.$route.path === "/TemplateManage";
    }
  },
  methods: {
    next() {
      if (!fs.existsSync(this.tempPath)) {
        this.$error("模板路径不存在！");
        return;
      }
      if (!fs.existsSync(this.tempPath + "/template")) {
        fs.mkdir(this.tempPath + "/template", err => {
          if (err) {
            this.$error(err);
          } else {
            this.$saveData(config.templatePath, this.tempPath + "/template");
            this.setTempPath = false;
            this.$router.push({ path: "/TemplateManage" });
          }
        });
      } else {
        this.$saveData(config.templatePath, this.tempPath + "/template");
        this.setTempPath = false;
        this.$router.push({ path: "/TemplateManage" });
      }
    },
    selectPath() {
      let path = dialog.showOpenDialog({ properties: ["openDirectory"] });
      if (path && path.length > 0) {
        this.tempPath = path[0];
      }
    },
    gotoPath(path) {
      if (path === "/TemplateManage") {
        let tempPath = localStorage.getItem(config.templatePath);
        if (!tempPath || tempPath === "" || tempPath == null) {
          this.setTempPath = true;
        } else {
          this.$router.push({ path: path });
        }
      } else {
        this.$router.push({ path: path });
      }
    },
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
      this.$nextTick(() => {
        this.$refs.view.height = this.height - 116;
      });
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
  width: 100px;
  text-align: right;
}
.btn {
  margin: 0 5px;
}
</style>


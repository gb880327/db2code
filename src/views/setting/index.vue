<template>
  <div>
    <Row>
      <Col span="12">
        <div class="row" style="margin: 15px;">
          <pathChoose v-model="dataPath" title="系统数据存储目录" :width="300"></pathChoose>
        </div>
        <div class="row">
          <Button type="primary" @click="save" style="width:300px;margin-left:122px;">保存</Button>
        </div>
      </Col>
      <Col span="12">
        <div class="row">
          <Button @click="importProfile" style="width:45%;">导入配置</Button>&nbsp;&nbsp;
          <Button @click="exportProfile" style="width:45%;">导出配置</Button>
        </div>
      </Col>
    </Row>
    <Modal v-model="modal" title="选择文件路径" :mask-closable="false">
      <div style="text-align: center;margin:27px 0;">
        <pathChoose v-model="outpath" title="文件路径" :width="300" :file="type === 'import'"></pathChoose>
      </div>
      <div slot="footer" style="text-align: right;padding: 8px 10px 8px 0;">
        <Button type="text" @click="cancel">取消</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
const fs = require("fs");
const path = require("path");
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";
import Service from "@/libs/service";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      modal: false,
      dataPath: "",
      orgPath: "",
      disabled: false,
      outpath: "",
      type: "",
      service: new Service()
    };
  },
  created() {
    this.dataPath = config.dataPath;
    this.orgPath = this.dataPath;
  },
  methods: {
    save() {
      if (this.dataPath != this.orgPath) {
        this.$confirm(
          "是否自动转移模板文件？",
          () => {
            let target = path.join(this.dataPath, "template");
            this.service.copyFile(config.template, target, 1).then(ret => {
              if (ret) {
                localStorage.setItem("basePath", this.dataPath);
                location.reload();
              }
            });
          },
          () => {
            localStorage.setItem("basePath", this.dataPath);
            location.reload();
          }
        );
      } else {
        localStorage.setItem("basePath", this.dataPath);
        this.$success("保存成功！", () => {
          location.reload();
        });
      }
    },
    ok() {
      if (this.outpath === "") {
        this.$error("请选择文件路径！");
        return;
      }
      if (this.type === "import") {
        const _this = this;
        this.$confirm("导入配置将会覆盖现有配置信息，是否继续？", () => {
          _this.service.importProfile(_this.outpath).then(ret => {
            if(ret){
              _this.$success("导入成功！");
              _this.cancel();
            }
          });
        });
      } else {
        this.service.exportProfile(this.outpath).then(ret => {
          if (ret) {
            this.$success("导出成功！");
            this.cancel();
          }
        });
      }
    },
    cancel() {
      this.outpath = "";
      this.type = "";
      this.modal = false;
    },
    importProfile() {
      this.modal = true;
      this.type = "import";
    },
    exportProfile() {
      this.modal = true;
      this.type = "export";
    }
  }
};
</script>
<style scoped>
</style>

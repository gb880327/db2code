<template>
  <div style="margin: 20px 40px;">
    <Row>
      <Col span="2" style="padding-top: 8px; text-align:right;">导入配置：</Col>
      <Col>
        <Button @click="importProfile(0)" type="info" style="width:220px;">覆盖配置</Button>&nbsp;&nbsp;
        <Button @click="importProfile(1)" type="success" style="width:220px;">合并配置</Button>&nbsp;&nbsp;
      </Col>
    </Row>

    <Row style="margin-top: 20px;">
      <Col span="2" style="padding-top: 8px; text-align:right;">导出配置：</Col>
      <Col>
        <Button @click="exportProfile" type="primary" style="width:220px;">导出配置</Button>
      </Col>
    </Row>

    <Row style="margin-top: 20px;">
      <Col span="2" style="padding-top: 8px; text-align:right;">数据类型配置：</Col>
      <Col>
        <Button @click="$refs.editMapping.show()" type="primary" style="width:220px;">编辑</Button>
      </Col>
    </Row>

    <Row style="margin-top: 20px;">
      <Col style="padding-left:25px;">
        <pathChoose v-model="dataPath" title="系统数据存储目录" :width="300" v-on:change="save" :readonly="true"></pathChoose>
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

    <editMapping ref="editMapping"></editMapping>
  </div>
</template>
<script>
const fs = require("fs");
const path = require("path");
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";
import Service from "@/libs/service";
import editMapping from "@/views/mapping/editMapping";

export default {
  components: {
    pathChoose,
    editMapping
  },
  data() {
    return {
      modal: false,
      dataPath: "",
      orgPath: "",
      disabled: false,
      outpath: "",
      type: "",
      importType: 0,
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
        this.$success(this,"保存成功！", () => {
          location.reload();
        });
      }
    },
    ok() {
      if (this.outpath === "") {
        this.$error(this,"请选择文件路径！");
        return;
      }
      if (this.type === "import") {
        const _this = this;
        this.$confirm(
          "是否" + (this.importType == 0 ? "覆盖" : "合并") + "配置信息！",
          () => {
            this.service
              .importProfile(this.outpath, this.importType)
              .then(ret => {
                if (ret) {
                  this.$success(this,"导入成功！",()=>{
                    location.reload();
                  });
                }
              });
          }
        );
      } else {
        this.service.exportProfile(this.outpath).then(ret => {
          if (ret) {
            this.$success(this,"导出成功！");
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
    importProfile(importType) {
      this.modal = true;
      this.importType = importType;
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

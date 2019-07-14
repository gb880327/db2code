<template>
  <Row>
    <Col span="12">
      <div class="row" style="margin: 15px;">
        <pathChoose v-model="dataPath" title="系统数据存储目录" :width="300"></pathChoose>
      </div>
      <div class="row">
        <Button type="primary" @click="ok" style="width:300px;margin-left:122px;">保存</Button>
      </div>
    </Col>
    <Col span="12">
      <div class="row">
        <Button @click="importProfile" style="width:45%;">导入配置</Button> &nbsp;&nbsp;
        <Button @click="exportProfile" style="width:45%;">导出配置</Button>
      </div>
    </Col>
  </Row>
</template>
<script>
const fs = require("fs");
const path = require("path");
import config from "@/libs/config";
import pathChoose from "@/components/PathChoose";

export default {
  components: {
    pathChoose
  },
  data() {
    return {
      modal: false,
      dataPath: "",
      orgPath: "",
      disabled: false
    };
  },
  created() {
    this.dataPath = config.dataPath;
    this.orgPath = this.dataPath;
  },
  methods: {
    ok() {
      if (this.dataPath != this.orgPath) {
        this.$confirm(
          "是否自动转移模板文件？",
          () => {
            let target = path.join(this.dataPath, "template");
            if (!fs.existsSync(target)) {
              fs.mkdir(target, err => {
                if (err) {
                  this.$error(err);
                }
              });
            }
            this.$listFileForFolder(config.template).then(res => {
              res.forEach(it => {
                fs.rename(
                  path.join(config.template, it),
                  path.join(target, it),
                  err => {}
                );
              });
              localStorage.setItem("basePath", this.dataPath);
              location.reload();
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
    importProfile(){},
    exportProfile(){
      
    }
  }
};
</script>
<style scoped>
</style>

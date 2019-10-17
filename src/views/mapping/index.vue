<template>
  <Modal v-model="showModal" :width="720" title="修改数据类型映射" :mask-closable="false">
    <div class="mapping-box">
      <div class="mapping-top">
        <div class="mapping-row" style="padding-left: 100px;font-weight: bold;font-size: 16px;">
          <span class="labelName">数据库类型：{{dbType}}</span>
        </div>
        <div class="mapping-row" style="padding-left: 135px; font-weight: bold;font-size: 16px;">
          <span class="labelName">项目类型：{{projectLang}}</span>
        </div>
      </div>
      <div calss="mapping-data">
        <Scroll ref="scroll" :height="600" class="mapping-scroll">
          <div class="row" v-for="item,i of typeMapping" :key="i">
            <div class="mapping-row">
              <Select v-model="item.dbType" style="width:200px">
                <Option
                  v-for="item in $root.dataBaseType[dbType]"
                  :value="item"
                  :key="item"
                  :disabled="checkDbTypeStatus(item)"
                >{{ item }}</Option>
              </Select>
            </div>
            <div class="mapping-arrow">
              <Icon type="ios-arrow-round-forward" size="32" />
            </div>
            <div class="mapping-row" style="padding-left: 50px;">
              <Select v-model="item.langType" style="width:200px">
                <Option
                  v-for="item in $root.codeLangType[projectLang]"
                  :value="item"
                  :key="item"
                >{{ item }}</Option>
              </Select>
            </div>
            <Icon type="ios-trash-outline" @click="delMapping(i)" class="mapping-del" />
          </div>
        </Scroll>
        <div class="mapping-button">
          <Button type="dashed" @click="addMapping">新增</Button>
          <Button type="primary" @click="save">保存</Button>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
    
<script>
import config from "@/libs/config";
import Service from "@/libs/service";
import { dataTypeList } from "@/libs/dataTypeMapping";

export default {
  name: "dataTypeMapping",
  data() {
    return {
      showModal: false,
      service: new Service(),
      dataTypeList: dataTypeList,
      typeMapping: [],
      dbType: "",
      projectLang: "java"
    };
  },
  created() {
    this.dbType = this.$root.dataBaseType[0];
  },
  computed: {},
  methods: {
    show(dbType, projectLang, mappingData) {
      this.dbType = dbType;
      this.projectLang = projectLang;
      this.typeMapping = [];
      Object.keys(mappingData).forEach(key => {
        this.typeMapping.push({
          dbType: key,
          langType: mappingData[key]
        });
      });
      this.showModal = true;
    },
    checkDbTypeStatus(value) {
      return this.typeMapping.findIndex(item => item.dbType === value) >= 0;
    },
    delMapping(i) {
      this.typeMapping.splice(i, 1);
    },
    addMapping() {
      this.typeMapping.push({
        dbType: "",
        langType: ""
      });
      this.$nextTick(() => {
        let container = this.$el.querySelector(".ivu-scroll-container");
        container.scrollTop = container.scrollHeight;
      });
    },
    save() {
      let data = {};
      for (let item of this.typeMapping) {
        data[item.dbType] = item.langType;
      }
      this.$emit("save", data);
      this.showModal = false;
    }
  }
};
</script>
<style scoped>
@import "./index.css";
</style>
<template>
  <div :style="{height: getHeight+'px'}">
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
        <Scroll :height="600" class="mapping-scroll">
          <div class="row" v-for="item,i of typeMapping" :key="i">
            <div class="mapping-row">
              <Select v-model="item.dbType" style="width:200px">
                <Option
                  v-for="item in dataTypeList[dbType]"
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
                  v-for="item in dataTypeList[projectLang]"
                  :value="item"
                  :key="item"
                  :disabled="checkLangTypeStatus(item)"
                >{{ item }}</Option>
              </Select>
            </div>
            <Icon type="ios-trash-outline" @click="delMapping(i)" class="mapping-del" />
          </div>
        </Scroll>
      </div>
    </div>
  </div>
</template>
    
<script>
import config from "@/libs/config";
import Service from "@/libs/service";
import { dataTypeList } from "@/libs/dataTypeMapping";

export default {
  data() {
    return {
      service: new Service(),
      height: 0,
      dbTypeList: config.dbType,
      langList: config.langType,
      dataTypeList: dataTypeList,
      typeMapping: [],
      dbType: "",
      projectLang: "java"
    };
  },
  created() {
    this.dbType = this.dbTypeList[0];
    this.service.getDataTypeMappingForFile().then(ret => {
      let data = ret[this.dbType + "To" + this.projectLang];
      Object.keys(data).forEach(key => {
        this.typeMapping.push({
          dbType: key,
          langType: data[key]
        });
      });
    });
    this.$nextTick(() => {
      this.height = this.$parent.$el.clientHeight;
    });
  },
  computed: {
    getHeight() {
      return this.height;
    }
  },
  methods: {
    checkDbTypeStatus(value) {
      return this.typeMapping.findIndex(item => item.dbType === value) >= 0;
    },
    checkLangTypeStatus(value) {
      return this.typeMapping.findIndex(item => item.langType === value) >= 0;
    },
    delMapping(i) {
      this.typeMapping.splice(i, 1);
    }
  }
};
</script>
<style scoped>
@import "./index.css";
</style>
<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%', padding: '0 10px'}">
        <Button type="primary" shape="circle" icon="md-home" @click="gotoPath('/')"></Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" icon="ios-construct-outline" @click="gotoPath('/DBManage')" :disabled="dbManage">数据库设置</Button>
      </Header>
      <Content :style="{margin: '75px 10px 0', background: '#fff', height: (height-116)+'px'}">
        <router-view ref="view"></router-view>
      </Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data() {
    return {
      height: document.documentElement.clientHeight
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  computed:{
    dbManage(){
      return this.$route.path === "/DBManage";
    }
  },
  methods: {
    gotoPath(path){
      this.$router.push({path: path});
    },
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
      this.$nextTick(()=>{
        this.$refs.view.height = this.height - 116;
      });
    }
  }
};
</script>
<style scoped>
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
.content{
  border-top: 1px solid #dcdee2;
}
</style>


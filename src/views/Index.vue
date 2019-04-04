<style scoped>
.layout {
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
  padding: 10px 0 10px 0;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%', padding: '0 10px'}">
        <Button type="primary" icon="ios-search" @click="query">Search</Button>
      </Header>
      <Content :style="{margin: '75px 10px 0', background: '#fff', height: (height-116)+'px'}"></Content>
      <Footer class="layout-footer-center">2019 &copy; Rookie</Footer>
    </Layout>
  </div>
</template>
<script>
import {query} from "@/libs/database";

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
  methods: {
    query,
    resizeHandler(event) {
      this.height = document.documentElement.clientHeight;
    }
  }
};
</script>

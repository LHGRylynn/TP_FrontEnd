<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: fixed;
  height: 100%;
  width: 100%;
}
*{
  margin: 0px;
  padding: 0px;
}
/* 全局，使用 .customScrollBar 类将在容器上使用风格化滚动条 */
.customScrollBar{
  overflow: overlay;
}
.customScrollBar::-webkit-scrollbar{
  width: 12px;
}
.customScrollBar::-webkit-scrollbar-thumb{
  box-shadow: inset 0 0 5px rgba(0,0,0,.2);
  background-color: #a5a5a5;
}
.customScrollBar::-webkit-scrollbar-thumb:hover{
  background-color: gray;
}
.customScrollBar::-webkit-scrollbar-track{
  box-shadow: inset 0 0 4px rgba(0,0,0,.2);
  background-color: #e5e5e5;
}
</style>

<!--  -->
<template>
  <div>
    <div id="container" style="width: 100%; height: calc(100vh - 100px)"></div>
  </div>
</template>

<script>
var content= [
    "<div style = 'font-size: 14px; color: red; width:200px; height:50px;'>这是信息窗口</div>"
]
export default {
  name: "Map",
  data () {
    return {
    };
  },

  components: {},

  computed: {},

  mounted() {
       // 创建地图实例
    var map = new AMap.Map("container", {
        zoom: 13,
        center:[116.80012454006956, 39.95525724909179],
    })

    // 创建 infoWindow 实例	
    var infoWindow = new AMap.InfoWindow({
        anchor: 'top-right',
        content: content.join("<br>")  //传入 dom 对象，或者 html 字符串
    });

    // 创建一个 Marker 实例：
    var marker = new AMap.Marker({
        position: new AMap.LngLat(116.80012454006956, 39.95525724909179),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: '防灾科技学院'
    })

    var clickHandler = function(e) {
        console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
        // 打开信息窗体
        infoWindow.open(map,map.getCenter());
    };


    marker.on('click', clickHandler);

    // 绑定事件
    //map.on('click', clickHandler);
    
  

    // 将创建的点标记添加到已有的地图实例：
    map.add(marker);

  },

  methods: {}
}

</script>
<style lang='scss' scoped>
</style>
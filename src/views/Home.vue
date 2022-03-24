<!--  -->
<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px;">
      <el-col :span="6" >
        <el-card style="color: #409EFF;">
          <div >累计受灾人数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold;">
            100万
          </div>
        </el-card>

      </el-col>
      <el-col :span="6" >
        <el-card style="color: #E6A23C;">
          <div >受伤人数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold;  ">
             {{injuredNum}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A;">
          <div >失踪人数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold;">
              {{missingNum}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C;">
          <div >遇难人数</div>
          <div style="padding: 10px 0;text-align: center;font-weight: bold;">
           {{victimsNum}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-top: 80px;">
      <div style="">
        <el-carousel height="500px">
          <el-carousel-item v-for="item in imgs" :key="item">
           <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-row> -->
    <el-row style="margin-top: 80px;">
      <el-col :span="12" >
        <div id="main" style="width: 500px;height: 450px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 500px;height: 450px;"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts';

  export default {
    name: "Home",
    data() {
      return {
        injuredNum:'',
        missingNum:'',
        victimsNum:''
      };
    },
    mounted() {    //页面元素渲染之后再触发
      this.request.get("/injured/number").then(res =>{
        this.injuredNum = res.data
      })

       this.request.get("/missing/number").then(res =>{
        this.missingNum = res.data
      })

       this.request.get("/victims/number").then(res =>{
        this.victimsNum = res.data
      })

      var option = {
        title:{
          text:"地震每日新增遇难人数统计",
          subtext:"趋势图",
          left:'center'
        },
        xAxis: {
          type: 'category',
          data: ["3.15", "3.16", "3.17", "3.18"]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [5, 3, 2, 1],
            type: 'line'
          },
          {
            data: [5, 3, 2, 1],
            type: 'bar'
          }
        ]
      };

      //饼图
      // var pieOption = {
      //   title: {
      //     text: '各季度新增用户数量统计',
      //     subtext: '比例图',
      //     left: 'center'
      //   },
      //   tooltip: {
      //     trigger: 'item'
      //   },
      //   legend: {
      //     orient: 'vertical',
      //     left: 'left'
      //   },
      //   series: [
      //     {
      //       type: 'pie',
      //       radius: '70%',
      //       label:{
      //         normal:{
      //           show:true,
      //           position:'inner',
      //           textStyle : {
      //             fontWeight : 300,
      //             fontSize : 14,
      //             color :'#fff'
      //           },
      //           formatter:'{d}%'
      //         }
      //       },
      //       data: [],
      //       emphasis: {
      //         itemStyle: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(0, 0, 0, 0.5)'
      //         }
      //       }
      //     }
      //   ]
      // };


      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);

      // var pieDom = document.getElementById('pie');
      // var pieChart = echarts.init(pieDom);

      // this.request.get("/echarts/members").then(res => {

        // option.series[0].data = res.data
        // option.series[1].data = res.data
        myChart.setOption(option);


      //   pieOption.series[0].data = [
      //     {name:"第一季度",value: res.data[0]},
      //     {name:"第二季度",value: res.data[1]},
      //     {name:"第三季度",value: res.data[2]},
      //     {name:"第四季度",value: res.data[3]},
      //   ]
      //   pieChart.setOption(pieOption);
      // })     
    }
  }

</script>
<style scoped>
</style>
/**
 * Created by JavieChan on 2016/1/5.
 * Updated by JavieChan on 2016/1/6.
 */

//饼图一
var myPie01 = echarts.init(document.getElementById('chartPieContent01'), 'macarons');
var myPie02 = echarts.init(document.getElementById('chartPieContent02'), 'macarons');
var myPie03 = echarts.init(document.getElementById('chartPieContent03'), 'macarons');

opPie(100, 100, 30, 100, 60, 100);

function opPie(pie1, tot1, pie2, tot2, pie3, tot3){
    var radius=[72, 79]; //半径
    var center=['50%', '50%'];
    var clockWise = true; //是否顺时针
    var labelOther = {
        normal : {
            color: '#e3e3e3',
            label : {
                show : false,
                position : 'center'
            },
            labelLine : {
                show : false
            }
        },
        emphasis: {
            color: 'rgba(0,0,0,0)'
        }
    };
    var label01 = {
        normal : {
            color: '#f38e73',
            label : {
                show : false,
                position : 'center',
                formatter : '{c}'+'元',
                textStyle: {
                    baseline : 'bottom'
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var label02 = {
        normal : {
            color: '#08c3e5',
            label : {
                show : false,
                position : 'center',
                formatter : '{c}元',
                textStyle: {
                    baseline : 'bottom'
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var label03 = {
        normal : {
            color: '#68d58f',
            label : {
                show : false,
                position : 'center',
                formatter : '{c}元',
                textStyle: {
                    baseline : 'bottom'
                }
            },
            labelLine : {
                show : false
            }
        }
    };


    var optionPie01 = {
        legend: {
            show: false,
            data: 'totalOnline'
        },
        series : [
            {
                type : 'pie',
                center : center,
                radius : radius,
                clockWise: clockWise,
                data : [
                    {name:'totalOnline', value:pie1, itemStyle:label01},
                    {name:'other', value:tot1-pie1, itemStyle:labelOther}
                ]
            }
        ]
    };
    var optionPie02 = {
        legend: {
            show: false,
            data: 'yesterdayOnline'
        },
        series : [
            {
                type : 'pie',
                center : center,
                radius : radius,
                clockWise: clockWise,
                data : [
                    {name:'yesterdayOnline', value:pie2, itemStyle:label02},
                    {name:'other', value:tot2-pie2, itemStyle:labelOther}
                ]
            }
        ]
    };
    var optionPie03 = {
        legend: {
            show: false,
            data: 'todayOnline'
        },
        series : [
            {
                type : 'pie',
                center : center,
                radius : radius,
                clockWise: clockWise,
                data : [
                    {name:'todayOnline', value:pie3, itemStyle:label03},
                    {name:'other', value:tot3-pie3, itemStyle:labelOther}
                ]
            }
        ]
    };

    // 为echarts对象加载数据
    myPie01.setOption(optionPie01);
    myPie02.setOption(optionPie02);
    myPie03.setOption(optionPie03);
}

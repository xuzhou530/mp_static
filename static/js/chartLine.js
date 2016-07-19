/**
 * Created by JavieChan on 2016/1/5.
 * Updated by JavieChan on 2016/1/27.
 */

//折线图
var myLine = echarts.init(document.getElementById('chartLineContent'), 'macarons');

function opLine(arr, brr, crr,  drr, flag){ //arr:在线人数  brr:在线AP  crr:故障AP  drr:查询范围
    if(flag==0){
        var tip = '{b}小时<br>{a0}：{c0}<br>{a1}：{c1}<br>{a2}：{c2}', xn='小时';
    }else{
        var tip = '{b}<br>{a0}：{c0}<br>{a1}：{c1}<br>{a2}：{c2}', xn='日期';
    }

    var grid = {    //直角坐标系内绘图网格
        x: 50,
        y: 20,
        x2: 45,
        backgroundColor: '#f9f9f9',
        borderColor: '#e1e1e1'
    };
    var tooltip = {   //提示框
        trigger: 'axis',
        backgroundColor: '#407396'
        //formatter: tip
        //formatter: function(params, ticket, callback){
        //    console.log(params);
        //    var res = params[0].name+'小时';
        //    for(var i=0, len=params.length; i<len; i++){
        //        res+='<br/>'+params[i].seriesName+'：'+params[i].value;
        //    }
        //    setTimeout(function (){
        //        callback(ticket, res);
        //    }, 1000);
        //    return 'loading';
        //}
    };

    var optionLine = {
        grid : grid,
        tooltip : tooltip,
        legend: {
            y : 'bottom',
            data:['在线人数', '在线AP', '故障AP']
        },
        xAxis : [{
            name: xn,
            nameTextStyle: {
                color: '#444'
            },
            type : 'category',
            boundaryGap : false,
            data : drr,
            axisLine: {
                show: true,
                lineStyle:{
                    color: '#e1e1e1',
                    width: 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#777'
                }
            }
        }],
        yAxis : [{
            type : 'value',
            //axisLabel : {
            //    formatter: '{value}'
            //},
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#444'
                }
            }
        }],
        series : [
            {
                name: '在线人数',
                type: 'line',
                data: arr,
                itemStyle: {
                    normal: {
                        color: '#68d58f'
                    }
                }
            },
            {
                name: '在线AP',
                type: 'line',
                data: brr
                //itemStyle: {
                //    normal: {
                //        color: '#68d58f'
                //    }
                //}
            },
            {
                name: '故障AP',
                type: 'line',
                data: crr
                //itemStyle: {
                //    normal: {
                //        color: '#68d58f'
                //    }
                //}
            }
        ]
    };

    myLine.hideLoading();
    myLine.setOption(optionLine);
}

;$(function(){
    var today = $('#datepicker').val();
    $.ajax({
        url: proUrl+'aps/stat/?date='+today,
        type: "get",
        dataType: "json",
        success: function(data){
            var stat = getStat(data.stat, 0);
            opLine(stat.b, stat.c, stat.d, stat.a, 0);
        }
    });
});


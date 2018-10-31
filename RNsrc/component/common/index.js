import React, { Component } from 'react';
import {
  // PixelRatio,
  StyleSheet,
  Dimensions
} from 'react-native';

const wRatio = Dimensions.get('window').width/400;
module.exports =  {
  pt:function(n){
    // return PixelRatio.getPixelSizeForLayoutSize(n)*2/3
    return n*wRatio;
  },
  format:function(time, format){
    if(time.toString().length==10){
      time = time * 1000
    }
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getUTCFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
  }
}

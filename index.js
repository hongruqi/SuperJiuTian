/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import React, { Component } from 'react';
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';
import {
  AppRegistry,
  Image,
} from 'react-native';
import {name as appName} from './app.json';

import TabBarBottom from './RNsrc/component/bottom_navigation';
import ViewImg from './RNsrc/component/viewImg';
import MyHomeScreen from './RNsrc/router/home';
import Detail from './RNsrc/router/detail';
import Activedetail from './RNsrc/router/activedetail';
import Mine from './RNsrc/router/mine';
import Search from './RNsrc/router/search';
import Xiaotian from './RNsrc/router/xiaotian';
import Login from './RNsrc/router/login';
import Register from './RNsrc/router/register';
import Collection from './RNsrc/router/collection';
import CollectionDetail from './RNsrc/router/collectiondetail';
import Feedback from './RNsrc/router/feedback';
import About from './RNsrc/router/about';
import Active from './RNsrc/router/active';
import Submitactive from './RNsrc/router/submitactive';
import Activeviewimg from './RNsrc/router/activeviewimg';


const Homeicon = require('./RNsrc/assets/img/about.png')
const Homeicons = require('./RNsrc/assets/img/ding.png')

const StackOptions = (title) => {
  return {
    title: title,
    header: () => ({
      style: {
        backgroundColor: '#205ba9',
      },
      titleStyle: {
        color: '#fff',
      },
      tintColor: '#fff',
    })
  }
};

const HomeNavigator = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Detail: {
    screen: Detail,
  },
  Search: {
    screen: Search,
    navigationOptions: StackOptions('搜索')
  },
  Ask: {
    screen: Xiaotian,
    navigationOptions: StackOptions('小天')
  },
  Submitactive: {
    screen: Submitactive,
  },
  ViewImg: {
    screen: ViewImg,
  }
},{
  initialRouteName: 'Home',
  headerMode: 'screen'
});

const ActiveNavigator = StackNavigator({
  ActiveHome: {
    screen: Active,
  },
  Submitactive: {
    screen: Submitactive,
  },
  ActiveDetail: {
    screen: Activedetail,
  },
  Activeviewimg: {
    screen: Activeviewimg,
  }
},{
  initialRouteName: 'ActiveHome',
  headerMode: 'screen'
})

const MineNavigator = StackNavigator({
  MineHome: {
    screen: Mine,
    navigationOptions: StackOptions('我的')
  },
  Login: {
    screen: Login,
    navigationOptions: StackOptions('登录')
  },
  Register: {
    screen: Register, 
    navigationOptions: StackOptions('注册')
  },
  MyCollection: {
    screen: Collection,
  },
  CollectionDetail: {
    screen: CollectionDetail,
  },
  Feedback: {
    screen: Feedback,
  },
  About: {
    screen: About,
    navigationOptions: StackOptions('关于九天')
  }
},{
  initialRouteName: 'MineHome'
})

const SuperJiuTian = TabNavigator({
  Homes: {
    screen: HomeNavigator,
  },
  Actives: {
    screen: ActiveNavigator,
  },
  Mines: {
    screen: MineNavigator,
  },
}, {
  tabBarPosition: 'bottom',
  swipeEnabled:false,
  animationEnabled:false,
  tabBarComponent: TabBarBottom,
  lazy: true,
  tabBarVisible: false,
})

export default SuperJiuTian;

AppRegistry.registerComponent(appName, () => SuperJiuTian);

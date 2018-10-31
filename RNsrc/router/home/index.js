
import React, { Component } from 'react';
import {
  ScrollView,
  ListView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  RefreshControl,
  View
} from 'react-native';

import SplashScreen from "rn-splash-screen";
import * as WeChat from 'react-native-wechat';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';
import ArticalItem from '../../component/artical_item';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let liveAjax = false;
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			isRefreshing: false,
			curChannelId:0,
			channelName: [{name:'最新',id:0}],
			lastId: 0,
			dataSource: []
		};
	}

	// 初始化，取数据
	componentDidMount(){
		// WeChat.registerApp('wx78fe71ee9d687ba3');	
		this.getType();
		this.getData();
	}

	// get 分类
	async getType() {
		const responseJson = await smartFetch(API.get_types);
		this.setState({
			channelName : responseJson.data
		});

		// Hide the active splash screen
		SplashScreen.hide();
	}

	// get 文章
	async getData(){
		if (liveAjax) {return}
		liveAjax = true;
		const responseJson = await smartFetch(API.get_essay+this.state.curChannelId+'&lastId='+this.state.lastId);
		liveAjax = false;
		this.setState({
			page : this.state.page+1,
			isRefreshing: false,
			lastId : responseJson.data.lastId,
			dataSource : this.state.isRefreshing ? responseJson.data.list : this.state.dataSource.concat(responseJson.data.list)
		});
	}

	// pullToRefresh
	_onRefresh = () => {
		this.state.lastId = 0;
		this.setState({
			isRefreshing: true,
		});
		this.getData()
	}

	// render artical
	_renderRow = (rowData, sectionID, rowID) => {
		return (
			<ArticalItem pressFunc = {() => this.props.navigation.navigate('Detail', rowData)} data = {rowData}/>
		)
	}

	changeChannel = item => event =>{
		this.state.dataSource = [];
		this.state.page = 1;
		this.state.curChannelId = item.id;
		this.state.lastId = 0;
		this.getData();

	}

	// init header
	static navigationOptions = {
		title: '资讯',
		header: ({ state, setParams, goBack, navigate }) => ({
			right: (
				<View style={styles.headerRight}>
					<TouchableWithoutFeedback onPress={() => navigate('Ask', { name: 'Jane' })}>
						<Image source={require('../../assets/img/robot.png')} style={styles.icon}/>
					</TouchableWithoutFeedback>
				</View>
			),
			style: {
				backgroundColor: '#205ba9',
			},
			titleStyle: {
				color: '#fff',
			}
		})
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={{flex: 1}}>
				<View>
					<ScrollView 
						horizontal={true} 
						showsHorizontalScrollIndicator={false} 
						contentContainerStyle={styles.contentContainer}>
						{
							this.state.channelName.map((elem,idx) => {
								return <TouchableHighlight 
									style={styles.sort} underlayColor='#bbb'
									onPress={this.changeChannel(elem)}
									key={'this' + idx} >
									<Text style={[styles.sortItem,(this.state.curChannelId == elem.id ? styles.fire : {})]}>{elem.name}</Text>
								</TouchableHighlight>
							})
						}
					</ScrollView>
				</View>
				<View style={styles.inputWrap}>
					<TouchableWithoutFeedback onPress={() => navigation.navigate('Search', { name: 'Jane' })}>
						<View style={styles.input}>
							<Image source={require('../../assets/img/search_b.png')} style={styles.searchBar}/>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<ListView
					enableEmptySections={true}
					style={styles.listView}
					dataSource={ds.cloneWithRows(this.state.dataSource)}
					onEndReachedThreshold={180}
					onEndReached={this.getData.bind(this)}
					renderRow={this._renderRow}
					refreshControl={
						<RefreshControl 
							refreshing={this.state.isRefreshing}
							onRefresh={this._onRefresh}
							tintColor="#999"
							title="Loading..."
							colors={['#999']}
							progressBackgroundColor="#eee"
						/>
					}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerRight:{
		marginRight: -17,
		flexDirection: 'row'
	},
	icon:{
		width: 20,
		height: 20,
		flex: 1,
		marginRight: 30
	},
	contentContainer:{
		backgroundColor: '#eee',
		paddingLeft: 10,
	},
	sort:{
		height: 36,
		width: 50,
	},
	sortItem: {
		textAlign: 'center',
		color: '#999',
		lineHeight: 31,
		fontSize: 16
	},
	fire: {
		color: '#205ba9',
	},
	inputWrap: {
		height: 55,
		backgroundColor: '#fff',
		padding: 10
	},
	input: {
		height: 35, 
		borderRadius: 4,
		backgroundColor: '#eee'
	},
	searchBar: {
		width: 25,
		height: 25,
		position:'absolute',
		top: 5,
		left: 5
	},
	listView: {
		flex:1,
		padding: 12,
		backgroundColor: '#fff'
	},
	articalItem: {
		height: 96,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 10
	},
	articleImg: {
		width: 99,
		height: 69,
		marginRight: 20
	}
})

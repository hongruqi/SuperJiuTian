
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

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';
import ActiveItem from '../../component/active_item';


const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class Active extends Component {
	constructor(props) {
		super(props);
		this.state = {
			liveAjax: false,
			page: 1,
			isRefreshing: false,
			curChannelId: 0,
			lastId: 0,
			dataSource: [],
			channelInfo: [{
				id: 0,
				name: '全部',
			}]
			// channelInfo: [{
			// 	id: 0,
			// 	name: '全部',
			// },{
			// 	id: 1,
			// 	name: '报名中',
			// },{
			// 	id: 2,
			// 	name: '推广中',
			// },{
			// 	id: 5,
			// 	name: '已结束',
			// }]
		};
	}

	// 初始化，取数据
	componentDidMount(){
		this.getData();
		this.getActiveType();
	}

	// get 分类
	async getActiveType() {
		const responseJson = await smartFetch(API.get_active_channel);
		this.setState({
			channelInfo : responseJson.data
		});
	}

	changeChannel = item => event => {

		this.state.dataSource = [];
		this.state.page = 1;
		this.state.curChannelId = item.id;
		this.state.lastId = 0;

		this.getData();
	}

	// get 文章
	async getData(){
		if (this.state.liveAjax) {return}
		this.state.liveAjax = true;
		const responseJson = await smartFetch(API.get_active_list+'&activetype='+this.state.curChannelId+'&lastId='+this.state.lastId);
		this.state.liveAjax = false;
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
			<ActiveItem pressFunc = {() => this.props.navigation.navigate('ActiveDetail', rowData)} data = {rowData}/>
		)
	}


	// init header
	static navigationOptions = {
		title: '活动',
		header: ({ state, setParams, goBack, navigate }) => {
			return {
				right: (
					<View style={styles.headerRight}>
						<TouchableWithoutFeedback onPress={() => navigate('Submitactive', { name: 'Jane' })}>
							<Image source={require('../../assets/img/submit_active.png')} style={styles.icon}/>
						</TouchableWithoutFeedback>
					</View>
				),
				style: {
					backgroundColor: '#205ba9',
				},
				titleStyle: {
					color: '#fff',
				}
			}
		}
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={{flex: 1}}>
				<View>
				<ScrollView 
					horizontal={true} 
					contentContainerStyle={styles.contentContainer}
					showsHorizontalScrollIndicator={false}>
					{
						this.state.channelInfo.map((elem,idx) => {
							return <TouchableHighlight 
								style={styles.sort} 
								underlayColor='#bbb'
								onPress={this.changeChannel(elem)}
								key={'this' + idx} >
								<Text style={[styles.sortItem,(this.state.curChannelId == elem.id ? styles.fire : {})]}>{elem.name}</Text>
							</TouchableHighlight>
						})
					}
				</ScrollView>
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
	headerTitle:{
		fontSize: 18,
		fontWeight: 'bold',
		color: '#fff',
	},
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
		flex: 1,
		backgroundColor: '#eee',
		height: 35,
		justifyContent: 'center',
	},
	sort:{
		flex: 1,
	},
	sortItem: {
		textAlign: 'center',
		color: '#999',
		lineHeight: 31,
		fontSize: 16
	},
	fire: {
		color: '#205ba9',
		flex: 1,
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
		width: 100,
		height: 75,
		marginRight: 20
	}
})

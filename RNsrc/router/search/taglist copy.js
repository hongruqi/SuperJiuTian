import React, { Component } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  ListView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  RefreshControl,
  View
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';
import ArticalItem from '../../component/artical_item';

var SelectableSectionsListView = require('react-native-selectablesectionlistview');

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let liveAjax = false;
export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchContent: '',
			page: 1,
			noResault: false,
			isRefreshing: false,
			curChannelId:0,
			channelName: [{name:'最新',id:0}],
			lastId:0,
			hasMoreData:0,
			showTagTuijian:true,
			issearchTag:false,
			tuijianTags: [],
			searchTags: [],
			dataSource: []
		};
	}

	// 初始化，取数据
	componentDidMount(){
		this.getTagAll();
	}

	doSearchFromTag(searchTag){
		if (searchTag == "") {
			Alert.alert('','请输入查询内容');
			return;
		}else{
			this.state.searchContent = searchTag;
			this.state.issearchTag = true;
			this.state.dataSource = [];
			this.state.lastId = 0;
			this.hasMoreData = 0;

			this.props.navigation.navigate('Search', { searchtag: searchTag });
		}
	}


	// get 文章
	async getData(){
		if(this.state.issearchTag)
		{
			if ( liveAjax || this.state.searchContent == "" ) { return; }
			const bodystr = 'search_tag='+this.state.searchContent+'&userid='+this.state.searchContent+'&lastId='+this.state.lastId+'&hasMoreData='+this.state.hasMoreData;
			liveAjax = true;
			const responseJson = await smartFetch(API.get_article_by_tag,undefined,bodystr);
			liveAjax = false;
			let tmpDataSource = this.state.isRefreshing ? responseJson.data.list : this.state.dataSource.concat(responseJson.data.list)
			
			this.setState({
				page : this.state.page+1,
				noResault: tmpDataSource.length ? false : true,
				showTagTuijian: tmpDataSource.length ? false : true,
				isRefreshing: false,
				lastId: responseJson.data.lastId,
				hasMoreData: responseJson.data.endState,
				dataSource : tmpDataSource
			});
		}
		else
		{
			if ( liveAjax || this.state.searchContent == "" ) { return; }

			//bug: page
			const bodystr = 'search_key='+this.state.searchContent+'&userid='+this.state.searchContent+'&lastId='+this.state.lastId+'&hasMoreData='+this.state.hasMoreData;
			liveAjax = true;
			const responseJson = await smartFetch(API.get_search,undefined,bodystr);
			liveAjax = false;
			let tmpDataSource = this.state.isRefreshing ? responseJson.data.list : this.state.dataSource.concat(responseJson.data.list)
			
			this.setState({
				page : this.state.page+1,
				noResault: tmpDataSource.length ? false : true,
				showTagTuijian: tmpDataSource.length ? false : true,
				isRefreshing: false,
				lastId: responseJson.data.lastId,
				hasMoreData: responseJson.data.endState,
				dataSource : tmpDataSource
			});
		}
		
	}


	//获取推荐tag
	async getTagAll(){
		const responseJson = await smartFetch(API.get_tag_all);
		let tmpDataSource = responseJson.data.list ;
		
		this.setState({
			tuijianTags : tmpDataSource
		});
	}


	// pullToRefresh
	_onRefresh = () => {
		this.state.lastId = 0;
		this.hasMoreData = 0;
		this.setState({isRefreshing: true});
		this.getTagAll()
	}

	// render artical
	_renderRow = (rowData, sectionID, rowID) => {
	    return (
	      <TouchableHighlight onPress={() => {
	          this.doSearchFromTag(rowData.name);
	        }}>
	        <View style={styles.articalItem}>
				<Text style={[styles.title,styles.titleTop]} numberOfLines={2}>
					{rowData.name}
				</Text>
			</View>
	      </TouchableHighlight>
	    );
		
	}


	render (){
		const {navigation} = this.props
		return (
			<View style={{flex: 1}}>

				{ this.state.tuijianTags.length ?
					<ListView
						enableEmptySections={true}
						style={[styles.listView]}
						dataSource={ds.cloneWithRows(this.state.tuijianTags)}
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
				: null}
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	inputWrap: {
		flexDirection: 'row',
		height: 55,
		backgroundColor: '#205ba9',
		padding: 10,
		paddingTop: 15,
	},
	input: {
		paddingVertical: 0,
		height: 30, 
		width: '80%',
		borderRadius: 4,
		backgroundColor: '#fff',
		marginHorizontal: 10,
		paddingHorizontal: 10,
	},
	button: {
		width: '8%',
		flex: 1,
	},
	buttonText: {
		flex: 1,
		color: '#fff',
		fontSize: 18,
		lineHeight: 24,
		textAlign: 'center',
	},
	btnBack: {
		width: '4%',
	},
	noResTxt: {
		textAlign: 'center',
		backgroundColor: '#fff',
		lineHeight: 60,
		color: '#888',
	},
	tuijianHead: {
		marginTop: 8,
		height: 42,
		width: '100%',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingHorizontal: 20,
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	suggestWrap: {
		flexDirection:'row',
		flexWrap:'wrap',
		paddingHorizontal: 10,
		backgroundColor: '#fff',
	},
	tuijianHeadTxt: {
		color: '#333',
		fontWeight: 'bold',
		fontSize: 16,
	},
	tuijianTag: {
		position: 'relative',
		height: 36,
		paddingHorizontal: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
	},
	tuijianTagTxt: {
		color: '#666',
	},
	tuijianTagSep: {
		position: 'absolute',
		right: 0,
		height: '66%',
		borderRightWidth: 1,
		borderRightColor: '#ddd',
	},
	searchTagWrap: {
		position: 'absolute',
		top: 56,
		width: '100%',
		backgroundColor: '#fff',
	},
	searchTag: {
		height: 34,
		position: 'relative',
		paddingHorizontal: 15,
		paddingBottom: 2,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		flexDirection: 'row',
		alignItems: 'center',
	},
	searchIcon: {
		width: 20,
		height: 20,
		marginRight: 6,
	},	
	listView: {
		flex:1,
		padding: 10,
		backgroundColor: '#fff',
	},
	grey: {
		backgroundColor: '#eee',
	},
	articalItem: {
		height: 42,
		padding: 10,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 10,
		position: 'relative',
		backgroundColor: '#fff',
	},
})

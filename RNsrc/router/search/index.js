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

		this.getTuijianTag();

		if(this.props.navigation.state.params.searchtag)
		{
			const search_tag_fromlist = this.props.navigation.state.params.searchtag;
			this.props.navigation.state.params.searchtag = "";
			this.doSearchFromTag(search_tag_fromlist);
		}
	}

	doSearch = () =>{
		if (this.state.searchContent == "") {
			Alert.alert('','请输入查询内容');
			return;
		}else{
			this.setState({
				searchTags : []
			});
			this.state.issearchTag = false;
			this.state.dataSource = [];
			this.state.lastId = 0;
			this.hasMoreData = 0;
			this.getData();
		}
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
			this.getData();
		}
	}

	getTagSearch(searchContent)
	{
		if(searchContent != "")
		{
			// alert(this.state.searchContent);
			this.getSearchTags(searchContent);
		}
		else
		{
			this.setState({
				searchTags : []
			});	
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
	async getTuijianTag(){
		const responseJson = await smartFetch(API.get_tuijian_tag);
		let tmpDataSource = responseJson.data.list ;
		
		this.setState({
			tuijianTags : tmpDataSource
		});
	}


	//获取搜索的tag
	async getSearchTags(searchContent){

		// if ( liveAjax || this.state.searchContent == "" ) { return; }
		const bodystr = 'search_tag='+searchContent+'&userid='+this.state.searchContent;
		
		const responseJson = await smartFetch(API.get_tag_by_search,undefined,bodystr);
		
		// let tmpDataSource = this.state.isRefreshing ? responseJson.data.list : this.state.dataSource.concat(responseJson.data.list)
		let tmpDataSource = responseJson.data.list;
		this.setState({
			searchTags : tmpDataSource
		});
		// alert(tmpDataSource.length)
		// alert(searchContent);
		// alert(tmpDataSource.length);
		// alert(JSON.stringify(tmpDataSource));
	}

	clickSearchTag = (name) => {
		this.setState({
			searchTags : []
		})
		this.doSearchFromTag(name)
	}

	// pullToRefresh
	_onRefresh = () => {
		this.state.lastId = 0;
		this.hasMoreData = 0;
		this.setState({isRefreshing: true});
		this.getData()
	}

	// render artical
	_renderRow = (rowData, sectionID, rowID) => {
		return (
			<ArticalItem pressFunc = {() => this.props.navigation.navigate('Detail', rowData)} data = {rowData}/>
		)
	}



	_renderRowTag = (rowData, sectionID, rowID) => {
	    var rowHash = Math.abs(hashCode(rowData));
	    var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
	    return (
	      <TouchableHighlight onPress={() => {
	          this._pressRow(rowID);
	          highlightRow(sectionID, rowID);
	        }}>
	        <View>
	          <View style={styles.row}>
	            <Image style={styles.thumb} source={imgSource} />
	            <Text style={styles.text}>
	              {rowData + ' - ' + LOREM_IPSUM.substr(0, rowHash % 301 + 10)}
	            </Text>
	          </View>
	        </View>
	      </TouchableHighlight>
	    );
	  }




	render (){
		const {navigation} = this.props
		return (
			<View style={{flex: 1}}>
				<View style={[styles.inputWrap]}>
					<TextInput style={[styles.input]} underlineColorAndroid='transparent'
						onChangeText={(searchContent) => {this.setState({searchContent});this.getTagSearch(searchContent);}}
						value={this.state.searchContent}
						placeholder= "请输入要查询的内容"
					/>
				    <TouchableWithoutFeedback onPress={this.doSearch}>
				    	<View style={[styles.button]}>
							<Text style={[styles.buttonText]}>搜索</Text>
				    	</View>
					</TouchableWithoutFeedback>
				</View>

				{this.state.noResault ? <Text style={[styles.noResTxt]}>没有查询到任何结果 T T</Text> : null}
				{this.state.showTagTuijian ?
					<View>
						<View style={[styles.tuijianHead]}><Text style={[styles.tuijianHeadTxt]}>九天热搜榜</Text></View>
						<View style={[styles.suggestWrap]}>
							{ this.state.tuijianTags.map((elem,idx) => {
								return (
									<TouchableWithoutFeedback key={elem.name} onPress={()=>this.doSearchFromTag(elem.name)}>
										<View style={[styles.tuijianTag]}>
											<Text style={[styles.tuijianTagTxt]} numberOfLines={1}>{elem.name}</Text>
											{(idx%3 == 2) ? null: <View style={[styles.tuijianTagSep]}></View>}
										</View>
									</TouchableWithoutFeedback>

								)
							}) }

							<TouchableWithoutFeedback onPress={() => navigation.navigate('SearchTags', { name: 'Jane' })}>
								<View style={[styles.tuijianTag]}>
									<Text style={[styles.tuijianTagTxt]} numberOfLines={1}>更多...</Text>
								</View>
							</TouchableWithoutFeedback>

						</View>
					</View>
				: null}

				{ this.state.dataSource.length ?
					<ListView
						enableEmptySections={true}
						style={[styles.listView, this.state.showTagTuijian ? styles.grey : null]}
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
				: null}

				{this.state.searchTags.length ?
					<View style={styles.searchTagWrap}>
						{ this.state.searchTags.map((tag,idx) => {
							return (
								<TouchableWithoutFeedback key={'searchTags'+tag.id} onPress={()=>this.clickSearchTag(tag.name)}>
									<View style={styles.searchTag}>
										<Image source={require('../../assets/img/search_b.png')} style={styles.searchIcon}/>
										<Text>{tag.name}</Text>
									</View>
								</TouchableWithoutFeedback>
							)
						})}
					</View>
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
		width: '33.3%',
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
	}
})

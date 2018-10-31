
import React, { Component }  from 'react';
import {
  Alert,
  Button,
  ScrollView,
  ListView,
  Image,
  StyleSheet,
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
export default class Collection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			isRefreshing: false,
			dataSource: [],
			lastId: 0,
			isEditing : false,
		};
	}

	// 初始化Header
	componentWillMount(){
		this.props.navigation.setParams({
			isEditing: false,
			onEditPress: () => {
				this.editCollections()
			},
			onCancelPress: () => {
				this.cancelEdit()
			},
			onDelPress: () => {
				this.delCollections()
			},
		})
	}

	// 初始化，取数据
	componentDidMount(){
		this.getData();
	}

	// get 文章
	async getData(){
		if (liveAjax) {return}
		liveAjax = true;
		const bodystr = 'tagId=0&lastId='+this.state.lastId;
		const responseJson = await smartFetch(API.get_collection,undefined,bodystr);
		liveAjax = false;
		
		if(responseJson.code != 0) {
			Alert.alert('',responseJson.msg);
			return;
		}

		this.setState({
			page : this.state.page+1,
			isRefreshing: false,
			lastId : responseJson.data.lastId,
			dataSource : this.state.isRefreshing ? responseJson.data.list : this.state.dataSource.concat(responseJson.data.list)
		});
	}

	// edit
	editCollections = () => {

	}
	// cancel edit
	cancelEdit = () => {

	}
	// del 
	delCollections = () => {

	}

	// pullToRefresh
	_onRefresh = () => {
		this.state.lastId=0;
		this.setState({isRefreshing: true});
		this.getData()
	}

	static navigationOptions = {
		title: '我的收藏',
		header: ({ state, setParams, goBack, navigate}) => {
			return {
				right: (
					<View style={styles.headerRight}>
						{
							state.params.isEditing ? (<View style={styles.headerRight}>
							<TouchableWithoutFeedback onPress={state.params.onCancelPress}>
								<View>
									<Text style={styles.headerBtn}>取消</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={state.params.onDelPress}>
								<View>
									<Text style={styles.headerBtn}>删除</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={state.params.onEditPress}>
								<View>
									<Text style={styles.headerBtn}>编辑</Text>
								</View>
							</TouchableWithoutFeedback>
							</View>) : null
						}
					</View>
				),
				style: {
					backgroundColor: '#205ba9',
				},
				titleStyle: {
					color: '#fff',
				},
				tintColor: '#fff',
			}
		}
	}

	// render artical
	_renderRow = (rowData, sectionID, rowID) => {
		rowData.id = rowData.articleId
		return (
			this.state.isEditing ? (
				<View>
					<TouchableWithoutFeedback>
						<Text>o</Text>
					</TouchableWithoutFeedback>
					<ArticalItem pressFunc = {() => {}} data = {rowData}/>
				</View>
			) : <ArticalItem pressFunc = {() => this.props.navigation.navigate('CollectionDetail', rowData)} data = {rowData}/>
		)
	}

	render (){
		const {navigation} = this.props
		const contentLength = (this.state.dataSource && this.state.dataSource.length) || 0
		return (
			<View style={{flex: 1}}>
				<ListView
					enableEmptySections={true}
					style={[styles.listView,(!contentLength ? styles.listViewEmpty : {})]}
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
				{
					(this.state.dataSource && this.state.dataSource.length) ? 
					null
					:
					<Text style={styles.empty}>没有发现收藏的文章，快去发现更多内容吧～</Text>
				}
			</View>
		)
	}
}


const styles = StyleSheet.create({
	headerRight: {
		flexDirection: 'row'
	},
	headerBtn: {
		color: '#fff',
		paddingHorizontal: 10,
	},
	listView: {
		flex:1,
		padding: 10,
		backgroundColor: '#fff'
	},
	listViewEmpty: {
		position: 'absolute',
		backgroundColor: 'transparent',
	},
	empty: {
		flex: 10,
		textAlign: 'center',
		padding: 30,
		fontSize: 18,
		lineHeight: 30,
		color: '#999',
	}
})



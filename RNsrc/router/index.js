
import React, { Component }  from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  WebView
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';


let WeChat = require('react-native-wechat');

export default class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataReady: false,
			htmlData:'',
			xiangguanData:[],
			xiangguanData2:[],
			articleSource:'',
			articleTime:'',
			collectImg:'star_w.png',
			showSharePop: false,
			tagId: 0,
			collectId: 0,
			loginUserId: 0,
			// next is test for viewImage
			img:(['https://facebook.github.io/react/img/logo_og.png',
				'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
				'http://www.ycombinator.com/images/ycombinator-logo-fb889e2e.png']).join(' ')
		};	
	}

	// 初始化Header
	componentWillMount(){
		this.props.navigation.setParams({
			onNavSharePress: () => {
				this.shareWeChat()
			},
			onCollectPress: () => {
				this.collection()
			}
		})
	}

	// 初始化，取数据
	componentDidMount(){
		this.getDetailData();

	}

	async collection (){
		let userid = await AsyncStorage.getItem('userid');
		if(userid == null) {
			Alert.alert('','请先登录');
			return;
		}
		if(this.props.navigation.state.params.collectId > 0)
		{
			const bodystr = 'tagId='+this.state.tagId+'&collectIds=['+this.props.navigation.state.params.collectId+']';
			const responseJson = await smartFetch(API.do_remove_collection,undefined,bodystr);

			this.props.navigation.setParams({
				collectId: 0,
			})
		}
		else
		{
			const bodystr = 'tagId='+this.state.tagId+'&articleId='+this.props.navigation.state.params.id;
			const responseJson = await smartFetch(API.do_collection,undefined,bodystr);
			this.props.navigation.setParams({
				collectId: responseJson.data.id,
			})
		}
		
	}

	// get 文章数据
	async getDetailData(){
		const responseJson = await smartFetch(API.get_detail+this.props.navigation.state.params.id);
		let loginUId = await AsyncStorage.getItem('userid');
		if(loginUId == null) {
			loginUId = 0;
		}

		this.state.xiangguanData = responseJson.data.article_xiangguan_list
		this.state.xiangguanData2 = responseJson.data.article_xiangguan_list_2

		this.setState({
			dataReady: true,
			htmlData : responseJson.data.content+this.concatEssay(),
			articleSource : responseJson.data.source,
			articleTime : responseJson.data.createTime,
			collectId : responseJson.data.collectId,
			tagId : responseJson.data.tagId,
			loginUserId : loginUId,
		});
		this.props.navigation.setParams({
			collectId: responseJson.data.collectId,
		})

	}

	concatEssay = () => {
		let html = ""
		if (this.state.xiangguanData2.length) {
			html += '<h4>相关阅读：</h4>'
		}
		this.state.xiangguanData2.map((elem,idx) => {
			html += ('<h5 data-i=' +(elem)+ 
				' style="color:#3e84e5;line-height:16px;margin:10px 5px;padding: 0;" onclick="window.postMessage(this.dataset.i)">'
				+elem.title+'</h5>')
		})
		if (this.state.xiangguanData.length) {
			html += '<h4>往期回顾：</h4>'
		}
		this.state.xiangguanData.map((elem,idx) => {
			html += ('<h5 data-i=' +(elem)+ 
				' style="color:#3e84e5;line-height:16px;margin:10px 5px;padding: 0;" onclick="window.postMessage(this.dataset.i)">'
				+elem.title+'</h5>')
		})
		return html
	}

	// share to wechat
	shareWeChat = () => {
		this.setState({
			showSharePop: true
		})
	}
	hideShare = () => {
		this.setState({
			showSharePop: false
		})
	}

	shareToTimeLine = () => {
		// Alert.alert('',JSON.stringify(this.props.navigation.state.params));
		this.hideShare();
		WeChat.isWXAppInstalled()
        .then((isInstalled) => {
			if (isInstalled) {
				WeChat.shareToTimeline({
					title:this.props.navigation.state.params.title,
					description: '展现天文资讯，推荐天文作品，分享天文经验，一路同行探索宇宙！',
					thumbImage: 'http://jiutianxingkong.com/img/jiutianlogo.png',
					type: 'news',
					webpageUrl: 'http://jiutianxingkong.com/?c=News&a=share_detail&articleId='+this.props.navigation.state.params.id+'&share_userid='+this.state.loginUserId,
				}).catch((error) => {
					Alert.alert('',error.message);
					// ToastAndroid.show(error.message,ToastAndroid.SHORT);
				});
			} else {
				Alert.alert('','没有安装微信软件，请您安装微信之后再试');
				// ToastAndroid.show('没有安装微信软件，请您安装微信之后再试',ToastAndroid.SHORT);
			}
        });
	}
	shareToSession = () => {
		this.hideShare();
		WeChat.isWXAppInstalled()
		.then((isInstalled) => {
			if (isInstalled) {
				WeChat.shareToSession({
					title:this.props.navigation.state.params.title,
					description: '展现天文资讯，推荐天文作品，分享天文经验，一路同行探索宇宙！',
					thumbImage: 'http://jiutianxingkong.com/img/jiutianlogo.png',
					type: 'news',
					webpageUrl: 'http://jiutianxingkong.com/?c=News&a=share_detail&articleId='+this.props.navigation.state.params.id+'&share_userid='+this.state.loginUserId,
				}).catch((error) => {
					Alert.alert('',error.message);
					// ToastAndroid.show(error.message,ToastAndroid.SHORT);
				});
			} else {
				Alert.alert('','没有安装微信软件，请您安装微信之后再试');
				// ToastAndroid.show('没有安装微信软件，请您安装微信之后再试',ToastAndroid.SHORT);
			}
		});
	}

	catchEvent = (event) => {
		// 在webview内部的网页中调用window.postMessage方法时可以触发此属性对应的函数，从而实现网页和RN之间的数据交换。 设置此属性的同时会在webview中注入一个postMessage的全局函数并覆盖可能已经存在的同名实现。
		// 网页端的window.postMessage只发送一个参数data，此参数封装在RN端的event对象中，即event.nativeEvent.data。data 只能是一个字符串。
		alert(event.nativeEvent.data)
		return
		this.props.navigation.navigate('Detail', JSON.parse(event.nativeEvent.data))
		// const IMGJSON = JSON.stringify(event.nativeEvent.data)
		// const IMGJSON = JSON.stringify(this.state.img)
		// this.props.navigation.navigate('ViewImg', { img: IMGJSON })
	}

	static navigationOptions = {
		title: '',
		header: ({ state, setParams, goBack, navigate}) => {
			let img = <Image source={require('../../assets/img/star_w.png')} style={styles.icon} />
			if (state.params.collectId > 0) {
				img = <Image source={require('../../assets/img/star_y.png')} style={styles.icon} />
			}

			return {
				right: (
					<View style={styles.headerRight}>
						<TouchableWithoutFeedback onPress={state.params.onCollectPress}>
							<View>
								{img}
							</View>
						</TouchableWithoutFeedback>
						<TouchableWithoutFeedback onPress={state.params.onNavSharePress}>
							<Image source={require('../../assets/img/share.png')} style={[styles.icon,{height:25}]} />
						</TouchableWithoutFeedback>
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

	render(){
		const {navigation} = this.props
		const detailData = this.props.navigation.state.params;
		const headHtml = '<h3 id="artileTitle">'+detailData.title+
						'</h3><p id="artileSource">'+this.state.articleSource+' '+this.state.articleTime+'</p>';

		return (
			<View style={styles.flex}>
			{
				this.state.dataReady ? 
				<WebView 
					allowsInlineMediaPlayback={true}
					source={{html: (headHtml+this.state.htmlData+
						"<style>img{max-width:100%;}#artileTitle{color:#999;text-align:center;font-size:20px;line-height:30px}#artileSource{color:#999;text-align:right;font-size:14px;line-height:20px;margin-bottom:-20px}</style>")}}
					style={[styles.flex,styles.webview]} 
					onMessage={this.catchEvent}
					javaScriptEnabled={true}  />
				: null
			}

				{
					this.state.showSharePop ? <View style={styles.shareWechat}>
						<View style={{flexDirection: 'row'}}>
							<TouchableHighlight style={styles.shareChannal} onPress={this.shareToSession} underlayColor='#eee'>
								<View style={styles.shareChannal}>
									<Image source={require('../../assets/img/weixin_friends.png')} style={styles.shareIcon} />
									<Text style={styles.shareText}>微信好友</Text>
								</View>
							</TouchableHighlight>
							<TouchableHighlight style={styles.shareChannal} onPress={this.shareToTimeLine} underlayColor='#eee'>
								<View style={styles.shareChannal}>
									<Image source={require('../../assets/img/weixin.png')} style={styles.shareIcon} />
									<Text style={styles.shareText}>朋友圈</Text>
								</View>
							</TouchableHighlight>

							<TouchableHighlight style={styles.shareChannal} onPress={this.shareToTimeLine} underlayColor='#eee'>
								<View style={styles.shareChannal}>
									<Image source={require('../../assets/img/qq.png')} style={styles.shareIcon} />
									<Text style={styles.shareText}>QQ好友</Text>
								</View>
							</TouchableHighlight>
							<TouchableHighlight style={styles.shareChannal} onPress={this.shareToTimeLine} underlayColor='#eee'>
								<View style={styles.shareChannal}>
									<Image source={require('../../assets/img/qzone.png')} style={styles.shareIcon} />
									<Text style={styles.shareText}>QQ空间</Text>
								</View>
							</TouchableHighlight>
						</View>
						<TouchableHighlight style={styles.shareCancelBtn} onPress={this.hideShare} underlayColor='#bbb'>
							<Text style={styles.shareCancelText}>取消</Text>
						</TouchableHighlight>
					</View> : null
				}
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
		backgroundColor: '#fff',
	},
	headerRight:{
		marginRight: -17,
		flexDirection: 'row'
	},
	icon:{
		width: 22,
		height: 22,
		flex: 1,
		marginRight: 30,
	},
	webview:{
		paddingTop: 10,
	},
	artileTitle:{
		marginHorizontal: 10,
		textAlign: 'center',
		color: '#999',
		lineHeight: 30,
		fontSize: 20,
		fontWeight:'bold'
	},
	artileSource:{
		textAlign: 'right',
		color: '#999',
		lineHeight: 30,
		fontSize: 14,
		marginHorizontal: 10,
	},
	shareWechat:{
		flex:1,
		height: 150,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		paddingHorizontal: 15,
		paddingTop: 5,
		justifyContent: 'space-around',
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderColor: '#e9e9e9',
	},
	shareChannal:{
		flex:1,
		height: 80,
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
	},
	shareIcon: {
		width: 42,
		height: 42,
	},
	shareText: {
		paddingTop: 8,
		fontSize: 16,
		color: '#999',
	},
	shareCancelBtn: {
		height: 30,
		borderWidth: 1,
		borderColor: '#e9e9e9',
		borderRadius: 2,
		backgroundColor: '#f9f9f9',
		alignItems: 'center',
	},
	shareCancelText:{
		lineHeight: 24,
	}
})

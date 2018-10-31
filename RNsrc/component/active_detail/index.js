
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

// import TopNavigation from '../top_navigation';
import smartFetch from '../common/fetch';
import API from '../../configData/api';
import ViewImg from '../viewImg';


let WeChat = require('react-native-wechat');

export default class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			htmlData:'',
			xiangguanData:[],
			xiangguanData2:[],
			articleSource:'',
			articleTime:'',
			collectImg:'star_w.png',
			showSharePop: false,
			showViewImg : false,
			tagId: 0,
			collectId: 0,
			loginUserId: 0,
			// next is test for viewImage
			img:[]
			// img:(['http://101.200.185.62/public/image/20170717/1500268124436385.jpg',
				// 'http://101.200.185.62/public/image/20170717/1500266644748559.png',
				// 'http://101.200.185.62/public/image/20170717/1500266649776499.jpg']).join(' ')
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
		const responseJson = await smartFetch(API.get_detail+this.props.navigation.state.params.id+'&is_new=1');
		let loginUId = await AsyncStorage.getItem('userid');
		if(loginUId == null) {
			loginUId = 0;
		}

		this.state.xiangguanData = responseJson.data.article_xiangguan_list
		this.state.xiangguanData2 = responseJson.data.article_xiangguan_list_2

		this.setState({
			htmlData : responseJson.data.content,
			articleSource : responseJson.data.source,
			articleTime : responseJson.data.createTime,
			collectId : responseJson.data.collectId,
			tagId : responseJson.data.tagId,
			loginUserId : loginUId,
			img : responseJson.data.img_src_arr.join(' '),
		});
		this.props.navigation.setParams({
			collectId: responseJson.data.collectId,
		})

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

	catchEvent = event => {
		try{
			const info = JSON.parse(event.nativeEvent.data)
			

			if(info.title)
			{
				this.resetState();

				this.props.navigation.state.params.id = info.id;
				this.props.navigation.state.params.collectIdcollectId = info.id;
				this.props.navigation.state.params.title = info.title;

				// this.props.navigation.setParams({
				// 	collectId: info.collectId,
				// 	id: info.id,
				// 	title: info.title,
				// })
				this.getDetailData();
			}
			else
			{
				// this.setState({
				// 	// showViewImg : true,
				// })
				// return
				// const IMGJSON = JSON.stringify(this.state.img);
				this.props.navigation.navigate('Activeviewimg', {img_arr:this.state.img, info: info })
			}
		}catch(err){
			Alert.alert('','服务器蒙圈了，请稍后重试～');
		}		
	}

	closeViewImg = () => {
		this.setState({
			showViewImg : false,
		})
	}

	resetState = () => {
		this.state = {
			htmlData:'',
			xiangguanData:[],
			xiangguanData2:[],
			articleSource:'',
			articleTime:'',
			collectImg:'star_w.png',
			showSharePop: false,
			showViewImg : false,
			tagId: 0,
			collectId: 0,
			loginUserId: 0,
			img:[],
		}
	}

	static navigationOptions = {
		title: '',	
		cardStack: {
	        gesturesEnabled: true  // 是否可以右滑返回
	    },
		// header: { visible: false },
		header: ({ state, setParams, goBack, navigate}) => {
			let img = <Image source={require('../../assets/img/star_w.png')} style={[styles.icon,styles.iconCollect]} />
			if (state.params.collectId > 0) {
				img = <Image source={require('../../assets/img/star_y.png')} style={[styles.icon,styles.iconCollect]} />
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
		const htmlImgCss = '<style>img{max-width:100%;}#artileTitle{color:#999;text-align:center;font-size:20px;line-height:30px}\#artileSource{color:#999;text-align:right;font-size:14px;line-height:20px;margin-bottom:-20px}</style>';
		// const imgClickScript = '';
		const imgClickScript = '<script>document.addEventListener("click", function(e) {var tagName = e.target.tagName.toLowerCase();if (tagName=="img") {window.postMessage(JSON.stringify({src: e.target.src}));}})</script>';
		// <TopNavigation 
		// 	goBack={()=>{this.props.navigation.goBack()}}
		// 	onCollectPress={this.collection} 
		// 	onNavSharePress={this.shareWeChat} />
		return (
			<View style={styles.flex}>
				<WebView 
					allowsInlineMediaPlayback={true}
					bounces={true}
					source={{html: (headHtml+this.state.htmlData+htmlImgCss+imgClickScript)}}
					style={[styles.flex,styles.webview]} 
					onMessage={this.catchEvent}
					javaScriptEnabled={true}  />

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

							
						</View>
						<TouchableHighlight style={styles.shareCancelBtn} onPress={this.hideShare} underlayColor='#bbb'>
							<Text style={styles.shareCancelText}>取消</Text>
						</TouchableHighlight>
					</View> : null
				}
				{
					this.state.showViewImg ? 
					<ViewImg info={this.state.img} close={this.closeViewImg}/>
					: null
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
	iconCollect: {
		width: 24,
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
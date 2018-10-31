
import React, { Component }  from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  ScrollView,
  ListView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';

export default class Mine extends Component {
	constructor(props) {
	    super(props);
	    this.state = { 
	    	usernick: '',
	    	online: false,
	    };
	}

	// 初始化，取数据
	componentDidMount(){
		this.getUserInfo();
		setInterval(this.getUserInfo, 2000)
	}

	getUserInfo = async () =>{

		let userid = await AsyncStorage.getItem('userid');
		if(userid == null || this.state.online) {
			return;
		}
		const responseJson = await smartFetch(API.get_userinfo,undefined,"");
		if(responseJson.code == 0) {
			this.setState({
				online: true,
				usernick: responseJson.data.username,
			})
		} else {
			Alert.alert('',responseJson.msg);
			this.dologout();
			return;
		}
		
	}

    logout= async () =>{
    	Alert.alert( '', '退出后将无法收藏文章，确定退出？',
		[
			{text:'取消',onPress:()=>{}},
			{text:'确定',onPress:()=>this.dologout()},
		]);
	}

	async dologout(){
		await AsyncStorage.removeItem('userid');
		await AsyncStorage.removeItem('accessToken');
		this.setState({
			online: false,
		})
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={styles.viewFlex}>
				<View style={styles.viewCenter}>
					<Image source={ require('../../assets/img/headimg_160.png')} style={styles.avatar}/>
				</View>

				{
					this.state.online?(
						<View style={[styles.viewCenter,styles.regLog]}>
							<View>
								<Text style={styles.regLoginText}>{this.state.usernick}</Text>
							</View>
						</View>
					):(
						<View style={[styles.viewCenter,styles.regLog]}>
							<TouchableWithoutFeedback onPress={() => navigation.navigate('Register', { name: 'Jane' })}>
								<View>
									<Text style={styles.regLoginText}>注册</Text>
								</View>
							</TouchableWithoutFeedback>
							<Text style={[styles.regLoginText,{paddingHorizontal: 12,fontSize:18}]}>|</Text>
							<TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { name: 'Jane' })}>
								<View>
									<Text style={styles.regLoginText}>登录</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					)
				}
				
				<View style={{paddingHorizontal: 15}}>
					<TouchableWithoutFeedback onPress={() => navigation.navigate('MyCollection', { name: 'Jane' })}>
						<View style={styles.menus}>
							<Image source={ require('../../assets/img/star.png')} style={styles.menuIcon}/>
							<Text style={styles.userCenterText}>我的收藏</Text>
							<Image source={ require('../../assets/img/arrow.png')} style={[styles.menuIcon,styles.rightIcon]}/>
						</View>
					</TouchableWithoutFeedback>
					<View style={styles.line}></View>
					<TouchableWithoutFeedback onPress={() => navigation.navigate('Feedback', { name: 'Jane' })}>
						<View style={styles.menus}>
							<Image source={ require('../../assets/img/feedback.png')} style={styles.menuIcon}/>
							<Text style={styles.userCenterText}>意见反馈</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => navigation.navigate('About', { name: 'Jane' })}>
						<View style={styles.menus}>
							<Image source={ require('../../assets/img/about.png')} style={styles.menuIcon}/>
							<Text style={styles.userCenterText} >关于九天</Text>
						</View>
					</TouchableWithoutFeedback>
					{
						this.state.online ? <TouchableWithoutFeedback onPress={() => this.logout()}>
							<View style={styles.menus}>
								<Image source={ require('../../assets/img/exit.png')} style={styles.menuIcon}/>
								<Text style={styles.userCenterText} >退出</Text>
							</View>
						</TouchableWithoutFeedback> : null
					}
						
				</View>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	navigetionItem: {
		flex: 1,
		paddingTop: 4,
		alignItems: 'center',
	},
	viewFlex: {
		flex: 1,
		backgroundColor: '#fff',
	},
	viewCenter:{
		alignItems:'center',
	    justifyContent: 'center',
		backgroundColor: '#205ba9',
		paddingTop: 15,
	},
	avatar: {
		width: 80,
		height: 80,
	},
	regLog:{
		flexDirection: 'row',
	    justifyContent: 'center',
	},
	menus: {
		flexDirection: 'row',
		height: 50,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		position: 'relative',
		alignItems: 'center',
	},
	menuIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
		marginVertical: 14,
	},
	rightIcon: {
		position: 'absolute',
		right: 0,
		width: 36,
		height: 36,
	},
	regLoginText:{
		color: '#fff',
		fontSize: 16,
		paddingBottom: 15,
	},
	userCenterText:{
		color: '#999',
		fontSize: 16,
	},
	line: {
		borderBottomWidth: 2,
		borderBottomColor: '#ccc',
	}
})



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
  View
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';

export default class Register extends Component {
	constructor(props) {
	    super(props);
	    this.state = { 
	    	username: '',
	    	userphone: '',
	    	uservcode: '',
	    	userpass: '',
	    	btnTxt: '获取验证码',
	    	countdownTime: 60
	    };
	}

	doReg= () =>{
		if(this.state.username == "") {
			Alert.alert('','请输入昵称');
			return;
		}
		if(this.state.userphone == "") {
			Alert.alert('','请输入手机号');
			return;
		}
		if(this.state.uservcode == "") {
			Alert.alert('','请输入验证码');
			return;
		}
		if(this.state.userpass == "") {
			Alert.alert('','请输入密码');
			return;
		}
		this.sendNameAndPassReg();
	}

	async sendNameAndPassReg() {
		const bodystr = 'nickname='+this.state.username+'&phoneno='+this.state.userphone+'&passwd='+this.state.userpass+'&vcode='+this.state.uservcode;
		const responseJson = await smartFetch(API.do_reg,undefined,bodystr);
		
		if (responseJson.code == 0) {
			Alert.alert('', '注册成功');
			// navigation.navigate('Mine', { name: 'Jane' });
			this.props.navigation.goBack();
		} else {
			Alert.alert('',responseJson.msg);
		}
	}


	doGetMsg= () =>{
		// 倒计时中不可再次点击
		if (this.state.countdownTime<60 && this.state.countdownTime>0) {return}
		if(this.state.userphone == "") {
			Alert.alert('','请输入手机号');
			return;
		}
		this.getMsg();
		
	}

	// 发送验证码后倒计时60s
	timerSendMsg = () =>{
		this.timer = setInterval(() => {
			if (this.state.countdownTime>0) {
				this.state.countdownTime = this.state.countdownTime-1;
				this.setState({
					btnTxt: this.state.countdownTime+"秒后重发"
				})
			}else{
				clearInterval(this.timer)
				this.setState({
					countdownTime: 60,
					btnTxt: '获取验证码'
				})					
			}
		},1000)
	}

	// send phone Verification code
	async getMsg() {
		const bodystr = 'phoneno='+this.state.userphone;
		const responseJson = await smartFetch(API.get_msg,undefined,bodystr);
		
		if (responseJson.code == 0) {
			Alert.alert('', '发送成功');
			this.timerSendMsg();
		} else {
			Alert.alert('',responseJson.msg);
		}
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={styles.bodyContent}>
				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/user.png')} style={styles.icon}/>
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						onChangeText={(username) => this.setState({username})}
						value={this.state.username}
						placeholder= "请输入昵称" placeholderTextColor='#999'
					/>
				</View>

				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/phone.png')} style={styles.icon}/>
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						onChangeText={(userphone) => this.setState({userphone})}
						value={this.state.userphone}
						placeholder= "请输入手机号" placeholderTextColor='#999'
						keyboardType="numeric"
					/>
				</View>

				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/file.png')} style={styles.icon}/>
					<TextInput style={[styles.input,styles.inputCode]} underlineColorAndroid='transparent'
						onChangeText={(uservcode) => this.setState({uservcode})}
						value={this.state.uservcode}
						placeholder= "请输入验证码" placeholderTextColor='#999'
					/>
					<TouchableWithoutFeedback onPress={() => this.doGetMsg()}>
						<View>
							<Text style={styles.getCodeTxt}>{this.state.btnTxt}</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>

				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/lock.png')} style={styles.icon}/>
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						onChangeText={(userpass) => this.setState({userpass})}
						value={this.state.userpass}
						secureTextEntry={true}
						placeholder= "请输入密码" placeholderTextColor='#999'
					/>
				</View>

				<TouchableWithoutFeedback onPress={this.doReg}>
					<View>
					    <Text style={styles.button}>注册</Text>
					</View>
				</TouchableWithoutFeedback>
					
				<TouchableWithoutFeedback onPress={() => navigation.navigate('Login', { name: 'Jane' })}>
					<View style={styles.bottomView}>
						<Text style={styles.regLoginText}>已有账号点击登录</Text>
					</View>
				</TouchableWithoutFeedback>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	bodyContent: {
		flex: 1,
	    backgroundColor: '#fff',
		paddingHorizontal: 18,
		position: 'relative',
	},
	icon: {
		height: 16,
		width: 14,
		marginTop: 10,
	},
	input: {
		flex: 1,
		height: 35,
		lineHeight: 24,
		paddingVertical: 0,
		paddingHorizontal: 10,
		color: '#666',
	},
	getCodeTxt: {
		height: 38,
		borderLeftWidth: 1,
		borderColor: '#e9e9e9',
		paddingHorizontal: 15,
		lineHeight: 28,
		color: '#bbb',
	},
	button: {
		marginTop: 10,
		borderRadius: 4,
		textAlign: 'center',
		height: 35,
		lineHeight: 26,
		color: '#fff',
		backgroundColor: '#205ba9',
	},
	// bottomView:{
	// 	position: 'absolute',
	// 	bottom: 55,
	// 	paddingLeft: 18,
	// },
	regLoginText:{
		// width: '100%',
		// textAlign: 'center',
		// color: '#999',
		// lineHeight: 30,
		// fontSize: 14,
		padding: 15,
		paddingRight: 0,
		textAlign: 'right',
		color: '#999',
		fontSize: 14,
	},
	inputview:{
		flexDirection: 'row',
		height: 50,
		paddingVertical: 6,
		borderBottomWidth: 1,
		borderColor: '#e9e9e9', 
	}
})

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

export default class Login extends Component {
	constructor(props) {
	    super(props);
	    this.state = { 
	    	username: '',
	    	userpass: ''
	    };
	}

	doLogin= () =>{

		if(this.state.username == "") {
			Alert.alert('','请输入手机号');
			return;
		}
		if(this.state.userpass == "") {
			Alert.alert('','请输入密码');
			return;
		}
		this.sendNameAndPass();
	}


	async sendNameAndPass() {
		const bodystr = 'phoneno='+this.state.username+'&passwd='+this.state.userpass;
		const responseJson = await smartFetch(API.do_login,undefined,bodystr);
		
		if(responseJson.code == 0) {
			await AsyncStorage.setItem('userid', responseJson.data.userid);
			await AsyncStorage.setItem('accessToken', responseJson.data.accessToken);
			Alert.alert('', '登录成功');
		    // this.props.navigation.navigate('Mine', { name: 'Jane' });
		    this.props.navigation.goBack();
		} else {
			Alert.alert('',responseJson.msg);
		}
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={styles.bodyContent}>
				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/user.png')} style={styles.icon} />
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						onChangeText={(username) => this.setState({username})}
						value={this.state.username}
						placeholder= "请输入手机号" placeholderTextColor='#999'
						keyboardType="numeric"
					/>
				</View>
				<View style={styles.inputview}>
					<Image source={ require('../../assets/img/lock.png')} style={styles.icon} />
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						onChangeText={(userpass) => this.setState({userpass})}
						value={this.state.userpass}
						secureTextEntry={true}
						placeholder= "请输入密码" placeholderTextColor='#999'
					/>
				</View>
				<TouchableWithoutFeedback onPress={this.doLogin}>
					<View>
						<Text style={styles.button}>登录</Text>
					</View>
				</TouchableWithoutFeedback>
				
				<TouchableWithoutFeedback style={styles.goRegister} onPress={() => navigation.navigate('Register', { name: 'Jane' })}>
					<View style={styles.bottomView}>
						<Text style={styles.regLoginText}>注册 </Text>
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
		height: 40,
		lineHeight: 24,
		paddingVertical: 0,
		paddingHorizontal: 10,
		color: '#666',
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
	regLoginText:{
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
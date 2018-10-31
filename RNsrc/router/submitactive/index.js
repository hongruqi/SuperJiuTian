
import React, { Component }  from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';


export default class Submitactive extends Component {
	constructor(props) {
	    super(props);
	    this.state = { 
	    	activeName: '',
	    	activeTime: '',
	    	activeAddress: '',
	    	email: ''
	    };
	}
	// 初始化Header
	componentWillMount(){
		this.props.navigation.setParams({
			onSendPress: () => {
				this.submitActive()
			},
		})
	}

	submitActive= () =>{
		if(this.state.activeName == ""){
			Alert.alert('','请填入活动名称');
			return;
		}
		if(this.state.activeAddress == ""){
			Alert.alert('','请填入活动地址');
			return;
		}
		if(this.state.activeTime == ""){
			Alert.alert('','请填入活动时间');
			return;
			// this.state.activeTime = "2017-06-10";
		}
		if(this.state.email == ""){
			Alert.alert('','请填入活动邮箱');
			return;
		}
		this.sendActive();
	}

	async sendActive() {
		const bodystr = 'activeName='+this.state.activeName+'&activeTime='+this.state.activeTime+'&activeAddress='+this.state.activeAddress+'&email='+this.state.email+'&userid=1';
		const responseJson = await smartFetch(API.do_get_active,undefined,bodystr);
		
		Alert.alert('','发送成功');
		this.setState({
			activeName: '',
	    	activeTime: '',
	    	activeAddress: '',
	    	email: ''
		});
	}

	static navigationOptions = {
		title: '提交活动',
		header: ({ state, setParams, goBack, navigate}) => ({
			right: (
				<View>
					<TouchableWithoutFeedback onPress={state.params.onSendPress}>
						<View>
							<Text style={styles.headerBtn}>提交</Text>
						</View>
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
		})
	}


	render (){
		const {navigation} = this.props
		return (
			<View style={styles.inputContainer}>
				<View style={styles.imputItem}>
					<Text style={styles.inputTitle}>活动名称*</Text>
					<TextInput style={styles.input} 
						underlineColorAndroid='transparent'
						onChangeText={(activeName) => this.setState({activeName})}
						value={this.state.text} />
				</View>
				
				<View style={styles.imputItem}>
					<Text style={styles.inputTitle}>活动地点*</Text>
					<TextInput style={styles.input} 
						underlineColorAndroid='transparent'
						onChangeText={(activeAddress) => this.setState({activeAddress})}
						value={this.state.text} />
				</View>
				<View style={styles.imputItem}>
					<Text style={styles.inputTitle}>活动时间*</Text>
					<TextInput style={styles.input} 
						underlineColorAndroid='transparent'
						onChangeText={(activeTime) => this.setState({activeTime})}
						value={this.state.text} />
				</View>
				<View style={styles.imputItem}>
					<Text style={styles.inputTitle}>邮箱*</Text>
					<TextInput style={styles.input} 
						underlineColorAndroid='transparent'
						onChangeText={(email) => this.setState({email})}
						value={this.state.text} />
				</View>

				<View>
					<Text style={styles.tipText}>如果您想与天爱们分享活动，请填写以下基本信息；我们会发送“天文活动信息表”至您留的邮箱；信息确认后，平台将发布您的活动。</Text>
					<Text style={styles.tipText}>一路同行，探索宇宙！</Text>
				</View>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerBtn: {
		fontSize: 16,
		paddingRight: 15,
		color: '#fff',
	},
	inputContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	imputItem: {
		paddingVertical: 16,
		paddingHorizontal: 17,
		height: 55,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ededed',
		position: 'relative'
	},
	inputTitle: {
		fontSize: 16,
		color: '#5d5d5d'
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
	right: {
		width: 8,
		height: 14,
		position: 'absolute',
		right: 17,
		top: 17,
	},
	tipText: {
		fontSize: 14,
		lineHeight: 18,
		marginTop: 48,
		paddingHorizontal: 17,
		textAlign: 'center',
		color: '#ccc'
	}
})
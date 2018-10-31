
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
  TouchableWithoutFeedback,
  View
} from 'react-native';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';

export default class Feedback extends Component {
	constructor(props) {
	    super(props);
	    this.state = { 
	    	feedbackText: ''
	    };
	}
	// 初始化Header
	componentWillMount(){
		this.props.navigation.setParams({
			onSendPress: () => {
				this.sendFeedback()
			},
		})
	}

	static navigationOptions = {
		title: '意见反馈',
		header: ({ state, setParams, goBack, navigate}) => ({
			right: (
				<View>
					<TouchableWithoutFeedback onPress={state.params.onSendPress}>
						<View>
							<Text style={styles.headerBtn}>发送</Text>
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

	submitFeedback= () =>{
		this.sendFeedback();
	}

	async sendFeedback() {
		const bodystr = 'content='+this.state.feedbackText+'&userid=1';
		const responseJson = await smartFetch(API.do_feedback,undefined,bodystr);
		
		Alert.alert('','发送成功');
		this.setState({
			text : ""
		});
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={styles.bodyContent}>
				<View>
					<TextInput style={styles.input} underlineColorAndroid='transparent'
						multiline={true}
						onChangeText={(feedbackText) => this.setState({feedbackText})}
						value={this.state.text} placeholderTextColor='#999'
						placeholder= "欢迎您提问题或建议。请留下邮箱或qq，以便及时给您反馈。"
					/>
				</View>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerBtn:{
		color: '#fff',
		paddingHorizontal: 10,
		fontSize: 16,
	},
	bodyContent: {
		flex: 1,
	    backgroundColor: '#f9f9f9',
	},
	input: {
		height: 120,
		borderColor: '#eee',
		borderBottomWidth:1,
		paddingHorizontal: 13,
		backgroundColor: '#fff',
		lineHeight: 30,
	},
	button: {
		width:'98%'
	},
	regLoginText:{
		color: '#999',
		lineHeight: 30,
		fontSize: 20
	},
	inputview:{
		flexDirection: 'row',
	}
})
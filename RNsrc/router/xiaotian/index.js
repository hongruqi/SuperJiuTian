
import React, { Component }  from 'react';
import {
  ScrollView,
  ListView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  WebView
} from 'react-native';
import StackRouter from 'react-navigation';

import smartFetch from '../../component/common/fetch';
import API from '../../configData/api';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class Xiaotian extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			count: 1,
			inputValue: '',
			dataSource: [{
				direct: 1,
				article: [],
				content: '您好，我是小天，您的天文小助手！\n有什么问题，您可以在这里问题我！'
			}]
		}
	}

	doAsk = item => event =>{
		const askContnt = [{
			direct: 2,
			article: [],
			content: this.state.inputValue
		}]
		this.setState({
			dataSource : this.state.dataSource.concat(askContnt)
		});
		this.getAnswer();
		this.state.inputValue = "";
	}

	// get answer
	async getAnswer(){
		const bodystr = 'ask_content='+this.state.inputValue+'&userid=1';
		let answerStr, answerContnt;
		const responseJson = await smartFetch(API.get_xiaotian_answer,undefined,bodystr);
		answerStr = JSON.parse(responseJson.data.answer);
		answerContnt = [{
			direct: 1,
			content: answerStr.text,
			article: responseJson.data.article
		}]
		this.setState({
			dataSource : this.state.dataSource.concat(answerContnt)
		});
		setTimeout(() => {
		// to do : judge if listview height>screen height
			if (this.state.dataSource.length>4) {
				this._listView.scrollToEnd({animated: true})
			}
		})
			
	}

	render (){
		const {navigation} = this.props
		return (
			<View style={{flex:1,backgroundColor:'#f7f7f7'}}>
				<ListView 
					ref={(listView) => { this._listView = listView; }}
					style={styles.listView}
					dataSource={ds.cloneWithRows(this.state.dataSource)}
					renderRow={(rowData,idx) => {
						return (
							<View>
								<View style={[styles.msgItem,(rowData.direct==2 ? styles.msgItemRight : {})]}>
									<Image source={ rowData.direct==2 ? require('../../assets/img/ask_header.png') : require('../../assets/img/answer_header.png') }  style={styles.msgIcon}/>
									<View style={[styles.msgTextWrap,(rowData.direct==2 ? styles.msgTextWrapRight : {})]}>
										<Text style={[styles.msgText,(rowData.direct==2 ? styles.msgTextRight : {})]}>{rowData.content}</Text>
									</View>
								</View>
								{
									rowData.article && rowData.article.length ? (
										<View style={styles.linkWrap}>
											<Text style={styles.linkText}>推荐以下文章给你：</Text>  
											{ rowData.article.map((elem,idx) => {
												return (
													<TouchableWithoutFeedback key={'href'+elem.title} onPress={() => this.props.navigation.navigate('Detail', elem)} >
														<View><Text style={styles.linkTitle}>{`${idx+1}. ${elem.title}`}</Text></View>
													</TouchableWithoutFeedback>
												)
											}) }
										</View>
									) : null
								}
							</View>
						)
					}} />
				<View style={styles.inputWrap}>
					<TextInput 
						style={styles.textInput} selectionColor='#123456' underlineColorAndroid='transparent'
						onChangeText={(inputValue) => this.setState({inputValue})}
						value={this.state.inputValue} 
						placeholder='有什么问题尽管问我吧！' placeholderTextColor='#bbb' />
					<TouchableOpacity 
						onPress={this.doAsk()} >
						<View style={[styles.button,(!this.state.inputValue ? styles.buttonGrey : null)]}>
							<Text style={styles.buttonText}>发送</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	listView: {
		flex: 1,
		paddingTop: 10,
		marginBottom: 50,
	},
	msgItem:{
		paddingHorizontal: '3.3%',
		marginBottom: 14,
		flexDirection: 'row',
	},
	msgItemRight: {
		flexDirection: 'row-reverse'
	},
	msgIcon: {
		width: 23,
		height: 23,
		backgroundColor: '#e9e9e9'
	},
	msgTextWrap: {
		marginLeft: 7,
		borderRadius: 4,
		maxWidth: '64%',
		paddingTop: 6,
		paddingHorizontal: 10,
		paddingBottom: 10,
		backgroundColor: '#e9e9e9'
	},
	msgTextWrapRight: {
		marginRight: 7,
		backgroundColor: '#3680e1'
	},
	msgText: {
		lineHeight: 18,
		fontSize: 13,
		lineHeight: 20,
		color: '#333'
	},
	msgTextRight: {
		color: '#fff'
	},
	linkWrap: {
		marginHorizontal: '3.3%',
		marginTop: -10,
		marginBottom: 10,
		paddingLeft: 30,
		maxWidth: '95%'
	},
	linkText: {
		color: '#333',
		lineHeight: 22,
		fontSize: 12,
	},
	linkTitle: {
		color: '#3680e1',
		textDecorationLine: 'underline',
		lineHeight: 20,
		fontSize: 14
	},
	inputWrap: {
		position: 'absolute',
		bottom: 0,
		height: 50,
		width: '100%',
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	textInput: {
		height: 30, 
		borderColor: 'rgba(0, 0, 0, .15)', 
		borderWidth: 1,
		borderRadius: 4,
		width: '82%',
		paddingVertical: 0,
		paddingHorizontal: 8,
		marginRight: 8,
		fontSize: 13,
	},
	button: {
		height: 30,
		width: 55,
		borderRadius: 4,
		backgroundColor: '#3385ff',
		overflow: 'hidden',
	},
	buttonGrey: {
		backgroundColor: 'rgba(0, 0, 0, .2)'
	},
	buttonText: {
		textAlign: 'center',
		color: '#fff',
		lineHeight: 24,
	}
})
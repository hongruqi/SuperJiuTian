
import React, { Component }  from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  WebView
} from 'react-native';
import StackRouter from 'react-navigation';

export default class Webview extends Component {
	static navigationOptions = {
		title: 'webview',
		header: ({ state, setParams, goBack, navigate }) => ({
			style: {
				backgroundColor: '#000',
			},
			titleStyle: {
				color: '#fff',
			},
			tintColor: '#fff',
		})
	}
	state={
		img:(['https://facebook.github.io/react/img/logo_og.png',
				'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png',
				'http://www.ycombinator.com/images/ycombinator-logo-fb889e2e.png']).join(' ')
	}
	componentDidMount(){
		setTimeout(() => {
			this.catchEvent()
		},1000)
	}
	catchEvent = (event) => {
		// 在webview内部的网页中调用window.postMessage方法时可以触发此属性对应的函数，从而实现网页和RN之间的数据交换。 设置此属性的同时会在webview中注入一个postMessage的全局函数并覆盖可能已经存在的同名实现。
		// 网页端的window.postMessage只发送一个参数data，此参数封装在RN端的event对象中，即event.nativeEvent.data。data 只能是一个字符串。
		// const IMGJSON = JSON.stringify(event.nativeEvent.data)
		const IMGJSON = JSON.stringify(this.state.img)
		this.props.navigation.navigate('ViewImg', { img: IMGJSON })
	}
	render(){
		const {navigation} = this.props
		return (
			<View style={styles.flex}>
				<WebView 
					source={{uri: navigation.state.params.url}}
					style={styles.flex} 
					onMessage={this.catchEvent}/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	flex: {
		flex: 1
	}
})
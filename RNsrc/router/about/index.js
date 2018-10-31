
import React, { Component }  from 'react';
import {
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

export default class About extends Component {
	render (){
		const {navigation} = this.props
		return (
			<View style={styles.about}>
				<Image source={ require('../../assets/img/logo.png')} style={styles.logo}/>
				<Text>2.0.19</Text>
				<Text style={styles.description}>
					展现天文资讯，推荐天文作品、分享天文经验，一路同行探索宇宙！
					{'\n'}{'\n'}
					欢迎发邮件到 feedback@jiutianxingkong.com 交流！
				</Text>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	about: {
		flex: 1,
		paddingVertical: 32,
		paddingHorizontal: 38,
		alignItems:'center',
	    backgroundColor: '#fff',
	},
	logo: {
		width: 55,
		height: 55,
		marginBottom: 3,
	},
	description: {
		marginTop: 5,
		color: '#666',
		lineHeight: 26,
		fontSize: 14
	}

})
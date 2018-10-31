import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

let WeChat = require('react-native-wechat');

export default class TopNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true
		};
	}

	render () {
		const {goBack} = this.props
		return (
			<View style={styles.topNavWrap}>
				<TouchableWithoutFeedback 
					style={styles.goBackWrap}
					onPress={goBack}>
					<Image style={styles.goBack} source={require('../../assets/img/back-icon@3x.ios.png')} />
				</TouchableWithoutFeedback>
				<Text>{this.props.title || ''}</Text>
				<View style={styles.rightBtnWrap}>
					<TouchableWithoutFeedback onPress={this.props.onCollectPress}>
						<Image source={require('../../assets/img/share.png')} style={[styles.icon,{height:25}]} />
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={this.props.onNavSharePress}>
						<Image source={require('../../assets/img/share.png')} style={[styles.icon,{height:25}]} />
					</TouchableWithoutFeedback>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	topNavWrap: {
		width: '100%',
		height: 65,
		backgroundColor: '#205ba9',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 10,
	},
	goBackWrap: {
		width: 60,
		height: 60,
		backgroundColor: '#fff',
	},
	goBack: {
		marginLeft: 10,
		width: 14,
		height: 24,
	},
	rightBtnWrap: {
		marginRight: -17,
		flexDirection: 'row',
	},
	icon:{
		width: 22,
		height: 22,
		marginRight: 30,
	},
})
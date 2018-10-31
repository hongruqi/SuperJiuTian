import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const IconMenuNews = require('../../assets/img/menu_news.png')
const IconMenuNewsOn = require('../../assets/img/menu_news_on.png')

const IconMenuActive = require('../../assets/img/menu_active.png')
const IconMenuActivesOn = require('../../assets/img/menu_active_on.png')

const IconMenuMine = require('../../assets/img/menu_mine.png')
const IconMenuMineOn = require('../../assets/img/menu_mine_on.png')

export default class BottomNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true
		};
	}
	componentWillReceiveProps(nextProps){
		let flag = true 
		for (let i = 0; i < nextProps.navigationState.routes.length; i++) {
			if (nextProps.navigationState.routes[i].index>0) {
				flag = false
				break
			}
		}
		this.state.visible = flag
	}
	render () {
		const {navigation} = this.props
		const routeIdx = this.props.navigationState.index
		return (
			<View style={[styles.navigetionBar,(!this.state.visible? {height:1}: {})]}>
				<TouchableWithoutFeedback onPress={() => navigation.navigate('Homes', {})}>
					<View style={styles.navigetionItem}>
						{
							routeIdx === 0 
							?
							<Image source={IconMenuNewsOn} style={styles.navigetionBarItem}/>
							:
							<Image source={IconMenuNews} style={styles.navigetionBarItem}/>
						}
						<Text style={[styles.name, (routeIdx === 0 ? styles.activeTintColor : {})]}>资讯</Text>
					</View>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => navigation.navigate('Actives', {})}>
					<View style={styles.navigetionItem}>
						{
							routeIdx === 1 
							?
							<Image source={IconMenuActivesOn} style={styles.navigetionBarItem}/>
							:
							<Image source={IconMenuActive} style={styles.navigetionBarItem}/>
						}
						<Text style={[styles.name, (routeIdx === 1 ? styles.activeTintColor : {})]}>活动</Text>
					</View>
				</TouchableWithoutFeedback>
				<TouchableWithoutFeedback onPress={() => navigation.navigate('Mines', {})}>
					<View style={styles.navigetionItem}>
						{
							routeIdx === 2 
							?
							<Image source={IconMenuMineOn} style={styles.navigetionBarItem}/>
							:
							<Image source={IconMenuMine} style={styles.navigetionBarItem}/>
						}
						<Text style={[styles.name, (routeIdx === 2 ? styles.activeTintColor : {})]}>我的</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	navigetionBar:{
		height: 56,
		backgroundColor: '#f6f6f6',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopColor: '#dcdcdc',
		borderTopWidth: 1,
	},
	navigetionItem: {
		flex: 1,
		paddingTop: 4,
		alignItems: 'center',
	},
	navigetionBarItem: {
		width: 35,
		height: 35,
	},
	name:{
		marginTop: 1,
		fontSize: 12,
		color: '#474747'
	},
	activeTintColor:{
		color: '#205ba9'
	}
})
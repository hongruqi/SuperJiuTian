import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default class Search extends Component {

	render () {
		let rowData = this.props.data
		return (
			<TouchableWithoutFeedback onPress={this.props.pressFunc}>
				<View style={styles.activeItem}>
					<Image source={{uri: rowData.thumbImage}} style={styles.activeImg}/>
					<View style={styles.right}>
						<Text style={[styles.title,styles.titleTop]} numberOfLines={2}>
							{
								rowData.channelName
								? 
								<Text style={[styles.textSmall,styles.dingTxt]}>{' '+rowData.channelName+' '}</Text>
								: null
							}
							{(rowData.channelName ? ' ' : '')+rowData.title}
						</Text>
						{
							rowData.channelName
							?
							<View style={styles.location}>
								<Image style={styles.locationIcon} source={ require('../../assets/img/location.png') } />
								<Text style={[styles.title,styles.textLocation]}>{' '+rowData.hddz}</Text>
							</View>
							: null
						}
						<View style={styles.info}>
							<Text style={[styles.title,styles.textSmall,styles.source]}>{rowData.source}</Text>
							<Text style={[styles.title,styles.textSmall,styles.time]} numberOfLines={1}>{rowData.createTime}</Text>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	right:{
		flex: 1,
		flexDirection: 'column',
		marginTop: -3,
	},
	title:{
		color: '#333',
		lineHeight: 20,
		marginBottom: 3,
		position: 'relative',
		alignItems: 'center',
	},
	titleTop:{
		marginTop: 3,
		lineHeight: 20,
	},
	dingTxt:{
		color: '#fff',
		backgroundColor: '#1277db',
	},
	locationIcon:{
		width: 10,
		height: 14,
	},
	location: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		bottom: 12,
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		bottom: -8,
	},
	textLocation: {
		fontSize: 12,
		color: '#6f6f6f',
	},
	textSmall: {
		fontSize: 12,
		color: '#8a8a8a',
	},
	source:{
		marginRight: 5,
	},
	name: {
		color: '#fff',
		backgroundColor: '#205ba9',
		lineHeight: 16,
		height: 17,
		paddingHorizontal: 6,
		marginBottom: 0,
		marginRight: 8,
	},
	time:{
		flex: 1,
		textAlign: 'right',
		lineHeight: 22,
	},
	activeItem: {
		height: 96,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 10,
		position: 'relative',
	},
	activeImg: {
		width: 98,
		height: 72,
		marginRight: 10
	}
})
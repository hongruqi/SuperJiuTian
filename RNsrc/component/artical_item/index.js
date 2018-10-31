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
				<View style={styles.articalItem}>
					<Image source={{uri: rowData.thumbImage}} style={styles.articleImg}/>
					<View style={styles.right}>
						<Text style={[styles.title,styles.titleTop]} numberOfLines={2}>
							{
								rowData.isUp==1 
								? 
								<Text style={[styles.textSmall,styles.dingTxt]}> 置顶 </Text>
								: null
							}
							{(rowData.isUp==1 ? ' ' : '')+rowData.title}
						</Text>
						
						<View style={styles.info}>
							<Text style={[styles.title,styles.textSmall,styles.source]}>{rowData.source}</Text>
							{
								rowData.channelName 
								? 
								<Text style={[styles.title,styles.textSmall,styles.name]}>{rowData.channelName}</Text>
								: null
							}
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
		lineHeight: 16,
	},
	dingTxt:{
		color: '#fff',
		backgroundColor: '#1277db',
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'absolute',
		bottom: -8,
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
	articalItem: {
		height: 88,
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		paddingVertical: 10,
		position: 'relative',
		backgroundColor: '#fff',
	},
	articleImg: {
		width: 99,
		height: 69,
		marginRight: 10
	}
})
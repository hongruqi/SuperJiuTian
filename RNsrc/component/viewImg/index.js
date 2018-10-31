
import React, { Component }  from 'react';
import {
  Alert,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  AppRegistry,
  Text,
  Modal,
  Platform, 
  PermissionsAndroid, 
  NativeModules,
  CameraRoll,
} from 'react-native';
import StackRouter from 'react-navigation';
// import DeviceInfo from 'react-native-device-info';
// var DeviceInfo = require('react-native-device-info');

// import Swiper from 'react-native-swiper';
// import PhotoView from 'react-native-photo-view';

import ImageViewer from 'react-native-image-zoom-viewer';


const { width, height } = Dimensions.get('window')

export default class ViewImg extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentimgno:0,
			imgallarr:[],
		};	
	}
	// <View style={styles.slide}>
	// 	<Image 
	// 	source={{uri: url}}
	// 	style={styles.image} />
	// </View>

		// <PhotoView
		// source={{uri: url}}
		// resizeMode='contain'
		// minimumZoomScale={0.5}
		// maximumZoomScale={3}
		// androidScaleType='center'
		// onTap={() => this.props.navigation.goBack()}
		// style={styles.photo} />
	
	static navigationOptions = {
		title: '',	
		header: { visible: false },
	}

	state = {
		init: false,
	}

	componentDidMount(){
		// this.findIndex();
		setTimeout(() => {
			
			this.setState({
				init: true
			})
		}, 200)
	}

	findIndex = () => {
		const IMGARR = this.props.navigation.state.params.img_arr.split(' ');
		const CURIMGSRC = this.props.navigation.state.params.info.src;
		for(var i=0;i<IMGARR.length;i++)
		{
			if(IMGARR[i] == CURIMGSRC)
			{
				this.state.curentImg = i;
				break;
			}
		}
		return this.state.curentImg
	}




	async saveimg11()
	{
		let url = this.state.imgallarr[this.state.currentimgno];


    	const grantedWrite = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )
    		Alert.alert('',JSON.stringify(grantedWrite));

        // if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
            if(1) {
        	path = RNFS.CachesDirectoryPath;

			var timestr = Date.now();

			let options = {
				fromUrl:url,
				toFile:'${path}/jiutianimg${timestr}',
				background:true
			}
			Alert.alert('',options.toFile);
			RNFS.downloadFile(options).promise.then(res => {
				var tempURL = path+'/jiutianimg'+timestr;
				Alert.alert('',tempURL);
				try{
					var promise = CameraRoll.saveToCameraRoll(tempURL,'photo');
					promise.then(succ=>{
						Alert.alert('','succ');
					}).catch(err=>{
						Alert.alert('',"222"+JSON.stringify(err));
					})
				}catch(err){
					Alert.alert('',"111"+JSON.stringify(err));
				}
			}).catch(err => {
				Alert.alert('',"333"+JSON.stringify(err));
			})

        } else {
        	Alert.alert('','请开启手机存储权限');
            // Toast.info("请开启手机存储权限", 2);
        }

	}

	saveImgSuccess = () => {
	    if(Platform.OS === 'android') {
	    	
	    	// this.saveimg11();
var RNFS = require('react-native-fs');
	    		var timestr = Date.now();
	    		// const downloadDest22 = RNFS.MainBundlePath+timestr+'.jpg';
		        // const downloadDest = RNFS.DocumentDirectoryPath+'/'+timestr+'.jpg';


		  //       fromurl1 = this.state.imgallarr[this.state.currentimgno];
		  //       const downloadDest = `${RNFS.DocumentDirectoryPath}/${((Math.random() * 1000) | 0)}.jpg`;
		  //       const ret = RNFS.downloadFile({ fromUrl: fromurl1, toFile: downloadDest, begin, progress, background, progressDivider });
				// jobId = ret.jobId;
				// return;


		        const downloadDest = RNFS.ExternalDirectoryPath+'/jiutianimg'+timestr+'.jpg';
		        


		        // const downloadDest = RNFS.MainBundlePath+timestr+'.jpg';
		        // const downloadDest = '/tmp/jiutianimg'+timestr+'.jpg';


		        // console.log('aaaaaaaaaaaaaaaaaaa', RNFS.DocumentDirectoryPath);
		        // console.log('bbbbbbbbbbbbbbbbbbbbbbb', RNFS.MainBundlePath);
		        // console.log('cccccccccccccccccccccccccc', RNFS.CachesDirectoryPath);

		        // console.log('dddddddddddd', RNFS.ExternalDirectoryPath);
		        // console.log('eeeeeeeeeeee', RNFS.ExternalStorageDirectoryPath);
		        
		        // Alert.alert('ww',this.state.currentimgno);

		        const formUrl = this.state.imgallarr[this.state.currentimgno];

				// console.log('fffffffffffffffffffffffffffff', formUrl);

		        const options = {
		            fromUrl: formUrl,
		            toFile: downloadDest,
		            progressDivider:1,
		            background: true,
		            begin: (res) => {
		                console.log('begin', res);
		                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
		            },
		            progress: (res) => {

		                let pro = res.bytesWritten / res.contentLength;

		                // this.setState({
		                //     progressNum: pro,
		                // });
		            }
		        };
		        try {
		            const ret = RNFS.downloadFile(options);

		            jobId = ret.jobId;


		            ret.promise.then(res => {
		                // console.log('success', res);

		                // console.log('file://' + downloadDest)

		                jobId = -1;
// 		                Alert.alert('',"77"+downloadDest);
// Alert.alert('',"555"+JSON.stringify(res));

						// var promise = CameraRoll.saveToCameraRoll(downloadDest,'photo');
						// promise.then(succ=>{
						// 	Alert.alert('','succ');
						// }).catch(err=>{
						// 	Alert.alert('',"999"+JSON.stringify(err));
						// })


						var tempURL = "file://" + downloadDest;
						// console.log('kkkkkkkkkkkkkkkkkkkkkkk', tempURL);
						try{
							var promise = CameraRoll.saveToCameraRoll(tempURL,'photo');
							// var promise = CameraRoll.saveImageWithTag(tempURL);
							promise.then(succ=>{
								Alert.alert('','保存成功');
							}).catch(err=>{
								console.log("dddddddddd"+JSON.stringify(err));
								// Alert.alert('',"11"+JSON.stringify(err));
							})
						}catch(err){
							console.log("vvvvvvvvvvvvvv"+JSON.stringify(err));
							// Alert.alert('',"22"+JSON.stringify(err));
						}




		            }).catch(err => {
		                console.log('err', err);
		            });
		        }
		        catch (e) {
		            console.log(error);
		        }







	    }
	    else
	    {
	    	Alert.alert('','保存成功');
	    }

	}


	saveImgSuccess2 = () => {
	    if(Platform.OS === 'android') {
	    	let url = this.state.imgallarr[this.state.currentimgno];

			this.requestWritePermission(url);
	        if(!!url) {
	            // if (parseFloat(DeviceInfo.getSystemVersion()) >= 6.0) {//6.0及以上
	            //     console.log(DeviceInfo.getSystemVersion());
	            //     this.requestWritePermission(url);
	            // }else {
	                NativeModules.imageDownload.imageProcess(url, (boo) => {
	                    console.log(boo);
	                    if (boo) {
	                    	Alert.alert('','图片保存成功！');
	                        // Toast.show("图片保存成功！", 1);
	                    } else {
	                    	Alert.alert('','图片保存失败！');
	                        // Toast.show("图片保存失败！", 1);
	                    }
	                });
	            // }
	        }
	    }
	    else
	    {
	    	Alert.alert('','保存成功');
	    }

	}

	/**
	 * 请求Android写权限
	 */
	async requestWritePermission(url) {

	    try {
	        const grantedWrite = await PermissionsAndroid.request(
	            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
	        )
	        if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
	            NativeModules.imageDownload.imageProcess(url, (boo) => {
	                console.log(boo);
	                if(boo) {
	                	Alert.alert('','图片保存成功！');
	                    // Toast.info("图片保存成功！", 2);            
	                }else {
	                	Alert.alert('','图片保存失败！');
	                    // Toast.info("图片保存失败！", 2);
	                }
	            });
	        } else {
	        	Alert.alert('','请开启手机存储权限');
	            // Toast.info("请开启手机存储权限", 2);
	        }
	    } catch (err) {
	        console.warn(err)
	    }

	}




	// const images = [
	// {url:'http://101.200.185.62/public/image/20170816/1502820774990064.jpg'}, 
	// {url: 'http://101.200.185.62/public/image/20170816/1502820777842089.jpg'}, 
	// {url: 'http://101.200.185.62/public/image/20170816/1502820782143816.jpg'},
	// {url: 'http://101.200.185.62/public/image/20170816/1502820081230332.jpg'},
	// {url: 'http://101.200.185.62/public/image/20170815/1502808588668330.jpg'},
	// {url: 'http://101.200.185.62/public/image/20170816/1502820240856227.jpg'},
	// {url: 'h


	// const images = [
	// {url:'http://101.200.185.62/public/image/20170815/1502809487336544.gif'}, 
	// {url: 'http://101.200.185.62/public/image/20170815/1502809401585477.gif'}, 
	// {url: 'http://101.200.185.62/public/image/20170815/1502808583937337.png'}]



	changeindexno = (indexno) => 
	{
		this.state.currentimgno = indexno.toString();
		// Alert.alert('',JSON.stringify(indexno));
	}



	render(){		
		const IMGARR = this.props.navigation.state.params.img_arr.split(' ');
		this.state.imgallarr = IMGARR;
		imgarr = [];
		for(var i in IMGARR){
			imgarr.push({"url":IMGARR[i]});
		}
		const images = imgarr;


		let curimgno = 0;
		const CURIMGSRC = this.props.navigation.state.params.info.src;
		for(var i=0;i<IMGARR.length;i++)
		{
			if(IMGARR[i] == CURIMGSRC)
			{
				curimgno = i;
				this.state.currentimgno = curimgno;
				break;
			}
		}

		// const images = [
		// {url:'http://101.200.185.62/public/image/20170815/1502809487336544.gif'}, 
		// {url: 'http://101.200.185.62/public/image/20170815/1502809401585477.gif'}, 
		// {url: 'http://101.200.185.62/public/image/20170815/1502808583937337.png'}]

		return (
            // <Modal visible={true} transparent={true}>
            //     <ImageViewer imageUrls={images}/>
            // </Modal>
            // onPress={() => {this.props.navigation.goBack()}}
            <Modal 
            	visible={true} 
            	transparent={true} 
            	// onCancel={() => console.log('----')} 
            	// onClick={this.handleClick.bind(this)}
            	
            	style={{ height: 500, width: 500 }}>
				<ImageViewer 
				onClick={() => {this.props.navigation.goBack()}}
				imageUrls={images} 
				visible={true} 
				enableImageZoom={true} 
				saveToLocalByLongPress={true}
				index={(curimgno)} 

				// onChange={(indexno) => this.state.currentimgno={indexno}}
				onChange={this.changeindexno}
				onSaveToCamera={this.saveImgSuccess}
				// onSave={() => { alert("ss");}}
				/>
			</Modal>
        )

		// const IMGARR = this.props.navigation.state.params.img_arr.split(' ');
		// return (
		// 	<View style={[styles.shadow, styles.flex]}>
		// 		{
		// 			this.state.init ?
		// 			<Swiper ref='swiperView'
		// 				loop={false} bounces={true}
		// 				loadMinimal={true} loadMinimalSize={1}
		// 				index={this.state.curentImg} >
		// 				{
		// 					IMGARR.map((url,idx) => {
		// 						return (
		// 							<View key={'idx-'+idx} style={[styles.slide]}>
		// 							<TouchableWithoutFeedback
		// 								onPress={() => {this.props.navigation.goBack()}} >
		// 								<View style={styles.slide}>
		// 								<Image 
		// 								source={{uri: url}}
		// 								style={styles.image} />
		// 							</View>
		// 							</TouchableWithoutFeedback>
		// 							</View>
		// 						)
		// 					})
		// 				}
		// 			</Swiper> : null
		// 		}
		// 	</View>
		// )
	}
}

const styles = StyleSheet.create({
	flex: {
		flex: 1
	},
	color: {
		backgroundColor: '#fff'
	},
	slide: {
		flex: 1,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	photo: {
		width,
		height,
		flex: 1
	},
	shadow: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, .7)'
	},
	image: {
		flex: 1,
		height: '100%',
		width: '100%',
		resizeMode: 'contain',
	}
})
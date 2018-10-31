
import {
  ToastAndroid,
  AsyncStorage,
} from 'react-native';

import CONFIG_MESSAGE from '../../configData/message';

const DEFAULT_OPTIONS = {
  'credentials': 'include',
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
};

export default async function smartFetch(url, options = {} ,bodystr = "") {
  try {
    // const Options = { ...DEFAULT_OPTIONS, ...options};
    
    const userid = await AsyncStorage.getItem('userid');
    const accesstoken = await AsyncStorage.getItem('accessToken');

    let DEFAULT_OPTIONS_COOKIE = {
      'credentials': 'include',
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let cookiestr = "";
    if(userid !=  null && accesstoken != null)
    {
        DEFAULT_OPTIONS_COOKIE = {
          'credentials': 'include',
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': 'userid='+userid+';accessToken='+accesstoken+';',
        };
    }
    

    const Options = {
      headers:DEFAULT_OPTIONS_COOKIE,
    };

    if(bodystr != "")
    {
        Options = {
          method:'POST',
          body:bodystr,
          headers:DEFAULT_OPTIONS_COOKIE,
        };
    }

    const res = await fetch(url, Options);

    if (!res.ok) {
      ToastAndroid.show(CONFIG_MESSAGE.error_network, ToastAndroid.LONG);
      return;
    }

    const json = await res.json();

    return json;

  } catch(err) {
    ToastAndroid.show(String(err), ToastAndroid.LONG);
  }
};
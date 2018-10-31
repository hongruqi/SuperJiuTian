
const URL_BASE= 'http://jiutianxingkong.com/';
module.exports =  {
	get_essay : `${URL_BASE}?c=News&a=api_list_new&channelId=`,
	get_types : `${URL_BASE}?c=news&a=api_channel_list_v2`,
	get_detail : `${URL_BASE}?c=news&a=api_detail_new&articleId=`,
	get_xiaotian_answer : `${URL_BASE}?c=xiaotian&a=ask`,
	do_feedback : `${URL_BASE}?c=Feedback&a=send_feedback`,
	get_collection : `${URL_BASE}?c=Collect&a=api_list`,
	do_login : `${URL_BASE}?c=Auth&a=api_login`,
	do_reg : `${URL_BASE}?c=Auth&a=api_register`,
	get_msg : `${URL_BASE}?c=Auth&a=api_pincode`,
	get_search : `${URL_BASE}?c=news&a=api_search_list`,
	get_userinfo : `${URL_BASE}?c=User&a=api_userinfo`,
	do_collection : `${URL_BASE}?c=Collect&a=api_collect`,
	do_remove_collection : `${URL_BASE}?c=Collect&a=api_remove`,
	get_active_list : `${URL_BASE}?c=News&a=api_active_list`,
	do_get_active : `${URL_BASE}?c=Active&a=apply_active`,
	get_active_channel : `${URL_BASE}?c=News&a=api_active_channel_list`,
	get_tuijian_tag : `${URL_BASE}?c=News&a=api_tag_list_tuijian`,
	get_article_by_tag : `${URL_BASE}?c=News&a=api_search_list_by_tag`,
	get_tag_by_search : `${URL_BASE}?c=News&a=api_tag_list_search`,
	get_tag_all : `${URL_BASE}?c=News&a=api_tag_list_all`
}
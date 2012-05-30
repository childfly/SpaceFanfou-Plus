/* 扩展信息 */

var plugins = [

	/* 页面样式扩展 */

	{
		name: 'font_reset_cn',
		css: 'font_reset_cn.css'
	},
	{
		name: 'translucent_sidebar',
		css: 'translucent_sidebar.css'
	},
	{
		name: 'box_shadows',
		css: 'box_shadows.css'
	},
	{
		name: 'newstyle_trendlist',
		css: 'newstyle_trendlist.css'
	},
	{
		name: 'newstyle_op_icons',
		css: 'newstyle_op_icons.css'
	},
	{
		name: 'logo_remove_beta',
		css: 'logo_remove_beta.css',
		js: 'logo_remove_beta.js'
	},
	{
		name: 'remove_app_recom',
		css: 'remove_app_recom.css'
	},

	/* 页面功能性扩展 */

	{
		name: 'expanding_replies',
		options: ['number', 'auto_expand'],
		js: 'expanding_replies.js',
		css: 'expanding_replies.css'
	},
	{
		name: 'user_switcher',
		js: 'user_switcher.js',
		css: 'user_switcher.css'
	},
	{
		name: 'float_message',
		options: ['noajaxattop', 'notlostfocus', 'keepmentions'],
		js: 'float_message.js',
		css: 'float_message.css'
	},
	{
		name: 'disable_autocomplete',
		js: 'disable_autocomplete.js'
	},
	{
		name: 'privatemsg_manage',
		js: 'privatemsg_manage.js',
		css: 'privatemsg_manage.css'
	},
	{
		name: 'friend_manage',
		js: 'friend_manage.js',
		css: 'friend_manage.css'
	},
	{
		name: 'advanced_sidebar',
		js: 'advanced_sidebar.js',
		css: 'advanced_sidebar.css'
	},
	{
		name: 'clean_personal_theme',
		js: 'clean_personal_theme.js',
		css: 'clean_personal_theme.css'
	},
	{
		name: 'auto_pager',
		js: 'auto_pager.js'
	},

	/* 其他扩展 */

	{
		name: 'share_to_fanfou',
		type: 'background',
		js: 'share_to_fanfou.js'
	},
	{
		name: 'notification',
		type: 'background',
		options: ['updates', 'mentions', 'followers', 'notdisturb', 'playsound'],
		js: 'notification.js'
	}

];

/* 历史记录 */

var history = {
	'0.6.6.0': ['新增通知插件 (具体功能见设置页)', '更新设置页']
};

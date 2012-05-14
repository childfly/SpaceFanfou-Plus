SF.st = {};

/* 选项默认值 */

SF.st.default_settings = {
	font_reset_cn: false,
	translucent_sidebar: true,
	box_shadows: false,
	newstyle_trendlist: true,
	newstyle_op_icons: true,
	logo_remove_beta: true,
	remove_app_recom: true,
	amy_star: false,
	expanding_replies: true,
	'expanding_replies.number': 3,
	'expanding_replies.auto_expand': false,
	image_uploading: true,
	user_switcher: false,
	float_message: false,
	'float_message.noajaxattop': false,
	'float_message.notlostfocus': false,
	'float_message.keepmentions': false,
	disable_autocomplete: false,
	share_to_fanfou: true,
	privatemsg_manage: true,
	friend_manage: true,
	advanced_sidebar: true,
	clean_personal_theme: false,
	auto_pager: true
};

/* 读取选项 */

SF.st.settings = (function() {
	var settings = JSON.parse(localStorage['settings']);
	for (var key in SF.st.default_settings) {
		if (! SF.st.default_settings.hasOwnProperty(key)) continue;
		if (settings[key] === undefined)
			settings[key] = SF.st.default_settings[key];
	}

	return settings;
})();

SF.pl.notification = new SF.plugin((function() {
	var notifyonupdated, notifyonmentioned, notifyonfollowed, notdisturb, timeout;
	var period = 30000;

	var source;
	var data, old_data;
	var username;

	var web_url = 'http://fanfou.com/';
	var wap_url = 'http://m.fanfou.com/home';
	var xhr = new XMLHttpRequest;

	var visiting_ff = false;

	var options = {
		at: ['mentions', '你被 @ 了 %n 次'],
		pm: ['privatemsg', '你有 %n 封未读私信'],
		fo: ['home', '有 %n 个新饭友关注了你'],
		fo_req: ['home', '有 %n 个新饭友请求关注你']
	};

	var timer = {
		interval: null,
		setup: function() {
			this.cancel();
			this.interval = setInterval(check, period);
		},
		cancel: function() {
			if (! this.interval) return;
			clearInterval(this.interval);
			this.interval = null;
		}
	};

	var onActivated = (function() {
		var timeout;
		return function(info) {
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				chrome.tabs.get(info.tabId, function(tab) {
					if (visiting_ff = (tab != null && checkURL(tab.url)))
						hideAllNotifications();
				});
			}, 50);
		}
	})();

	function getUpdates() {
		if (! updates) return;
		if (updates.length === 1)
			return updates[0];
		return updates.map(function(item, i) {
			return (i + 1) + '. ' + item;
		}).join('; ');
	}

	function check() {
		abort();
		xhr.open('GET', wap_url, true);
		xhr.onload = onload;
		try {
			xhr.send(null);
		} catch (e) { }
	}

	function onload() {
		source = xhr.responseText;
		if (! xhr.status || ! source)
			return;
		if (! checkIfLoggedIn())
			return;

		old_data = data;
		data = { counts: {} };

		getUsername();
		if (old_data.username &&
			data.username != old_data.username) {
			reset();
		}

		count();
		data.sum && notify();

		source = '';
	}

	function abort() {
		try {
			xhr.abort();
		} catch (e) { }
	}

	function reset() {
		data = { counts: {} };
		old_data = { counts: {} };
		username = '';
	}

	function checkIfLoggedIn() {
		var re = /<a href=\"\/home(\?v=\d+)?\">刷新<\/a>/;
		return re.test(source);
	}

	function getUsername() {
		var re = /<title> 饭否 \| 欢迎你，(.+)<\/title>/;
		data.username = source.match(re)[1];
	}

	function count() {
		var sum = 0;
		if (notifyonmentioned) {
			checkAt();
			checkPM();
		}
		if (notifyonfollowed) {
			checkFo();
		}
		var counts = data.counts;
		for (var key in counts) {
			if (! counts.hasOwnProperty(key)) continue;
			counts[key] && (counts[key] = counts[key][1]);
			counts[key] = parseInt(counts[key], 10) || 0;
			sum += counts[key];
		}
		data.sum = sum;
	}

	function checkAt() {
		var re = /<a href=\"\/mentions\">@我的\((\w*)\)<\/a>/;
		data.counts.at = source.match(re);
	}

	function checkPM() {
		var re = /<a href="\/privatemsg">你有 (\d+) 条新私信<\/a>/;
		data.counts.pm = source.match(re);
	}

	function checkFo() {
		data.counts.fo = source.match(/<p>(\d+) 个人关注了你<\/p><p><span><a href=/);
		data.counts.fo_req = source.match(/(\d+) 个人申请关注你，<a href="/);
	}

	function notify() {
		if (notdisturb && visiting_ff) return;

		var items = [];
		var counts = data.counts;
		var old_counts = old_data.counts;

		for (var type in counts) {
			if (! counts.hasOwnProperty(type)) continue;
			if (counts[type] && (! old_counts[type] || counts[type] > old_counts[type])) {
				items.push(type);
			}
		}

		items.forEach(function(item) {
			var template = options[item][1];
			var content = template.replace(/%n/, counts[item]);
			var path = options[item][0];
			showNotification({
				id: item,
				type: 'text',
				content: content,
				timeout: timeout
			}).
			addEventListener('click', function(e) {
				this.cancel();
				createTab(web_url + path);
			}, false);
		});
	}

	function load() {
		if (notdisturb)
			chrome.tabs.onActivated.addListener(onActivated);

		if (notifyonupdated && SF.updated) {
			var updated_items = getUpdates() || '';
			if (updated_items)
				updated_items = '更新内容: ' + updated_items;

			var t = updates.length * 5000;
			t = Math.max(t, 15000);
			t = Math.min(t, 60000);

			showNotification({
				type: 'text',
				title: '太空饭否++ 由 ' + SF.old_version + ' 升级至 ' + SF.version,
				content: updated_items,
				timeout: t
			}).
			addEventListener('click', function(e) {
				this.cancel();
			}, false);

			SF.updated = false;
		}
		if (notifyonmentioned || notifyonfollowed) {
			timer.setup();
			check();
		}
	}

	function unload() {
		abort();
		timer.cancel();
		reset();
		hideAllNotifications();
		chrome.tabs.onActivated.removeListener(onActivated);
	}

	return {
		update: function(a, b, c, d, _, e) {
			notifyonupdated = a;
			notifyonmentioned = b;
			notifyonfollowed = c;
			notdisturb = d;
			timeout = e * 1000;
			unload();
			load();
		},
		unload: unload
	};
})());
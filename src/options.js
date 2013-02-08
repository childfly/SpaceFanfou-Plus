var $ = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

function forEach(array, func, context) {
	return Array.prototype.forEach.call(array, func, context);
}

document.addEventListener('DOMContentLoaded', function() {
	function getValue($elem) {
		if ($elem.type == 'checkbox')
			return $elem.checked;
		else
			return JSON.parse($elem.value);
	}
	function setValue($elem, value) {
		if ($elem.type == 'checkbox') {
			if ($elem.checked !== value)
				SF.fn.emulateClick($elem);
		} else $elem.value = value;
	}

	var $foldables = $$('[foldable]');
	forEach($$('[foldable]'), function($foldable) {
		var $foldable_src = $foldable.querySelector('[foldable_src]');
		setValue($foldable_src, true);

		$foldable_src.addEventListener('change', function(e) {
			if (getValue(this))
				$foldable.classList.remove('folded');
			else
				$foldable.classList.add('folded');
		}, false);
	});
	forEach($$('[foldable_tgt]'), function($f) {
		$f.style.height = $f.offsetHeight + 'px';
	});

	document.body.classList.add('init');
	forEach($$('.tabs ul'), function($ul) {
		$ul.style.maxHeight = $ul.offsetHeight + 'px';
	});
	document.body.classList.remove('init');

	// 获取选项信息
	forEach($$('[key]'), function($t) {
		setValue($t, SF.st.settings[$t.getAttribute('key')]);
	});

	forEach($$('.btn_apply'), function(btn) {
		btn.addEventListener('click', function() {
			forEach($$('[key]'), function($t) {
				var key = $t.getAttribute('key');
				SF.st.settings[key] = getValue($t);
			});
			localStorage['settings'] = JSON.stringify(SF.st.settings);
		});
	});

	addEventListener('unload', function() {
		SF.fn.emulateClick($$('.btn_apply')[0]);
	}, false);

	$('version').textContent = localStorage['sf_version'];

	var $wrapper = $('wrapper');
	var $screenshots = $$('.screenshot');
	var $tabs = $('tabs');
	var $screenshot = $('screenshot');
	var $preview_img = $('preview_img');
	var $preview_des = $('preview_des');

	for (var i = 0; i < $screenshots.length; i++) {
		var $ss = $screenshots[i];
		$ss.description = $ss.title;
		$ss.title = '';
		$ss.addEventListener('mouseover', function(e) {
			if (e.target != this) return;
			$preview_img.src = this.rel;
			$preview_des.textContent = this.description;
			$screenshot.classList.remove('fadeOut');
		}, false);
		$ss.addEventListener('mousemove', function(e) {
			posPreview(e.pageX, e.pageY);
		}, false);
		$ss.addEventListener('mouseout', function(e) {
			if (e.target != this) return;
			$screenshot.classList.add('fadeOut');
		}, false);
	}

	function posPreview(x, y) {
		var oH = $wrapper.offsetHeight;
		var targetX = x + 30;
				targetY = y - 10;

		var height = $screenshot.clientHeight;
		if (targetY + height + 10> oH)
				targetY = oH - height - 10;

		$screenshot.style.left = targetX + 'px';
		$screenshot.style.top = targetY + 'px';
	}
}, false);

function current(target, self) {
	localStorage['latest_options_tab'] = self.id;
	var button = self.parentElement;
	if (button.classList.contains('current')) return;
	var current_button = $$('li.current a')[0];
	var current_tab_no = current_button ?
		+current_button.id.split('').reverse()[0] : $$('#navigation ul li').length;
	var target_tab_no = self.id.split('').reverse()[0];
	var tab = $$('#navigation li');
	var i, j, len = tab.length;
	for (i = 0; i < len; i++) {
		tab[i].classList.remove('current');
	}
	button.classList.add('current');
	for (i = 0; j = $('tabs' + i); i++) {
		j.style.display = 'none';
		j.style.webkitAnimation = j.style.animation = '';
	}
	var target_style = $(target).style;
	target_style.display = 'block';
	var animation_name = current_tab_no > target_tab_no ? 'leftSlideIn' : 'rightSlideIn';
	target_style.webkitAnimation = animation_name + '.2s ease-out';

	var ul = $$('#' + target + ' ul')[0];
	if (! ul) return;
	clearTimeout(ul.timeout);
	ul.style.overflow = 'hidden';
	ul.timeout = setTimeout(function() {
		ul.style.overflow = '';
	}, 250);

	forEach($$('button'), function(btn) {
		clearTimeout(btn.timeout);
		btn.style.webkitAnimation = 'btn-fadeIn .6s ease-in';
		btn.timeout = setTimeout(function() {
			btn.style.webkitAnimation = '';
		}, 600);
	});
}

addEventListener('load', function load(e) {
	forEach($$('#navigation a'), function(nav_link, i) {
		nav_link.onclick = function(e) {
			current('tabs' + i, this);
		}
	});

	forEach($$('.avatar img'), function(img) {
		img.src += '?' + (new Date).getTime();
	});

	setTimeout(function() {
		if (document.documentElement.clientHeight < 300) return load();
		forEach($$('div[id^="tabs"]'), function(tab) {
			tab.style.visibility = 'visible';
		});
		var latest_tab = localStorage['latest_options_tab'] || 'tab1';
		SF.fn.emulateClick($(latest_tab));
	}, 16);
}, false);
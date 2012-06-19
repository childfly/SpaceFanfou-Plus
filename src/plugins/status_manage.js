SF.pl.status_manage = new SF.plugin((function($) {
	if (! SF.fn.isMyPage()) return;
	if (! $('#stream li .op .delete').length) return;

	var $paginator = $('ul.paginator');
	var $li = $('#stream li');

	if (! $paginator.length || ! $li.length) return;

	var $manage = $('<div />');
	$manage.addClass('batch-manage statuses');

	function batchDelete() {
		var $todel = $('#stream li input[type=checkbox][msgid]:checked');
		var length = $todel.length;
		if (! length) return;
		if (! confirm('确定要删除选定的' + $todel.length + '条消息吗？'))
			return;
		var count = 0;
		$todel.each(function() {
			var $t = $(this);
			var $del = $t.parent().find('a.delete');
			$.ajax({
				type: 'POST',
				url: location.href,
				data: {
					action: 'msg.del',
					msg: $t.attr('msgid'),
					token: $del.attr('token'),
					ajax: 'yes',
				},
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(data) {
					if (data.status) {
						FF.util.yFadeRemove($del.get(0), 'li');
						if (++count === length) location.reload();
					} else {
						alert(data.msg);
					}
				},
			});
		});
	}

	var $select = $('<select />');
	$select
	.append(
		$('<option />')
		.val('default')
		.text('批量处理..')
	)
	.append(
		$('<option />')
		.val('delete')
		.text('删除选中消息')
	)
	.append(
		$('<option />')
		.val('select-all')
		.text('全选')
	)
	.append(
		$('<option />')
		.val('toggle')
		.text('反选')
	)
	.append(
		$('<option />')
		.val('select-replies')
		.text('选中回复')
	)
	.append(
		$('<option />')
		.val('select-reposts')
		.text('选中转发')
	)
	.append(
		$('<option />')
		.val('cancel')
		.text('取消选择')
	)
	.val('default')
	.change(function(evt) {
		switch (this.value) {
		case 'default':
			break;
		case 'delete':
			batchDelete();
			break;
		case 'select-all':
			$('#stream li input[type=checkbox]')
			.prop('checked', true);
			break;
		case 'toggle':
			$('#stream li input[type=checkbox]')
			.each(function() {
				var $checkbox = $(this);
				$checkbox.
				prop('checked', ! $checkbox.prop('checked'));
			});
			break;
		case 'select-replies':
			$('#stream li[reply-status] input[type=checkbox]')
			.prop('checked', true);
			break;
		case 'select-reposts':
			$('#stream li[repost-status] input[type=checkbox]')
			.prop('checked', true);
			break;
		case 'cancel':
			$('#stream li input[type=checkbox]')
			.prop('checked', false);
			break;
		}
		this.value = 'default';
	})
	.appendTo($manage);
	
	function toggle(e) {
		$('input[type=checkbox][msgid]', this).click();
	}

	return {
		load: function() {
			var $checkbox = $('<input>').attr('type', 'checkbox');
			$li.each(function() {
				var op_btns = $('.op a', this);
				if (! op_btns.length) return;
				var msgid = op_btns.attr('href').split('/').pop();
				var $chk = $checkbox.clone();
				$chk.attr('msgid', msgid);
				$chk.appendTo(this);
				var $reply = $('>.stamp>.reply', this);
				if ($reply.length) {
					var attr;
					var text = $reply.text();
					if (/^转自(.+)(\(查看\))?$/.test(text))
						attr = 'repost-status';
					else if (/^给(.+)的回复(\(查看\))?/.test(text))
						attr = 'reply-status';
					attr && $(this).attr(attr, '');
				}
			}).dblclick(toggle);
			$manage.appendTo('#info');
		},
		unload: function() {
			$('#stream li input[type=checkbox][msgid]').remove();
			$li.removeAttr('repost-status reply-status').off('dblclick', toggle);
			$manage.detach();
		}
	};
})(jQuery));

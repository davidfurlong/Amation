$('input[type="text"]').focus(function(e){
	$(e.target).parent().addClass('focus');
});
$('input[type="text"]').blur(function(e){
	$(e.target).parent().removeClass('focus');
});
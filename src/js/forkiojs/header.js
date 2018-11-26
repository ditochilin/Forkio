$(document).ready(function(){
	$('.header__burger-icon').click(function(){
		if($('.menu').hasClass('visible')){
			$('.menu').removeClass('visible');
			$(this).removeClass('active');
		}
	})

	$('.header__burger-icon').mouseenter(function(){
		$('.menu').addClass('visible');
		$(this).addClass('active');
	})
})
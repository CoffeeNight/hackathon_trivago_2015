function autoScrollTo(sel,offset,fn) {
	offset = offset || 0;
    var top = $(sel).offset().top + offset;
    $("html, body").animate({ scrollTop: top }, 1000, fn);
}

$(function () {
    $("#slider").noUiSlider({
        start: [1, 200],
        connect: true,
        range: {
            'min': 1,
            'max': 1000
        },
        step: 1
    });
    $('#slider').Link('upper').to($('#slider-value-upper'));
    $('#slider').Link('lower').to($('#slider-value-lower'));
    $('#datetimepicker1').datetimepicker({
    	format: 'YYYY-MM-DD',
    	widgetPositioning: {
    	    horizontal: 'auto',
	        vertical: 'bottom'
    	}
    });
    $('.home-seach-submit').click(function(e){
    	e.preventDefault();
    	$('.wm-big-header__image').animate({ height: 0 }, 1000);
    	$('.js-results').animate({ opacity: 1 }, 700);
    	$('.wm-search-wrapper').animate({ padding: 0 }, 700);
    	$('.navbar').fadeIn();
    	$('.logo__container').animate({ height: 0 }, 1000);
    	// autoScrollTo('.wm-search-small-wrapper',-75,function(){
    	// 	//$('.logo__container').hide();
    	// });
    })
});
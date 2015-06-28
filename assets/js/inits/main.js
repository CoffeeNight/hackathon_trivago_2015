$(function () {
    Parse.initialize("dS3rAMmDvIsvWkBWyS9txTRlSNYPpIFboZ8eRReK", "NG3s7U0uZOgtD6pwF2g52okwoGKTBhvnMzVSF2yz");
    var slider = $("#slider");
    
    function autoScrollTo(sel,offset,fn) {
        offset = offset || 0;
        var top = $(sel).offset().top + offset;
        $("html, body").animate({ scrollTop: top }, 1000, fn);
    }

    slider.noUiSlider({
        start: [1, 200],
        connect: true,
        range: {
            'min': 1,
            'max': 1000
        },
        step: 1
    });
    slider.Link('upper').to($('#slider-value-upper'));
    slider.Link('lower').to($('#slider-value-lower'));
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'auto',
            vertical: 'bottom'
        }
    });

    $('.home-search-submit').click(function(e){
        e.preventDefault();
        $('.home-search-form').submit();
    });
    $('.home-search-form').submit(function(e){
        e.preventDefault();
        $('.wm-big-header__image').animate({ height: 0 }, 600);
        $('.js-results').animate({ opacity: 1 }, 400);
        $('.wm-search-wrapper').animate({ padding: 0 }, 400);
        $('.navbar').fadeIn();
        $('.logo__container').animate({ height: 0 }, 600);
    });


    var tourRequest = Parse.Object.extend("TourRequest");
    var query = new Parse.Query(tourRequest);
    
    // Requests
    query.find({
      success: function(results) {
        alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        // for (var i = 0; i < results.length; i++) {
        //   var object = results[i];
        //   alert(object.id + ' - ' + object.get('playerName'));
        // }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
});
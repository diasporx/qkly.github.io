var j = jQuery.noConflict();

jQuery(function(){
    j('.phone_input').mask('+9 (999) 999-99-99');

    j('.mask_seconds').mask('99:99:99');

    if(typeof onWinResize === 'function'){
        onWinResize();
        j(window).on('resize', function(){
            onWinResize();
        });
    }

    if(typeof onWinScroll === 'function'){
        j(window).scroll(function(){
            onWinScroll();
        }).scroll();
    }

    j.datetimepicker.setLocale('ru');
    j('.js-date').datetimepicker({
        format: 'd.m.Y H:i',
        minDate: new Date(Date.now() - current_date_diff),
        step: 1
    });
});


jQuery(window).on('load', function(){
    if(typeof onWinResize === 'function'){
        onWinResize();
    }
});


window.onbeforeunload = function(event){
    if(j('body').hasClass('onprogress')){
        event.returnValue = 'Вы уверены?';
    }
}


function updateURLParameter(url, param, paramVal){
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) 
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }        
    }
    else
    {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
            TheAnchor  = tmpAnchor[1];

        if(TheParams)
            baseURL = TheParams;
    }

    if(TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}


function openFullscreen(elem){
    if(elem.requestFullscreen){
        elem.requestFullscreen();
    }else if(elem.mozRequestFullScreen){
        elem.mozRequestFullScreen();
    }else if (elem.webkitRequestFullscreen){
        elem.webkitRequestFullscreen();
    }else if (elem.msRequestFullscreen){
        elem.msRequestFullscreen();
    }
}


function msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100);
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);
    var hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


jQuery.fn.imageCrop = function(){
    this.removeClass('by_width by_height').each(function(){
        if(this.complete){
            if(jQuery(this).width() / jQuery(this).height() >= jQuery(this).parent().width() / jQuery(this).parent().height()){
                jQuery(this).addClass('by_height');
            }else{
                jQuery(this).addClass('by_width');
            }
        }else{
            jQuery(this).on('load', function(){
                if(jQuery(this).width() / jQuery(this).height() >= jQuery(this).parent().width() / jQuery(this).parent().height()){
                    jQuery(this).addClass('by_height');
                }else{
                    jQuery(this).addClass('by_width');
                }
            });
        }
    });
};
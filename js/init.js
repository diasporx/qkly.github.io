jQuery(function(){
    j('.main_block_video').click(function(event){
        event.preventDefault();

        j.fancybox({
            padding: 0,
            width: 200,
            maxHeight: '85%',
            content: '<iframe width="640" height="360" src="https://www.youtube.com/embed/TJt35uWbGLM?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="max-width:100%;"></iframe>'
        });
    });


    j('body.registration_page .auth_left form').submit(function(event){
        event.preventDefault();

        var $this = j(this);

        j('body').addClass('onprogress');

        ym(56709133, 'reachGoal', 'register');

        setTimeout(function(){
            j('body').removeClass('onprogress');

            $this.off('submit').submit();
        }, 2000);
    });


    j('.add_page_block a').click(function(event){
        event.preventDefault();

        if(!j(this).hasClass('inactive')){
            j.fancybox({
                padding: 0,
                content: '<div class="popup_form"><h3>Создание новой подписной страницы</h3><p>Введите название и id страницы</p><form method="post" action="' + pages_route + '">' + csrf_field + '<input type="text" name="title" placeholder="Введите название страницы" required="" /><input type="text" name="slug" placeholder="Введите ID страницы, например: kaksozdatstranicu" required="" /><button type="submit">Добавить</button><a href="#">Отмена</a></form></div>',
                afterShow: function(){
                    j('.popup_form form > a').click(function(event){
                        event.preventDefault();

                        j.fancybox.close();
                    });
                }
            });
        }else{
            j('.buy_page_button').click();
        }
    });


    j('.buy_page_button').click(function(){
        j.fancybox({
            padding: 0,
            content: '<div class="popup_form small popup_form_buy_page"><h3>Докупить страницу</h3><p>1 доп. страница = 1 000 ₽</p><form method="post" action="' + buy_page_route + '">' + csrf_field + '<button type="submit">Оплатить с баланса</button><p>Баланс: ' + balance + ' ₽</p><a href="' + payment_route + '" title="Недостаточно средств, пополните баланс">Пополнить баланс</a></form></div>',
            afterShow: function(){
                j('.popup_form form > a').tooltipster({
                    side: 'bottom',
                    theme: 'tooltipster-light',
                    trigger: 'custom'
                });


                j('.popup_form form').submit(function(event){
                    event.preventDefault();

                    if(balance >= 1000){
                        j.fancybox.close();

                        j('body').addClass('onprogress');

                        j.ajax({
                            type: 'post',
                            url: j(this).attr('action'),
                            data: j(this).serialize(),
                            error: function(errors){
                                alert(errors.responseText);
                            },
                            success: function(){
                                j('body').removeClass('onprogress');

                                window.location.reload();
                            }
                        });
                    }else{
                        j(this).children('a').tooltipster('open');
                    }
                });
            },
            beforeClose: function(){
                j('.popup_form form > a').tooltipster('close');
            }
        });
    });


    j('.left_sidebar_button').click(function(){
        if(j('#left_sidebar').hasClass('opened')){
            j('html, body').animate({
                scrollTop: 0
            });
        }

        j('#left_sidebar').toggleClass('opened');
    });


    if(j('.page_settings_input, .page_settings_textarea, .page_settings_field_file_upload').length){
        j('.page_settings_input, .page_settings_textarea, .page_settings_field_file_upload').each(function(){
            j(this).tooltipster({
                side: j(this).is('.page_settings_field_file_upload') ? 'right' : 'bottom',
                theme: ['tooltipster-light', 'tooltipster-light-red'],
                contentAsHTML: true,
                trigger: 'custom'
            }).change(function(){
                if(j(this).hasClass('invalid')){
                    j(this).removeClass('invalid').tooltipster('close');
                }
            });
        });
    }


    j('.page_settings form').on('submit', function(event){
        event.preventDefault();

        j('body').addClass('onprogress');

        var formData = new FormData(this);

        var $this = j(this);

        j.ajax({
            type: j(this).attr('method'),
            url: j(this).attr('action'),
            data: formData,
            processData: false,
            contentType: false,
            error: function(res){
                for(error in res.responseJSON){
                    $this.find('.page_settings_input, .page_settings_textarea').filter('[name="' + error + '"]').addClass('invalid').tooltipster('content', res.responseJSON[error].join('<br>')).tooltipster('open');
                }

                j('html, body').animate({
                    scrollTop: $this.find('.page_settings_input, .page_settings_textarea, .page_settings_field_file_upload').filter('.invalid').first().offset().top - 50
                });

                j('body').removeClass('onprogress');
            },
            success: function(res){
                j('body').removeClass('onprogress');

                window.location.reload(true);
            }
        });
    });


    j(document).on('keypress', '.page_settings_field > input[data-multiple]', function(event){
        if(event.which == 13){
            event.preventDefault();

            if(j(this).val().trim() != ''){
                j(this).siblings('.values').append('<div class="value_item">' + j(this).val().trim() + '<input type="hidden" name="' + j(this).data('name') + '[]" value="' + j(this).val().trim() + '" /><img src="' + baseurl + '/assets/images/delete.svg" /></div>');
            }

            j(this).val('');
        }
    });


    j('.page_settings_field_interval ul li input').on('input change', function(){
        var interval_hours = +j(this).closest('ul').find('input').eq(0).val();
        var interval_minutes = +j(this).closest('ul').find('input').eq(1).val();
        var interval_seconds = +j(this).closest('ul').find('input').eq(2).val();

        j(this).closest('ul').siblings('input').val(interval_hours * 60 * 60 + interval_minutes * 60 + interval_seconds).prop('disabled', interval_hours == 0 && interval_minutes == 0 && interval_seconds == 0);
    });


    j(document).on('click', '.page_settings_field .value_item img', function(){
        j(this).closest('.value_item').remove();
    });


    j('.page_settings_menu ul li').click(function(){
        if(j(this).hasClass('active')){
            return false;
        }

        j('.page_settings_menu ul li').removeClass('active').filter(this).addClass('active');

        j('.page_settings_item').removeClass('active').filter('.page_settings_' + j(this).data('name')).addClass('active');

        j('.page_settings_block').data('tab', j(this).data('name')).attr('data-tab', j(this).data('name'));

        history.pushState({}, '', updateURLParameter(window.location.href, 'tab', j(this).data('name')));
    });


    j('.page_settings_field .copy_button').tooltipster({
        side: 'right',
        theme: 'tooltipster-light',
        trigger: 'custom'
    }).click(function(event){
        event.preventDefault();

        if(navigator.userAgent.match(/ipad|iphone/i)){
            range = document.createRange();
            range.selectNodeContents(j(this).siblings('input')[0]);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            this.setSelectionRange(0, 999999);
        }else{
            j(this).siblings('input')[0].select();
        }

        document.execCommand("copy");


        j(this).tooltipster('open');

        var $this = j(this);
        setTimeout(function(){
            $this.tooltipster('close');
        }, 1500);
    });


    j('.pages_copy_link').tooltipster({
        side: 'top',
        theme: 'tooltipster-light',
        trigger: 'custom'
    }).click(function(event){
        event.preventDefault();

        var temp_input = j('<input type="text" value="' + j(this).data('url') + '" style="position:fixed;left:0;top:0;opacity:0;" />').appendTo('body');

        if(navigator.userAgent.match(/ipad|iphone/i)){
            range = document.createRange();
            range.selectNodeContents(temp_input[0]);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            this.setSelectionRange(0, 999999);
        }else{
            temp_input[0].select();
        }

        document.execCommand("copy");

        temp_input.remove();


        j(this).tooltipster('open');

        var $this = j(this);
        setTimeout(function(){
            $this.tooltipster('close');
        }, 1500);
    });


    j('.page_settings_field_yes_no_chooser a').click(function(event){
        event.preventDefault();

        if(j(this).hasClass('active')){
            return false;
        }

        j(this).siblings('a').addBack().removeClass('active').filter(this).addClass('active');

        j(this).siblings('input').val(j(this).data('value'));
    });


    j(document).on('click', '.page_settings_field .value_under_item_white img', function(){
        j(this).closest('.value_under_item').remove();
    });


    j('.page_settings_field .add_items').click(function(event){
        event.preventDefault();

        if(j(this).siblings('input').val() == ''){
            return false;
        }

        j(this).siblings('.values_under').append('<div class="value_under_item clearfix"><div class="value_under_item_white">' + j(this).siblings('input').val() + '<input type="hidden" /><img src="' + baseurl + '/assets/images/delete_red.svg" /></div><p>' + j(this).siblings('.page_settings_fields_checkbox').find('input[type="radio"]:checked, input[type="checkbox"]:checked').next('h4').text() + '</p><input type="hidden" /></div>');

        j(this).siblings('input').val('');
    });


    j('.page_settings_field_file_upload:not(.custom_upload) input').on('change', function(event){
        j('body').addClass('onprogress');

        j(this).closest('.page_settings_field_file_upload').siblings('input[type="hidden"]').val(1);

        var formData = new FormData();
        formData.append('name', j(this).attr('name'));

        for(let i = 0; i < event.target.files.length; i++){
            formData.append('files[' + i + ']', event.target.files[i]);
        }

        formData.append('_token', csrf_token);

        var $this = j(this);

        j.ajax({
            type: 'post',
            url: updateURLParameter($this.closest('form').attr('action'), 'upload', 1),
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            error: function(res){console.log(res);
                for(error in res.responseJSON){
                    $this.closest('.page_settings_field_file_upload').addClass('invalid').tooltipster('content', res.responseJSON['files.0'].join('<br>')).tooltipster('open');
                }

                j('body').removeClass('onprogress');
            },
            success: function(res){
                j('body').removeClass('onprogress');

                $this.val('');

                var files_html = '';
                for(let i = 0; i < res.length; i++){
                    files_html += '<li class="clearfix" data-filename="' + res[i] + '"><p>' + $this.data('label') + ': ' + res[i] + '</p><a href="#"><img src="' + baseurl + '/assets/images/recycle_bin_red.svg" />Удалить</a></li>';
                }

                $this.closest('.page_settings_field_file_upload').siblings('.page_settings_files_list').html('<ul>' + files_html + '</ul>');
            }
        });
    });

    j(document).on('click', '.page_settings_files_list ul li a', function(event){
        event.preventDefault();

        j('body').addClass('onprogress');

        var formData = new FormData();
        formData.append('name', j(this).closest('.page_settings_files_list').siblings('.page_settings_field_file_upload').find('input').attr('name'));
        formData.append('filename', j(this).closest('li').data('filename'));
        formData.append('_token', csrf_token);

        var $this = j(this);

        j.ajax({
            type: 'post',
            url: updateURLParameter($this.closest('form').attr('action'), 'delete', 1),
            data: formData,
            contentType: false,
            processData: false,
            success: function(res){
                if(res == 'yes'){
                    j('body').removeClass('onprogress');

                    $this.closest('li').remove();
                }
            },
            error: function(errors){
                document.write(errors.responseText);
            }
        });
    });

    j(document).on('change', '.page_settings_field_file_upload.custom_upload input', function(){
        if(j(this).closest('.page_settings_field_file_upload').siblings('.page_settings_files_list').length){
            j(this).closest('.page_settings_field_file_upload').siblings('.page_settings_files_list').html('<ul><li class="clearfix"><p>Картинка: <img /></p></li></ul>');
        }else{
            j(this).closest('.page_settings_field_file_upload').before('<div class="page_settings_files_list"><ul><li class="clearfix"><p>Картинка: <img /></p></li></ul></div>');
        }

        var fr = new FileReader();

        var $this = j(this);
        fr.onload = function(){
            $this.closest('.page_settings_field_file_upload').siblings('.page_settings_files_list').find('img').attr('src', this.result);
        };

        fr.readAsDataURL(this.files[0]);
    });


    j(document).on('click', '.pages_menu > img', function(){
        j(this).siblings('ul').toggle();
    });


    j(document).on('click', '.delete_page', function(event){
        event.preventDefault();

        if(confirm('Вы уверены что хотите удалить страницу "' + j(this).closest('.pages_right').siblings('.pages_left').find('h2').text() + '"')){
            window.location.href = j(this).attr('href');
        }
    });


    j('.payment_amount_left input').change(function(){
        if(!j(this).val() || j(this).val() < 100){
            j(this).val(100);

            j('.payment_confirm button span').text(100);

            return false;
        }

        j('.payment_confirm button span').text(j(this).val());
    });

    j('.payment_method').click(function(){
        if(j(this).hasClass('active')){
            return false;
        }
        
        j('.payment_method').removeClass('active').filter(this).addClass('active');

        j('.payment_methods input[name="payment_method"]').val(j(this).data('name'));
    });

    j('.payment form').submit(function(event){
        event.preventDefault();

        j('body').addClass('onprogress');

        j.ajax({
            type: 'post',
            url: j(this).attr('action'),
            data: j(this).serialize(),
            dataType: 'json',
            success: function(res){
                j('body').removeClass('onprogress');

                var widget = new cp.CloudPayments();
                widget.charge({
                    publicId: 'pk_89eaf513b2acfad2ae1cc10df13cd',
                    description: 'Оплата',
                    amount: res.price,
                    currency: 'RUB',
                    skin: "mini",
                    data: res.data
                }, function(){
                    window.location.reload(true);
                });
            }
        });
    });
});


function onWinResize(){
    if(j('#main_block').length){
        j('#main_block').css('top', (j(window).height() - parseInt(j('html').css('margin-top')) + j('header').outerHeight() - j('footer').outerHeight() - j('#main_block').outerHeight()) / 2);
    }

    if(j('#auth').length){
        if(j(window).height() - parseInt(j('html').css('margin-top')) - 110 > j('.auth_left').height()){
            j('.auth_left').css('margin-top', (j(window).height() - parseInt(j('html').css('margin-top')) - 110 - j('.auth_left').height()) / 2);
        }else{
            j('.auth_left').css('margin-top', 0);
        }
    }


    if(j('#left_sidebar').length){
        j('#left_sidebar').css({
            height: j(window).height(),
            minHeight: 0
        });

        j('#left_sidebar').css('min-height', Math.max(j('#left_sidebar')[0].scrollHeight, j('#content_inner').outerHeight())).addClass('finished');
    }
}


function onWinScroll(){
    if(j('#left_sidebar').length){
        if(j('#left_sidebar')[0].scrollHeight > j('#left_sidebar').height()){
            j('#left_sidebar').addClass('scrolling');

            if(j(window).scrollTop() + j(window).height() > j('#left_sidebar').height() + j('#left_sidebar').position().top){
                j('#left_sidebar').css('top', j(window).scrollTop() + j(window).height() - j('#left_sidebar').height());
            }

            if(j(window).scrollTop() < j('#left_sidebar').position().top){
                j('#left_sidebar').css('top', j(window).scrollTop());
            }
        }else{
            j('#left_sidebar').removeClass('scrolling');
        }
    }
}


function checkHash(){
    var hash = window.location.hash;
    if(hash == '#success'){
        history.pushState({}, '', window.location.href.replace(hash, ''));
    }
}
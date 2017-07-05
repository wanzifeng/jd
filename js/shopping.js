/**
 * Created by wzf on 2017/5/1.
 */
$(function (){
    (function changePrice() {
        //<-----------------------------------------------------------checkbox改变价格
        var a = 0; //<-----------初始数量
        var b = 13888.00; //<-----------初始价格
        $('.option-price').children('input').each(function (i) {
            var that = $(this);
            that.click(function (ev) {
                if (that.prop("checked") == true) {
                    a++;//<----------每个checkbox选中的时候，总数量加一
                    b += (that.siblings('strong').text().trim().slice(1) - 0); //<-----------每个checkbox选中的时候，b加上其兄弟的text()的价格；
                } else {
                    a--;
                    b -= (that.siblings('strong').text().trim().slice(1) - 0);
                }
                $('.sel-num').text(a);
                $('.sub-price-num').text(b.toFixed(2));
            });
        });
        $('#all').children('span').children('i').text("◇");
        var opt = $('.option-list');
        $('.fittings-items').children('li:lt(6)').click(function () {//<-----------对配件的tab选项点击绑定事件
            $(this).addClass('current').siblings().removeClass('current');
            opt.eq($(this).index()).addClass("o-ac").siblings().removeClass('o-ac');
            opt.css("left", 0);
        });
        //<-----------------------------------------------------------tab  前后切换
        var optAc=$(".o-ac");
        $(".next-button").click(function () {//<---------向后按钮的点击事件
            if (parseInt(optAc.css("left")) == 0 && optAc.prop("scrollWidth")>720) {
                optAc.animate({"left": -720}, 1000);
            }
        }).hover(
            function () {
                if (optAc.prop("scrollWidth")>720&&parseInt(optAc.css("left")) != -720) {
                    $(this).css("backgroundPosition", "-46px 0");
                }
            }, function () {
                $(this).css("backgroundPosition", "0 0");
            });
        $(".pre-button").click(function () {
            if (parseInt(optAc.css("left")) == -720) {
                optAc.animate({"left": 0}, 1000);
            }
        }).hover(
            function () {
                if (optAc.prop("scrollWidth")>720&&parseInt(optAc.css("left")) != 0 ) {
                    $(this).css("backgroundPosition", "-46px -94px");
                }
            }, function () {
                $(this).css("backgroundPosition", "0 -94px");
            });
        //<-----------------------------------------------------------购物各选项的鼠标悬浮和鼠标点击效果
        function changeBorder(obj) {//<---------非必选项封装的函数
            var x = null;
            obj.children('dd').children('a').mouseenter(function () {
                $(this).addClass("ac");
            });
            obj.children('dd').children('a').mouseleave(function () {
                if ($(this).parent().index() == x) {
                    return;
                }
                $(this).removeClass("ac");
            });
            obj.children('dd').children('a').click(function () {
                if ($(this).hasClass("ac") && x == $(this).parent().index()) {//<---------有“ac”，x有赋值且等于其parent的index值
                    x = null;//---------将x值重新赋值为空；从而使其能再次点击后加上“ac”类名；
                    $(this).removeClass("ac");
                    return;
                }
                $(this).addClass("ac").parent().siblings().children('a').removeClass('ac');
                x = $(this).parent().index();
            });
        };
        changeBorder($('.suit'));//<---------非必选项调用该函数
        //<--------------------------增值保障选项开始
            $(".gua-dd").mouseenter(function () {
            $(this).children('a').css({"border":"1px solid #e3393c","borderBottomColor":"#FFF"});
            $(this).children(".more-item").show();
        });
        $(".gua-dd").mouseleave(function () {
            if($(this).data("myFlag")){
                $(this).children('a').css({"border":"1px solid #e3393c"});
                $(this).children(".more-item").hide();
                return;
            }
            $(this).children('a').css({"border":"1px solid #ccc"});
            $(this).children(".more-item").hide();
        });
        $('.gua-form').hover(
            function () {
                $(this).children('.gua-change').css("color","#e3393c");
                $(this).children(".gua-more").show();
            },function () {
                $(this).children('.gua-change').css("color","#666");
                $(this).children(".gua-more").hide();
            }
        );
        $('.gua-check').click(function () {
                $(".gua-dd").children(".more-item").hide();
                if($(this).prop("checked")){//使始终只有一个被选中且可以全部取消
                    $(this).parent().parent().parent().data("myFlag",true);
                    var myItem=$(this).siblings(".gua-name").text();
                    var myPrice=$(this).siblings(".gua-price").text();
                    $(this).parent().parent().siblings().children(".g-item").html(myItem);
                    $(this).parent().parent().siblings().children(".g-price").html(myPrice);
                    $(this).parent().siblings().children(".gua-check").prop("checked",!$(this).prop("checked"));
                    return;
                }
                $(this).parent().parent().parent().data("myFlag",false);
        });
        //<-------------增值保障选项结束
        var timer;//增值保障帮助的悬浮框开始
        $(".gua-help").mouseenter(function () {
            clearTimeout(timer);
            $(".help-box").show();
        });
        $(".gua-help").mouseleave(function () {
            timer=setTimeout(function () {//使其延时生效
                $(".help-box").hide();
            },600);
        });
        $(".help-box").mouseenter(function () {
           clearTimeout(timer);//清楚定时器，从而消除$(".gua-help").mouseleave的事件
            $(this).show();
        });
        $(".help-box").mouseleave(function (){
            $(this).hide();
        });//增值保障帮助的悬浮框结束
        var n = null;
        var m = null;//<---------必选项的点击事件及悬浮事件
        $('.must-choose').children('dd').children('a').click(function (ev) {
            $(this).addClass("ac").parent().siblings().children('a').removeClass('ac');
            n = $(this).parent().index();
            m = $(this).parent().parent().index();
        }).hover(
            function () {
                if ($(this).hasClass('ac')) {
                    n = $(this).parent().index();
                    m = $(this).parent().parent().index();
                    return;
                }
                $(this).addClass("ac");
            },
            function () {
                if ($(this).parent().index() == n && $(this).parent().parent().index() == m) {
                    return;
                }
                $(this).removeClass("ac");
            });
        //<---------------------------------------------------------------------------------购物车按钮
        var oInput = $('#num-input');//使输入的内容只能为数字且大于等于一
        var i = 1;
        oInput.keyup(function (ev) {
            var oInputText = oInput.val();
            if (oInput.val() == "") {//使可以为空格
                oInput.val('');
                return;
            }
            oInputText -= 0;
            if (isNaN(oInputText)) {
                oInput.val(1);
            } else {
                if (oInputText < 1) {//使数量输入不能为小于1的数，若小于1，则变为1；
                    oInput.val(1);
                }
            }
        });
        $('#changeNum').click(function (ev) {
            var oElm = ev.target;
            if (oElm == this) {
                return;
            }
            if (oElm.className == "addBtn") {
                i = oInput.val();
                i++;
                oInput.val(i);
                $('.subBtn').css({'color':'#666',"cursor":"pointer"});
            }
            if (oInput.val() <= 1 && oElm.className == "subBtn") {
                return;
            }
            if (oElm.className == "subBtn" && oInput.val() == 2) {//使数量为2的时候则在点击数量减少的时候，改变该按钮的背景色；
                i = oInput.val();
                i--;
                $('.subBtn').css({'color':'#ccc',"cursor":"not-allowed"});
                oInput.val(i);
                return;
            }
            if (oElm.className == "subBtn" && oInput.val() != 2) {
                i = oInput.val();
                i--;
                $('.subBtn').css({'color':'#666',"cursor":"pointer"});
                oInput.val(i);
            }
            return false;
        });
        $('.subBtn').focus(function () {//使其获得焦点的时候失去焦点
            $(this).blur();

        });
        $('.addBtn').focus(function () {
            $(this).blur();

        });
        $('.shopping-cart').focus(function () {
            $(this).blur();

        });
        //<-----------------------------------------------------------support的鼠标悬浮效果
        $('#support-sus').hover(
            function () {
                $('.suspend-box').show();
            }, function () {
                $('.suspend-box').hide();
            });
        //<-----------------------------------------------------------放大镜效果和鼠标悬浮切换
        $('.img_s').mouseenter(function (ev) {
            var title = $(this).prop("title");
            $(this).css({"borderColor": "#e53e41"}).parent().siblings().children('.img_s').css({"borderColor": "#fff"});
            $('#img_b').prop("src", title);
            $('#box2').children('img').prop("src", "images/big" + ($(this).parent().index() + 1) + ".jpg");
        });
        var oBox1 = $("#box1");
        oBox1.mousemove(function (ev) {
            var l = ev.pageX - oBox1.offset().left - $("#zoom").outerWidth() / 2 - 1;
            var t = ev.pageY - oBox1.offset().top - $("#zoom").outerHeight() / 2 - 1;
            if (l < 0) {
                l = 0;
            }
            if (t < 0) {
                t = 0;
            }
            if (l > oBox1.width() - $("#zoom").outerWidth()) {
                l = oBox1.width() - $("#zoom").outerWidth();
            }
            if (t > oBox1.height() - $("#zoom").outerHeight()) {
                t = oBox1.height() - $("#zoom").outerHeight();
            }
            $("#zoom").show().css({
                "left": l,
                "top": t
            });
            $("#box2").show().children("img").css({
                "left": -l * ($("#box2").width() / $("#zoom").outerWidth()),
                "top": -t * ($("#box2").height() / $("#zoom").outerHeight())
            });
        });
        oBox1.mouseleave(function (ev) {
            $("#zoom").hide();
            $("#box2").hide();
            $(this).mousemove(function () {
                return false;
            });
        });
    })();
    //<-----------------------------------------------------------预览图的previewlist切换
    (function previewSwitch() {
        var l=$("#preview-small-list li").length;
        var oPreview=$("#preview-small-list");
        $(".next").click(function () {
            if (parseInt(oPreview.css("left")) == 0) {
                oPreview.animate({"left": -76}, 600);
            }
        }).hover(
            function () {
                if (parseInt(oPreview.css("left")) == 0) {
                    $(this).css("backgroundImage","url(images/hover-next.png)");
                }
            }, function () {
                $(this).css("backgroundImage", "url(images/disabled-next.png)");
            });
        $(".prev").click(function () {
            if (parseInt(oPreview.css("left")) == -76) {
                oPreview.animate({"left": 0}, 600);
            }
        }).hover(
            function () {
                if (parseInt(oPreview.css("left")) == -76) {
                    $(this).css("backgroundImage", "url(images/hover-prev.png)");
                }
            }, function () {
                $(this).css("backgroundImage", "url(images/disabled-prev.png)");
            });
    })();
    (function () {//<-------------------用jqueryUI完成文字自动填充功能
        $( "#inputBox" ).autocomplete({
            source: [ "零食", "家电", "电脑", "服装", "汽车", "水果", "话费" ]
        });
    })();
    (function makeNavDisplay() {//<-------------------鼠标悬浮时使导航栏显示
        $("#all").hover(
            function () {
                $(this).children(".nav-list").show();
            }, function () {
                $(this).children(".nav-list").hide();
            });
    })();
    (function makeSidebarDisplay() {//<-------------------鼠标悬浮时使侧边导航栏显示
        $('.l-l').hover(
            function () {
                $(this).children(".cebian").show();
            }, function () {
                $(this).children(".cebian").hide();
            });
    })();
    (function(){//-----------配送地址的下拉菜单点击事件
        $(".place-drop").children("li").click(function () {
            $(this).addClass("default-place").siblings().removeClass("default-place");
            var txt=$(this).children("a").text();
            $(".a-first").empty().append(txt+"<i>◇</i>");
        });
    })();
    (function () {//-----------省市联动
        //创建json数据
        function cb(data) {
            return data;
        }
        /*function jsonP() {
            $('<script src="./js/cityJson.js"></script>').appendTo($('head'));
        }
        jsonP();*/
        var cityJson=cb(arrjson);
        console.log(cityJson)

                //初始化默认的地址
                var textDefaultProvince=$('.head-province').text();
                var textDefaultCity=$('.head-city').text();
                var textDefaultCountry=$('.head-country').text();
                $('.option-province').text(textDefaultProvince);
                $('.option-city').text(textDefaultCity);
                $('.option-country').text(textDefaultCountry).parent().addClass("current-address");
                var textDefaultCode;
                $.each(cityJson,function (i,element) {
                    if(textDefaultCountry==element.item_name){
                        textDefaultCode=element.item_code;
                    }
                });
                $.each(cityJson,function (i,element) {
                    if(textDefaultCode.substr(0,4)==element.item_code.substr(0,4)&&element.item_code.substr(4,2)!="00"){
                        if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                            $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                            return;
                        }
                        $('.address-content').append('<li><a href="##">' + element.item_name + '</a></li>');
                    }
                });

                //绑定点击事件
                $(".address-option").on("click","li",function () {
                    $(".address-head-wrap").mouseleave(function () {
                        myMouseEnter();
                    });
                    $(this).addClass("current-address").siblings().removeClass("current-address");
                    $('.address-content').empty();
                    var myOptionChose=  $(this).prev().length==0?$(this).text():$(this).prev().text();//判断点击的li是否有前一个元素，若有则取前一个元素的值，若无则说明点击的使省选项，则取点击的li的值
                    var myOptionCode;
                    $.each(cityJson,function (i,element) {
                        if(myOptionChose==element.item_name){
                            myOptionCode=element.item_code;
                        }
                    });//找到对应myOptionCode的json对象中的item_code，并用myOptionCode储存；
                    if($(this).children('a').hasClass("option-province")){//判断点击的是哪个li；
                        $.each(cityJson,function (i,element) {
                            if(element.item_code.substr(2,4)=="0000"){//循环json并将所需的值找出
                                if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                                    $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                                    return;
                                }
                                $('.address-content').append('<li><a href="##">'+element.item_name+'</a></li>');
                            }
                        });
                    }else if($(this).children('a').hasClass("option-city")){
                        $.each(cityJson,function (i,element) {
                            if(element.item_code.substr(0,2)==myOptionCode.substr(0,2)&&element.item_code.substr(2,2)!="00"&&element.item_code.substr(4,2)=="00"){
                                if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                                    $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                                    return;
                                }
                                $('.address-content').append('<li><a href="##">'+element.item_name+'</a></li>');
                            }
                        });
                    }else{
                        $.each(cityJson,function (i,element) {
                            if(element.item_code.substr(0,4)==myOptionCode.substr(0,4)&&element.item_code.substr(4,2)!="00"){
                                if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                                    $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                                    return;
                                }
                                $('.address-content').append('<li><a href="##">'+element.item_name+'</a></li>');
                            }
                        });
                    }
                    setTimeout(function () {//避免连点使触发mouseleave事件
                        $(".address-head-wrap").mouseleave(function () {
                            myMouseLeave();
                        });
                    },100);
                    return false;
                });
                $('.address-content').on("click","a",function () {//对内容部分的li绑定点击事件
                    myMouseEnter();
                    var chosenName=$(this).text();
                    var myChosenCode;
                    if($('.option-province').parent().hasClass("current-address")){//若此时选择的是省份
                        $('.option-province').text(chosenName);
                        $('.option-province').parent().next().show().addClass("current-address").children().text("请选择").end().siblings().removeClass("current-address").end().next().hide();
                        $('.address-content').empty();
                        $.each(cityJson, function (i, element) {
                            if (chosenName == element.item_name) {
                                myChosenCode = element.item_code;
                            }
                        });
                        $.each(cityJson, function (i, element) {
                            if (myChosenCode.substr(0, 2) == element.item_code.substr(0, 2) && element.item_code.substr(2, 2) != "00" && element.item_code.substr(4, 2) == "00") {
                                if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                                    $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                                    return;
                                }
                                $('.address-content').append('<li><a href="##">' + element.item_name + '</a></li>');
                            }
                        });
                    }else if($('.option-city').parent().hasClass("current-address")){//若此时选择的是市
                        $('.option-city').text(chosenName);
                        $('.option-city').parent().next().show().addClass("current-address").children().text("请选择").end().siblings().removeClass("current-address").end().next().hide();
                        $('.address-content').empty();
                        $.each(cityJson,function (i,element) {
                            if(chosenName==element.item_name){
                                myChosenCode=element.item_code;
                            }
                        });
                        $.each(cityJson,function (i,element) {
                            if(myChosenCode.substr(0,4)==element.item_code.substr(0,4)&&element.item_code.substr(4,2)!="00"){
                                if (element.item_name.length >= 7) {//名字长的地域名单独给宽
                                    $('.address-content').append('<li class="long"><a href="##">' + element.item_name + '</a></li>');
                                    return;
                                }
                                $('.address-content').append('<li><a href="##">'+element.item_name+'</a></li>');
                            }
                        });
                        return;
                    }else if($('.option-country').parent().hasClass("current-address")){//若此时选择的是区县；
                        /*  $(".address-choose").focusout();//使其失去焦点*/
                        $('.option-country').text(chosenName);
                        $('.head-province').text($('.option-province').text());
                        $('.head-city').text($('.option-city').text());
                        $('.head-country').text($('.option-country').text());
                        $('.address-choose').hide();
                        $(".add-cover").css("width",$(".address-head").outerWidth());
                        return;
                    }
                    return false;
                });
                $(".address-head-wrap").mouseenter(function () {//鼠标进入时选框show，离开时选框hide；
                    myMouseEnter();
                });
                $(".address-head-wrap").mouseleave(function () {
                    myMouseLeave();
                });
                function myMouseEnter() {//定义一个鼠标进入的函数
                    $('.address-choose').show();
                    $(".address-head-wrap").css("borderColor","#ccc");
                    $('.head-right').css("backgroundImage","url(images/up_triangle.png)");
                }
                function myMouseLeave() {//定义一个鼠标离开的函数
                    $('.address-choose').hide();
                    $(".address-head-wrap").css("borderColor", "transparent");
                    $('.head-right').css("backgroundImage", "url(images/down-triangle.png)");
                }
                /*$(document).click(function (ev) {
                    var oElem = ev.target;
                    if (oElem.className == "address-choose") {
                        $(".address-head-wrap").mouseleave(function () {
                            myMouseEnter();
                        });
                        myMouseEnter();
                        console.log("asdfasdf");
                        console.log(oElem.className);
                        return;
                    }
                    $(".address-head-wrap").mouseleave(function () {
                        myMouseLeave();
                    });
                    myMouseLeave();
                    console.log("sdfasdf")
                });*/
               /* $(".address-choose").focusin(function () {//如果点击后使鼠标改变移出效果
                    $(".address-head-wrap").mouseleave(function () {
                        myMouseEnter();
                    });
                    myMouseEnter();
                });
                $(".address-choose").blur(function () {//如果失去焦点后使鼠标移出效果生效
                    $(".address-head-wrap").mouseleave(function () {
                        myMouseLeave();
                    });
                });*/

    })($);
    (function () {//屏幕右侧的固定选项的动态效果
        var timer;
        $('.right-i').children('ul').children("li").hover(
            function () {
                var that=$(this)
                $(this).children("span").css("backgroundColor","#c81623");
                timer=setTimeout(function () {//有停顿的效果
                    that.children("a").css("backgroundColor","#c81623").show().stop().animate({"left":"-61"},400);
                },200);
            },function () {
                clearTimeout(timer);
                $(this).children("span").css("backgroundColor","#7a6e6e");
                $(this).children("a").css("backgroundColor","#7a6e6e").stop().animate({"left":"0"},400);
            }
        );
    })();
});
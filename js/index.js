/**
 * Created by wzf on 2017/5/1.
 */
$(function () {//<--------调用轮播图插件
    $('#slideA ul').cycle({
        fx:'fade',
        speed:1000,
        pause:true,
        timeout:3000,
        prev:"#slideA .prevBtn",
        next:"#slideA .nextBtn",
        pager:"#slideA .sliderBtn",
        showSlideNum:false,
    });
    (function scrollChange() {//<--------滚动条事件及左侧楼层点击事件
        var arr = [];
        var num_index;
        $('.jd-floor').each(function () {//<--------将所有楼层的offset().top放进数组
            arr.push($(this).offset().top);
        });
        arr.push($(document).height());//<--------将文档高度放进数组
        var screenH = $(window).height();
        function scrollEvent() {//<--------滚动事件函数
            if ($(this).scrollTop() >= arr[0] - (screenH / 2)) {
                $('#left-choice').fadeIn("fast");
            } else {
                $('#left-choice').fadeOut("fast");
                $('.jd-floor').children(".f3-top").children(".floor-num").css("backgroundPosition", "0 0");//<-------使index为0的楼层Icon绿
            }
            for (var i = 0; i < arr.length; i++) {//<--------当滚动条的高度大于某个楼层的高度且小于其下一个楼层的高度 得到当前在哪个楼层
                if ($(window).scrollTop() >= arr[i] - (screenH / 2) && $(window).scrollTop() < arr[i + 1] - (screenH / 2)) {
                    $("#left-choice").children('li').eq(i).addClass("ac").finish().siblings().removeClass('ac');
                    $('.jd-floor').children(".f3-top").children(".floor-num").css("backgroundPosition", "0 0");//<-------使所有的楼层Icon变暗
                    $('.jd-floor').eq(i).children(".f3-top").children(".floor-num").css("backgroundPosition", "-40px 0");//<-------使index为i的楼层Icon绿
                    num_index = i;//<--------记录下此时的num_index值
                }
            }
        }
        $(window).scroll(function () {//<--------window的滚动事件
            scrollEvent();//调用scrollEvent
        });
        $("#left-choice").children('li').each(function (i) {
            var _this = $(this);
            _this.click(function () {////<--------每个楼层的li绑定点击事件
                var that = $(this);
                num_index = that.index();//<--------记录下此时的num_index值
                that.addClass("ac").siblings().removeClass('ac');
                $(window).scroll(function () {//滚动事件发生时不调用scrollEvent
                    that.addClass("ac").siblings().removeClass('ac');
                });
                $("html,body").stop().animate({"scrollTop": arr[num_index]}, 600, function () {
                    $(window).scroll(function () {//<--------window的滚动事件
                        scrollEvent();//重新调用scrollEvent
                    });
                });
            });
            _this.hover(function () {
                $(this).addClass("ac");
            }, function () {
                if ($(this).index() == num_index) {//---------若当前index值等于所记录下的num_index值 则return
                    return;
                }
                $(this).removeClass("ac");
            })
        });
    })();
    //<-------------------返回顶部点击事件
    (function  backTop() {
        $('#backTop').on("click",function () {
            $("html,body").animate({"scrollTop": 0}, 600);
           // return false;
        });
    })();
    (function () {//<-------------------用jqueryUI完成文字自动填充功能
        $( "#inputBox" ).autocomplete({
            source: [ "零食", "家电", "电脑", "服装", "汽车", "水果", "话费" ]
        });
    })();
    (function () {//<-------------------小时钟函数
        function Clock() {
            var d = new Date();
            var s = d.getSeconds();
            this.start = function () {
                var clock = new Clock();
                document.getElementById("second-pointer").style.transform = "rotate(" + s * 6 + "deg)";
                window.setTimeout(function () {
                    clock.start();
                }, 500);
            };
        };
        var clock = new Clock();
        clock.start();
    })();
    (function () {//<-------------------使图片hover时移动一小段距离
        function imgMove(obj) {
            obj.hover(
                function () {
                    $(this).children("img").stop().animate({'left': -10}, 300)
                },
                function () {
                    $(this).children("img").stop().animate({'left': 0}, 300)
                }
            );
        };
        imgMove($('.f2-next').find(".icon"));//猜你喜欢图片
        imgMove($('.big-p'));//京东品质生活图片
        imgMove($('.small-p'));
        imgMove($('.m-small-p'));
        imgMove($('.m-big-p'));
        imgMove($('.f3-mid').find("a").not(".pic-not-move"));//1F图片
    })();
    (function makeDisplay() {//<-------------------鼠标悬浮时使侧边导航栏显示
        $('.l-l').hover(
            function () {
                $(this).children(".cebian").show();
            }, function () {
                $(this).children(".cebian").hide();
            });
    })();
    (function changePatch(){//<-------------------换一批点击事件
        $(".changeBatch").click(function () {
            $('.f2-next').animate({"left":-1208},1000)
        });
    })();
    (function newsCirculation(){//<-------------------滚动新闻
        var timer;
        var i=0;
        function autoCirculation() {
            timer=setInterval(function(){
                if(i==5){
                    i=1;
                    var myDd= $('.fast-news:lt(4)').clone();
                    $('.fast-news:lt(4)').remove();
                    $("#fast-news-list").append(myDd);
                    $('.fast-news').css({"top":0});//<--------------将其top值设为0；
                    $('.fast-news').animate({"top":-24*i});//<--------------再用animate使top值设为-24；
                }else{
                    $('.fast-news').animate({"top":-24*i});
                };
                i++;
            },2000);
        };
        autoCirculation();//<-------启动计时器
        $("#fast-news-list").on("mouseenter",".fast-news",function(){
            clearInterval(timer);
        });
        $("#fast-news-list").on("mouseleave",".fast-news",function(){
            autoCirculation();
        });
    })();
    (function(){//<-------话费机票等小图标的鼠标悬停交互效果
        var myFlag=true;
        $(".show-first").each(function(){
            $(this).mouseenter(function () {
                if(myFlag){
                    var i=$(this).index();
                    $(".small-icon-gather").stop().animate({"top":-209});
                    $(".small-icon-title").children("li").eq(i).addClass("li-hover").siblings().removeClass("li-hover");
                };
                myFlag=true;
            });
        });
        $(".small-icon-title>li").each(function () {
            $(this).mouseenter(function () {
                var n=$(this).index();
                $(this).addClass("li-hover").siblings().removeClass("li-hover");
                $(".small-icon-content").children("li").eq(n).show().siblings().hide();
            });
        });
        function smallestTitleChange(obj,obj1) {//标题鼠标悬停效果的函数
            obj.each(function () {
                $(this).mouseenter(function () {
                    var m=$(this).index();
                    $(this).children().focus().css("outline","none");
                    $(this).addClass("ac-bg").siblings().removeClass("ac-bg");
                    obj1.siblings().animate({"left":-m*252});
                });
            });
        };
        smallestTitleChange($(".my-first>li"),$('.my-first'));
        smallestTitleChange($(".my-second>li"),$('.my-second'));
        smallestTitleChange($(".my-third>li"),$('.my-third'));
        smallestTitleChange($(".my-fourth>li"),$('.my-fourth'));
        function myChangeSelect(obj,arg) {//自定义一个下拉列表change事件的函数
            obj.change(function(){
                var myText=obj.children("option").eq($(this).val()).attr("data-price");
                arg.text(myText);
            });
        };
        myChangeSelect($("#face-value-select"),$(".price-range"));
        myChangeSelect($("#flow-select"),$(".flow-range"));
        myChangeSelect($("#monthly-fee-select"),$(".time-range"));
        myChangeSelect($("#game-value-select"),$(".game-range"));
        myChangeSelect($("#game-value-select1"),$(".game-range1"));
        //<-------机票中的radio选中效果
        $(".single").click(function () {
            $(".back-date").hide();
            if($(this).prop("checked")){
                $(".go-back").prop("checked",false);
            }else{
                $(".go-back").prop("checked",true);
            };
        });
        $(".go-back").click(function () {
            $(".back-date").show();
            if($(this).prop("checked")){
                $(".single").prop("checked",false);
            }else{
                $(".single").prop("checked",true);
            };
        });
        $(".air-date").datepicker({
            showOtherMonths: true,
            dateFormat: "yy-mm-dd",
            minDate: new Date()
        });//使用UI插件中的日期组件
        $(".back-date").datepicker({
            showOtherMonths: true,
            dateFormat: "yy-mm-dd",
            minDate: new Date()
        });//使用UI插件中的日期组件
        $(".start-date").datepicker({
            showOtherMonths: true,
            dateFormat: "yy-mm-dd",
            minDate: new Date()
        });//使用UI插件中的日期组件
        $(".leave-date").datepicker({
            showOtherMonths: true,
            dateFormat: "yy-mm-dd",
            minDate: 1
        });//使用UI插件中的日期组件
        $('.exit-hide-part').click(function(){//使隐藏部分重新隐藏
            $(".small-icon-gather").children("li:gt(3)").not(".last").mouseenter(function () {
                myFlag=false;
            });
            $(".small-icon-gather").stop().animate({"top":0},function () {
                $(".small-icon-gather").children("li:gt(3)").not(".last").mouseenter(function () {//---------使滑动完成后再使其生效
                    myFlag=true;
                });
            });
            myFlag=false;//将myflag值改为false，使鼠标下一次悬浮无效
        });
    })();
    (function(){//-----------配送地址的下拉菜单点击事件
        $(".place-drop").children("li").click(function () {
            $(this).addClass("default-place").siblings().removeClass("default-place");
            var txt=$(this).children("a").text();
            $(".a-first").empty().append(txt+"<i>◇</i>");
        });
    })();
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
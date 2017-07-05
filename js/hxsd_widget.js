// JavaScript Document
$.extend({
	modal:function () {
        var oM=$('<div class="modal"></div>');
        $(document.body).append(oM);
        return function(){
            oM.remove();//删除模态层
        }
    },
	confirmBox:function(msg,fn){//确定弹框
        var delModal=$.modal();//调用模态层 并接收返回值  函数
        var oBox=$('<div class="confirmBox"><h3 style=height:30px;background:blue;"></h3><p>'+msg+'</p><button type="button">确定</button>　　<button type="button">取消</button></div>');
        $(document.body).append(oBox);
		/*拖拽*/
        oBox.drag(oBox.children('h3')).showCenter();
        //居中
        oBox.on('click','button:first',function(){
            oBox.remove();//删除alertBox
            delModal();
            fn && fn();
        });
        oBox.on('click','button:last',function(){
            oBox.remove();//删除alertBox
            delModal();
        })
	},
    promptBox:function (msg,fn) {
        var delModal=$.modal();//调用模态层 并接收返回值  函数
        var oBox=$('<div class="promptbox"><h3>'+msg+'</h3><textarea></textarea><button type="button">确定</button><button type="button">取消</button></div>');
        $(document.body).append(oBox);
        /*拖拽*/
        oBox.drag().showCenter();
        oBox.find('button,textarea').mousedown(function (ev) {
            ev.stopPropagation();
        });
        oBox.on('click','button:first',function(){
            fn && fn($('textarea').val());
            delModal();
            oBox.remove();//删除alertBox
        });
        oBox.on('click','button:last',function(){
            oBox.remove();//删除alertBox
            delModal();
        })
    },
})
$.fn.extend({
    showCenter:function(){
        var _this;
        function center(){
            var screenW=$(window).width();
            var screenH=$(window).height();
            _this.show();
            var l=(screenW-_this.outerWidth() )/2;
            var t=(screenH-_this.outerHeight() )/2;
            _this.css({'left':l,"top":t})
        };
        return this.each(function () {
            _this=$(this);
            center();
            $(window).resize(center);
        })
    },
    drag:function (title) {
         return this.each(function () {
            title=title || $(this);//拖拽判断
            var _this=$(this);
            title.mousedown(function(ev){
                //鼠标按下，计算盒子偏移距离
                var disX=ev.pageX-_this.offset().left;
                var disY=ev.pageY-_this.offset().top;
                //-------------------------------------------
                $(document).mousemove(function(ev){
                    var t=ev.pageY-disY;
                    var l=ev.pageX-disX;

                    var screenW=$(window).width();//屏幕宽度
                    var screenH=$(window).height();//屏幕高度

                    if(l<0){
                        l=0;
                    };
                    if(t<0){
                        t=0;
                    };

                    if(l>screenW-_this.outerWidth()){ //屏幕宽度---盒子宽度
                        l=screenW-_this.outerWidth()
                    };

                    if(t>screenH-_this.outerHeight()  ){ //屏幕宽度---盒子宽度
                        t=screenH-_this.outerHeight()
                    };

                    _this.css({'left':l,'top':t})
                });
                //-----------------------------------------
                $(document).mouseup(function(){
                    $(document).unbind('mousemove');
                });
                return false;//阻止默认事件
            })
        })
    },
    mouseWheel:function (fn) {
        return this.each(function () {
            if(window.navigator.userAgent.indexOf("Firefox")!=-1){
                this.addEventListener("DOMMouseScroll",wheelFn,true);
            }else{
                this.onmousewheel=wheelFn;
            }
            function wheelFn(ev) {
                var direct=ev.wheelDelta?ev.wheelDelta<0:ev.detail>0;
                fn&&fn(direct);
                ev.preventDefault();
            }
        });
    }
});




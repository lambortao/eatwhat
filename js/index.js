(function(){
    var foodArr = new Array();
    
    (function getLocal() {
        var foodArrOld = JSON.parse(localStorage.getItem('foodArr'));
        
        if(foodArrOld){
            foodArr = foodArrOld;
            reloadDom(foodArr);
        } else {
            foodArr = ['冒', '金拱门', '粥', '麻辣烫', '饺子', '烤冷面', '锅贴 or 生煎', '面条'];
            setFoodArr(foodArr);
        }
    })();
    
    // 添加食物按钮
    //FIXME: 验证这里可以再多新增几个候选项，在用户提交空信息的时候询问是否需要再添加几种，这里需要新建一个大的食物的多维数组
    (function() {
        $('#addFood').click(function() {
            var addFoodInput = $('#addFoodInput').val();
            if(addFoodInput == ''){
                layer.tips('框框里要填候选项呦', '#addFoodInput', {
                    tips: [1, '#c33'],
                    time: 4000
                });
                return;
            } else if (addFoodInput.length > 10) {
                layer.msg('你想吃的东西十个字都不够写？');
                return;
            } else {
                // 验证新添加的食物是否重复
                var indexOfArr = _.indexOf(foodArr, addFoodInput);
                if(indexOfArr == -1){
                    reloadFoodArr(addFoodInput);
                    $('#addFoodInput').val('');
                } else {
                    layer.tips('我在这里呐~', '.foodUl .food:eq('+indexOfArr+')', {
                        tips: [1, '#093'],
                        time: 3000
                    });
                    return;
                }
            }
        });
    })();

    // 更新食物数组
    function reloadFoodArr(e) {
        foodArr.push(e);
        setFoodArr(foodArr);
    }

    // 写入localStorage
    function setFoodArr(arr) {
        localStorage.setItem('foodArr', JSON.stringify(arr));
        reloadDom(arr);
    }

    // 更新页面数据
    function reloadDom(arr) {
        var inHtml = '';
        for(let i = 0; i < arr.length; i++) {
            inHtml += `<li class="food" index="${i}">${arr[i]}</li>`;
        }
        $('.foodarr-list ul').empty().append(inHtml);
    }

    // 删除已有的数据
    (function delectFoodArr(e) {
        $(document).on('click', '.food', function() {
            if(foodArr.length > 1){
                $('#ok').text('不知道');
                var index = $(this).attr('index');
                foodArr.splice(index, 1);
                setFoodArr(foodArr);
                if(foodArr.length == 0){
                    $('.foodUl').text('这就是列表');
                }
            } else {
                layer.msg('全部删掉是不准备吃了嘛？');
            }
            
        });
    })();  

    // 禁用添加
    function addFoodJy(bool) {
        addFood = $('#addFood');
        foodUl = $('.foodUl');
        bool ? (
            addFood.attr('disabled', 'true'),
            foodUl.addClass('stop'),
            $('#start').val('停').addClass('stop')
        ) : (
            addFood.removeAttr('disabled'),
            foodUl.removeClass('stop'),
            $('#start').val('开整').removeClass('stop')
        );
    }

    // 取随机数
    function randomNum(num) {
        return Math.floor(Math.random() * num);
    }

    // 点击开整
    //FIXME: 如果用户点击开整多次说明一直找不到想吃的，那么就可以询问是否需要随机替换掉几种食物
    (function() {
        var startBool = false;
        var clear;
        $('#start').click(function() {
            goFood();
        });
        $(document).keyup(function(e) {
            var keycode = e.which;
            if(keycode == 27) {
                goFood();
            }
        })

        function goFood() {
            if(startBool) {
                addFoodJy(false);
                startBool = false;
                window.clearInterval(clear);
            } else {
                var foodArrLength = foodArr.length;
                if(foodArrLength == 0){
                    layer.msg('一个都没有你整啥？');
                    return;
                } else if (foodArrLength == 1) {
                    layer.msg('就一个还能整别的？');
                    return;
                } else {
                    addFoodJy(true);
                    startBool = true;
                    var foodNum = foodArr.length,
                        inNum = 0,
                        goNum = 0,
                        foodList = $('.foodUl').children('li'),
                        txt = $('#ok');

                    function food() {
                        if(foodNum > 3){
                            var inNum = randomNum(foodNum);
                            foodList.eq(inNum).addClass('active').siblings('li').removeClass('active');
                            txt.text(foodArr[inNum] + '！');
                        } else {
                            foodList.eq(goNum).addClass('active').siblings('li').removeClass('active');
                            txt.text(foodArr[goNum] + '！');
                            goNum++;
                            goNum = (goNum == foodNum) ? 0 : goNum;
                        }
                    }
                    clear = window.setInterval(food, 60);
                }
            }
        }
    })();
})();


// 音乐相关API
// audioObject  
// 创建或获取audio对象的方法有两种


// 第一种 <audio id="music" src="http://cloud.hunger-valley.com/music/玫瑰.mp3">你的浏览器不支持哦</audio>
        //  <script>
        //      var audioObject = document.querySelector('#music');
        //  </script>

// 第二种
// var audioObject = new Audio("http://cloud.hunger-valley.com/music/玫瑰.mp3")

var currentIndex = 0;  //要播放的音乐的下标
var audio = new Audio();  //创建播放器对象
audio.autoplay = true;   //设置为自动播放
var musicList = [];




getMusicList(function(list){
  musicList = list;
  loadMusic(list[currentIndex]);
  generate(list);
})

audio.ontimeupdate = function(){  //监听事件，显示进度条
    $('.progress_current').style.width = (this.currentTime/this.duration)*100+'%';
}

audio.onplay = function(){   //监听播放，显示时间
    clock = setInterval(function(){
        var min = Math.floor(audio.currentTime / 60);  //获取播放的分数
        var sec = Math.floor(audio.currentTime) % 60 + '';  //获取播放的秒数
        sec = sec.length === 2?sec:"0" + sec;           //秒数是2位数的时候直接显示，是一位数的时候加0显示
        $('.time').innerText = min + ':' + sec;  
        
    },1000);
}

audio.onpause = function(){  //这个事件会在音乐暂停或者音乐播放完的时候出发，停止音乐时间计时
    clearInterval(clock);
}


$('.control .pause').onclick = function(){  //监听事件，更改播放和暂停按钮，并控制音乐的暂停和播放
    if(audio.paused){                   //paused属性是true的时候，表示音乐是暂停状态，false是播放状态
        audio.play();
        this.querySelector('.fa').classList.remove('fa-play');
        this.querySelector('.fa').classList.add('fa-pause');
    }else{
        audio.pause();
        this.querySelector('.fa').classList.remove('fa-pause');
        this.querySelector('.fa').classList.add('fa-play');
    }  
}


// 下一首
$('.music_box .forward').onclick = function(){
 //比如数组有4个元素，0余上4是0，1余上4是1，2余上4是2，3余上4是3，4余上4是0，这个方法用于循环计数。比如音乐播放到最后一首后，要跳转到第一首
    $('.pause').querySelector('.fa').classList.remove('fa-play');
    $('.pause').querySelector('.fa').classList.add('fa-pause');
    currentIndex = (++currentIndex)%musicList.length; 
    loadMusic(musicList[currentIndex]); 
}
// 上一首
$('.music_box .back').onclick = function () {
    // currentIndex每次运算之后减减，然后再加上数组本身的长度，可以实现下标正向和逆向的循环
    $('.pause').querySelector('.fa').classList.remove('fa-play');
    $('.pause').querySelector('.fa').classList.add('fa-pause');
    currentIndex =(musicList.length+ --currentIndex)% musicList.length;
    loadMusic(musicList[currentIndex]);
}

// 拖动滚动条控制播放进度
$('.progress_bar').onclick = function(e){
    var percent = e.offsetX / parseInt( getComputedStyle(this).width);
    console.log(percent);
    audio.currentTime = audio.duration * percent;
    $('.progress_current').style.width = e.offsetX+"px";
}

audio.onended = function(){
    currentIndex = (++currentIndex) % musicList.length;
    loadMusic(musicList[currentIndex]);  
}
function $(selector){
    return document.querySelector(selector);
}

function getMusicList(callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/music.json", true);
    xhr.onload = function () {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            callback(JSON.parse(this.responseText))
        } else {
            console.log("获取数据失败");
        }
        xhr.onerror = function () {
            console.log("网络异常");
        }
    }
    xhr.send();  
}

function loadMusic(musicObj){
    console.log("begin", musicObj);
    $('.music_box .title').innerText = musicObj.title;  //把相应歌曲的歌名填入DOM
    $('.music_box .author').innerText = musicObj.author; //把歌曲演唱者填入DOM
    $('.cover').style.backgroundImage = 'url('+ musicObj.img +')';  //这里是随着歌曲的更换让背景图也跟着更换
    audio.src = musicObj.src;                           //把歌曲的播放连接，赋值给播放器的src
}


// 生成歌曲列表
function generate(list){
    list.forEach(function(data){
        var node_li = document.createElement('li');
        var str = data.title+'-'+ data.author;
        node_li.innerText = str;
        $('.list').appendChild(node_li);
    })
}


// 事件代理方法，实现点击哪一首歌曲就播放哪一首
$('.list').onclick = function(e){
    var e  = e ||window.event;
    var target = e.target || e.srcElement;
    var liBox = $('.list').querySelectorAll('li');
    for(var i=0;i<liBox.length;i++){  //给每一个li绑定一个index属性，记录这首歌在数组中的下标
      (function(i){
          liBox[i].index = i;
      })(i)
     currentIndex = liBox[i].index;
    }
    console.log(target.index);  
    loadMusic(musicList[target.index]);//然后把下标放到 loadMusic（）函数中实现歌曲的播放
    
    // 这里是鼠标点击歌曲的时候，li会出现被选中背景
    for(var i =0;i<liBox.length;i++){
        if (liBox[i].classList.contains('active')){
            liBox[i].classList.remove('active')
        }
    }
    target.classList.add('active'); 
}


// 监听onplaying事件，点击下一首或者歌曲播放完的时候，对应的li也出现背景色
audio.onplaying = function(){
    var liBox = $('.list').querySelectorAll('li');
    for (var i = 0; i < liBox.length; i++) {
        if (liBox[i].classList.contains('active')) {
            liBox[i].classList.remove('active')
        }
    }
    console.log(currentIndex);
    liBox[currentIndex].classList.add('active');
}










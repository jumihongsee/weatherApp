$(document).ready(function(){
    const cityName = []; //버튼 클릭 또는 검색바에서 입력을 하는 순간 도시명 데이터를 수집한다. 
    console.log(cityName);



    let state_icon = ""; //텍스트 아이콘을 이미지 아이콘으로 변경하는 데이터 
    const w_box = `
            <li>
                <div class="top">
                    <div class="cur_icon">
                        <i class="wi "></i>
                    </div>
                
                    <div class="info">
                        <div class="temp"><span class="degree">12</span>&nbsp;℃</div>
                        <p class="interTemp">최저<span class="temp_min">9</span>℃/ &nbsp;최고<span class="temp_max">15</span>℃</p>
                        <h4>Cloud</h4>
                        <p class="location"><span class="city">Busan</span>,<span class="nation">KR</span></p>
                    </div>
                </div>
                <div class="bottom">
                    <div class="wind">
                        <i class="wi wi-strong-wind"></i>
                        <p><span>0.00</span>&nbsp;m/s</p>
                    </div>
                    <div class="humidity">
                        <i class="wi wi-humidity"></i>
                        <p><span>00</span>&nbsp;%</p>
                    </div>
                    <div class="cloud">
                        <i class="wi wi-cloudy"></i>
                        <p><span>0.00</span>&nbsp;%</p>
                    </div>
                </div>
            </li>
    `;
    function w_info(){

        $("#weather ul ").empty(); //하위의 내용을 비운다. 
        //cityName 이라는 배열 데이터를 기준으로 반복하여 구조를 넣는다. 
        for(i in cityName){
           $("#weather ul").append(w_box);
        }
        //첫번째 데이터가 존재한다면, 두번째 버튼을 클릭했을때, 두번을 반복을 한다.(기존 데이터인 한개의 박스가 있는것에 추가로 두개의 박스가 추가된다.)
        //구성 완료된 시점
        $("#weather li").each(function(index){
            //index : 순차적 접근 과정에서 인덱스 번호를 반환

            $.ajax({
                url : `https://api.openweathermap.org/data/2.5/weather?q=${cityName[index]}&appid=83190b1188e35a70c8a4049a86c69b62`,
                dataType : "json",
                success : function(data){
                    const weather = data.weather[0].main;
                    console.log("현재날씨 is : "+weather); // Clouds
                    const temp = Math.round(data.main.temp - 273.15);
                    console.log("현재온도 is : "+temp); // -4
                    const temp_min= Math.round(data.main.temp_min - 273.15);
                    console.log("최저온도 is : "+temp_min); // -5
                    const temp_max= Math.round(data.main.temp_max - 273.15);
                    console.log("최고온도 is : "+temp_max); // -1
                    const city = data.name;
                    console.log("도시명 is : "+city);
                    const nation = data.sys.country;
                    console.log("국가명 is : "+nation);
                    const wind = data.wind.speed;
                    console.log("현제 풍속 is : "+wind);
                    const humidity = data.main.humidity;
                    console.log("현제 습도 is : "+humidity);
                    const cloud = data.clouds.all;
                    console.log("현제 구름양 is : "+cloud);

                    //텍스트화된 날씨(변수명 : weather) 데이터를 이미지 아이콘으로 변경.
                    if(weather == "Clear") state_icon = "wi-day-sunny";
                    else if(weather == "Clouds") state_icon = "wi-cloud";
                    else if(weather == "Rain") state_icon = "wi-rain";
                    else if(weather == "Snow") state_icon = "wi-snow";
                    else if(weather == "Mist") state_icon = "wi-fog";

                    $("#weather li").eq(index).find(".cur_icon i").addClass(state_icon);
                    $("#weather li").eq(index).find(".degree").text(temp);
                    $("#weather li").eq(index).find(".temp_min").text(temp_min);
                    $("#weather li").eq(index).find(".temp_max").text(temp_max);
                    $("#weather li").eq(index).find(".info h4").text(weather);
                    $("#weather li").eq(index).find(".city").text(city);
                    $("#weather li").eq(index).find(".nation").text(nation);
                    $("#weather li").eq(index).find(".wind p span:first-child").text(wind);
                    $("#weather li").eq(index).find(".humidity p span:first-child").text(humidity);
                    $("#weather li").eq(index).find(".cloud p span:first-child").text(cloud);
                }
            }); //ajax 종료
        }); //each문
    }

    $(document).on("click", ".cities button", function(){ //arrow function 쓰지마셈
        const city_txt = $(this).text(); //클릭한 버튼의 텍스트를 추출한다. 
        console.log(city_txt);
        cityName.unshift(city_txt); //cityName이라는 배열 데이터의 첫번째 자리에 데이터를 추가한다. 
        console.log(cityName);
        $(this).remove(); //클릭한 버튼은 제거된다. 
        w_info(); //함수 호출
    });

    function searching(){
        const search_val=$("#search_box").val();
        if(search_val.trim()==" "){ //검색어의 전후 공백을 제거해보니, 값이 없더라(최소 공백만 넣은 상태) 
            alert("검색어를 입력바랍니다.");
            $("#search_box").focus();
        }else{
            cityName.unshift(search_val);
            w_info();
        }
    }

    $(".search button").click(function(){
        searching();
    }); 

    $(".search").keydown(function(e){
        if(e.keyCode == 13){
            searching();
        }
    });

    navigator.geolocation.getCurrentPosition(function(position){
        const latitude = position.coords.latitude;
        const longtitude = position.coords.longitude;
        console.log(latitude); // 위도 37.4923615
        console.log(longtitude); // 경도 127.0292881 경도(동경135도)

        $.ajax({
            url : `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=83190b1188e35a70c8a4049a86c69b62`,
            dataType : "json",
            success : function(data){
                
                const city = data.name;
                console.log("도시명 is : "+city);
                const nation = data.sys.country;
                console.log("국가명 is : "+nation);
                const wind = data.wind.speed;

                cityName.unshift(city);
                w_info();

                
            }
          
        }); //ajax 종료



    });

});
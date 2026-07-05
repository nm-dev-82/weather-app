import { useState,useEffect } from 'react'
import './App.css'

function App() {
  
  // 変数定義
  const apiKey=import.meta.env.VITE_WEATHER_API_KEY; // .envファイルからAPI取得
  const [weather,setWeather]=useState(null); //天気予報の表示

  const [city,setCity]=useState("");// 検索ボックス入力欄
  const [displayCity,setDisplayCity]=useState("Tokyo");//天気予報の初期表示

  const [errorMsg, setErrorMsg] = useState(""); //エラーメッセージ

  const handleSearch =()=>{
    setDisplayCity(city); //検索ボタンの処理・入力値を天気予報に反映
  }

  //現在地を取得
  const handleLocation =()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      const lat=position.coords.latitude;
      const lon=position.coords.longitude;
      getWeatherByLocation(lat,lon);
    },(error)=>{
      setErrorMsg("位置情報が取得できませんでした。"); //エラーメッセージ
    }

    );
  };
  // -----------------------------------------------------------------------

  //初期表示 ・displayCity変化で再表示
  useEffect( 
      () => {getWeather();}, [displayCity]
    );


  // 非同期通信 API取得（都市名から）
  const getWeather=async()=>{
  try{
    setErrorMsg(""); //エラーメッセージをリセット
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${displayCity}&appid=${apiKey}&units=metric&lang=ja`;
    const response= await fetch(url);

    if(!response.ok){
      setErrorMsg("都市が見つかりませんでした。英語で入力してください"); // エラー処理・都市の取得に失敗
      return;
    }

    const data= await response.json();

    setWeather(data);
  }catch(error){
      setErrorMsg("通信に失敗しました。時間をおいて試してください。");  //エラー処理・通信失敗
  }
  };

  // 非同期通信 API取得（緯度経度から）
  //座標で天気を取る関数
  const getWeatherByLocation=async(lat,lon)=>{
    try{
    setErrorMsg(""); //エラーメッセージをリセット  
    const url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
    const response=await fetch(url);

    if(!response.ok){
      setErrorMsg("都市が見つかりませんでした。"); // エラー処理・都市の取得に失敗
      return;
    }

    const data=await response.json();
    console.log(data);
    setWeather(data);
    }catch(error){
      setErrorMsg("通信に失敗しました。時間をおいて試してください。");  //エラー処理・通信失敗
    }
  };

  // -----------------------------------------------------------------------

  // jsx
  return (
  <div className="app">
    <header>
      <h1>天気予報</h1>
      <p className="app__subtitle">場所、または現在地から取得できます</p>
    </header>

    <section className="search">
      <div className="search__city">
        <input
          type="text"
          className="search__box"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="都市名を入力 (例: Kobe)"
        />
        <button className="search__button" onClick={handleSearch}>検索</button>
      </div>
      <button className="search__location" onClick={handleLocation}>現在地から探す</button>
    </section>

    {weather && (
      <section className="currentWeather">
        <p className="currentWeather__city">{weather.name}</p>
        <div className="currentWeather__main">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p className="currentWeather__temp">
          <span className="currentWeather__temp--max">{Math.round(weather.main.temp_max)}℃</span>
          {" / "}
          <span className="currentWeather__temp--min">{Math.round(weather.main.temp_min)}℃</span>
          </p>
        </div>
        <ul className="currentWeather__details">
          <li>湿度 {weather.main.humidity}%</li>
          <li>風速 {weather.wind.speed}m/s</li>
          <li>体感温度 {Math.round(weather.main.feels_like)}℃</li>
        </ul>
      </section>
    )}

    {errorMsg && (
      <section className="errorMsg">
        <p>{errorMsg}</p>
      </section>
    )}
  </div>
);

}

export default App

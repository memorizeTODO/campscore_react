import { addDays, differenceInDays, startOfDay  } from 'date-fns';
import React, { useState, useEffect, useCallback } from 'react';
import WB01 from '../images/sunny.png'
import WB02 from '../images/partly-cloudy.png'
import WB03 from '../images/mostly-cloudy.png'
import WB04 from '../images/overcast.png'
import WB09 from '../images/rain.png'
import WB11 from '../images/rain-or-snow.png'
import WB12 from '../images/snow.png'
import WB13 from '../images/snow-or-rain.png'
import WBRD from '../images/raindrop.png'


interface WeatherDataArr {
  weather: string;
  temp: string;
  prec: string;
  rain: string;
}

interface Props {
  preferredRegion: string;
  startDate: Date;
  endDate: Date;
}

function getImgSrc(weather: string): string {
  switch (weather) {
    case 'WB01':
      return WB01;
    case 'WB02':
      return WB02;
    case 'WB03':
      return WB03;
    case 'WB04':
      return WB04;
    case 'WB09':
      return WB09;
    case 'WB11':
      return WB11;
    case 'WB12':
      return WB12;
    case 'WB13':
      return WB13;

    default:
      return WBRD;
  }
}

function getImgSrc2(weather2:string): string{	
  switch(weather2){
    case 'WB01':
      return WB01;
    case 'WB02':
      return WB02;
    case 'WB03':
      return WB03;
    case 'WB04':
      return WB04;
      
    default :
      return WBRD;
 }
}

const WeatherInfo: React.FC<Props> = ({ preferredRegion, startDate, endDate }) => {
  const [weatherDataArr, setWeatherDataArr] = useState<WeatherDataArr[]>([]);
  const [weatherScoreArr, setWeatherScoreArr] = useState<Number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherItems, setWeatherItems] = useState<JSX.Element[]>([
    <div key="default" className="flex justify-center items-center w-full h-full">
      <p className="text-gray-500">날씨 데이터를 불러오는 중입니다...</p>
    </div>,
  ]);
  const [weatherScoreItem, setWeatherScoreItem] = useState<Number[]>([]);

  /**
   * generateWeatherItems 함수: 날씨 데이터를 기반으로 JSX.Element 목록을 생성.
   */
  const generateWeatherItems = useCallback(() => {
    if (weatherDataArr.length === 0) {
      setWeatherItems([
        <div key="default" className="flex justify-center items-center w-full h-full">
          <p className="text-gray-500">날씨 데이터를 불러오는 중입니다...</p>
        </div>,
      ]);
      return;
    }

    const items: JSX.Element[] = [];
    const arrDayStr = ['일', '월', '화', '수', '목', '금', '토'];
    const todayDate = new Date();

    const startIdx = differenceInDays(startOfDay(startDate),startOfDay(todayDate));
    //alert(startIdx);
    //alert(startOfDay(startDate));
    const endIdx = differenceInDays(startOfDay(endDate), startOfDay(todayDate));
    //alert(endIdx);
    setWeatherScoreArr(new Array(endIdx-startIdx+1).fill(0))
    for (var i = startIdx; i <= endIdx; i++) {
      const weatherData = weatherDataArr[i];
      if (!weatherData) continue;

      const precArray = weatherData.prec.split('|', 2);
      const tempArray = weatherData.temp.split('|', 2);
      const rainArray = weatherData.rain.split('|', 2);
      const weatherArray = weatherData.weather.split('|', 2);

      const temp = tempArray[0];
      const temp2 = tempArray[1];
      const prec = precArray[0];
      const prec2 = precArray[1];
      const rain = rainArray[0];
      const rain2 = rainArray[1];

      const weather1 = ['WB09', 'WB11', 'WB12', 'WB13'].includes(rain) ? rain : weatherArray[0];
      const weather2 = ['WB09', 'WB11', 'WB12', 'WB13'].includes(rain2) ? rain2 : weatherArray[1];
      const imgSrc = getImgSrc(weather1);
      const imgSrc2 = getImgSrc(weather2);

      var currentDate = addDays(startOfDay(startDate), i - startIdx);
      //currentDate.setDate(currentDate.getDate());
      //alert(currentDate.getDate());
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const date = ('0' + currentDate.getDate()).slice(-2);
      const dayIdx = currentDate.getDay();

      
      var weatherscore = (weather1 == "WB01") ? Number(3) :
      (weather1 == "WB02") ? Number(2) : 
        (weather1 == "WB03") ? Number(1) : 
        (weather1 == "WB04") ? Number(0.5) : 
        (weather1 == "WB09" ||weather1 == "WB11"||weather1 == "WB12"||weather1 == "WB13") ? Number(0) : 
         Number(0) ;
      weatherscore = 
      (weather2 == "WB01") ? weatherscore + Number(7) :
      (weather2 == "WB02") ? weatherscore + Number(6):  
      (weather2 == "WB03") ? weatherscore + Number(5) : 
      (weather2 == "WB04") ? weatherscore + Number(4.5) : 
      (weather2 == "WB09" ||weather2 == "WB11"||weather2 == "WB12"||weather2 == "WB13") ? weatherscore + Number(0) : 
         Number(0) ;

      console.log(i+1+"일차"+weatherscore);
      weatherScoreArr[i] = weatherscore;

      items.push(
        <div className="flex flex-row h-full w-32 mr-10 items-center justify-center" key={i}>
          <div className="flex flex-col w-32">
            <label htmlFor="" className="block text-lg font-bold text-gray-900 mx-auto">
              <span className="mx-auto text-xl">
                <span className="flex justify-center">{arrDayStr[dayIdx]}</span>
                <br />
                {`${month}.${date}`}
              </span>
            </label>
            <div className="h-auto w-auto flex flex-row items-center mt-5 justify-center">
              <img src={imgSrc} className="w-16 h-16" alt="Weather Image 1" />
              <img src={imgSrc2} className="w-16 h-16" alt="Weather Image 2" />
            </div>
            <div className="flex flex-row mx-auto items-center mt-3 justify-center">
              <span className="text-[#45A6FF] font-md text-2xl">{`${temp}°`}</span>
              <span className="text-[#959FA9] text-2xl">/</span>
              <span className="text-[#F42E2E] font-bold text-2xl">{`${temp2}°`}</span>
            </div>
            <div className="flex flex-row mx-auto items-center mt-5 font-bold justify-center">
              <span className="text-[#3B9DE3] mr-2">{`${prec}%`}</span>
              <span className="text-[#3B9DE3]">{`${prec2}%`}</span>
            </div>
          </div>
        </div>
      );
    }

    setWeatherItems(items);
  }, [weatherDataArr,startDate, endDate]);
  useEffect(() => {
    // 초기화 작업
    setLoading(true);
    setWeatherDataArr([]);
    setWeatherItems([
      <div key="default" className="flex justify-center items-center w-full h-full">
        <p className="text-gray-500">날씨 데이터를 불러오는 중입니다...</p>
      </div>,
    ]);
    setError(null);
  }, [preferredRegion]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchWeatherData = async () => {
      setLoading(true);
      setWeatherDataArr([]); // 기존 데이터를 초기화
      setError(null); // 기존 오류 메시지 초기화
      try {
        const res = await fetch(`http://localhost:80/get/weather?region=${preferredRegion}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const resJson = await res.json();

        const newWeatherDataArr: WeatherDataArr[] = Array(8).fill(null).map((_, idx) => ({
          weather: resJson[`wc${idx}`],
          temp: resJson[`tp${idx}`],
          prec: resJson[`rp${idx}`],
          rain: resJson[`wcd${idx}`],
        }));

        setWeatherDataArr(newWeatherDataArr);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    return () => {
      controller.abort();
    };
  }, [preferredRegion]);


  useEffect(() => {
    if ((!weatherDataArr || weatherDataArr.length === 0) ) {
      return;
    }
  
    // 데이터가 로드된 후에만 호출
    if (loading===false){
      generateWeatherItems();
    }
  }, [loading]);

  useEffect(() => {
    generateWeatherItems();
  }, [startDate, endDate]);

  return (
    <div id="weather-list" className="flex flex-row justify-center">
      {weatherItems}
   </div>
  );
};

export default WeatherInfo;
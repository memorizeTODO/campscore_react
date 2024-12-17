import React, {useState, useEffect} from "react";
import Header from "./mainPage/Header.tsx";
import ImageSlider from "./mainPage/ImageSlider.tsx"
import SearchForm from "./mainPage/SearchForm.tsx";
import RecommendedPlaces from "./mainPage/RecommendedPlaces.tsx";
import WeatherInfo from './mainPage/WeatherInfo.tsx';
import { addDays } from "date-fns";



const MainPage=()=>{
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(),7));
  const [numOfDays, setNumOfDays] = useState(1);
  const [campName, setCampName] = useState('');

  const [preferredRegion,setPreferredRegion]=useState<string>('경기')
  const [weatherData, setWeatherData] = useState([]);
  const [campType, setCampType]  = useState<string>('');
  const [campRegion, setCampRegion] = useState<string>('');

  
  const [tours, setTours] = useState([]);
  const [camps, setCamps] = useState([]);
  const regions = ['경기', '강원', '경북', '제주']; // 예시 지역


  return(
  <div>
    <Header/>
    <div className="pt-20 z-10">
      <ImageSlider/>
      <SearchForm
        campType ={campType}
        campRegion ={campRegion}
        setCampType={setCampType}
        setCampRegion={setCampRegion}
        startDate = {startDate} 
        endDate = {endDate}
        setStartDate = {setStartDate} 
        setEndDate = {setEndDate}
      />
      <RecommendedPlaces preferredRegion={preferredRegion} setPreferredRegion={setPreferredRegion} />
      <WeatherInfo preferredRegion = {preferredRegion} startDate={startDate} endDate={endDate}/>
    </div>
    <div>
      <h1>{campType} {campRegion} 123</h1>
    </div>

</div>
      
  );
}

export default MainPage; 


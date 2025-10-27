import { addDays, startOfDay, differenceInDays } from "date-fns";
import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import Header from "./searchResult/Header.tsx";
import CampList from "./searchResult/CampList.tsx"
import WeatherInfo from "./searchResult/WeatherInfo.tsx";
import { newDate } from "react-datepicker/dist/date_utils";
import SearchForm from "./searchResult/SearchForm.tsx";

interface Campground {
	   placeaddress: string;
	   placeid: string | number;
	   placename: string;
	   placeurl: string;
	   placecategory: string;
	   placeregion: string;
	 }

const SearchResult=()=>{
    const location = useLocation(); 

    const query = new URLSearchParams(location.search);
    

    const allowedDateFromToday=["0","1","2","3","4","5","6","7"];

    const rawStartDate = query.get("start-date")?.trim();
    const rawDateDiff = query.get("date-diff")?.trim();

    const today = startOfDay(new Date()); //RestApi쪽 프로젝트에서 시간을 받아오도록 변경해야함

    function parseDateFromQuery(value: string | null | undefined, fallback: Date): Date { // start_date,end_date 파라미터의 키값, 벨류 값의 유무와 벨류값의 형식이 올바른지 확인하고 fallback 날짜값이나 파라미터로 가져온 날짜 스트링 값을 Date 타입으로 반환
      if (!value) return fallback;

      // YYYY-MM-DD 형식인지 검사
      const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
      if (!isValidFormat) return fallback;

      const parsed = new Date(value);

      // 실제 날짜로 유효한지 검사
      return isNaN(parsed.getTime()) ? fallback : parsed;
    }


//-------캠핑 시작일자 파라미터 ---------//
    const parsedStartDate = parseDateFromQuery(rawStartDate, startOfDay(new Date()))
    const [startDate, setStartDate] = useState<Date>(
      differenceInDays(parsedStartDate, today) < 0 || differenceInDays(parsedStartDate, today) > 7 ? today : parsedStartDate
    );
    console.log(startDate);

    const [dateDiff, setDateDiff] = useState<number>(() => {
        // rawDateDiff가 없거나(undefined) 빈 문자열이면 즉시 기본값 7 반환
        if (!rawDateDiff) { 
            return 7;
        }

        // rawDateDiff가 존재하면 숫자로 변환합니다.
        const num = Number(rawDateDiff); // (절차 2와 3이 이 한 줄로 처리됨)
        
        // 변환 결과가 NaN인지 확인합니다. (Number(undefined/''/잘못된문자열)의 결과는 NaN)
        if (Number.isNaN(num)) {
            return 7;
        }
        
        // 유효한 숫자일 경우 그 값을 사용합니다.
        return num;
    });
    

//-------캠핑 종료날짜 파라미터 ----------//    
    const rawEndDate = query.get("end-date")?.trim();
    const parsedEndDate = parseDateFromQuery(rawEndDate, addDays(today,7) ) //end-date 파라미터 파싱
    const [endDate, setEndDate]  = useState<Date>(
      differenceInDays(parsedEndDate, startDate) < 0 || differenceInDays(parsedEndDate, today) > 7 ? addDays(today,7) : parsedEndDate //종료일자가 시작일자보다 이전이거나 오늘로 부터 7일 후를 넘어선 날짜일 땐 현재 날짜에 7일 더한 한 값으로 지정
    );
    
    
//---------------------선호 지역 파라미터 -----------------------------------//
  
    const rawPreferredRegion = query.get("preferred-region")?.trim();
    const allowedRegions = ["서울", "경기", "강원", "충남", "충북", "경남", "경북", "전남", "전북", "제주" ];
    
    const [preferredRegion, setPreferredRegion] = useState<string>(
      rawPreferredRegion  && allowedRegions.includes(rawPreferredRegion ) ? rawPreferredRegion  : "경기"
    );

//--------------------캠프 타입(=카테고리) 파라미터 -----------------------------------//
    function parseCampTypeFromQuery(value: string | null | undefined, fallback: string){
      if (!value) return fallback;
    }
    const rawCampType = query.get("camp-type")?.trim()||"ALL";
    const [campType, setCampType]  = useState<string>(rawCampType);




    const [campRegion, setCampRegion] = useState<string>('');
//-------------------검색 키워드 파라미터------------------------//
    function parsePlaceNameFromQuery(value: string | null | undefined, fallback: string){
      if (!value) return fallback;
    }

    const rawPlaceName = query.get("place-name")?.trim() || ""; 
    const [placeName, setPlaceName] = useState<string>(rawPlaceName);

//-------------------정렬기준(sort-type), 정렬(order-by/asc desc) 파라미터--------------------------//

  const rawSortType = query.get("sort-type")?.trim() || "place-name"; 
  const [sortType, setSortType] = useState<string>(rawSortType);
  const rawOrder = query.get("order")?.trim() || "asc"; 
  const [order, setOrder] = useState<string>(rawOrder);
//-------------------------------------페이지-----------------------------------------------------//
  const rawPage = query.get("page")?.trim() || "1"
  const [page, setPage] = useState<string>(rawPage);


//------------------------------------파라미터 가져오기 끝-------------------------------------------------//
  const [name, setName] = useState<string>("");
  const [campListArr, setCampListArr]= useState<Campground[]>([]);
  const [campListItems, setCampListItems] = useState<JSX.Element[]>([]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    // 만약 입력이 바뀔 때마다 다른 처리를 하고 싶다면 여기에 추가
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    console.log("이름 검색:", name);
    // 이름 검색 로직 실행
  };

    return(
        <div>
            <Header />
            <div className="pt-20 z-10">
                <div className="w-full h-1/4">
                    <div className="items-center font-bold text-4xl text-center my-28">  
                    </div>
                </div>
                
                {/* <div className="relative w-full">
                        <div className="  h-96 w-10/12 mx-auto bg-[#ffffff] border-2 border-black-100 z-30 py-5 rounded-lg px-5 ">
                          <div id="weather-list" className="flex flex-row justify-center ">
                            <WeatherInfo preferredRegion = {preferredRegion} startDate={startDate} endDate={endDate}/>
                          </div>
                            
                        </div>
                </div> */}
                {/*태그영역*/}
                
                <CampList
                  placeName={placeName}
                  campType ={campType}
                  sortType ={sortType}
                  order = {order}
                  campListArr = {campListArr}
                  campListItems = {campListItems}
                  page = {page}

                  setPlaceName={setPlaceName}
                  setCampType = {setCampType}  
                  setSortType ={setSortType}
                  setOrder = {setOrder}      
                  setCampListArr={setCampListArr}
                  setCampListItems={setCampListItems}   
                /> 
                <SearchForm 
                  placeName={placeName}
                  campType ={campType}
                  sortType ={sortType}
                  order = {order}
                  preferredRegion ={preferredRegion}
                  startDate= {startDate}
                  dateDiff= {dateDiff}
                  campListItems = {campListItems}

                  setPlaceName={setPlaceName}
                  setCampType = {setCampType}  
                  setSortType ={setSortType}
                  setOrder = {setOrder}               
                />
             
                
                               
            </div>



        </div>

      
        

    );

}

export default SearchResult;

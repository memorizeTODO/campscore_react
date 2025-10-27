import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePickers from './DatePickers.tsx';
import { addDays } from 'date-fns';


interface props{
  campType: string,
  campRegion: string,
  setCampType: (campType: string) => void,
  setCampRegion: (campRegion: string) => void,

  startDate: Date,
  endDate: Date,
  dateDiff: number,
  
  setStartDate: React.Dispatch<React.SetStateAction<Date>>,
  setEndDate: React.Dispatch<React.SetStateAction<Date>>,
  setDateDiff: React.Dispatch<React.SetStateAction<number>>,
  
}



const SearchForm : React.FC<props> =({campType, campRegion, setCampType, setCampRegion, startDate, endDate, dateDiff, setStartDate, setEndDate, setDateDiff})=>{


  

  const handleCampRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCampRegion(event.target.value);
  };

  const handleCampTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCampType(event.target.value);
  };

  const navigate = useNavigate(); // React Router의 useNavigate 추가

  // 기존 form의 기본 submit 동작을 React Router 방식으로 변경
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault() //브라우저의 기본 제출 동작 차단
    const form = event.target as HTMLFormElement;
    const placeName = (form.elements.namedItem("place-name") as HTMLInputElement)?.value; // 폼 필드의 name 값을 가져오기
    // URLSearchParams를 사용해 쿼리스트링 생성
    const queryParams = new URLSearchParams({
      "place-name": placeName||"", // 입력된 캠핑장 이름
      "preferred-region": campRegion, // 선택된 지역
      "camp-type": campType, // 선택된 캠핑 종류
      "start-date": startDate.toISOString(), // 시작 날짜
      "date-diff": dateDiff.toString(),
      "sort-type" : "place_name", 
      "order": "asc",
      
    });
   
    navigate(`/search?${queryParams.toString()}`); // React Router를 통해 페이지 이동
  };

  return (
      /* 검색 폼 */
    <form name="searchdata" onSubmit={handleSubmit} method="get" className="relative w-3/5 -translate-y-1/2 mx-auto bg-[#ffffff] border-2 border-black-100 z-30 flex justify-center p-10">
      <div className="flex justify-center flex-col 2xl:flex-row gap-5 w-full">
        <input
          type="text"
          id="place-name"
          name="place-name"
          placeholder="장소명"
          className="bg-[#E8E8E8] text-gray-900 rounded-lg p-5 focus:ring-blue-500 focus:border-blue-500"
        />

                <DatePickers
                    startDate={startDate}
                    endDate={endDate}
                    dateDiff={dateDiff}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setDateDiff={setDateDiff}
                />



        <div className="grid grid-cols-2 w-full">
          <select id="campingRegion" name="camp-region" value={campRegion} onChange={handleCampRegionChange} className="bg-[#E8E8E8] rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-5">
            <option value="">지역</option>
            <option value="경기">경기도</option>
            <option value="강원">강원도</option>
            <option value="충남">충청남도</option>
            <option value="충북">충청북도</option>
            <option value="전남">전라남도</option>
            <option value="전북">전라북도</option>
            <option value="경남">경상남도</option>
            <option value="경북">경상북도</option>
            <option value="제주">제주</option>
          </select>

          <select id="campingType" name="camp-type" value={campType} onChange={handleCampTypeChange} className="bg-[#E8E8E8] rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-5">
            <option value="">종류</option>
            <option value="오토캠핑장">오토캠핑장</option>
            <option value="카라반">카라반</option>
            <option value="글램핑">글램핑</option>
          </select>
        </div>

        <button type="submit" className="bg-[#eeeeee] hover:bg-[#dddddd] w-full 2xl:w-16 h-16 rounded-full">
          <svg viewBox="-5 -5 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden 2xl:inline">
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="inline 2xl:hidden text-center">검색</span>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;


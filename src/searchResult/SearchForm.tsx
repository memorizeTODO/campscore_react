import React, { useState, useEffect, useCallback  } from "react";
import { useNavigate } from 'react-router-dom';

interface SearchProps{
    placeName: string,
    campType: string,
    sortType : string,
    order : string,
    preferredRegion : string,
    startDate: Date,
    dateDiff: number,

    campListItems: JSX.Element[],
    
    setPlaceName: React.Dispatch<React.SetStateAction<string>>
    setCampType: React.Dispatch<React.SetStateAction<string>>
    setSortType: React.Dispatch<React.SetStateAction<string>>
    setOrder: React.Dispatch<React.SetStateAction<string>>
}

interface Campground {
  placeaddress: string;
  placeid: string | number;
  placename: string;
  placeurl: string;
  placecategory: string;
  placeregion: string;
}


const SearchForm: React.FC<SearchProps> =({placeName, campType, sortType, order, preferredRegion, startDate, dateDiff, campListItems, setPlaceName, setCampType, setSortType, setOrder})=>{
    


    const navigate = useNavigate(); // React Router의 useNavigate 추가

    const handleSubmit =(event: React.FormEvent) => {
        event.preventDefault();//브라우저의 기본 제출 동작 차단
        const form = event.target as HTMLFormElement;
        const placeName = (form.elements.namedItem("search-placename") as HTMLInputElement)?.value; // 폼 필드의 name 값을 가져오기
        
        // URLSearchParams를 사용해 쿼리스트링 생성
        const queryParams = new URLSearchParams({
          "place-name": placeName||"", // 입력된 캠핑장 이름
          "preferred-region": preferredRegion, // 선택된 지역
          "camp-type": campType, // 선택된 캠핑 종류
          "start-date": startDate.toISOString(), // 시작 날짜
          "date-diff": dateDiff.toString(),
          "sort-type" :sortType, 
          "order": order,
          
        });
        navigate(`?${queryParams.toString()}`); // React Router를 통해 페이지 이동
    }
    const handlePlaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceName(event.target.value); // keyword 값을 최신 입력값으로 설정
    };

    const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(event.target.value); // 선택된 캠핑장 종류를 상위 상태로 반영
    };
     const handleSortTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortType(event.target.value); // 선택된 캠핑장 종류를 상위 상태로 반영
    };
    
    // 'ALL' 항목의 고유 값 및 구분자 정의
    const ALL_OPTION_VALUE = "ALL";
    const SEPARATOR = "%7C"; // | 구분자 사용

    // 옵션 배열 (이전과 동일)
    const CAMP_TYPE_OPTIONS = [
    { value: ALL_OPTION_VALUE, label: "전체", id: "all-checkbox" },
    { value: "카라반", label: "카라반", id: "caravan-checkbox" },
    { value: "글램핑장", label: "글램핑장", id: "gramping-checkbox" },
    { value: "오토캠핑장", label: "오토캠핑장", id: "autocamping-checkbox" },
    ];

    // 헬퍼 함수: 현재 campType 문자열을 배열로 변환 (컴포넌트 외부로 이동)
    const campTypeStrToArray = (typeStr: string): string[] => {
        if (!typeStr || typeStr === "") return []; 
        return typeStr.split(SEPARATOR).filter(s => s.trim() !== "");
    };

    // 헬퍼 함수: 배열을 '|' 구분자 문자열로 변환 (컴포넌트 외부로 이동)
    const campTypeArrToString = (typeArr: string[]): string => {
        const uniqueArr = Array.from(new Set(typeArr.filter(Boolean)));
        return uniqueArr.join(SEPARATOR);
    };

    // 3. 체크박스 변경 핸들러 정의 (로직은 동일하게 유지)
    const handleCampTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        const isChecked = event.target.checked; 

        // 최신 campType 상태 문자열을 배열로 변환
        let currentTypes = campTypeStrToArray(campType);

        if (selectedValue === ALL_OPTION_VALUE) {
            // A. '전체' 체크박스를 조작하는 경우
            if (isChecked) {
                setCampType(ALL_OPTION_VALUE);
            } else {
                setCampType("");
            }
        } else {
            // B. '전체'를 제외한 일반 체크박스를 조작하는 경우
            let newTypes: string[];
            
            if (isChecked) {
                if (!currentTypes.includes(selectedValue)) {
                    newTypes = [...currentTypes, selectedValue];
                } else {
                    newTypes = currentTypes;
                }
                
                // '전체'가 포함되어 있었다면, '전체'를 해제합니다.
                newTypes = newTypes.filter(type => type !== ALL_OPTION_VALUE);
            } else {
                newTypes = currentTypes.filter(type => type !== selectedValue);
            }
            
            // 배열을 다시 파이프 구분자 문자열로 저장
            console.log(campTypeArrToString(newTypes))
            setCampType(campTypeArrToString(newTypes));
        }
    }, [campType, setCampType]); // campType을 의존성 배열에 포함

    // 4. 렌더링을 위한 배열 변환
    const selectedTypesArray = campTypeStrToArray(campType);

    return(
            <div className="relative flex w-full">
                <div className="mx-10 w-80 flex flex-col top-0">
                    <div className="py-10 rounded-lg ">
                        <form className="w-80" onSubmit={handleSubmit} method="get">   
                            <label htmlFor="searchPlaceName" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                              <input
                                type="search"
                                id="search-placename"
                                name= "search-placename"
                                value={placeName}
                                onChange={handlePlaceNameChange}
                                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500"
                                placeholder="이름"
                                required
                              />
                              <button
                                type="submit"
                                id="submit-btn"
                                name= "submit-btn"
                                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-sm rounded-lg text-sm px-4 py-2">
                                <svg
                                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                  />
                                </svg>
                              </button>
                            </div>
                        </form>
                    </div>

                    <form id="checkboxGroup"> 
                        {/* ... 기존 Tailwind CSS UI 및 옵션 매핑 코드 ... */}
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">캠핑장 종류</h3>
                        <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            
                            {CAMP_TYPE_OPTIONS.map((option, index) => (
                                <li 
                                    key={option.id} 
                                    className={`w-full ${index === CAMP_TYPE_OPTIONS.length - 1 ? '' : 'border-b border-gray-200'} rounded-t-lg dark:border-gray-600`}
                                >
                                    <div className="flex items-center ps-3">
                                        <input
                                            id={option.id}
                                            type="checkbox" 
                                            value={option.value}
                                            name="placeCategoryDetails" 
                                            checked={selectedTypesArray.includes(option.value)} 
                                            onChange={handleCampTypeChange}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                                        />
                                        <label 
                                            htmlFor={option.id} 
                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </form>
                </div>

                <div className="flex flex-col w-full pb-5"> 
                    <form action="" method="get" >
                        <div className="flex relative flex-row-reverse w-10/12">
                                                <select id="order" name="order" className="py-2.5 px-0 text-sm text-gray-500 bg-[#F5F5F5] 
                                                focus:outline-none focus:ring-0 focus:border-gray-200 peer" defaultValue='asc' value={order} onChange={handleOrderChange}>
                                                    <option value="asc">오름차순</option>
                                                    <option value="desc">내림차순</option>
                                                    </select>  
                                                <select id="sort-type" name='sort-type' className="py-2.5 px-0 text-sm text-gray-500   bg-[#F5F5F5]
                                                                                    focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                                                                    value ={sortType} 
                                                                                    onChange={handleSortTypeChange}>
                                                    <option value="place_name" >이름순</option>
                                                    {/* <option value="weather_score">날씨점수순</option> */}
                                                
                                                </select>
                                                
                        </div>
                    </form>
        
                    <div id="camp-list" >{campListItems}</div>
            
                            
                </div>  
            </div>   
    );
}

export default SearchForm;
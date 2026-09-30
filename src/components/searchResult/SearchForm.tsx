import React, { useState, useEffect, useCallback  } from "react";
import { useNavigate } from 'react-router-dom';

interface SearchProps {
    placeName: string,
    campType: string,
    sortType : string,
    order : string,
    campRegion : string,
    startDate: Date,
    dateDiff: number,

    campListItems: JSX.Element[],
    
    setPlaceName: React.Dispatch<React.SetStateAction<string>>
    setCampType: React.Dispatch<React.SetStateAction<string>>
    setCampRegion: React.Dispatch<React.SetStateAction<string>>
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

// 상수 정의
const ALL_OPTION_VALUE = "ALL";
const SEPARATOR = "|"; // 내부 상태 관리용 구분자 (URL에는 더 이상 안 쓰임)
const allowedCampTypes = [ALL_OPTION_VALUE, "카라반", "글램핑장", "오토캠핑장"];

// 옵션 배열
const CAMP_TYPE_OPTIONS = [
    { value: ALL_OPTION_VALUE, label: "전체", id: "all-checkbox" },
    { value: "카라반", label: "카라반", id: "caravan-checkbox" },
    { value: "글램핑장", label: "글램핑장", id: "gramping-checkbox" },
    { value: "오토캠핑장", label: "오토캠핑장", id: "autocamping-checkbox" },
];

// 헬퍼 함수들 (내부 상태 문자열 <-> 배열 변환용)
const campTypeStrToArray = (typeStr: string): string[] => {
    if (!typeStr || typeStr === "" || typeStr === ALL_OPTION_VALUE) return [ALL_OPTION_VALUE];
    return typeStr.split(SEPARATOR).map(s => s.trim()).filter(Boolean);
};

const campTypeArrToString = (typeArr: string[]): string => {
    if (typeArr.length === 0 || typeArr.includes(ALL_OPTION_VALUE)) return ALL_OPTION_VALUE;
    const uniqueArr = Array.from(new Set(typeArr.filter(Boolean)));
    return uniqueArr.join(SEPARATOR);
};

const SearchForm: React.FC<SearchProps> = ({
    placeName, 
    campType, 
    sortType, 
    order, 
    campRegion, 
    startDate, 
    dateDiff, 
    campListItems, 
    setPlaceName, 
    setCampType, 
    setCampRegion, 
    setSortType, 
    setOrder
}) => {
    const navigate = useNavigate();

    // 🌟 [핵심 변경] handleSubmit에서 복수 쿼리 파라미터(Array-style)로 URL 생성
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const placeNameVal = (form.elements.namedItem("search-placename") as HTMLInputElement)?.value;
        
        // 1. 기본 파라미터 설정
        const queryParams = new URLSearchParams({
            "start-date": startDate.toISOString(),
            "date-diff": dateDiff.toString(),
            "place-name": placeNameVal || "",
            "camp-region": campRegion,
            "sort-type": sortType,
            "order": order,
            "page": '1',
        });

        // 2. camp-type을 개별적으로 append하여 복수 파라미터 생성 (?camp-type=카라반&camp-type=글램핑장)
        const typeArray = campTypeStrToArray(campType);
        queryParams.delete("camp-type"); // 기존에 혹시 남아있을 수 있는 값 제거
        
        if (typeArray.includes(ALL_OPTION_VALUE) || typeArray.length === 0) {
            queryParams.append("camp-type", ALL_OPTION_VALUE);
        } else {
            typeArray.forEach(type => {
                if (type) {
                    queryParams.append("camp-type", type);
                }
            });
        }

        navigate(`?${queryParams.toString()}`);
    };

    const handlePlaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceName(event.target.value);
    };

    const handleOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrder(event.target.value);
    };

    const handleSortTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortType(event.target.value);
    };
    
    const handleCampRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCampRegion(event.target.value);
    };
    
    // 체크박스 변경 핸들러
    const handleCampTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = event.target.value;
        const isChecked = event.target.checked; 

        let currentTypes = campTypeStrToArray(campType);

        if (selectedValue === ALL_OPTION_VALUE) {
            if (isChecked) {
                setCampType(ALL_OPTION_VALUE);
            } else {
                setCampType("");
            }
        } else {
            let newTypes: string[];
            
            if (isChecked) {
                if (!currentTypes.includes(selectedValue)) {
                    newTypes = [...currentTypes, selectedValue];
                } else {
                    newTypes = currentTypes;
                }
                // '전체'가 껴있었다면 제거
                newTypes = newTypes.filter(type => type !== ALL_OPTION_VALUE);
            } else {
                newTypes = currentTypes.filter(type => type !== selectedValue);
            }
            
            setCampType(campTypeArrToString(newTypes));
        }
    };

    // 렌더링용 배열
    const selectedTypesArray = campTypeStrToArray(campType);

    return(
        <div className="relative flex w-full">
            <div className="mx-10 w-80 flex flex-col top-0">
                <div className="py-10 rounded-lg">
                    <form className="w-80" onSubmit={handleSubmit} method="get">   
                        <label htmlFor="searchPlaceName" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                          <input
                            type="search"
                            id="search-placename"
                            name="search-placename"
                            value={placeName}
                            onChange={handlePlaceNameChange}
                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-gray-500 focus:border-gray-500"
                            placeholder="이름"
                          />
                          <button
                            type="submit"
                            id="submit-btn"
                            name="submit-btn"
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

                <select id="campingRegion" name="camp-region" value={campRegion} onChange={handleCampRegionChange} className="bg-[#E8E8E8] rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-5 mt-4">
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
            </div>

            <div className="flex flex-col w-full pb-5"> 
                <form action="" method="get">
                    <div className="flex relative flex-row-reverse w-10/12">
                        <select id="order" name="order" className="py-2.5 px-0 text-sm text-gray-500 bg-[#F5F5F5] focus:outline-none focus:ring-0 focus:border-gray-200 peer" value={order} onChange={handleOrderChange}>
                            <option value="asc">오름차순</option>
                            <option value="desc">내림차순</option>
                        </select>  
                        <select id="sort-type" name='sort-type' className="py-2.5 px-0 text-sm text-gray-500 bg-[#F5F5F5] focus:outline-none focus:ring-0 focus:border-gray-200 peer" value={sortType} onChange={handleSortTypeChange}>
                            <option value="place_name">이름순</option>
                        </select>
                    </div>
                </form>
    
                <div id="camp-list">{campListItems}</div>
            </div> 
        </div>   
    );
}

export default SearchForm;
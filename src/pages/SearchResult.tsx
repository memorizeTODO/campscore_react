import { addDays, startOfDay, differenceInDays } from "date-fns";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { API1_BASE_URL } from "../config.ts";
import Header from "../components/searchResult/Header.tsx";
import CampList from "../components/searchResult/CampList.tsx";
import WeatherInfo from "../components/searchResult/WeatherInfo.tsx";
import SearchForm from "../components/searchResult/SearchForm.tsx";
import PaginationBar from "../components/searchResult/PaginationBar.tsx";

interface Campground {
     placeaddress: string;
     placeid: string | number;
     placename: string;
     placeurl: string;
     placecategory: string;
     placeregion: string;
}

const allowedRegions = ["서울", "경기", "강원", "충남", "충북", "경남", "경북", "전남", "전북", "제주"];
const ALL_OPTION_VALUE = "ALL";
const SEPARATOR = "|"; 
const allowedCampTypes = [ALL_OPTION_VALUE, "카라반", "글램핑장", "오토캠핑장"];

// 날짜 파싱 헬퍼 함수
function parseDateFromQuery(value: string | null | undefined, fallback: Date): Date {
    if (!value) return fallback;
    const isValidFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValidFormat) return fallback;
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? fallback : parsed;
}

// 복수 파라미터(array) 형태로 들어오는 camp-type 검증 및 파싱
function parseCampTypeFromQuery(values: string[], fallback: string): string {
    if (!values || values.length === 0) return fallback;
    
    let types: string[] = [];
    if (values.length === 1 && values[0].includes(SEPARATOR)) {
        types = values[0].split(SEPARATOR).map(s => s.trim()).filter(Boolean);
    } else {
        types = values.map(s => s.trim()).filter(Boolean);
    }

    if (types.length === 0 || types.includes(ALL_OPTION_VALUE)) return ALL_OPTION_VALUE;

    const isValidAll = types.every(t => allowedCampTypes.includes(t));
    return isValidAll ? types.join(SEPARATOR) : fallback;
}

// 내부 상태 문자열 -> 배열 변환 헬퍼 함수
const campTypeStrToArray = (typeStr: string): string[] => {
    if (!typeStr || typeStr === "" || typeStr === ALL_OPTION_VALUE) return [ALL_OPTION_VALUE];
    return typeStr.split(SEPARATOR).map(s => s.trim()).filter(Boolean);
};

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const today = startOfDay(new Date());

  // 상태 선언
  const [startDate, setStartDate] = useState<Date>(today);
  const [dateDiff, setDateDiff] = useState<number>(7);
  const [endDate, setEndDate] = useState<Date>(addDays(today, 7));
  const [campRegion, setCampRegion] = useState<string>("");
  const [campType, setCampType] = useState<string>("ALL");
  
  const [placeQuery, setPlaceQuery] = useState<string>("");
  const [inputPlaceQuery, setInputPlaceQuery] = useState<string>(""); 

  const [sortType, setSortType] = useState<string>("place-name");
  const [order, setOrder] = useState<string>("asc");
  const [page, setPage] = useState<number>(1);

  const query = new URLSearchParams(location.search);

  // URL이 바뀔 때 상태 동기화
  useEffect(() => {
      const rawPlaceQuery = query.get("place-query")?.trim() || "";
      const rawCampRegion = query.get("camp-region")?.trim() || "";
      const rawCampTypes = query.getAll("camp-type");    
      const finalCampType = parseCampTypeFromQuery(rawCampTypes, ALL_OPTION_VALUE);
      const rawSortType = query.get("sort-type")?.trim() || "place-name";
      const rawOrder = query.get("order")?.trim() || "asc";
      const rawPage = query.get("page")?.trim() || "1";

      // --- 캠핑 시작일자 파싱 ---
      const rawStartDate = query.get("start-date")?.trim();
      const parsedStartDate = parseDateFromQuery(rawStartDate, today);
      const diffFromToday = differenceInDays(parsedStartDate, today);
      const finalStartDate = (diffFromToday < 0 || diffFromToday > 7) ? today : parsedStartDate;
      setStartDate(finalStartDate);

      // --- 날짜 차이 파싱 ---
      const rawDateDiff = query.get("date-diff")?.trim();
      let finalDateDiff = 7;
      if (rawDateDiff) {
          const num = Number(rawDateDiff);
          if (!Number.isNaN(num)) finalDateDiff = num;
      }
      setDateDiff(finalDateDiff);

      // --- 캠핑 종료일자 파싱 ---
      const rawEndDate = query.get("end-date")?.trim();
      const parsedEndDate = parseDateFromQuery(rawEndDate, addDays(finalStartDate, 7));
      const diffEndStart = differenceInDays(parsedEndDate, finalStartDate);
      const diffEndToday = differenceInDays(parsedEndDate, today);
      const finalEndDate = (diffEndStart < 0 || diffEndToday > 7) ? addDays(finalStartDate, 7) : parsedEndDate;
      setEndDate(finalEndDate);

      // --- 선호 지역 파싱 ---
      setCampRegion(rawCampRegion && allowedRegions.includes(rawCampRegion) ? rawCampRegion : "");

      // --- 캠프 타입 파싱 ---
      setCampType(finalCampType);

      // --- 검색어 파싱 ---
      setPlaceQuery(rawPlaceQuery);
      setInputPlaceQuery(rawPlaceQuery);

      // --- 정렬 및 순서 파싱 ---
      setSortType(rawSortType);
      setOrder(rawOrder);

      // --- 페이지 파싱 ---
      const potentialNumber = Number(rawPage);
      if (Number.isInteger(potentialNumber) && isFinite(potentialNumber) && potentialNumber >= 1) {
          setPage(potentialNumber);
      } else {
          setPage(1);
      }
  }, [location.search]);

  const [totalPages, setTotalPages] = useState<number>(1);
  const [campListArr, setCampListArr] = useState<Campground[]>([]);
  const [campListItems, setCampListItems] = useState<JSX.Element[]>([]);

  // 페이지 이동 함수
  const handlePageChange = (newPage: number) => {
        const queryParams = new URLSearchParams(location.search); 
        queryParams.set("page", newPage.toString()); 
        navigate(`?${queryParams.toString()}`);
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // API 호출 및 페이지 초과 시 자동 보정 로직
  const fetchCampListArr = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setLoading(true);
        setCampListArr([]); 
        setError(null); 

        try {
            const currentQuery = new URLSearchParams(location.search);
            const currentPageNum = Number(currentQuery.get("page") || "1");
            
            const queryParams = new URLSearchParams({
                "sort-type": currentQuery.get("sort-type") || "place-name",
                "order": currentQuery.get("order") || "asc",
                "camp-region": currentQuery.get("camp-region") || "",
                "place-name": currentQuery.get("place-name") || "",
                "page": currentPageNum.toString(),
            });

            // camp-type 배열 추출 및 각각 append
            const rawCampTypes = currentQuery.getAll("camp-type");
            const finalCampType = parseCampTypeFromQuery(rawCampTypes, ALL_OPTION_VALUE);
            const typeArray = campTypeStrToArray(finalCampType);
            
            queryParams.delete("camp-type");
            if (typeArray.includes(ALL_OPTION_VALUE) || typeArray.length === 0) {
                queryParams.append("camp-type", ALL_OPTION_VALUE);
            } else {
                typeArray.forEach(type => {
                    if (type) queryParams.append("camp-type", type);
                });
            }

            const res = await fetch(
                `${API1_BASE_URL}/get/campinglist?${queryParams.toString()}`,
                { signal: abortController.signal }
            );
            if (!res.ok) throw new Error('Network response was not ok');
            
            const resJson = await res.json();
            const contentList = resJson.content || [];
            
            if (resJson.meta?.totalPages !== undefined) {
                const fetchedTotalPages = resJson.meta.totalPages;
                setTotalPages(fetchedTotalPages);

                // 🌟 [안전장치] 현재 요청한 페이지가 전체 페이지 수보다 크면 (예: 3페이지 보다가 2페이지짜리 결과로 바뀔 때) 1페이지로 자동 보정
                if (currentPageNum > fetchedTotalPages && fetchedTotalPages > 0) {
                    currentQuery.set("page", "1");
                    navigate(`?${currentQuery.toString()}`, { replace: true });
                    return;
                }
            }

            const newCampListArr: Campground[] = contentList.map((itemData: any) => ({
                placeaddress: itemData.addressName,
                placeid: itemData.placeID,
                placename: itemData.placeName,
                placeurl: itemData.placeUrl,
                placecategory: itemData.placeCategoryDetail,
                placeregion: itemData.region,
            }));

            setCampListArr(newCampListArr);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                // 무시
            } else {
                setError(error.message);
                console.error("Fetch Error:", error);
            }
        } finally {
            if (abortControllerRef.current === abortController) {
                setLoading(false);
                abortControllerRef.current = null; 
            }
        }
  };

  useEffect(() => {
        fetchCampListArr();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
  }, [location.search]); 

  return(
      <div>
          <Header />
          <div className="pt-20 z-10">
              <div className="w-full h-1/4">
                  <div className="items-center font-bold text-4xl text-center my-28"></div>
              </div>
              
              <CampList
                  placeQuery={placeQuery}
                  campType={campType}
                  sortType={sortType}
                  order={order}
                  campListArr={campListArr}
                  campListItems={campListItems}
                  page={page}
                  setPlaceQuery={setPlaceQuery}
                  setCampType={setCampType}  
                  setSortType={setSortType}
                  setOrder={setOrder}      
                  setCampListArr={setCampListArr}
                  setCampListItems={setCampListItems}   
              /> 
              <SearchForm 
                  placeQuery={placeQuery}
                  campType={campType}
                  sortType={sortType}
                  order={order}
                  campRegion={campRegion}
                  startDate={startDate}
                  dateDiff={dateDiff}
                  campListItems={campListItems}
                  setPlaceQuery={setPlaceQuery}
                  setCampType={setCampType}
                  setCampRegion={setCampRegion}  
                  setSortType={setSortType}
                  setOrder={setOrder}              
              />
              
             <div className="flex justify-center my-8">
                  <PaginationBar 
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                  />
              </div>       
          </div>
      </div>
  );
}

export default SearchResult;
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { addDays, startOfDay, differenceInDays } from "date-fns";
import Header from "../components/detailPage/Header.tsx"
import DetailContent from "../components/detailPage/DetailContent.tsx";
import { API1_BASE_URL } from "../config.ts";


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


const DetailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const today = startOfDay(new Date());

    // 상태 선언
    const [startDate, setStartDate] = useState<Date>(today);
    const [dateDiff, setDateDiff] = useState<number>(7);
    const [endDate, setEndDate] = useState<Date>(addDays(today, 7));
    const [campRegion, setCampRegion] = useState<string>("");
    const [campType, setCampType] = useState<string>();
    
    const [placeQuery, setPlaceQuery] = useState<string>("");
    const [inputPlaceQuery, setInputPlaceQuery] = useState<string>(""); 

    const [sortType, setSortType] = useState<string>("place-name");
    const [order, setOrder] = useState<string>("asc");
    const [page, setPage] = useState<number>(1);

    const [placeID, setPlaceID] = useState<number>(1);
    
    const query = new URLSearchParams(location.search);


    const [placeData, setPlaceData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
  // URL이 바뀔 때 상태 동기화
    useEffect(() => {
        const rawPlaceQuery = query.get("place-query")?.trim() || "";
        const rawCampRegion = query.get("camp-region")?.trim() || "";
        const rawCampTypes = query.getAll("camp-type");    
        const finalCampType = parseCampTypeFromQuery(rawCampTypes, ALL_OPTION_VALUE);
        const rawSortType = query.get("sort-type")?.trim() || "place-name";
        const rawOrder = query.get("order")?.trim() || "asc";
        const rawPage = query.get("page")?.trim() || "1";

        const rawPlaceID = query.get("place-id")?.trim() || "1";

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
        // --- 장소ID 파싱 ---
         if (rawPlaceID) {
            const num = Number(rawPlaceID);
            if (!Number.isNaN(num)) setPlaceID(num);
        }
 
    }, [location.search]);


    // 목록으로 돌아갈 때 히든 파라미터(weather-score)를 포함한 모든 검색 상태를 완벽히 복원
    const handleBackToList = () => {
        const queryParams = new URLSearchParams();
        queryParams.append("camp-region", campRegion);        
        queryParams.append("place-query", placeQuery);
        queryParams.append("sort-type", sortType);
        if (Array.isArray(campType)) {
            campType.forEach((type) => {
                queryParams.append("camp-type", type);
            });
        } else if (campType) {
            // 문자열 하나인 경우에도 우선 append 형식으로 처리
            queryParams.append("camp-type", campType);
        }
        queryParams.append("order", order);
        queryParams.append("page", String(page));
        navigate(-1);
        navigate(`/?${queryParams.toString()}`);
    };


    const fetchPlaceData = async () => {

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        try {
        const currentQuery = new URLSearchParams(location.search);

        setLoading(true);
        setPlaceData(null);

        const currentplaceID = currentQuery.get('place-id')|| placeID;
        
        const res = await fetch(
                            `${API1_BASE_URL}/get/placedata?place-id=${currentplaceID.toString()}`,
                            { signal: abortController.signal }
                        );
        if (!res.ok) throw new Error('Network response was not ok');

        const resJson = await res.json();

        console.log('resJson=' + resJson);
        setPlaceData(resJson);
        }catch (error: any) {
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
        fetchPlaceData();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, [location.search]); 

    if (loading) {
            return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    return (
        <div>
            <Header/>
            <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-10">
                
                <DetailContent placeData={placeData} />
                <div className="w-10/12 flex justify-start mb-5">
                    <button 
                        onClick={handleBackToList} 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer font-medium"
                    >
                        ← 목록으로 돌아가기
                    </button>
                </div>
            </div>

        </div>
    );
    
};

export default DetailPage;
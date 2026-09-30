import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DetailContent from "../components/detailPage/DetailContent.tsx";

const DetailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const region = searchParams.get("region") || "";
    const placeid = searchParams.get("placeid") || "";
    const placeName = searchParams.get("place-name") || "";
    const page = searchParams.get("page") || "1";
    const campTypes = searchParams.getAll("camp-type");
    const placeQuery = searchParams.get("place-query") || "";
    const sortType = searchParams.get("sort-type") || "";
    const order = searchParams.get("order") || "";
    
    // 히든으로 넘어온 날씨 점수 파라미터 수신
    const weatherScore = searchParams.get("weather-score") || "";

    const [campDetail, setCampDetail] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setCampDetail({
            id: placeid,
            name: placeName,
            region: region,
            address: "서울특별시 중구 ... (예시 상세 주소)",
            category: "일반야영장",
            description: `${placeName} 상세 설명입니다.`,
        });
        setLoading(false);
    }, [placeid, placeName, region]);

    // 목록으로 돌아갈 때 히든 파라미터(weather-score)를 포함한 모든 검색 상태를 완벽히 복원
    const handleBackToList = () => {
        const backParams = new URLSearchParams({
            page: page,
            "place-query": placeQuery,
            "sort-type": sortType,
            order: order,
        });

        if (weatherScore) {
            backParams.append("weather-score", weatherScore);
        }

        campTypes.forEach((type) => {
            backParams.append("camp-type", type);
        });

        navigate(`/?${backParams.toString()}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-50 py-10">
            <div className="w-10/12 flex justify-start mb-5">
                <button 
                    onClick={handleBackToList} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer font-medium"
                >
                    ← 목록으로 돌아가기
                </button>
            </div>

            <DetailContent campDetail={campDetail} region={region} />
        </div>
    );
};

export default DetailPage;
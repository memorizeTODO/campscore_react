import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Campground {
    placeaddress: string;
    placeid: string | number;
    placename: string;
    placeurl: string;
    placecategory: string;
    placeregion: string;
}

interface CampListProps {
    placeQuery: string;
    campType: string | string[]; // 배열일 수도 있는 campType 대응
    campRegion: string
    sortType: string;
    order: string;
    campListArr: Campground[];
    campListItems: JSX.Element[];
    page: number;
    
    setCampListItems: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
}

const CampList: React.FC<CampListProps> = ({
    placeQuery, campRegion, campType, sortType, order, campListArr, campListItems, page, 
    setCampListItems
}) => {
    const navigate = useNavigate();

    // 상세 페이지로 이동할 때 상태 유지 및 camp-type 중복 쿼리 처리
    const handleDetailMove = (campRegion: string, id: string | number) => {
        const queryParams = new URLSearchParams();

        // 기본 단일 값 파라미터들 추가
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
        queryParams.append("place-id", String(id));
       
        // camp-type이 여러 개(배열 형태 등)일 수 있으므로 중복 쿼리로 각각 append


        navigate(`/detail?${queryParams.toString()}`);
    };

    const generateCampList = useCallback(() => {
        const items: JSX.Element[] = [];    
        const loopLimit = campListArr.length;

        for (let i = 0; i < loopLimit; i++) {
            const data = campListArr[i];
            const address = data.placeaddress;
            const placeID = data.placeid;
            const placeName = data.placename;
            const placeUrl = data.placeurl;
            const category = data.placecategory;
            const region = data.placeregion;
            const img = `../images/${region}/thumbnail/${placeID}_main.jpg`;

            items.push(
                <div 
                    key={placeID} 
                    onClick={() => handleDetailMove(campRegion, placeID)}
                    className="flex flex-row justify-start h-72 w-10/12 z-30 mr-10 px-5 py-5 rounded-lg bg-[#ffffff] border-2 border-black-100 mb-5 cursor-pointer"
                >
                    <div className="h-64 w-64 absolute rounded-lg relative">
                        <img className="h-64 w-64 absolute rounded-lg" src={img} alt={placeName} />
                    </div>
                    <div className="w-full h-full relative flex flex-col mx-5 px-5">
                        <div>{address}</div>
                        <div className="flex justify-start font-bold text-4xl"> 
                            {placeName}
                        </div>    
                        {category}
                    </div>
                </div>
            );
        }
        
        setCampListItems(items);
    }, [campListArr, setCampListItems, page, campType, placeQuery, sortType, order, navigate]);

    useEffect(() => {
        generateCampList();
    }, [generateCampList]); 

    return null;
}

export default CampList;
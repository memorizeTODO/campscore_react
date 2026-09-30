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
    placeName: string;
    campType: string | string[]; // 배열일 수도 있는 campType 대응
    sortType: string;
    order: string;
    campListArr: Campground[];
    campListItems: JSX.Element[];
    page: number;
    
    setPlaceName: React.Dispatch<React.SetStateAction<string>>,
    setCampType: React.Dispatch<React.SetStateAction<any>>,
    setSortType: React.Dispatch<React.SetStateAction<string>>,
    setOrder: React.Dispatch<React.SetStateAction<string>>,
    setCampListArr: React.Dispatch<React.SetStateAction<Campground[]>>,
    setCampListItems: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
}

const CampList: React.FC<CampListProps> = ({
    placeName, campType, sortType, order, campListArr, campListItems, page, 
    setPlaceName, setCampType, setSortType, setOrder, setCampListArr, setCampListItems
}) => {
    const navigate = useNavigate();

    // 상세 페이지로 이동할 때 상태 유지 및 camp-type 중복 쿼리 처리
    const handleDetailMove = (region: string, id: string | number, name: string) => {
        const queryParams = new URLSearchParams();

        // 기본 단일 값 파라미터들 추가
        queryParams.append("region", region);
        queryParams.append("placeid", String(id));
        queryParams.append("place-name", name);
        queryParams.append("page", String(page));
        queryParams.append("place-query", placeName);
        queryParams.append("sort-type", sortType);
        queryParams.append("order", order);

        // camp-type이 여러 개(배열 형태 등)일 수 있으므로 중복 쿼리로 각각 append
        if (Array.isArray(campType)) {
            campType.forEach((type) => {
                queryParams.append("camp-type", type);
            });
        } else if (campType) {
            // 문자열 하나인 경우에도 우선 append 형식으로 처리
            queryParams.append("camp-type", campType);
        }

        navigate(`/detail?${queryParams.toString()}`);
    };

    const generateCampList = useCallback(() => {
        const items: JSX.Element[] = [];    
        const loopLimit = campListArr.length;

        for (let i = 0; i < loopLimit; i++) {
            const data = campListArr[i];
            const address = data.placeaddress;
            const id = data.placeid;
            const name = data.placename;
            const url = data.placeurl;
            const category = data.placecategory;
            const region = data.placeregion;
            const img = `images/${region}/thumbnail/${name}.jpg`;

            items.push(
                <div 
                    key={id} 
                    onClick={() => handleDetailMove(region, id, name)}
                    className="flex flex-row justify-start h-72 w-10/12 z-30 mr-10 px-5 py-5 rounded-lg bg-[#ffffff] border-2 border-black-100 mb-5 cursor-pointer"
                >
                    <div className="h-64 w-64 absolute rounded-lg relative">
                        <img className="h-64 w-64 absolute rounded-lg" src={img} alt={name} />
                    </div>
                    <div className="w-full h-full relative flex flex-col mx-5 px-5">
                        <div>{address}</div>
                        <div className="flex justify-start font-bold text-4xl"> 
                            {name}
                        </div>    
                        {category}
                    </div>
                </div>
            );
        }
        
        setCampListItems(items);
    }, [campListArr, setCampListItems, page, campType, placeName, sortType, order, navigate]);

    useEffect(() => {
        generateCampList();
    }, [generateCampList]); 

    return null;
}

export default CampList;
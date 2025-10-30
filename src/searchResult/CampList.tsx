     import React, { useRef,useState, useEffect, useCallback  } from "react";

     interface Campground {
	   placeaddress: string;
	   placeid: string | number;
	   placename: string;
	   placeurl: string;
	   placecategory: string;
	   placeregion: string;
	 }
	 
     interface CampListProps{
         placeName: string,
         campType: string,
         sortType : string,
         order : string,
         campListArr: Campground[],
         campListItems: JSX.Element[],
         page: number;
         
         
         setPlaceName: React.Dispatch<React.SetStateAction<string>>,
         setCampType: React.Dispatch<React.SetStateAction<string>>,
         setSortType: React.Dispatch<React.SetStateAction<string>>,
         setOrder: React.Dispatch<React.SetStateAction<string>>,
         setCampListArr: React.Dispatch<React.SetStateAction<Campground[]>>,
         setCampListItems: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
     }
	 

     
	 const CampList: React.FC<CampListProps> =({placeName, campType,sortType, order, campListArr, campListItems,page , setPlaceName, setCampType, setSortType, setOrder, setCampListArr, setCampListItems})=>{

        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        // 1. AbortController 인스턴스를 저장할 Ref 생성
        const abortControllerRef = useRef<AbortController | null>(null);
        

	//  	const setCampList = async () => {
    //     const cres = await fetch(`http://localhost:80/get/campinglist?page=2&region=&sort_type=${sortType}&order_by=${orderBy}&place_name=${placeName}&category=${campType}`);
    //     const campJson = await cres.json();
        
    
    //     const Campgrounds = [
    //         {
    //                 placeaddress:campJson.item0.addressName,
    //                 placeid:campJson.item0.placeID,
    //                 placename:campJson.item0.placeName,
    //                 placeurl:campJson.item0.placeUrl,
    //                 placecategory: campJson.item0.placeCategoryDetail,
    //                 placeregion:campJson.item0.region,
        
    //         },
    //         {
    //                 placeaddress:campJson.item1.addressName,
    //                 placeid:campJson.item1.placeID,
    //                 placename:campJson.item1.placeName,
    //                 placeurl:campJson.item1.placeUrl,
    //                 placecategory: campJson.item1.placeCategoryDetail,
    //                 placeregion:campJson.item1.region,
    //         },
    //         {
    //                 placeaddress:campJson.item2.addressName,
    //                 placeid:campJson.item2.placeID,
    //                 placename:campJson.item2.placeName,
    //                 placeurl:campJson.item2.placeUrl,
    //                 placecategory: campJson.item2.placeCategoryDetail,
    //                 placeregion:campJson.item2.region,
    //         },
    //         {
    //                 placeaddress:campJson.item3.addressName,
    //                 placeid:campJson.item3.placeID,
    //                 placename:campJson.item3.placeName,
    //                 placeurl:campJson.item3.placeUrl,
    //                 placecategory: campJson.item3.placeCategoryDetail,
    //                 placeregion:campJson.item3.region,
    //         },
    //         {
    //                 placeaddress:campJson.item4.addressName,
    //                 placeid:campJson.item4.placeID,
    //                 placename:campJson.item4.placeName,
    //                 placeurl:campJson.item4.placeUrl,
    //                 placecategory:campJson.item4.placeCategoryDetail,
    //                 placeregion:campJson.item4.region,
    //         },
    //         {
    //                 placeaddress:campJson.item5.addressName,
    //                 placeid:campJson.item5.placeID,
    //                 placename:campJson.item5.placeName,
    //                 placeurl:campJson.item5.placeUrl,
    //                 placecategory: campJson.item5.placeCategoryDetail,
    //                 placeregion:campJson.item5.region,
    //         },
    //         {
    //             placeaddress:campJson.item6.addressName,
    //                 placeid:campJson.item6.placeID,
    //                 placename:campJson.item6.placeName,
    //                 placeurl:campJson.item6.placeUrl,
    //                 placecategory: campJson.item6.placeCategoryDetail,
    //                 placeregion:campJson.item6.region,
    //         },
    //         {
    //                 placeaddress:campJson.item7.addressName,
    //                 placeid:campJson.item7.placeID,
    //                 placename:campJson.item7.placeName,
    //                 placeurl:campJson.item7.placeUrl,
    //                 placecategory:campJson.item7.placeCategoryDetail,
    //                 placeregion:campJson.item7.region,

    //         },
    //         {
    //                 placeaddress:campJson.item8.addressName,
    //                 placeid:campJson.item8.placeID,
    //                 placename:campJson.item8.placeName,
    //                 placeurl:campJson.item8.placeUrl,
    //                 placecategory: campJson.item8.placeCategoryDetail,
    //                 placeregion:campJson.item8.region,
    //         },
    //         {
    //                 placeaddress:campJson.item9.addressName,
    //                 placeid:campJson.item9.placeID,
    //                 placename:campJson.item9.placeName,
    //                 placeurl:campJson.item9.placeUrl,
    //                 placecategory:campJson.item9.placeCategoryDetail,
    //                 placeregion:campJson.item9.region,
    //         }
    //     ]; 

    //     setCampListArr(Campgrounds);
    //     console.log(Campgrounds[0]['placeaddress']);
    // }
    const fetchCampListArr = async () => {
      if (abortControllerRef.current) {
          console.log("이전 요청 취소됨.");
          abortControllerRef.current.abort();
          abortControllerRef.current = null; // 취소 후 레퍼런스 정리
      }
      
      // 🚨 (2) 새 AbortController 생성 및 Ref에 저장
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setCampListArr([]); // 기존 데이터를 초기화
      setError(null); // 기존 오류 메시지 초기화
      try {
        const res = await fetch(`http://localhost:80/get/campinglist?sort-type=${sortType}&order=${order}&place-name=${placeName}&category=${campType}&page=${page}`,{ signal: abortController.signal });
        if (!res.ok) throw new Error('Network response was not ok');
        const resJson = await res.json();

    // 💡 수정된 로직: resJson의 키들을 순회하며 필요한 데이터만 추출
        const newCampListArr: Campground[] = [];
        
        // 최대 10개 (item0 ~ item9)까지만 처리합니다.
        for (let i = 0; i < 10; i++) {
            const itemKey = `item${i}`;
            const itemData = resJson[itemKey];

            // 해당 키가 resJson에 존재하지 않거나 null/undefined인 경우 루프 종료
            if (!itemData) { 
              console.log('cannot find item')
              break; 
            }
            console.log(itemData['addressName']);
            // 유효한 데이터가 있다면 배열에 추가
            newCampListArr.push({
                placeaddress: itemData['addressName'],
                placeid: itemData['placeID'],
                placename: itemData['placeName'],
                placeurl: itemData['placeUrl'],
                placecategory: itemData['placeCategoryDetail'],
                placeregion: itemData['region'],
            });
            
        }
        setCampListArr(newCampListArr);
        //console.log(newCampListArr[0].placeaddress);
      } catch (error: any) {
        if (error.name === 'AbortError') {
          
        }else{
          setError(error.message);
          console.error("Fetch Error:", error);
        }
        
      } finally {
        if (abortControllerRef.current === abortController) {
              setLoading(false);
              abortControllerRef.current = null; 
          }
      }
    }


    useEffect(() =>{
      fetchCampListArr();
      return () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      };
    },[placeName, campType,sortType, order]);
    
    const generateCampList = useCallback(() => {
    
        const items: JSX.Element[] = [];    
        
        const loopLimit = campListArr.length;

        for(let i = 0;i<loopLimit;i++){
            const data = campListArr[i];
            const address = data.placeaddress;
            const iD = data.placeid;
            const name = data.placename;
            const url = data.placeurl;
            const category = data.placecategory;
            const region = data.placeregion;
            const img = "images/"+region+"/thumbnail/"+name+".jpg";
            console.log(img);
            console.log(data.placeaddress);

            items.push(
            
            <form name="detaildata" action="detailpage.jsp" method="get">
                <div className="flex flex-row justify-start h-72 w-10/12 z-30 mr-10 px-5 py-5 rounded-lg bg-[#ffffff] border-2 border-black-100 mb-5 ">
                    <div className="h-64 w-64 absolute rounded-lg relative">
                        <img className="h-64 w-64 absolute rounded-lg" src={img} />
                    </div>
                    <div className="w-full h-full relative flex flex-col mx-5 px-5">
                        <div className="" >
                            {/* <input type = "hidden" name = "sdt" value={result_date0}></input>
                            <input type = "hidden" name = "edt" value={result_date}></input> */}
                                {address}
                        </div>
                        <button type= "submit" name = "campname" value={name} className="flex justify-start font-bold text-4xl" > 
                            {/* //onclick=location.href="detailpage.jsp"    */}
                                {name}
                        </button>    
                            {category}
                        <input type = "hidden" name = "region" value={region}></input>
                    </div>
                </div>
            </form>
                
            );
        }
        
        setCampListItems(items)
            // getWeatherByRegion();

        //campData();
    },[campListArr]);

    useEffect(() => {
    // campListArr가 업데이트될 때마다 목록을 생성하고 setCampListItems를 호출합니다.
    generateCampList();
    }, [generateCampList]); // generateCampList는 useCallback으로 메모이제이션되어 있으므로 안전합니다.

    

    return null;
}

export default CampList
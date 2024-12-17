import React, { useState } from 'react';


interface props{
  preferredRegion: string,
  setPreferredRegion: (preferredRegion: string) => void,
}

const RecommendedPlaces: React.FC<props> =({preferredRegion,setPreferredRegion})=>{
    
    const handlePreferredRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setPreferredRegion(event.target.value);
    };
    return(
        
    <div>
        {/* 지역 선택 드롭다운 */}
      <div data-name="선호지역" className="h-32 w-8/12 justify-center relative flex my-auto mx-auto">
      <select id="selectPreferredRegion" value={preferredRegion} className="w-1/4 text-2xl font-bold" onChange={handlePreferredRegionChange}>
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

    

    {/* 추천 캠핑장 / 추천 관광지 */}
    <div id="tour-list">
    {/* 추천 캠핑장 및 관광지 리스트 */}
    </div>
  </div>
    );
}

export default React.memo(RecommendedPlaces);
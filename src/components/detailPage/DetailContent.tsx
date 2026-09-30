import React from "react";

interface CampDetailData {
    name: string;
    region: string;
    address: string;
    category: string;
    description: string;
}

interface DetailContentProps {
    campDetail: CampDetailData;
    region: string;
}

const DetailContent: React.FC<DetailContentProps> = ({ campDetail, region }) => {
    const img = `images/${region}/detail/${campDetail.name}.jpg`; // 상세 이미지 경로 예시

    return (
        <div className="flex flex-col w-10/12 bg-white border-2 border-gray-200 rounded-lg p-8 shadow-md">
            {/* 상단 이미지 및 타이틀 영역 */}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 h-80 bg-gray-200 rounded-lg overflow-hidden relative">
                    <img 
                        className="w-full h-full object-cover" 
                        src={img} 
                        alt={campDetail.name} 
                        onError={(e) => {
                            // 이미지가 없을 경우 대체 이미지 처리용
                            (e.target as HTMLImageElement).src = "images/default_camp.jpg";
                        }}
                    />
                </div>
                <div className="flex flex-col justify-between w-full md:w-1/2">
                    <div>
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {campDetail.category}
                        </span>
                        <h1 className="text-4xl font-bold mt-3 mb-2">{campDetail.name}</h1>
                        <p className="text-gray-600 text-lg">{campDetail.address}</p>
                    </div>
                </div>
            </div>

            {/* 하단 상세 설명 영역 */}
            <div className="mt-10 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">상세 정보</h2>
                <p className="text-gray-700 leading-relaxed">{campDetail.description}</p>
            </div>
        </div>
    );
};

export default DetailContent;
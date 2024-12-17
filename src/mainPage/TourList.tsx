import React,{useEffect} from 'react'

interface props{

}

const TourList:React.FC<props>=()=>{
    return (
        <div></div>
    )
}

// function tourChange(){
            		
//     const cpnamedata = [
//         {
//             camp1:"청계산골든밸리글램핑&캠핑장",
//             camp2:"광릉해오름캠핑장",
//             camp3:"자라섬캠핑장",
//             camp4:"그라티아글램핑",
//         },
//         {
//             camp1:"동강전망휴양림오토캠핑장",
//             camp2:"홍천 어울림 글램핑펜션",
//             camp3:"행복휴양림&아우라지글램핑",
//             camp4:"홍천강오토캠핑장",
//         },
//         {
//             camp1:"경상북도포항산누리오토캠핑장",
//             camp2:"생림 오토캠핑장",
//             camp3:"80 SS 오토캠핑장",
//             camp4:"위정약수오토캠핑장",
//         },
//         {
//             camp1:"김녕해수욕장야영장",
//             camp2:"대정읍 화순 해수욕장",
//             camp3:"비양도 연평리 야영지",
//             camp4:"돌하르방 캠핑장",
//         }
//     ];	 
   
//     const tournamedata = [
//         {
//             tour1:"화담숲",
//             tour2:"포천아트밸리",
//             tour3:"수원화성",
//             tour4:"아침고요수목원",
//         },
//         {
//             tour1:"남이섬",
//             tour2:"추암 촛대바위",
//             tour3:"대관령양떼목장",
//             tour4:"설악산국립공원",
//         },
//         {
//             tour1:"불국사",
//             tour2:"동궁과 월지",
//             tour3:"첨성대",
//             tour4:"국립경주박물관",
//         },
//         {
//             tour1:"한라산",
//             tour2:"섭지코지",
//             tour3:"주상절리대",
//             tour4:"만창굴",
//         }
//     ];	 
    
//     function campImgSrc(cregion){	
//         switch(cregion){
//             case '경기':
//                 return "0";
//                 break;
//             case '강원':
//                 return '1';
//                 break;
//             case '경북':
//                 return '2';
//                 break;
//             case '제주':
//                 return '3';
//                 break;
//             default : 
//                 return '1';
//          }
//     }  
// var cregion = (`${"${changeregion}"}`);
// var tourListTag = document.getElementById("tour-list");	
// var cam	= campImgSrc(cregion);
// var cam_name = cpnamedata[cam];
// var tour_name = tournamedata[cam];
// console.log(cam_name.camp1); 



// innerHTML = ` 
//    <label for="recmdCamp" class="block mb-2 text-4xl font-bold text-gray-900 dark:text-white px-10 pt-40 py-5">추천 캠핑장</label>
//    <div class="grid md:grid-cols-4 gap-4 px-20 ">
//        <div>
//            <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/camp1.jpg" alt="">
//            <label for="campExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${cam_name.camp1}"}</label>
//        </div>
//        <div>
//            <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/camp2.jpg" alt="">
//            <label for="campExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${cam_name.camp2}"}</label>
//        </div>
//        <div>
//            <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/camp3.jpg" alt="">
//            <label for="campExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${cam_name.camp3}"}</label>
//        </div>
//        <div>
//            <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/camp4.jpg" alt="">
//            <label for="campExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${cam_name.camp4}"}</label>
//        </div>
//    </div>
//       <div>
//        <label for="recmdTour" class="block mb-2 text-4xl font-bold text-gray-900 dark:text-white px-10 pt-40 py-5" >추천 관광지</label>
//        <div class="grid md:grid-cols-4 gap-4 px-20">
//            <div>
//                <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/tour1.jpg" alt="">
//                <label for="tourpExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${tour_name.tour1}"}</label>
//            </div>
//            <div>
//                <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/tour2.jpg" alt="">
//                <label for="tourpExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${tour_name.tour2}"}</label>
//            </div>
//            <div>
//                <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/tour3.jpg" alt="">
//                <label for="tourpExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${tour_name.tour3}"}</label>
//            </div>
//            <div>
//                <img class="h-auto max-w-full rounded-lg" src="images/${"${changeregion}"}/tour4.jpg" alt="">
//                <label for="tourpExp1" class="text-center block mb-2 text-md  font-bold text-gray-900 dark:text-white px-10 py-5">${"${tour_name.tour4}"}</label>
//            </div>
//        </div>
//   </div> 
//  `;  
   
// tourListTag.innerHTML = innerHTML;	
// }

// tourChange();

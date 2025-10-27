import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('./main'); // 리액트 라우터를 통해 페이지 이동
  };

  return (
    <header className="fixed flex justify-between p-5 w-full bg-white z-50 border-2 border-black-100">
      
        <button type="button" onClick={handleNavigate} className="ml-5">
          <span className="text-4xl text-[#74cfca] font-bold">CAMP</span>
          <span className="text-2xl">*</span>
          <span className="text-4xl text-[#74cfca] font-bold">SCORE</span>
        </button>
        <div className="flex justify-start">   
        </div>                
    </header>

    
  );
};

export default Header;
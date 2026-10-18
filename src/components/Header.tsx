import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SignupModal  from './header/SignupModal.tsx';
import LoginModal from './header/LoginModal.tsx';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/main');
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <>
      {/* 헤더 영역 */}
      <header className="fixed flex justify-between items-center p-5 w-full bg-white z-50 border-2 border-black-100">
        {/* 로고 영역 */}
        <button type="button" onClick={handleNavigate} className="ml-5">
          <span className="text-4xl text-[#74cfca] font-bold">CAMP</span>
          <span className="text-2xl">*</span>
          <span className="text-4xl text-[#74cfca] font-bold">SCORE</span>
        </button>

        {/* 우측 로그인 및 회원가입 버튼 영역 */}
        <div className="flex items-center gap-3 mr-5">   
          <button 
            type="button" 
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-2.5 text-[#74cfca] bg-white border border-[#74cfca] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            로그인
          </button>
          <button 
            type="button" 
            onClick={() => setIsSignupOpen(true)}
            className="px-4 py-2.5 bg-[#74cfca] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            회원가입
          </button>
        </div>             
      </header>

      {/* 로그인 모달 팝업 */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      {/* 회원가입 모달 팝업 */}
      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)} 
      />
    </>
  );
};

export default Header;
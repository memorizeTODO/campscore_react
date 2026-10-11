import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from './header/LoginModal.tsx';
import { SignUpModal } from './header/SignUpModal.tsx';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/main');
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
            onClick={() => setIsSignUpOpen(true)}
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
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
      />
    </>
  );
};

export default Header;
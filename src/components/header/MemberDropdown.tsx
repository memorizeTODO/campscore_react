import React, { useState, useRef, useEffect } from 'react';

interface MemberDropdownProps {
  onLogout: () => void;
  onNavigateToProfile?: () => void;
}

export const MemberDropdown: React.FC<MemberDropdownProps> = ({ onLogout, onNavigateToProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // localStorage에서 닉네임과 아이디 불러오기
  const nickname = localStorage.getItem('memberNickname') || '사용자';
  const memberID = localStorage.getItem('memberID') || '';

  // 드롭다운 바깥 영역 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 닉네임 (아이디) 형태로 출력되는 드롭다운 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 text-[#74cfca] bg-white border border-[#74cfca] font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 max-w-[260px]"
      >
        <span className="truncate text-sm">
          {nickname} <span className="text-gray-400 font-normal">({memberID})</span>
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 팝업 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onNavigateToProfile) {
                onNavigateToProfile();
              } else {
                alert('회원 정보 페이지로 이동합니다.');
              }
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            회원 정보
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
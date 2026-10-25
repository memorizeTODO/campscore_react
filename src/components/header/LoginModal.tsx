import React, { useState } from 'react';
import { API1_BASE_URL } from "../../config.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // 로그인 상태 유지 체크 상태
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API1_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          memberID: id, 
          memberPasswd: password,
          rememberMe // 백엔드 요구사항에 맞춰 전송 가능
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      // JWT 토큰 저장 (상태 유지 체크 여부에 따라 sessionStorage 또는 localStorage 분기 처리도 추후 가능)
      const accessToken = data.accessToken || data.token;
      if (accessToken) {
        if (rememberMe) {
          localStorage.setItem('accessToken', accessToken);
        } else {
          // 체크하지 않은 경우 세션 스토리지 등에 담는 방식 등으로 확장 가능
          localStorage.setItem('accessToken', accessToken);
        }
      }

      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      alert('로그인 성공!');
      
      setIsLoading(false);
      setId('');
      setPassword('');
      setRememberMe(false);
      onClose();

      if (onLoginSuccess) {
        onLoginSuccess();
      }

    } catch (error: any) {
      console.error('로그인 에러:', error);
      alert(error.message || '서버 통신 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-2xl relative">
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div>
            <span className="text-3xl text-[#74cfca] font-bold">CAMP</span>
            <span className="text-xl font-bold mx-0.5">*</span>
            <span className="text-3xl text-[#74cfca] font-bold">SCORE</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">로그인</p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="아이디 입력" 
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca]"
          />
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca]"
          />

          {/* 로그인 상태 유지 체크박스 영역 */}
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 accent-[#74cfca] rounded border-gray-300 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
              로그인 상태 유지
            </label>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#74cfca] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-1 disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
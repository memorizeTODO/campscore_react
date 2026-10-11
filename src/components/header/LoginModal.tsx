import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('로그인 시도:', { email, password });

    onClose();
    setEmail('');
    setPassword('');
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
            type="email" 
            placeholder="이메일 입력" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca]"
          />
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca]"
          />
          <button 
            type="submit"
            className="w-full py-3 bg-[#74cfca] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2"
          >
            로그인하기
          </button>
        </form>
      </div>
    </div>
  );
};
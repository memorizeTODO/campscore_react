import React, { useState } from 'react';
import { API1_BASE_URL } from '../../config.ts';

interface MemberEditTabProps {
  editForm: {
    memberNickname: string;
    newPassword: string;
  };
  setEditForm: React.Dispatch<React.SetStateAction<{ memberNickname: string; newPassword: string }>>;
  originalNickname: string; // 현재 로그인한 회원의 원래 닉네임
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const MemberEditTab: React.FC<MemberEditTabProps> = ({
  editForm,
  setEditForm,
  originalNickname,
  isLoading,
  onSubmit,
}) => {
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameHint, setNicknameHint] = useState<{ valid: boolean; text: string } | null>(null);
  const [passwordHint, setPasswordHint] = useState<{ valid: boolean; text: string } | null>(null);

  // 현재 닉네임과 동일한지 여부 확인
  const isSameAsOriginal = editForm.memberNickname === originalNickname;

  // 닉네임 변경 시 실시간 제약 검증
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditForm((prev) => ({ ...prev, memberNickname: val }));
    setIsNicknameChecked(false);

    if (!val.trim()) {
      setNicknameHint({ valid: false, text: '닉네임을 입력해주세요.' });
      return;
    }

    // 현재 본인의 닉네임과 같다면 형식 검증 통과 및 안내 문구 출력
    if (val === originalNickname) {
      setNicknameHint({ valid: true, text: '현재 사용 중인 닉네임입니다.' });
      return;
    }

    // 1. 첫 글자 검증 (영문 또는 한글만 허용)
    const firstChar = val.charAt(0);
    const isFirstValid = /^[a-zA-Z가-힣]/.test(firstChar);
    if (!isFirstValid) {
      setNicknameHint({ valid: false, text: '닉네임의 첫 글자는 영문 또는 한글이어야 합니다.' });
      return;
    }

    // 2. SQL 인젝션 위험 기호 체크
    const dangerousPattern = /['";]|--|\/\*|\*\/|;|=/;
    if (dangerousPattern.test(val)) {
      setNicknameHint({ valid: false, text: '보안상 허용되지 않는 특수문자가 포함되어 있습니다.' });
      return;
    }

    // 3. 가중치 길이 계산 (한글 및 특수문자 = 2, 영어/숫자 = 1)
    let totalWeight = 0;
    for (let i = 0; i < val.length; i++) {
      const c = val.charAt(i);
      const isKorean = c >= '\uAC00' && c <= '\uD7A3';
      const isSpecial = !/[a-zA-Z0-9가-힣]/.test(c);

      if (isKorean || isSpecial) {
        totalWeight += 2;
      } else {
        totalWeight += 1;
      }
    }

    if (totalWeight > 20) {
      setNicknameHint({ valid: false, text: '닉네임은 영문 기준 20자 (한글/특수문자는 2자 취급)를 초과할 수 없습니다.' });
      return;
    }

    setNicknameHint({ valid: true, text: '형식에 맞는 닉네임입니다. 중복 확인을 진행해주세요.' });
  };

  // 닉네임 중복 확인 API 연동
  const handleNicknameCheck = async () => {
    const currentNickname = editForm.memberNickname.trim();

    if (!currentNickname) {
      alert('닉네임을 먼저 입력해주세요.');
      return;
    }

    if (isSameAsOriginal) return; // 동일할 때는 버튼이 비활성화되므로 동작 안 함

    if (nicknameHint && !nicknameHint.valid) {
      alert('올바른 닉네임 형식을 먼저 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API1_BASE_URL}/member/chk-nname-dup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberNickname: currentNickname }),
      });

      if (!response.ok) throw new Error('중복 확인 통신 실패');

      const data = await response.json();
      const isValid = typeof data === 'boolean' ? !data : data.valid;
      const messageText = typeof data === 'boolean'
        ? (data ? '이미 사용 중인 닉네임입니다.' : '사용 가능한 닉네임입니다.')
        : data.message;

      setNicknameHint({ valid: isValid, text: messageText });
      setIsNicknameChecked(isValid);
    } catch (error) {
      console.error('닉네임 중복 확인 에러:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 새 비밀번호 변경 시 실시간 제약 검증
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setEditForm((prev) => ({ ...prev, newPassword: pwd }));

    if (!pwd) {
      setPasswordHint(null);
      return;
    }

    if (pwd.length < 10 || pwd.length > 20) {
      setPasswordHint({ valid: false, text: '비밀번호는 10자리 이상 20자리 이하이어야 합니다.' });
      return;
    }

    const dangerousPattern = /['";]|--|\/\*|\*\/|;|=/;
    if (dangerousPattern.test(pwd)) {
      setPasswordHint({ valid: false, text: `보안상 허용되지 않는 특수문자(', \", ;, -- 등)가 포함되어 있습니다.` });
      return;
    }

    const hasEnglish = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*()]/.test(pwd);

    if (!hasEnglish || !hasNumber || !hasSpecial) {
      setPasswordHint({ valid: false, text: '영문, 숫자, 특수문자(!@#$%^&*())를 모두 포함해야 합니다.' });
      return;
    }

    setPasswordHint({ valid: true, text: '안전한 비밀번호 형식입니다.' });
  };

  // 폼 제출 전 최종 검증
  const handleSubmitWithValidation = (e: React.FormEvent) => {
    e.preventDefault();

    if (nicknameHint && !nicknameHint.valid) {
      alert('닉네임 형식을 올바르게 입력해주세요.');
      return;
    }

    // 닉네임이 변경되었는데 중복확인을 안 한 경우 차단
    if (!isSameAsOriginal && !isNicknameChecked) {
      alert('닉네임 중복확인을 진행해주세요.');
      return;
    }

    if (editForm.newPassword && passwordHint && !passwordHint.valid) {
      alert('비밀번호 형식을 올바르게 입력해주세요.');
      return;
    }

    onSubmit(e);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
        회원 정보 변경
      </h3>
      
      <form onSubmit={handleSubmitWithValidation} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editForm.memberNickname}
              onChange={handleNicknameChange}
              disabled={isLoading}
              placeholder="첫 글자 영문/한글, 최대 20자"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#74cfca]"
              required
            />
            <button
              type="button"
              onClick={handleNicknameCheck}
              disabled={isLoading || isSameAsOriginal}
              className={`px-4 py-3 font-semibold text-xs rounded-xl transition-colors whitespace-nowrap ${
                isSameAsOriginal
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' // 회색빛 비주얼 강조
                  : isNicknameChecked
                  ? 'bg-teal-50 text-[#74cfca] border border-[#74cfca]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isNicknameChecked ? '확인완료' : '중복확인'}
            </button>
          </div>
          {nicknameHint && (
            <p className={`text-xs mt-1.5 px-1 ${nicknameHint.valid ? 'text-green-600' : 'text-red-500'}`}>
              {nicknameHint.text}
            </p>
          )}
        </div>

        {/* 새 비밀번호 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 <span className="text-gray-400 font-normal">(변경 시에만 입력)</span>
          </label>
          <input
            type="password"
            placeholder="10~20자, 영문/숫자/특수문자(!@#$%^&*()) 조합"
            value={editForm.newPassword}
            onChange={handlePasswordChange}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#74cfca]"
          />
          {passwordHint && (
            <p className={`text-xs mt-1.5 px-1 ${passwordHint.valid ? 'text-green-600' : 'text-red-500'}`}>
              {passwordHint.text}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-[#74cfca] text-white font-semibold rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          {isLoading ? '저장 중...' : '변경사항 저장'}
        </button>
      </form>
    </div>
  );
};

export default MemberEditTab;
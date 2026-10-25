import { API1_BASE_URL } from "../../config.ts";
import React, { useState, useEffect } from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  // 회원 유형 선택 state ('general': 일반 회원, 'business': 업주 회원)
  const [memberType, setMemberType] = useState<'general' | 'business'>('general');

  // 아이디 및 중복확인 state
  const [signupID, setSignupID] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 이메일 및 중복확인 state
  const [signupEmail, setSignupEmail] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  
  // 닉네임 및 중복확인 state
  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 사업자 등록번호 및 중복확인 state (업주 회원 전용)
  const [businessNumber, setBusinessNumber] = useState('');
  const [isBusinessNumberChecked, setIsBusinessNumberChecked] = useState(false);

  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  
  // 휴대폰 번호 3분할 state
  const [phone1, setPhone1] = useState('010');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [preferredRegion, setPreferredRegion] = useState('');

  // 모달이 열릴 때 카카오 주소 API 스크립트 로드
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 이메일 형식 유효성 검증 정규식
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // 국세청 공식 사업자등록번호 유효성 검증 알고리즘
  const validateBizNumber = (bizNo: string) => {
    const numStr = bizNo.replace(/[^0-9]/g, '');
    if (numStr.length !== 10) return false;

    const bizID = numStr.split('').map((d) => parseInt(d, 10));
    const checkID = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += bizID[i] * checkID[i];
    }

    sum += Math.floor((bizID[8] * checkID[8]) / 10);
    const remainder = (10 - (sum % 10)) % 10;

    return remainder === bizID[9];
  };

  // 1. 아이디 중복 확인 API 연동
  const handleIdCheck = async () => {
    if (!signupID.trim()) {
      alert('아이디를 먼저 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API1_BASE_URL}/member/chk-id-dup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberID: signupID }),
      });

      if (!response.ok) throw new Error('중복 확인 통신 실패');

      const isDuplicate: boolean = await response.json();

      if (isDuplicate) {
        alert('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      } else {
        alert('사용 가능한 아이디입니다.');
        setIsIdChecked(true);
      }
    } catch (error) {
      console.error('아이디 중복 확인 에러:', error);
      alert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 2. 이메일 중복 확인 API 연동
  const handleEmailCheck = async () => {
    if (!signupEmail.trim()) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    if (!validateEmail(signupEmail)) {
      alert('올바른 이메일 형식으로 입력해주세요. (예: abc@domain.com)');
      return;
    }

    try {
      const response = await fetch(`${API1_BASE_URL}/member/chk-email-dup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberEmail: signupEmail }),
      });

      if (!response.ok) throw new Error('중복 확인 통신 실패');

      const isDuplicate: boolean = await response.json();

      if (isDuplicate) {
        alert('이미 사용 중인 이메일입니다.');
        setIsEmailChecked(false);
      } else {
        alert('사용 가능한 이메일입니다.');
        setIsEmailChecked(true);
      }
    } catch (error) {
      console.error('이메일 중복 확인 에러:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 3. 닉네임 중복 확인 API 연동
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 먼저 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API1_BASE_URL}/member/chk-nname-dup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberNickname: nickname }),
      });

      if (!response.ok) throw new Error('중복 확인 통신 실패');

      const isDuplicate: boolean = await response.json();

      if (isDuplicate) {
        alert('이미 사용 중인 닉네임입니다.');
        setIsNicknameChecked(false);
      } else {
        alert('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      }
    } catch (error) {
      console.error('닉네임 중복 확인 에러:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 4. 사업자 등록번호 중복 확인 API 연동 (업주 회원 전용)
  const handleBusinessNumberCheck = async () => {
    const numStr = businessNumber.replace(/[^0-9]/g, '');
    if (!numStr) {
      alert('사업자 등록번호를 먼저 입력해주세요.');
      return;
    }
    if (numStr.length !== 10 || !validateBizNumber(numStr)) {
      alert('유효하지 않은 사업자 등록번호입니다. 올바른 10자리 번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API1_BASE_URL}/member/chk-biznum-dup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessNumber: numStr }),
      });

      if (!response.ok) throw new Error('중복 확인 통신 실패');

      const isDuplicate: boolean = await response.json();

      if (isDuplicate) {
        alert('이미 등록된 사업자 등록번호입니다.');
        setIsBusinessNumberChecked(false);
      } else {
        alert('사용 가능한 사업자 등록번호입니다.');
        setIsBusinessNumberChecked(true);
      }
    } catch (error) {
      console.error('사업자 번호 중복 확인 에러:', error);
      alert('사업자 번호 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 카카오 주소 검색
  const handleAddressSearch = () => {
    const win = window as any;

    if (win.daum && win.daum.Postcode) {
      new win.daum.Postcode({
        oncomplete: (data: any) => {
          let fullAddress = data.roadAddress;
          let extraAddress = '';

          if (data.bname !== '' && /[동|로|가]$/.test(data.bname)) {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          if (extraAddress !== '') {
            fullAddress += ` (${extraAddress})`;
          }

          setAddress1(fullAddress);
        },
      }).open();
    } else {
      alert('주소 검색 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 회원가입 제출
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 업주 회원 필수 조건 체크
    if (memberType === 'business') {
      if (!businessNumber.trim()) {
        alert('사업자 등록번호를 입력해주세요.');
        return;
      }
      if (!validateBizNumber(businessNumber)) {
        alert('유효하지 않은 사업자 등록번호입니다. 다시 확인해주세요.');
        return;
      }
      if (!isBusinessNumberChecked) {
        alert('사업자 등록번호 중복확인을 진행해주세요.');
        return;
      }
    }

    if (!signupID.trim() || !signupEmail.trim() || !nickname.trim() || !signupPassword.trim() || !signupConfirmPassword.trim() || !phone2.trim() || !phone3.trim() || !address1.trim() || !birthDate.trim() || !preferredRegion) {
      alert('모든 필수 항목을 입력 또는 선택해주세요.');
      return;
    }

    if (!isIdChecked) {
      alert('아이디 중복확인을 진행해주세요.');
      return;
    }

    if (!validateEmail(signupEmail)) {
      alert('올바른 이메일 형식으로 입력해주세요.');
      return;
    }

    if (!isEmailChecked) {
      alert('이메일 중복확인을 진행해주세요.');
      return;
    }

    if (!isNicknameChecked) {
      alert('닉네임 중복확인을 진행해주세요.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (birthDate.length !== 6) {
      alert('생년월일은 6자리로 입력해주세요. (예: 990101)');
      return;
    }

    const requestPayload = {
      memberID: signupID,
      memberPasswd: signupPassword,
      memberNickname: nickname,
      memberName: nickname,
      memberEmail: signupEmail,
      memberType: memberType,
      memberPhone1: phone1,
      memberPhone2: phone2,
      memberPhone3: phone3,
      memberAddress1: address1,
      memberAddress2: address2,
      birthDate: birthDate,
      preferredRegion: preferredRegion,
      businessNumber: memberType === 'business' ? businessNumber : null
    };

    try {
      const response = await fetch(`${API1_BASE_URL}/member/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '서버 통신 중 오류가 발생했습니다.');
      }

      const resultText = await response.text();
      console.log('회원가입 성공:', resultText);
      alert('회원가입이 완료되었습니다!');
      
      // 모달 닫기 및 폼 초기화
      onClose();
      setMemberType('general');
      setSignupID('');
      setIsIdChecked(false);
      setSignupEmail('');
      setIsEmailChecked(false);
      setNickname('');
      setIsNicknameChecked(false);
      setBusinessNumber('');
      setIsBusinessNumberChecked(false);
      setSignupPassword('');
      setSignupConfirmPassword('');
      setPhone1('010');
      setPhone2('');
      setPhone3('');
      setAddress1('');
      setAddress2('');
      setBirthDate('');
      setPreferredRegion('');

    } catch (error: any) {
      console.error('회원가입 에러:', error);
      alert(`회원가입 실패: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-8 w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl relative">
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
          <p className="text-gray-500 text-sm mt-1">회원가입</p>
        </div>
        
        {/* 회원가입 폼 */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
          {/* 일반 회원 / 업주 회원 선택 탭 */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-1">
            <button
              type="button"
              onClick={() => setMemberType('general')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                memberType === 'general' 
                  ? 'bg-white text-[#74cfca] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              일반 회원
            </button>
            <button
              type="button"
              onClick={() => setMemberType('business')}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                memberType === 'business' 
                  ? 'bg-white text-[#74cfca] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              업주 회원
            </button>
          </div>

          {/* 아이디 + 중복확인 버튼 */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="아이디 입력" 
              value={signupID}
              onChange={(e) => {
                setSignupID(e.target.value);
                setIsIdChecked(false);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
            />
            <button 
              type="button"
              onClick={handleIdCheck}
              className={`px-3 py-2.5 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap ${
                isIdChecked 
                  ? 'bg-teal-50 text-[#74cfca] border border-[#74cfca]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isIdChecked ? '확인완료' : '중복확인'}
            </button>
          </div>

          {/* 이메일 + 중복확인 버튼 */}
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="이메일 입력 (예: abc@domain.com)" 
              value={signupEmail}
              onChange={(e) => {
                setSignupEmail(e.target.value);
                setIsEmailChecked(false);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
            />
            <button 
              type="button"
              onClick={handleEmailCheck}
              className={`px-3 py-2.5 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap ${
                isEmailChecked 
                  ? 'bg-teal-50 text-[#74cfca] border border-[#74cfca]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEmailChecked ? '확인완료' : '중복확인'}
            </button>
          </div>

          {/* 닉네임 + 중복확인 버튼 */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="닉네임 입력" 
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
            />
            <button 
              type="button"
              onClick={handleNicknameCheck}
              className={`px-3 py-2.5 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap ${
                isNicknameChecked 
                  ? 'bg-teal-50 text-[#74cfca] border border-[#74cfca]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isNicknameChecked ? '확인완료' : '중복확인'}
            </button>
          </div>

          {/* [조건부 렌더링] 업주 회원일 때만 보이는 사업자 등록번호 + 중복확인 버튼 */}
          {memberType === 'business' && (
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength={10}
                placeholder="사업자 등록번호 10자리 (숫자만)" 
                value={businessNumber}
                onChange={(e) => {
                  setBusinessNumber(e.target.value.replace(/[^0-9]/g, ''));
                  setIsBusinessNumberChecked(false);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm bg-amber-50/30"
              />
              <button 
                type="button"
                onClick={handleBusinessNumberCheck}
                className={`px-3 py-2.5 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap ${
                  isBusinessNumberChecked 
                    ? 'bg-teal-50 text-[#74cfca] border border-[#74cfca]' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isBusinessNumberChecked ? '확인완료' : '중복확인'}
              </button>
            </div>
          )}

          {/* 비밀번호 */}
          <input 
            type="password" 
            placeholder="비밀번호 입력" 
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
          />

          {/* 비밀번호 확인 */}
          <input 
            type="password" 
            placeholder="비밀번호 확인" 
            value={signupConfirmPassword}
            onChange={(e) => setSignupConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
          />

          {/* 휴대폰 번호 3분할 입력란 */}
          <div className="flex items-center gap-1.5 w-full">
            <select
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="w-[30%] px-2 py-2.5 bg-white rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-[#74cfca]"
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
              <option value="070">070</option>
            </select>
            <span className="text-gray-400">-</span>
            <input 
              type="text" 
              maxLength={4}
              placeholder="1234" 
              value={phone2}
              onChange={(e) => setPhone2(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-[33%] px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm text-center"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="text" 
              maxLength={4}
              placeholder="5678" 
              value={phone3}
              onChange={(e) => setPhone3(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-[33%] px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm text-center"
            />
          </div>

          {/* 거주지 주소 1 + 카카오 주소검색 버튼 */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="거주지 주소 1 (검색)" 
              value={address1}
              readOnly
              onClick={handleAddressSearch}
              className="flex-1 px-4 py-2.5 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none text-sm cursor-pointer"
            />
            <button 
              type="button"
              onClick={handleAddressSearch}
              className="px-3 py-2.5 bg-[#74cfca] text-white font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              주소 검색
            </button>
          </div>

          {/* 거주지 주소 2 (상세 주소) */}
          <input 
            type="text" 
            placeholder="상세 주소 2 입력" 
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
          />

          {/* 생년월일 6자리 */}
          <input 
            type="text" 
            maxLength={6}
            placeholder="생년월일 6자리 (예: 990101)" 
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm"
          />

          {/* 선호지역 콤보박스 */}
          <select 
            id="campingRegion" 
            name="camp-region" 
            value={preferredRegion} 
            onChange={(e) => setPreferredRegion(e.target.value)} 
            className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-[#74cfca]"
          >
            <option value="">선호지역 선택</option>
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

          {/* 회원가입 제출 버튼 */}
          <button 
            type="submit"
            className="w-full py-3 bg-[#74cfca] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2"
          >
            회원가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
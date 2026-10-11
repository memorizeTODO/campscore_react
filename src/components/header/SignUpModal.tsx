import React, { useState, useEffect } from 'react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  // 회원 유형 선택 state ('general': 일반 회원, 'business': 업주 회원)
  const [memberType, setMemberType] = useState<'general' | 'business'>('general');

  const [signupEmail, setSignupEmail] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  
  // 닉네임 및 중복확인 state
  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 사업자 등록번호 state (업주 회원 전용)
  const [businessNumber, setBusinessNumber] = useState('');

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

  const handleEmailCheck = () => {
    if (!signupEmail.trim()) {
      alert('이메일을 먼저 입력해주세요.');
      return;
    }
    // TODO: 이메일 중복확인 API 연동
    alert('사용 가능한 이메일입니다.');
    setIsEmailChecked(true);
  };

  const handleNicknameCheck = () => {
    if (!nickname.trim()) {
      alert('닉네임을 먼저 입력해주세요.');
      return;
    }
    // TODO: 닉네임 중복확인 API 연동
    alert('사용 가능한 닉네임입니다.');
    setIsNicknameChecked(true);
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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // 업주 회원일 경우 사업자 등록번호 유효성 검증 알고리즘 적용
    if (memberType === 'business') {
      if (!businessNumber.trim()) {
        alert('사업자 등록번호를 입력해주세요.');
        return;
      }
      if (!validateBizNumber(businessNumber)) {
        alert('유효하지 않은 사업자 등록번호입니다. 다시 확인해주세요.');
        return;
      }
    }

    if (!signupEmail.trim() || !nickname.trim() || !signupPassword.trim() || !signupConfirmPassword.trim() || !phone2.trim() || !phone3.trim() || !address1.trim() || !birthDate.trim() || !preferredRegion) {
      alert('모든 필수 항목을 입력 또는 선택해주세요.');
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

    const fullPhoneNumber = `${phone1}-${phone2}-${phone3}`;

    console.log('회원가입 시도:', { 
      memberType, 
      signupEmail, 
      nickname,
      ...(memberType === 'business' && { businessNumber }), 
      signupPassword, 
      phone: {
        phone1,
        phone2,
        phone3,
        full: fullPhoneNumber
      },
      address: `${address1} ${address2}`, 
      birthDate, 
      preferredRegion 
    });

    alert('회원가입이 완료되었습니다!');
    onClose();
    setMemberType('general');
    setSignupEmail('');
    setIsEmailChecked(false);
    setNickname('');
    setIsNicknameChecked(false);
    setBusinessNumber('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setPhone1('010');
    setPhone2('');
    setPhone3('');
    setAddress1('');
    setAddress2('');
    setBirthDate('');
    setPreferredRegion('');
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

          {/* 이메일 + 중복확인 버튼 */}
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="이메일 입력" 
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
              className="px-3 py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              중복확인
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
              className="px-3 py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              중복확인
            </button>
          </div>

          {/* [조건부 렌더링] 업주 회원일 때만 보이는 사업자 등록번호 입력란 */}
          {memberType === 'business' && (
            <input 
              type="text" 
              maxLength={10}
              placeholder="사업자 등록번호 10자리 (숫자만 입력)" 
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#74cfca] text-sm bg-amber-50/30"
            />
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

          {/* 휴대폰 번호 3분할 입력란 (너비 균형 조정 및 070 추가) */}
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
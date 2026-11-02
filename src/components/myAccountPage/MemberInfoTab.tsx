import React from 'react';

// 부모 컴포넌트로부터 받을 props 인터페이스 정의
interface MemberInfoTabProps {
  memberInfo: {
    memberID: string;
    memberNickname: string;
    memberType: string;
  };
}

export const MemberInfoTab: React.FC<MemberInfoTabProps> = ({ memberInfo }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
        회원 정보
      </h3>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">아이디</p>
          <p className="text-lg font-semibold text-gray-800">{memberInfo.memberID || '정보 없음'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">닉네임</p>
          <p className="text-lg font-semibold text-gray-800">{memberInfo.memberNickname || '정보 없음'}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">회원 유형</p>
          <p className="text-lg font-semibold text-gray-800">
            {memberInfo.memberType === 'BUSINESS' ? '사업자 회원' : '일반 회원'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberInfoTab;
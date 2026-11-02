import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API1_BASE_URL } from '../config.ts';
import MemberInfoTab from '../components/myAccountPage/MemberInfoTab.tsx';
import MemberEditTab from '../components/myAccountPage/MemberEditTab.tsx';

const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();

  // 현재 활성화된 탭 상태 ('info': 회원 정보, 'edit': 정보 변경)
  const [activeTab, setActiveTab] = useState<'info' | 'edit'>('info');

  // API 통신 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 회원 정보 상태
  const [memberInfo, setMemberInfo] = useState({
    memberID: '',
    memberNickname: '',
    memberType: '',
  });

  // 회원 정보 변경 폼 입력값 상태
  const [editForm, setEditForm] = useState({
    memberNickname: '',
    newPassword: '',
  });

  // 컴포넌트 마운트 시 로컬 스토리지에서 기본 정보 로드
  useEffect(() => {
    const storedID = localStorage.getItem('memberID') || '';
    const storedNickname = localStorage.getItem('memberNickname') || '';
    const storedType = localStorage.getItem('memberType') || 'GENERAL';

    setMemberInfo({
      memberID: storedID,
      memberNickname: storedNickname,
      memberType: storedType,
    });

    setEditForm((prev) => ({
      ...prev,
      memberNickname: storedNickname,
    }));
  }, []);

  // 회원 정보 수정 제출 핸들러
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.memberNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API1_BASE_URL}/member/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memberID: memberInfo.memberID,
          memberNickname: editForm.memberNickname,
          memberPasswd: editForm.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '회원 정보 수정에 실패했습니다.');
      }

      alert('회원 정보가 성공적으로 수정되었습니다.');

      // 로컬 스토리지 갱신
      localStorage.setItem('memberNickname', editForm.memberNickname);
      
      // 화면 상태 갱신
      setMemberInfo((prev) => ({
        ...prev,
        memberNickname: editForm.memberNickname,
      }));

      // 비밀번호 필드 초기화
      setEditForm((prev) => ({ ...prev, newPassword: '' }));

    } catch (error: any) {
      console.error('수정 에러:', error);
      alert(error.message || '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-24">
      {/* 좌측 사이드바 (탭 네비게이션) */}
      <aside className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-gray-800 mb-6 px-3">계정 설정</h2>
        
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'info' 
              ? 'bg-[#74cfca]/15 text-[#74cfca]' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          회원 정보
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'edit' 
              ? 'bg-[#74cfca]/15 text-[#74cfca]' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          회원 정보 변경
        </button>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/main')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 메인으로 돌아가기
          </button>
        </div>
      </aside>

      {/* 우측 메인 콘텐츠 영역 (컴포넌트 분리 적용) */}
      <main className="flex-1 p-10 max-w-4xl">
        {activeTab === 'info' && <MemberInfoTab memberInfo={memberInfo} />}
        {activeTab === 'edit' && (
          <MemberEditTab
            editForm={editForm}
            setEditForm={setEditForm}
            originalNickname={memberInfo.memberNickname} // <-- 현재 로그인한 유저의 원래 닉네임 전달
            isLoading={isLoading}
            onSubmit={handleUpdateSubmit}
          />
        )}
      </main>
    </div>
  );
};

export default MyAccountPage;
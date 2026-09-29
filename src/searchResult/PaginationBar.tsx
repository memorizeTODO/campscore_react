import React from 'react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'base';
}

const PaginationBar: React.FC<PaginationBarProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  size = 'base' 
}) => {
  
  // 방어 코드: 전체 페이지가 1개 이하일 때는 렌더링 안 함
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  // 🌟 [디시인사이드 스타일] 10개씩 끊어서 블록을 구성하는 알고리즘
  const blockSize = 10;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 크기 클래스 설정
  const sizeClasses = size === 'sm' 
    ? { ul: 'h-8 text-sm', li: 'h-8 px-3', svg: 'w-2.5 h-2.5' }
    : { ul: 'h-10 text-base', li: 'h-10 px-4', svg: 'w-3 h-3' };

  // 페이지 이동 핸들러
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // 개별 페이지 번호 아이템 렌더링
  const renderPageItem = (page: number) => {
    const isActive = page === currentPage;
    
    const activeClasses = isActive 
      ? 'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white font-bold'
      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white';

    return (
      <li key={page}>
        <a 
          onClick={(e) => {
            e.preventDefault(); 
            handlePageClick(page);
          }}
          aria-current={isActive ? 'page' : undefined}
          className={`flex items-center justify-center leading-tight ${sizeClasses.li} ${activeClasses}`}
          href={`?page=${page}`}
        >
          {page}
        </a>
      </li>
    );
  };
  
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;
  const disabledClasses = 'cursor-not-allowed opacity-50';

  return (
    <nav aria-label="Page navigation example">
      <ul className={`flex items-center -space-x-px ${sizeClasses.ul}`}>
        
        {/* 이전 버튼 */}
        <li>
          <a 
            onClick={(e) => {
              e.preventDefault();
              if (!isPrevDisabled) handlePageClick(currentPage - 1);
            }}
            className={`flex items-center justify-center ms-0 leading-tight border border-e-0 rounded-s-lg ${sizeClasses.li} text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${isPrevDisabled ? disabledClasses : ''}`}
            aria-disabled={isPrevDisabled}
            href={isPrevDisabled ? '#' : `?page=${currentPage - 1}`}
          >
            <span className="sr-only">Previous</span>
            <svg className={sizeClasses.svg + ' rtl:rotate-180'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
            </svg>
          </a>
        </li>

        {/* 10개씩 끊어지는 블록 번호들 */}
        {pageNumbers.map((page) => renderPageItem(page))}

        {/* 다음 버튼 */}
        <li>
          <a 
            onClick={(e) => {
              e.preventDefault();
              if (!isNextDisabled) handlePageClick(currentPage + 1);
            }}
            className={`flex items-center justify-center leading-tight border rounded-e-lg ${sizeClasses.li} text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${isNextDisabled ? disabledClasses : ''}`}
            aria-disabled={isNextDisabled}
            href={isNextDisabled ? '#' : `?page=${currentPage + 1}`}
          >
            <span className="sr-only">Next</span>
            <svg className={sizeClasses.svg + ' rtl:rotate-180'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationBar;
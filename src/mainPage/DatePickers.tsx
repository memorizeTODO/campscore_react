import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, differenceInDays, startOfDay  } from 'date-fns';

interface DatePickersProps {
    startDate: Date;
    endDate: Date;
    dateDiff: number;
    
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date>>;
    setDateDiff: React.Dispatch<React.SetStateAction<number>>;
    
}



const DatePickers: React.FC<DatePickersProps> = ({ startDate, endDate, dateDiff, setStartDate, setEndDate, setDateDiff }) => {
    
    
    useEffect(() => {
    if (startDate && endDate) {
        const newDateDiff = differenceInDays(endDate, startDate);
        setDateDiff(newDateDiff);
    }
    }, [startDate, endDate]);

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(startOfDay(date));
            // 시작 날짜가 변경되면 종료 날짜도 조정
            if (endDate && startOfDay(date) > endDate) {
                setEndDate(startOfDay(date));
            }
            
        }
       
    };

    useEffect(() => {
    console.log("dateDiff updated or component mounted:", dateDiff);
    }, []); // 빈 배열 넣으면 마운트 때 1번 실행됨

    useEffect(() => {
    console.log("dateDiff updated:", dateDiff);
    }, [dateDiff]); // dateDiff가 바뀔 때마다 실행

    const handleEndDateChange = (date: Date | null) => {
        if (date && startOfDay(date) >= startDate) {
            setEndDate(startOfDay(date)); // 종료 날짜는 시작 날짜보다 같거나 큰 날짜로 설정  
            
        }
        
    };

     // 날짜 차이 계산 (시작일과 종료일을 포함해서 계산)
    const minDate = startOfDay(new Date()); // 오늘 날짜
    const maxDate = addDays(startOfDay(new Date()), 7); // 오늘부터 7일 후
    



    return (
        <div className="flex w-full">
            <DatePicker
                selected={startOfDay(startDate)}
                onChange={handleStartDateChange}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={15}
                dropdownMode="select"
                minDate={minDate}
                maxDate={maxDate}
                className="w-full bg-[#E8E8E8] rounded-l-lg text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-right"
                placeholderText="시작 날짜"
            />
            <DatePicker
                selected={startOfDay(endDate)}
                onChange={handleEndDateChange}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                yearDropdownItemNumber={15}
                dropdownMode="select"
                minDate={startDate || minDate} // 시작 날짜 또는 오늘 날짜
                maxDate={maxDate}
                className="w-full bg-[#E8E8E8] rounded-r-lg text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 p-5 text-left"
                placeholderText="종료 날짜"
            />
        </div>
    );
};


export default DatePickers;
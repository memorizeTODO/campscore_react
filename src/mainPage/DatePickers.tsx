import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, differenceInDays  } from 'date-fns';

interface DatePickersProps {
    startDate: Date;
    endDate: Date;
    
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date>>;
    
}

const DatePickers: React.FC<DatePickersProps> = ({ startDate, endDate, setStartDate, setEndDate }) => {
    const minDate = new Date(); // 오늘 날짜
    const maxDate = addDays(new Date(), 7); // 오늘부터 7일 후

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setStartDate(date);
            // 시작 날짜가 변경되면 종료 날짜도 조정
            if (endDate && date > endDate) {
                setEndDate(date);
            }
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date && date >= startDate) {
            setEndDate(date); // 종료 날짜는 시작 날짜보다 같거나 큰 날짜로 설정
        }
    };

     // 날짜 차이 계산 (시작일과 종료일을 포함해서 계산)
     const calculateTotalDays = () => {
        if (startDate && endDate) {
            return differenceInDays(endDate, startDate) + 1; // 시작일과 종료일을 포함하려면 +1
        }
        return 0;
    };


    return (
        <div className="flex w-full">
            <DatePicker
                selected={startDate}
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
                selected={endDate}
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
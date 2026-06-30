import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarGrid = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, eventsMap }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper calculation functions
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Navigators
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days list construction
  const dayElements = [];

  // 1. Previous month trailing days
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    dayElements.push({
      day: prevDay,
      isCurrentMonth: false,
      dateString: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`,
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    dayElements.push({
      day: d,
      isCurrentMonth: true,
      dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // 3. Next month leading days (fill layout grid of 42 cells)
  const remainingCells = 42 - dayElements.length;
  for (let n = 1; n <= remainingCells; n++) {
    dayElements.push({
      day: n,
      isCurrentMonth: false,
      dateString: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(n).padStart(2, '0')}`,
    });
  }

  const getDayClass = (item) => {
    const isToday = item.dateString === todayDateString;
    const isSelected = item.dateString === selectedDate;
    const event = eventsMap[item.dateString];

    let base = 'h-full min-h-[44px] w-full flex flex-col justify-between p-1 border rounded-xl cursor-pointer transition-all duration-150 relative ';

    if (isSelected) {
      base += 'ring-2 ring-indigo-500 z-10 border-indigo-500 ';
    } else {
      base += 'border-slate-100/50 hover:bg-slate-50 ';
    }

    if (!item.isCurrentMonth) {
      base += 'text-slate-350 bg-slate-50/20 ';
    } else {
      base += 'text-slate-700 font-semibold ';
    }

    if (isToday) {
      // If today is selected, it maintains the light blue styling with indigo border ring
      return base + 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80';
    }

    if (event) {
      if (event.type === 'attendance') {
        return base + 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80';
      }
      if (event.type === 'holiday') {
        return base + 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80';
      }
      if (event.type === 'leave') {
        return base + 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80';
      }
      if (event.type === 'meeting') {
        return base + 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80';
      }
    }

    return base;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 h-full">
      {/* Month Year Selector Controls */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-lg">
          {monthNames[month]} {year}
        </h3>

        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-600 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-600 cursor-pointer transition-all active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Titles Grid */}
      <div className="grid grid-cols-7 text-center gap-1.5 mt-2">
        {weekdays.map((w, idx) => (
          <div key={idx} className="text-xs font-bold text-slate-400 uppercase py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1.5 mt-1">
        {dayElements.map((item, idx) => {
          return (
            <div
              key={idx}
              onClick={() => setSelectedDate(item.dateString)}
              className={getDayClass(item)}
            >
              <div className="text-xs leading-none select-none pl-1 pt-1">
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;

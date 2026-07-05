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

    let base = 'h-full min-h-[44px] w-full flex flex-col justify-between p-1 border rounded-xl transition-all duration-150 relative ';

    if (!item.isCurrentMonth) {
      // Trailing days grayed out
      base += 'text-slate-300 dark:text-slate-600 bg-slate-50/60 dark:bg-slate-950/15 border-slate-100/30 dark:border-slate-900/35 pointer-events-none select-none ';
    } else {
      // Current month days
      base += 'text-slate-700 dark:text-slate-300 font-semibold border-slate-200/85 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 cursor-pointer ';
    }

    if (isSelected && item.isCurrentMonth) {
      base += 'ring-2 ring-indigo-500 z-10 border-indigo-500 ';
    }

    if (item.isCurrentMonth) {
      if (isToday) {
        return base + 'bg-blue-50/90 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 hover:bg-blue-100/80 dark:hover:bg-blue-950/60';
      }

      if (event) {
        if (event.type === 'attendance') {
          return base + 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/50';
        }
        if (event.type === 'holiday') {
          return base + 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40 hover:bg-purple-100/80 dark:hover:bg-purple-950/50';
        }
        if (event.type === 'leave') {
          return base + 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100/80 dark:hover:bg-rose-950/50';
        }
        if (event.type === 'meeting') {
          return base + 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40 hover:bg-amber-100/80 dark:hover:bg-amber-950/50';
        }
      }
    }

    return base;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 h-full transition-colors duration-200">
      {/* Month Year Selector Controls */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
          {monthNames[month]} {year}
        </h3>

        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-all active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-all active:scale-95"
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
              onClick={() => item.isCurrentMonth && setSelectedDate(item.dateString)}
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

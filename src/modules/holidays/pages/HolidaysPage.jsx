import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import CalendarGrid from '../components/CalendarGrid';
import CalendarLegend from '../components/CalendarLegend';
import MonthStats from '../components/MonthStats';
import AddHolidayModal from '../components/AddHolidayModal';
import EventDetailsPopup from '../components/EventDetailsPopup';
import HolidaysTable from '../components/HolidaysTable';

const HolidaysPage = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [events, setEvents] = useState([]);

  const eventsMap = useMemo(() => {
    const map = {};
    events.forEach(evt => {
      map[evt.date] = evt;
    });
    return map;
  }, [events]);

  const holidaysList = useMemo(() => {
    return events.filter(e => e.type === 'holiday');
  }, [events]);

  const handleSelectDate = (dateStr) => {
    if (selectedDate === dateStr) {
      setIsDetailsOpen(prev => !prev);
    } else {
      setSelectedDate(dateStr);
      setIsDetailsOpen(true);
    }
  };

  const handleAddHoliday = (dateStr, name, category) => {
    if (eventsMap[dateStr]) {
      toast.error('An event already exists on this date!');
      return;
    }
    setEvents(prev => [...prev, { date: dateStr, type: 'holiday', label: name, holidayType: category }]);
    setSelectedDate(dateStr); // Select the newly added date
    setIsDetailsOpen(true); // Open details popup for newly added holiday
    
    // Adjust calendar month view if the added date is in a different month
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      setCurrentDate(parsedDate);
    }
    
    toast.success('Holiday added successfully!');
  };

  const handleDeleteHoliday = (dateStr) => {
    setEvents(prev => prev.filter(evt => !(evt.date === dateStr && evt.type === 'holiday')));
    toast.success('Holiday deleted successfully!');
  };

  const selectedEvent = eventsMap[selectedDate];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-sm text-slate-500">View and manage corporate attendances, holidays, leaves, and team schedules.</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <Plus size={16} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Grid of holiday lists / layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <CalendarGrid
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={handleSelectDate}
            eventsMap={eventsMap}
          />
        </div>

        {/* Right Side: Month Stats */}
        <div className="h-full flex flex-col">
          <MonthStats
            currentDate={currentDate}
            events={events}
          />
        </div>
      </div>

      {/* Bottom Side: Legend */}
      <CalendarLegend />

      {/* Corporate Holidays Table */}
      <HolidaysTable
        holidays={holidaysList}
        onDeleteHoliday={handleDeleteHoliday}
      />

      {/* Pop-up Modals */}
      <AddHolidayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHoliday={handleAddHoliday}
      />

      {/* Selected Date Details Pop-up Overlay */}
      <EventDetailsPopup
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        dateStr={selectedDate}
        event={selectedEvent}
      />
    </div>
  );
};

export default HolidaysPage;

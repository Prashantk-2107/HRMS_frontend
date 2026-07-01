import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../services/api';
import CalendarGrid from '../components/CalendarGrid';
import CalendarLegend from '../components/CalendarLegend';
import MonthStats from '../components/MonthStats';
import AddHolidayModal from '../components/AddHolidayModal';
import EventDetailsPopup from '../components/EventDetailsPopup';
import HolidaysTable from '../components/HolidaysTable';
import PermissionGuard from '../../../components/common/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';
import { usePermission } from '../../../hooks/usePermission';

const HolidaysPage = () => {
  const queryClient = useQueryClient();
  const canManageHolidays = usePermission(PERMISSIONS.HOLIDAY_MANAGE);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch holidays using TanStack Query
  const { data: holidaysData } = useQuery({
    queryKey: ['holidays'],
    queryFn: async () => {
      const response = await api.get('/holiday/get-all-holidays');
      return response.data?.data?.holidays || [];
    },
  });

  // Map backend holidays payload structure to calendar grid events mapping
  const events = useMemo(() => {
    if (!holidaysData) return [];
    return holidaysData.map(h => {
      // Parse datetime value to date string yyyy-mm-dd (timezone-safe splitting)
      const formattedDate = h.holiday_date ? h.holiday_date.split('T')[0] : '';
      return {
        id: h.holiday_id,
        date: formattedDate,
        type: 'holiday',
        label: h.holiday_name,
        holidayType: h.holiday_type
      };
    });
  }, [holidaysData]);

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

  // Create holiday mutation
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post('/holiday/create-holiday', payload);
      return response.data?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday added successfully!');

      const holiday = data?.holiday || data;
      if (holiday?.holiday_date) {
        const formattedDate = holiday.holiday_date.split('T')[0];
        setSelectedDate(formattedDate);
        setCurrentDate(new Date(formattedDate));
      }
      setIsDetailsOpen(true); // Open event details popup
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to add holiday!';
      toast.error(errorMsg);
    }
  });

  // Delete holiday mutation
  const deleteMutation = useMutation({
    mutationFn: async (holidayId) => {
      await api.delete(`/holiday/delete-holiday/${holidayId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Holiday deleted successfully!');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to delete holiday!';
      toast.error(errorMsg);
    }
  });

  const handleAddHoliday = (dateStr, name, category) => {
    const payload = {
      holiday_date: dateStr,
      holiday_name: name,
      holiday_type: category
    };
    createMutation.mutate(payload);
  };

  const handleDeleteHoliday = (holidayDate) => {
    // Find holiday record to retrieve its DB ID
    const targetHoliday = holidaysList.find(h => h.date === holidayDate);
    if (!targetHoliday?.id) {
      toast.error('Could not find holiday record identifier!');
      return;
    }
    deleteMutation.mutate(targetHoliday.id);
  };

  // Bulk create weekend holidays mutation
  const bulkCreateMutation = useMutation({
    mutationFn: async (payloads) => {
      const promises = payloads.map(p => api.post('/holiday/create-holiday', p));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      toast.success('Weekend holidays registered successfully!');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Failed to register weekend holidays!';
      toast.error(errorMsg);
    }
  });

  const handleMarkWeekends = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weekendHolidays = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const tempDate = new Date(year, month, d);
      const dayOfWeek = tempDate.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (!eventsMap[dateStr]) {
          weekendHolidays.push({
            holiday_date: dateStr,
            holiday_name: dayOfWeek === 6 ? 'Saturday' : 'Sunday',
            holiday_type: 'company'
          });
        }
      }
    }

    if (weekendHolidays.length === 0) {
      toast.error('All weekends in this month are already marked as holidays!');
      return;
    }

    bulkCreateMutation.mutate(weekendHolidays);
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

        <div className="flex gap-3">
          <PermissionGuard requiredPermission={PERMISSIONS.HOLIDAY_MANAGE}>
            <button
              onClick={handleMarkWeekends}
              disabled={bulkCreateMutation.isPending}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer border border-slate-200 disabled:opacity-50"
            >
              {bulkCreateMutation.isPending ? 'Marking...' : 'Mark Weekends'}
            </button>
          </PermissionGuard>

          <PermissionGuard requiredPermission={PERMISSIONS.HOLIDAY_MANAGE}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
            >
              <Plus size={16} />
              <span>Add Holiday</span>
            </button>
          </PermissionGuard>
        </div>
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
        onDeleteHoliday={canManageHolidays ? handleDeleteHoliday : undefined}
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

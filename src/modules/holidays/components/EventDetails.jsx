import { Calendar, CheckSquare, Coffee, FileText, Users } from 'lucide-react';

const EventDetails = ({ selectedDate, event }) => {
  const formatDateDisplay = (dateStr) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  const getEventIcon = () => {
    if (!event) return <Calendar className="text-slate-400" size={24} />;
    switch (event.type) {
      case 'attendance':
        return <CheckSquare className="text-emerald-500" size={24} />;
      case 'holiday':
        return <Coffee className="text-purple-500" size={24} />;
      case 'leave':
        return <FileText className="text-rose-500" size={24} />;
      case 'meeting':
        return <Users className="text-amber-500" size={24} />;
      default:
        return <Calendar className="text-indigo-500" size={24} />;
    }
  };

  const getEventCardStyle = () => {
    if (!event) return 'border-slate-100 bg-slate-50/30';
    switch (event.type) {
      case 'attendance':
        return 'border-emerald-100 bg-emerald-50/20';
      case 'holiday':
        return 'border-purple-100 bg-purple-50/20';
      case 'leave':
        return 'border-rose-100 bg-rose-50/20';
      case 'meeting':
        return 'border-amber-100 bg-amber-50/20';
      default:
        return 'border-indigo-100 bg-indigo-50/20';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 h-full min-h-[300px]">
      <div className="border-b border-slate-100 pb-3 text-left">
        <h4 className="font-bold text-slate-800 text-base">Date Details</h4>
        <span className="text-xs text-slate-400 font-semibold block mt-1">
          {formatDateDisplay(selectedDate)}
        </span>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border ${getEventCardStyle()} transition-all duration-300`}>
        <div className="mb-4">
          {getEventIcon()}
        </div>

        {event ? (
          <div className="text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${event.type === 'attendance' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' :
              event.type === 'holiday' ? 'bg-purple-100/50 text-purple-700 border-purple-200' :
                event.type === 'leave' ? 'bg-rose-100/50 text-rose-700 border-rose-200' :
                  'bg-amber-100/50 text-amber-700 border-amber-200'
              }`}>
              {event.type}
            </span>
            <h5 className="text-base font-extrabold text-slate-850">{event.label}</h5>
            <p className="text-xs text-slate-500 mt-1">
              {event.type === 'attendance' ? 'Standard corporate hours logged.' :
                event.type === 'holiday' ? 'Paid gazetted holiday. Corporate offices closed.' :
                  event.type === 'leave' ? 'Approved employee time-off.' :
                    'Calendar schedule or collaborative meeting.'}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h5 className="text-sm font-bold text-slate-500">No Events Scheduled</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
              This day is currently empty. Click "Add Holiday" to register a corporate holiday.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;

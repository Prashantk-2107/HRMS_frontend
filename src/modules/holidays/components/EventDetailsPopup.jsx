import { X, Calendar, CheckSquare, Coffee, FileText, Users } from 'lucide-react';

const EventDetailsPopup = ({ isOpen, onClose, dateStr, event }) => {
  if (!isOpen) return null;

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
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-sm">Date Information</h4>
            <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
              {formatDateDisplay(dateStr)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${getEventCardStyle()}`}>
            <div className="mb-3">
              {getEventIcon()}
            </div>

            {event ? (
              <div className="text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border ${
                  event.type === 'attendance' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' :
                  event.type === 'holiday' ? 'bg-purple-100/50 text-purple-700 border-purple-200' :
                  event.type === 'leave' ? 'bg-rose-100/50 text-rose-700 border-rose-200' :
                  'bg-amber-100/50 text-amber-700 border-amber-200'
                }`}>
                  {event.type}
                </span>
                <h5 className="text-sm font-extrabold text-slate-800">{event.label}</h5>
                <p className="text-xs text-slate-500 mt-1">
                  {event.type === 'attendance' ? 'Standard corporate hours logged.' :
                   event.type === 'holiday' ? 'Paid corporate holiday.' :
                   event.type === 'leave' ? 'Approved employee time-off.' :
                   'Team meeting scheduled.'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h5 className="text-sm font-bold text-slate-500">No Events Scheduled</h5>
                <p className="text-xs text-slate-400 mt-1">
                  This date is currently clear.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPopup;

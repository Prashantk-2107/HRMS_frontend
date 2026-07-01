import { useState } from 'react';
import { X, Calendar, ChevronDown } from 'lucide-react';

const AddHolidayModal = ({ isOpen, onClose, onAddHoliday }) => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('national');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { value: 'national', label: 'National Holiday' },
    { value: 'festival', label: 'Festival Holiday' },
    { value: 'company', label: 'Company Holiday' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !name.trim()) return;
    onAddHoliday(date, name.trim(), category);
    setDate('');
    setName('');
    setCategory('national');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-visible animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Add New Holiday</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Holiday Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Holiday Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Independence Day, Diwali"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Holiday Category</label>

            {/* Custom Select Trigger Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all w-full flex items-center justify-between cursor-pointer"
            >
              <span>
                {categories.find(c => c.value === category)?.label || 'National Holiday'}
              </span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop overlay for closing dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute top-[105%] left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1.5 animate-fade-in">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setCategory(cat.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${category === cat.value
                        ? 'bg-indigo-50/70 text-indigo-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <span>{cat.label}</span>
                      {category === cat.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Add Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHolidayModal;

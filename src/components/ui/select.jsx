import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({
  label,
  value,
  options = [],
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  required = false,
  position = 'bottom', // 'top' or 'bottom'
  error,
  className = '',
  triggerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left relative ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-left
            ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800'} 
            ${triggerClassName}`}
        >
          <span className={selectedOption ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <>
            {/* Click-away backdrop overlay */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            {/* Dropdown Options Container */}
            <div
              className={`absolute z-20 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1 duration-150 transition-all
                ${
                  position === 'top'
                    ? 'bottom-full mb-1.5 animate-in slide-in-from-bottom-2'
                    : 'top-full mt-1.5 animate-in slide-in-from-top-2'
                }`}
            >
              {options.length === 0 ? (
                <div className="px-4 py-2.5 text-xs text-slate-400 italic">No options found</div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};

export default Select;

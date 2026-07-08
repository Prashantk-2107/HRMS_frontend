
const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  error,
  icon: Icon,
  required,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={type}
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 bg-white transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : ''} 
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
              : 'border-gray-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10'
            }`}
          {...props}
        />
      </div>
      
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

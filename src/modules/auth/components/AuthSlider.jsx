import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AuthSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slidesData = [
    {
      title: "Control your Employees",
      description: "With Our Smart Tool Invest intelligently and discover a better way to manage your entire Employees easily."
    },
    {
      title: "Automate Payroll & Invoicing",
      description: "Generate structured salary records and manage financial payouts smoothly with zero errors."
    },
    {
      title: "Real-time Attendance Tracker",
      description: "Track check-in times, leaves, and overall performance with interactive real-time visual gauges."
    },
    {
      title: "Secure Data Management",
      description: "Role-based access permissions ensure confidential corporate information remains strictly secure."
    }
  ];

  return (
    <div className="w-full max-w-[520px] flex flex-col items-center gap-10">
      <div className="relative w-full h-[380px] flex justify-center items-center select-none">
        
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 absolute transition-transform duration-300 w-[250px] top-[10px] left-[20px] z-30">
          <h4 className="m-0 mb-3 text-xs font-semibold text-gray-700 flex justify-between items-center">
            Upcoming Schedule <Calendar size={14} className="text-gray-400" />
          </h4>
          
          <div className="border-l-[3px] border-red-500 pl-2.5 mb-3 text-left">
            <div className="text-xs font-semibold text-gray-900 mb-0.5">Team Briefing</div>
            <div className="text-[10px] text-gray-500 mb-1.5">Discuss priorities for the week</div>
            <div className="flex items-center justify-between text-[9px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-red-300" />
                Ethan Miller
              </span>
              <span>09:00 AM</span>
            </div>
          </div>

          <div className="border-l-[3px] border-amber-500 pl-2.5 mb-1 text-left">
            <div className="text-xs font-semibold text-gray-900 mb-0.5">Compensation Review</div>
            <div className="text-[10px] text-gray-500 mb-1.5">Review and update salary structures</div>
            <div className="flex items-center justify-between text-[9px] text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-200" />
                Emily Johnson
              </span>
              <span>10:30 AM - 12:00 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 absolute transition-transform duration-300 w-[170px] top-[60px] right-[20px] z-20 text-center">
          <h4 className="m-0 mb-3 text-xs font-semibold text-gray-700 flex justify-between items-center">
            Payment Status <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Today</span>
          </h4>
          <div className="relative w-[90px] h-[90px] mx-auto mb-2 flex justify-center items-center">
            <svg className="-rotate-90" width="90" height="90">
              <circle
                cx="45"
                cy="45"
                r="36"
                fill="transparent"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="45"
                cy="45"
                r="36"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="8"
                strokeDasharray="226"
                strokeDashoffset="65"
              />
              <circle
                cx="45"
                cy="45"
                r="36"
                fill="transparent"
                stroke="#4f46e5"
                strokeWidth="8"
                strokeDasharray="226"
                strokeDashoffset="120"
              />
            </svg>
            <div className="absolute text-xs font-bold text-gray-900 flex flex-col items-center justify-center leading-none">
              1035+
              <span className="text-[8px] text-gray-500 font-normal mt-0.5">Total Employees</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">+12% from last month</div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 absolute transition-transform duration-300 w-[190px] bottom-[20px] left-[10px] sm:left-0 z-40">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-[120px] h-[60px] overflow-hidden flex justify-center items-end">
              <div className="absolute top-0 left-0 w-[120px] h-[120px] rounded-full border-[12px] border-gray-200 border-b-transparent border-l-transparent -rotate-45" />
              <div className="absolute top-0 left-0 w-[120px] h-[120px] rounded-full border-[12px] border-indigo-600 border-b-transparent border-l-transparent rotate-[99deg] transition-transform duration-1000" />
              <div className="absolute bottom-0 text-xl font-bold text-gray-900 leading-none">80%</div>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">Present Employees</div>
            
            <div className="flex justify-between w-full mt-3 text-[9px] text-gray-400 px-1 items-center">
              <span className="cursor-pointer p-0.5 border border-gray-200 rounded hover:bg-gray-50"><ChevronLeft size={10} /></span>
              <span className="font-medium text-gray-600">Product Design</span>
              <span className="cursor-pointer p-0.5 border border-gray-200 rounded hover:bg-gray-50"><ChevronRight size={10} /></span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 absolute transition-transform duration-300 w-[210px] bottom-[10px] right-[10px] z-10">
          <h4 className="m-0 mb-2 text-xs font-semibold text-gray-700 flex justify-between items-center">
            Employee Salary Tracker <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Today</span>
          </h4>
          <div className="flex items-end justify-between h-[110px] pt-2.5">
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '35%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">M</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '55%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">T</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '75%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">W</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-indigo-600 rounded-full" style={{ height: '88%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5 font-bold">T</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '40%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">F</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '20%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">S</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="h-20 w-2.5 bg-gray-100 rounded-full flex items-end overflow-hidden">
                <div className="w-full bg-emerald-500 rounded-full" style={{ height: '60%' }} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1.5">S</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center max-w-[440px]">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2.5 tracking-tight">{slidesData[activeSlide].title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-0">{slidesData[activeSlide].description}</p>
        
        <div className="flex gap-2 justify-center mt-6">
          {slidesData.map((_, index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 
                ${activeSlide === index ? 'bg-indigo-600 w-4 rounded-sm' : 'bg-gray-300'}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthSlider;

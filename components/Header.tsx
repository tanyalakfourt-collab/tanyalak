
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-8 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-md">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">ระบบประกาศคะแนนรายบุคคล</h1>
        <p className="text-blue-100 text-lg">วิชาเคมี นักเรียนชั้นมัธยมศึกษาปีที่ 4</p>
        <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-500/30 rounded-full text-xs font-medium uppercase tracking-wider border border-green-400/50">
          <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-green-400"></span>
          ข้อมูลอัปเดตแบบเรียลไทม์จากระบบ
        </div>
      </div>
    </header>
  );
};

export default Header;

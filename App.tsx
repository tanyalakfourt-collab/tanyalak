
import React, { useState, useEffect, useMemo } from 'react';
import { fetchScores } from './services/sheetService';
import { ScoreData } from './types';
import Header from './components/Header';
import ScoreCard from './components/ScoreCard';

const App: React.FC = () => {
  const [allScores, setAllScores] = useState<ScoreData[]>([]);
  const [searchId, setSearchId] = useState('');
  const [foundStudent, setFoundStudent] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Admin states
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchScores();
      if (data.length === 0) {
        throw new Error('ดึงข้อมูลได้สำเร็จแต่ไม่พบรายชื่อนักเรียน โปรดตรวจสอบว่าข้อมูลในไฟล์เริ่มที่คอลัมน์ A หรือ B');
      }
      const sortedData = [...data].sort((a, b) => a.studentId.localeCompare(b.studentId));
      setAllScores(sortedData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.length < 4) return;
    setHasSearched(true);
    const result = allScores.find(s => s.studentId === searchId.padStart(5, '0'));
    setFoundStudent(result || null);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '021308') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('รหัสผ่านแอดมินไม่ถูกต้อง');
    }
  };

  const filteredAdminScores = useMemo(() => {
    return allScores.filter(s => 
      s.studentId.includes(adminSearchTerm) || 
      s.name.includes(adminSearchTerm) || 
      s.surname.includes(adminSearchTerm)
    );
  }, [allScores, adminSearchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 mt-8 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
           <div className="text-xs font-medium text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${allScores.length > 0 ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}></span>
              {isLoading ? 'กำลังเชื่อมต่อฐานข้อมูล...' : `พบข้อมูลนักเรียน ${allScores.length} คน`}
           </div>
           
           {isAdmin && (
             <button 
              onClick={() => setIsAdmin(false)}
              className="text-xs text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100"
             >
               ออกจากโหมดแอดมิน
             </button>
           )}
        </div>

        {!isAdmin ? (
          <>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 mb-8">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="studentId" className="block text-sm font-semibold text-slate-600 mb-2 ml-1">
                    รหัสประจำตัวนักเรียน
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    placeholder="กรอกเลข 5 หลัก"
                    maxLength={5}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-xl font-bold tracking-[0.3em] text-indigo-900"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || searchId.length < 4}
                  className="md:mt-7 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg transition-all"
                >
                  ค้นหาคะแนน
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl mb-8 text-center">
                 <p className="text-red-700 font-bold mb-2">เกิดข้อผิดพลาด</p>
                 <p className="text-red-600 text-sm mb-4">{error}</p>
                 <button onClick={loadData} className="text-xs bg-red-600 text-white px-4 py-2 rounded-lg">ลองโหลดใหม่</button>
              </div>
            )}

            {isLoading && allScores.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                <p className="text-slate-500">กำลังดึงข้อมูลจาก Google Sheets...</p>
              </div>
            ) : hasSearched ? (
              foundStudent ? (
                <ScoreCard data={foundStudent} />
              ) : (
                <div className="bg-amber-50 border-2 border-amber-100 p-10 rounded-3xl text-center">
                  <div className="text-2xl mb-2 text-amber-600 font-bold">ไม่พบรหัส {searchId}</div>
                  <p className="text-amber-800">โปรดตรวจสอบว่ากรอกรหัสถูกต้อง หรือติดต่อครูผู้สอน</p>
                </div>
              )
            ) : null}
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
            <div className="bg-indigo-900 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Admin: รายชื่อทั้งหมด ({allScores.length})</h2>
              <input 
                type="text"
                placeholder="ค้นหา..."
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-1 text-sm outline-none"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0">
                  <tr>
                    <th className="px-6 py-4">รหัส</th>
                    <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                    <th className="px-6 py-4 text-center">คะแนนรวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdminScores.map(student => (
                    <tr key={student.studentId} className="hover:bg-slate-50 cursor-pointer" onClick={() => {
                      setSearchId(student.studentId);
                      setFoundStudent(student);
                      setHasSearched(true);
                      setIsAdmin(false);
                    }}>
                      <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{student.studentId}</td>
                      <td className="px-6 py-4">{student.name} {student.surname}</td>
                      <td className="px-6 py-4 text-center font-bold">{student.scores.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">แอดมินเข้าสู่ระบบ</h3>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                placeholder="รหัสผ่าน"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none mb-4 text-center"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAdminLogin(false)} className="flex-1 py-3 bg-slate-100 rounded-xl">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl">ยืนยัน</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-10 text-center">
        <button onClick={() => setShowAdminLogin(true)} className="text-slate-300 text-[10px] hover:text-indigo-400">Teacher Admin</button>
      </footer>
    </div>
  );
};

export default App;

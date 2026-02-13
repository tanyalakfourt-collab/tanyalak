
import React from 'react';
import { ScoreData } from '../types';

interface ScoreItemProps {
  label: string;
  value: string;
  max?: string;
  isTotal?: boolean;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, value, max, isTotal }) => (
  <div className={`flex justify-between items-center p-3 rounded-lg ${isTotal ? 'bg-indigo-50 border-l-4 border-indigo-600 font-bold' : 'bg-gray-50 border-b border-gray-100'}`}>
    <span className="text-gray-700 text-sm md:text-base">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`${isTotal ? 'text-indigo-700 text-xl' : 'text-gray-900 font-semibold'}`}>{value || '0'}</span>
      {max && <span className="text-gray-400 text-xs">/ {max}</span>}
    </div>
  </div>
);

interface ScoreCardProps {
  data: ScoreData;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-indigo-200 text-sm uppercase tracking-wide">รหัสประจำตัว {data.studentId}</p>
          <h2 className="text-2xl font-bold">{data.name} {data.surname}</h2>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-center">
          <p className="text-xs text-indigo-100 uppercase">เกรดเฉลี่ยสะสม</p>
          <p className="text-3xl font-bold">{data.scores.total}</p>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-indigo-700 border-b pb-2 mb-4">ช่วงคะแนนเก็บ (ครึ่งแรก)</h3>
          <ScoreItem label="1. เอกสารประกอบการเรียน บทที่ 1" value={data.scores.chap1} max="10" />
          <ScoreItem label="2. ชิ้นงาน สมุดเล่มเล็ก Pop-up" value={data.scores.popup} max="15" />
          <ScoreItem label="3. ปฏิบัติการเตรียมสารละลาย" value={data.scores.labPrep} max="5" />
          <ScoreItem label="4. รวมคะแนน (1)" value={data.scores.sum1} max="30" isTotal />
          <ScoreItem label="5. สอบกลางภาคเรียน" value={data.scores.midterm} max="20" />
          <ScoreItem label="6. รวมครึ่งกลางภาค (1+2)" value={data.scores.sumMid} max="50" isTotal />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-indigo-700 border-b pb-2 mb-4">ช่วงคะแนนเก็บ (ครึ่งหลัง)</h3>
          <ScoreItem label="7. ใบงานปฏิบัติการเตรียมสารละลาย" value={data.scores.labReport} max="5" />
          <ScoreItem label="8. เอกสารประกอบการเรียน บทที่ 2" value={data.scores.chap2} max="5" />
          <ScoreItem label="9. สอบเก็บคะแนน ปริมาณสารสัมพันธ์" value={data.scores.quizStoich} max="10" />
          <ScoreItem label="10. เอกสารประกอบการเรียน บทที่ 3" value={data.scores.chap3} max="10" />
          <ScoreItem label="11. รวมคะแนน (4)" value={data.scores.sum4} max="30" isTotal />
          <ScoreItem label="12. คะแนนสอบปลายภาค (5)" value={data.scores.final} max="20" />
          <ScoreItem label="13. รวมคะแนนทั้งหมด (3+4+5)" value={data.scores.total} max="100" isTotal />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t text-center">
        <p className="text-gray-500 text-xs italic">* หากคะแนนไม่ถูกต้อง กรุณาติดต่อครูผู้สอนประจำวิชา</p>
      </div>
    </div>
  );
};

export default ScoreCard;

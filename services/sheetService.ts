
import { ScoreData } from '../types';

const SHEET_ID = '1XbwHBTJ-GKUs23Cv8juZwnxodG_LrsMp';
// ใช้ URL สำหรับ Export CSV โดยตรง
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

export const fetchScores = async (): Promise<ScoreData[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('ไม่สามารถเข้าถึงข้อมูลได้ โปรดตรวจสอบว่าได้ "แชร์ลิงก์ให้ทุกคนที่มีลิงก์อ่านได้" หรือยัง');
    
    const text = await response.text();
    const rows = parseCSV(text);
    
    const studentData: ScoreData[] = [];
    
    // วนลูปทุกแถว
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].map(cell => cell.trim());
      
      // พยายามหารหัสประจำตัวในแถวนี้ (อาจไม่ได้อยู่ที่ index 0 เสมอไปถ้ามีคอลัมน์ว่าง)
      // เรามองหาเซลล์ที่มีตัวเลข 5 หลัก
      let idIndex = -1;
      let studentId = '';

      for (let j = 0; j < Math.min(row.length, 5); j++) {
        const clean = cleanIdString(row[j]);
        if (clean.length >= 4 && clean.length <= 6) {
          idIndex = j;
          studentId = clean.padStart(5, '0');
          break;
        }
      }

      // ถ้าเจอ ID และมีข้อมูลชื่อตามหลังมา
      if (idIndex !== -1 && row.length > idIndex + 2) {
        const name = row[idIndex + 1];
        const surname = row[idIndex + 2];
        
        // ถ้าชื่อเป็นช่องว่าง หรือเป็นคำว่า "ชื่อ" (Header) ให้ข้าม
        if (!name || name === 'ชื่อ' || name === 'Name') continue;

        // คะแนนเริ่มหลังจาก นามสกุล (idIndex + 3)
        const s = idIndex + 3;
        
        studentData.push({
          studentId: studentId,
          name: name,
          surname: surname,
          scores: {
            chap1: formatScore(row[s]),
            popup: formatScore(row[s + 1]),
            labPrep: formatScore(row[s + 2]),
            sum1: formatScore(row[s + 3]),
            midterm: formatScore(row[s + 4]),
            sumMid: formatScore(row[s + 5]),
            labReport: formatScore(row[s + 6]),
            chap2: formatScore(row[s + 7]),
            quizStoich: formatScore(row[s + 8]),
            chap3: formatScore(row[s + 9]),
            sum4: formatScore(row[s + 10]),
            final: formatScore(row[s + 11]),
            total: formatScore(row[s + 12]),
          }
        });
      }
    }
    
    // ลบค่าซ้ำและคืนค่า
    const uniqueData = Array.from(new Map(studentData.map(item => [item.studentId, item])).values());
    console.log(`Successfully loaded ${uniqueData.length} students.`);
    return uniqueData;
  } catch (error) {
    console.error('Sheet Service Error:', error);
    throw error;
  }
};

function cleanIdString(val: any): string {
  if (!val) return '';
  // ตัด .00 ออก (กรณี Excel มองเป็นตัวเลข) และเก็บเฉพาะตัวเลข
  const str = val.toString().split('.')[0];
  return str.replace(/[^0-9]/g, '');
}

function formatScore(val: any): string {
  if (val === undefined || val === null) return '0';
  const s = val.toString().trim();
  return s === '' ? '0' : s;
}

function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  // รองรับทั้ง Windows (\r\n) และ Unix (\n) line endings
  const lines = text.split(/\r?\n/);
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const row: string[] = [];
    let cell = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }
    row.push(cell);
    // ลบเครื่องหมายคำพูดที่ครอบข้อมูลอยู่ออก
    result.push(row.map(v => v.replace(/^"|"$/g, '').trim()));
  }
  return result;
}

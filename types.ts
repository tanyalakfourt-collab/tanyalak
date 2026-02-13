
export interface ScoreData {
  studentId: string;
  name: string;
  surname: string;
  scores: {
    chap1: string;
    popup: string;
    labPrep: string;
    sum1: string;
    midterm: string;
    sumMid: string;
    labReport: string;
    chap2: string;
    quizStoich: string;
    chap3: string;
    sum4: string;
    final: string;
    total: string;
  };
}

export interface SheetRow {
  [key: string]: string;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}
export interface Announcement {
  fileUrl: string;
  advisorId: number;
  topic: string;
  content: string;
}
export interface Comment {
  content: string;
  studentId: number;
  advisorId: number;
}
export interface Reply {
  content: string;
  commentId: number;
}

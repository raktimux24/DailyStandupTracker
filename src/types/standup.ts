export interface Standup {
  id: string;
  date: Date;
  userId: string;
  userName: string;
  yesterday: string;
  today: string;
  blockers: string;
  comments: string;
}
import { Standup } from '../types/standup';

export const mockStandups: Standup[] = [
  {
    id: '1',
    date: new Date('2024-03-10'),
    userId: 'user1',
    userName: 'Alice Johnson',
    yesterday: 'Completed the authentication module and fixed bug #123',
    today: 'Starting work on the dashboard components',
    blockers: 'None at the moment',
    comments: 'Great progress on the auth module!'
  },
  {
    id: '2',
    date: new Date('2024-03-10'),
    userId: 'user2',
    userName: 'Bob Smith',
    yesterday: 'Worked on API documentation',
    today: 'Implementing new API endpoints',
    blockers: 'Waiting for DevOps to set up the staging environment',
    comments: 'Documentation is now up to date'
  },
  {
    id: '3',
    date: new Date('2024-03-09'),
    userId: 'user1',
    userName: 'Alice Johnson',
    yesterday: 'Started working on authentication module',
    today: 'Continue with auth implementation',
    blockers: 'Need clarification on security requirements',
    comments: 'Meeting scheduled with security team'
  }
];
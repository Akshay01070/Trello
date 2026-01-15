import { v4 as uuid } from 'uuid';

const members = [
  { id: 'm1', name: 'Alice' },
  { id: 'm2', name: 'Bob' },
  { id: 'm3', name: 'Charlie' }
];

const labels = [
  { id: 'l-frontend', name: 'frontend', color: 'green' },
  { id: 'l-backend', name: 'backend', color: 'amber' },
  { id: 'l-urgent', name: 'urgent', color: 'red' },
  { id: 'l-design', name: 'design', color: 'violet' },
  { id: 'l-bug', name: 'bug', color: 'red' },
  { id: 'l-feature', name: 'feature', color: 'blue' }
];

const sampleBoard = {
  id: 'b1',
  title: 'Default Board',
  lists: [
    {
      id: 'l1',
      title: 'To Do',
      cards: [
        {
          id: 'c1',
          title: 'Setup project',
          description: 'Create Vite + React skeleton',
          labels: ['l-frontend'],
          dueDate: null,
          checklists: [{ id: uuid(), title: 'Setup tasks', items: [{ id: uuid(), text: 'init repo', done: true }] }],
          members: ['m1'],
          archived: false
        },
        {
          id: 'c2',
          title: 'Design DB schema',
          description: '',
          labels: ['l-backend'],
          dueDate: null,
          checklists: [],
          members: ['m2'],
          archived: false
        }
      ]
    },
    {
      id: 'l2',
      title: 'In Progress',
      cards: []
    },
    {
      id: 'l3',
      title: 'Done',
      cards: []
    }
  ]
};

export { sampleBoard, members, labels };

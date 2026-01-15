import { v4 as uuid } from 'uuid';

const members = [
  { id: 'm1', name: 'Alice' },
  { id: 'm2', name: 'Bob' },
  { id: 'm3', name: 'Charlie' }
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
          labels: ['frontend'],
          dueDate: null,
          checklist: [{ id: uuid(), text: 'init repo', done: true }],
          members: ['m1'],
          archived: false
        },
        {
          id: 'c2',
          title: 'Design DB schema',
          description: '',
          labels: ['backend'],
          dueDate: null,
          checklist: [],
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

export { sampleBoard, members };

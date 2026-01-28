export type EventItem = {
  year: number;
  text: string;
};

export type Category = {
  id: number;
  title: string;
  start: number;
  end: number;
  events: EventItem[];
};

export const events = [
  {
    id: 0,
    title: 'Наука',
    start: 1999,
    end: 2010,
    events: [
      { year: 1961, text: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.' },
      { year: 1962, text: 'Consectetur adipiscing elit sed do eiusmod.onsectetur adipiscing elit sed do eiusmod.onsectetur adipiscing elit sed do eiusmod.' },
      { year: 1963, text: 'Lorem ipsum dolor sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur.Lorem ipsum dolor sit amet, consectetur.' },
      { year: 1964, text: 'Sed do eiusmod tempor incididunt ut labore.' },
      { year: 1965, text: 'Ut enim ad minim veniam quis nostrud.' },
    ],
  },
  {
    id: 1,
    title: 'Литература',
    start: 2010,
    end: 2030,
    events: [
      { year: 1960, text: 'Lorem ipsum dolor sit amet.' },
      { year: 1962, text: 'Sed ut perspiciatis unde omnis.' },
      { year: 1964, text: 'Consectetur adipiscing elit.' },
      { year: 1966, text: 'At vero eos et accusamus.' },
      { year: 1969, text: 'Et harum quidem rerum facilis.' },
    ],
  },
  {
    id: 2,
    title: 'Физика',
    start: 1966,
    end: 1969,
    events: [
      { year: 1961, text: 'Lorem ipsum dolor sit amet.' },
      { year: 1963, text: 'Ut enim ad minim veniam.' },
      { year: 1965, text: 'Duis aute irure dolor in reprehenderit.' },
      { year: 1967, text: 'Excepteur sint occaecat cupidatat.' },
      { year: 1968, text: 'Sunt in culpa qui officia deserunt.' },
    ],
  },
  {
    id: 3,
    title: 'Химия',
    start: 1960,
    end: 1969,
    events: [
      { year: 1960, text: 'Lorem ipsum dolor sit amet.' },
      { year: 1962, text: 'Consectetur adipiscing elit.' },
      { year: 1964, text: 'Sed do eiusmod tempor incididunt.' },
      { year: 1966, text: 'Ut labore et dolore magna aliqua.' },
      { year: 1969, text: 'Ut enim ad minim veniam.' },
    ],
  },
  {
    id: 4,
    title: 'Технологии',
    start: 1989,
    end: 2100,
    events: [
      { year: 1961, text: 'Lorem ipsum dolor sit amet.' },
      { year: 1963, text: 'Sed ut perspiciatis unde omnis.' },
      { year: 1965, text: 'Consectetur adipiscing elit.' },
      { year: 1967, text: 'Duis aute irure dolor.' },
      { year: 1969, text: 'Excepteur sint occaecat cupidatat.' },
    ],
  },
  {
    id: 5,
    title: 'Культура',
    start: 1988,
    end: 2010,
    events: [
      { year: 1960, text: 'Lorem ipsum dolor sit amet.' },
      { year: 1962, text: 'At vero eos et accusamus.' },
      { year: 1964, text: 'Et harum quidem rerum facilis.' },
      { year: 1966, text: 'Sed ut perspiciatis unde omnis.' },
      { year: 1968, text: 'Neque porro quisquam est.' },
    ],
  },
];

export default events;

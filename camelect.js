var base = { lab: 16, con: 1, ind: 1, ld: 10 };
var partyNames = { lab: 'Labour', con: "Conservative", ind: "Independent", grn: "Green", ld: "Lib Dem" };
var wardNames = {
  a: 'Abbey',
  b: 'Arbury',
  c: 'Castle',
  d: 'Cherry Hinton',
  e: 'Coleridge',
  f: 'East Chesterton',
  g: 'King\'s Hedges',
  h: 'Market',
  i: 'Newnham',
  j: 'Petersfield',
  k: 'Romsey',
  l: 'Queen Edith\'s',
  m: 'Trumpington',
  n: 'West Chesterton'
};

var settings = [
  { ward: 'a', p1: 'lab', p2: 'grn', p: 0.98 },
  { ward: 'b', p1: 'lab', p2: 'ld', p: 0.95 },
  { ward: 'c', p1: 'ind', p2: 'ld', p: 0.25 },
  { ward: 'd', p1: 'lab', p2: 'con', p: 0.98 },
  { ward: 'e', p1: 'lab', p2: 'con', p: 0.98 },
  { ward: 'f', p1: 'ld', p2: 'lab', p: 0.4 },
  { ward: 'g', p1: 'lab', p2: 'ld', p: 0.98 },
  { ward: 'h', p1: 'ld', p2: 'lab', p: 0.6 },
  { ward: 'i', p1: 'ld', p2: 'lab', p: 0.8 },
  { ward: 'j', p1: 'lab', p2: 'ld', p: 0.95 },
  { ward: 'k', p1: 'ld', p2: 'lab', p: 0.65 },
  { ward: 'l', p1: 'ld', p2: 'lab', p: 0.6 },
  { ward: 'm', p1: 'ld', p2: 'con', p: 0.6 },
  { ward: 'n', p1: 'lab', p2: 'ld', p: 0.45 }
];
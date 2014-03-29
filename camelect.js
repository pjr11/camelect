var _ = require('underscore');
var baseSeats = { ld: 10, lab: 16, con: 1, grn: 0, ind: 1 };
var totalSeats = 42;
var partyNames = {
  ld: "Lib Dem",
  lab: 'Labour',
  con: "Conservative",
  grn: "Green",
  ind: "Independent"
};

var parties = _.keys(partyNames);
var partyIndex = {};    // Maps each party to its index in parties
_.each(parties, function(p, i) { partyIndex[p] = i; });

var wardNames = [
  'Abbey',
  'Arbury',
  'Castle',
  'Cherry Hinton',
  'Coleridge',
  'East Chesterton',
  'King\'s Hedges',
  'Market',
  'Newnham',
  'Petersfield',
  'Romsey',
  'Queen Edith\'s',
  'Trumpington',
  'West Chesterton'
];

var wardCount = wardNames.length;

// Possible types of outcome
var outcomes = {
  LabourMajority: 0,
  Labour21: 1,
  NOCLabLargest: 2,
  NOCLabLDEqual: 3,
  NOCLDLargest: 4,
  LDMayorsCastingVote: 5,
  LDOutrightMajority: 6
};

var outcomeCount = _.keys(outcomes).length;

// Descriptive text for each outcome
var outcomeText = [
  'Labour majority',
  'Labour 21 seats',
  'NOC - Labour largest party',
  'NOC - Lab and LDs level',
  'NOC - LDs largest party',
  'LD control on mayor\'s casting vote',
  'LD outright majority'
];

var outcomeCount = outcomeText.length;

// This array specifies the input probabilities. For each seat,
// p1 and p2 are the two parties in contention. p is the probability
// that p1 will win the seat; we assume there's a probability of
// 1-p that p2 will win the seat.
var baseSettings = [
  { p1: 'lab', p2: 'grn', p: 0.98 },  // Abbey
  { p1: 'lab', p2: 'ld', p: 0.90 },   // Arbury
  { p1: 'ld', p2: 'ind', p: 0.75 },   // Castle
  { p1: 'lab', p2: 'con', p: 0.98 },  // Cherry Hinton
  { p1: 'lab', p2: 'con', p: 0.98 },  // Coleridge
  { p1: 'ld', p2: 'lab', p: 0.5 },    // East Chesterton
  { p1: 'lab', p2: 'ld', p: 0.95 },   // King's Hedges
  { p1: 'ld', p2: 'lab', p: 0.6 },    // Market
  { p1: 'ld', p2: 'lab', p: 0.8 },    // Newnham
  { p1: 'lab', p2: 'ld', p: 0.90 },   // Petersfield
  { p1: 'ld', p2: 'lab', p: 0.65 },   // Romsey
  { p1: 'ld', p2: 'lab', p: 0.6 },    // Queen Edith's
  { p1: 'ld', p2: 'con', p: 0.6 },    // Trumpington
  { p1: 'lab', p2: 'ld', p: 0.45 }    // West Chesterton
];

// Settings for an optimistic Liberal Democrat
var libDemHopingAgainstHopeSettings = [
  { p1: 'lab', p2: 'grn', p: 0.6 },  // Abbey
  { p1: 'lab', p2: 'ld', p: 0.60 },   // Arbury
  { p1: 'ld', p2: 'ind', p: 0.9 },   // Castle
  { p1: 'lab', p2: 'con', p: 0.7 },  // Cherry Hinton
  { p1: 'lab', p2: 'con', p: 0.7 },  // Coleridge
  { p1: 'ld', p2: 'lab', p: 0.75 },    // East Chesterton
  { p1: 'lab', p2: 'ld', p: 0.5 },   // King's Hedges
  { p1: 'ld', p2: 'lab', p: 0.8 },    // Market
  { p1: 'ld', p2: 'lab', p: 0.9 },    // Newnham
  { p1: 'lab', p2: 'ld', p: 0.5 },   // Petersfield
  { p1: 'ld', p2: 'lab', p: 0.8 },   // Romsey
  { p1: 'ld', p2: 'lab', p: 0.9 },    // Queen Edith's
  { p1: 'ld', p2: 'con', p: 0.8 },    // Trumpington
  { p1: 'lab', p2: 'ld', p: 0.7 }    // West Chesterton
];

// Which set shall we use?
var settings = libDemHopingAgainstHopeSettings;

// Think of c as being a binary number that we're incrementing; each array entry is one digit,
// false as zero, true as one. Returns a boolean saying whether we've finished.
function nextCombination(c) {
  for (var i = 0; i < c.length; i++) {
    if (c[i]) {
      c[i] = false;
    } else {
      c[i] = true;
      return false;   // not done
    }
  }

  return true;  // done
}

// Compute the probability that this combination will happen
function combinationProbability(c) {
  var p = 1;

  for (var i = 0; i < c.length; i++) {
    p = p * (c[i] ? settings[i].p : 1 - settings[i].p);
  }

  return p;
}

// Compute the number of seats that each party will get for this outcome
function computeSeats(c) {
  var seats = _.extend({}, baseSeats);

  for (var i = 0; i < c.length; i++) {
    var winner = c[i] ? settings[i].p1 : settings[i].p2;
    seats[winner] += 1;
  }

  return seats;
}

// Classify this outcome 
function classifyOutcome(seats) {
  if (seats.lab > 21) {
    return outcomes.LabourMajority;
  } else if (seats.lab === 21) {
    return outcomes.Labour21;
  } else if (seats.lab > seats.ld) {
    return outcomes.NOCLabLargest;
  } else if (seats.ld === 21) {
    return outcomes.LDMayorsCastingVote;
  } else if (seats.ld > 21) {
    return outcomes.LDOutrightMajority;
  } else if (seats.ld > seats.lab) {
    return outcomes.NOCLDLargest;
  } else {
    return outcomes.NOCLabLDEqual;
  }
}

// Return an array of n identical values
function arrayOfN(n, v) {
  return _.times(n, function() { return v; });
}

// Go through all the possible combinations and
// compute the probability of each outcome.
function computeProbs() {
  var c = arrayOfN(wardCount, false);
  var probs = arrayOfN(outcomeCount, 0);
  var done = false;

  // seatProbs holds an array for each party of giving the probability
  // that it will end up with n seats.
  var seatProbs = {};
  // +1 here is because party could theoretically get 0 to 42 seats
  _.each(parties, function(party) { seatProbs[party] = arrayOfN(totalSeats+1, 0); });

  do {
    var p = combinationProbability(c);
    var seats = computeSeats(c);

    // Add the probability of this outcome for the number of seats for each party
    _.each(parties, function(party) {
      seatProbs[party][seats[party]] += p;
    });

    // Also calculate the probability of each kind of overall outcome
    var outcomeIndex = classifyOutcome(seats);
    probs[outcomeIndex] += p;

    done = nextCombination(c);
  } while (!done);
  return { probs: probs, seatProbs: seatProbs };
}

function outputPartyColumnHeaders(row0header) {
  console.log(row0header + ',' + _.map(parties, function(p) { return partyNames[p]; }).join(','));
}

// Output the assumed probabilities in a format that's easy to make
// a bar chart from
function outputColourTable() {
  outputPartyColumnHeaders('Ward');
  for (var i = 0; i < wardCount; i++) {
    var row = arrayOfN(parties.length, 0);
    var s = settings[i];
    row[partyIndex[s.p1]] = s.p;
    row[partyIndex[s.p2]] = 1 - s.p;
    console.log(wardNames[i] + ',' + row.join(','));
  }
}

function outputSeatProbs(seatProbs) {
  outputPartyColumnHeaders('Seats');

  for (var i = 0; i <= totalSeats; i++) {
    console.log(i + ',' + _.map(parties, function(party) {
      return seatProbs[party][i];
    }).join(','));
  }
}

var result = computeProbs();
var probs = result.probs;
var total = 0;

outputColourTable();

console.log();
outputSeatProbs(result.seatProbs);

console.log();
console.log('Outcome,Probability');

for (var i = 0; i < outcomeCount; i++) {
  total += probs[i];
  console.log(outcomeText[i] + ',' + probs[i]);
}

console.log('Total,' + total);
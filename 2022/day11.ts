import { BLOCKS, Solver } from "./solver";

const solver = new Solver(BLOCKS);

solver.part1 = data => {
  const monkeys = parseData(data);

  let round = 0;
  while (round < 20) {
    round++;
    for (let monkey of monkeys) {
      for (let item of monkey.items) {
        let inspectedItem = Math.floor(monkey.operation(item) / 3);
        monkey.inspectionCount++;
        const testOutcome = Number(inspectedItem % monkey.testDivisibleBy === 0);
        monkeys[monkey.throwTo[testOutcome]].items.push(inspectedItem);
      }
      monkey.items = [];
    }
    Solver.log('Round ' + round);
    Solver.log(monkeys.map((m, i) => `Monkey ${i}: ` + m.items.join(', ')).join('\n') + '\n');
  }

  return getMonkeyBusiness(monkeys);
};

solver.part2 = data => {
  const monkeys = parseData(data);
  const commonDivisor = monkeys.map(m => m.testDivisibleBy).reduce((a, b) => a * b, 1);

  let round = 0;
  while (round < 10000) {
    round++;
    for (let monkey of monkeys) {
      for (let item of monkey.items) {
        let inspectedItem = monkey.operation(item) % commonDivisor;
        monkey.inspectionCount++;
        const testOutcome = Number(inspectedItem % monkey.testDivisibleBy === 0);
        monkeys[monkey.throwTo[testOutcome]].items.push(inspectedItem);
      }
      monkey.items = [];
    }
    if (round % 1000 === 0) {
      Solver.log(monkeys.map((m, i) => `Monkey ${i}: ${m.inspectionCount}`).join('\n') + '\n');
    }
  }

  return getMonkeyBusiness(monkeys);
};

interface Monkey {
  items: number[];
  operation: (item: number) => number;
  testDivisibleBy: number;
  throwTo: { [key: number]: number };
  inspectionCount: number;
}

function parseData(data: string[]) {
  let monkeys: Monkey[] = [];
  for (let block of data) {
    const [id, startingItems, operation, test, testOutcomeTrue, testOutcomeFalse] = block.split('\n');
    monkeys.push({
      items: startingItems.split(': ')[1].split(', ').map(el => Number(el)),
      operation: buildOperation(operation.split('= ')[1]),
      testDivisibleBy: Number(test.split('by ')[1]),
      throwTo: {
        0: Number(testOutcomeFalse.split('monkey ')[1]),
        1: Number(testOutcomeTrue.split('monkey ')[1]),
      },
      inspectionCount: 0
    });
  }
  return monkeys;
}

function buildOperation(operation: string) {
  const [op1, opType, op2] = operation.split(' ');
  if (op1 !== 'old') throw new Error('first operand not "old"');

  if (op2 === 'old') {
    switch (opType) {
      case '*': return (item: number) => item * item;
      case '+': return (item: number) => item + item;
    }
  } else {
    const val = Number(op2);
    switch (opType) {
      case '*': return (item: number) => item * val;
      case '+': return (item: number) => item + val;
    }
  }
  throw new Error('unknown operation type');
}

function getMonkeyBusiness(monkeys: Monkey[]) {
  const inspectionCounts = monkeys.map(m => m.inspectionCount);
  inspectionCounts.sort((a, b) => b - a); // sort descending
  return inspectionCounts[0] * inspectionCounts[1];
}


solver.test(`Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`, 10605, 2713310158);

solver.run();

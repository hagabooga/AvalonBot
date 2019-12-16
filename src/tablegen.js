const topleft = '\u2554';
const topright = '\u2557';
const botleft = '\u255A';
const botright = '\u255d';
const h = '\u2550';
const v = '\u2551';
const cross = '\u256C';
const t = '\u2566';
const bt = '\u2569';
const lt = '\u2560';
const rt = '\u2563';
const data = [
  ['MISSION', 'SIZE', 'TWO FAILS'],
  ['1', 2, false],
  ['2', 3, false],
  ['3', 2, false],
  ['4', 3, false],
  ['5', 3, false],
];

function words_row(words, lengths) {}

function seperator(lengths) {
  return;
}

function table(data) {
  let top = topleft;
  let lengths = data[0]
    .map((col, i) => data.map(row => row[i].toString()))
    .map((x, i) => Math.max(...x.map(string => string.length)));
  // top
  lengths.map(
    (x, i) =>
      (top += h.repeat(x + 2) + (i != lengths.length - 1 ? t : topright))
  );
  top += '\n' + v + ' ';
  data.map((row, j) => {
    row.map(
      (x, i) =>
        (top += x + ' '.repeat(lengths[i] - x.toString().length + 1) + v + ' ')
    );
    top += '\n';
    lengths.map((y, j) => {
      top +=
        (j == 0 ? lt : cross) +
        h.repeat(y + 2) +
        (j == lengths.length - 1 ? rt : '');
    });

    top += '\n' + v + ' ';
  });
  console.log(top);
}

table(data);

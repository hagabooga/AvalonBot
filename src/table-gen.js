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

function createTable(data) {
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
    // middle
    row.map((x, i) => {
      let middle = lengths[i] - x.toString().length;
      let half = Math.trunc(middle / 2);
      top += ' '.repeat(half) + x + ' '.repeat(middle - half + 1) + v + ' ';
    });

    top += '\n';

    // under
    let last = j == data.length - 1;

    lengths.map((y, k) => {
      top +=
        (k == 0 ? (last ? botleft : lt) : last ? bt : cross) +
        h.repeat(y + 2) +
        (k == lengths.length - 1 ? (last ? botright : rt) : '');
    });

    if (!last) {
      top += '\n' + v + ' ';
    }
  });

  return top;
}

export default createTable;

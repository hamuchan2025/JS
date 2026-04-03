const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".keys");

// 状態（初心者向け：電卓の「記憶」）
let current = "0";     // 今入力してる数字（文字列）
let prev = null;       // 前の数字（number）
let op = null;         // 演算子 "+ - * /"
let justEvaluated = false;

function updateScreen() {
  // 上段：式っぽく表示
  const top = (prev !== null && op) ? `${prev} ${op}` : " ";
  exprEl.textContent = top;

  // 下段：今の表示
  resultEl.textContent = current;
}

function toNumber(str) {
  // "0." みたいな途中入力でもOKにする
  if (str === "." || str === "-.") return 0;
  return Number(str);
}

function inputNumber(n) {
  if (justEvaluated) {
    // 「=」のあとに数字を押したら新しく入力開始
    current = n;
    justEvaluated = false;
  } else if (current === "0") {
    current = n;
  } else {
    current += n;
  }
  updateScreen();
}

function inputDot() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateScreen();
}

function backspace() {
  if (justEvaluated) {
    current = "0";
    justEvaluated = false;
  } else {
    current = current.length <= 1 ? "0" : current.slice(0, -1);
    if (current === "-" || current === "") current = "0";
  }
  updateScreen();
}

function clearAll() {
  current = "0";
  prev = null;
  op = null;
  justEvaluated = false;
  updateScreen();
}

function calc(a, operator, b) {
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return b === 0 ? null : a / b;
  return b;
}

function setOperator(nextOp) {
  const curNum = toNumber(current);

  if (prev === null) {
    prev = curNum;
  } else if (op && !justEvaluated) {
    // 例： 3 + 4 + のとき、先に計算しておく
    const out = calc(prev, op, curNum);
    if (out === null) {
      resultEl.textContent = "Error";
      return;
    }
    prev = out;
  }

  op = nextOp;
  current = "0";
  justEvaluated = false;
  updateScreen();
}

function equal() {
  if (prev === null || !op) return;

  const a = prev;
  const b = toNumber(current);
  const out = calc(a, op, b);

  if (out === null) {
    resultEl.textContent = "Error";
    return;
  }

  // 表示をキレイに（小数が長すぎる対策）
  const rounded = Number.isInteger(out) ? out : Number(out.toFixed(10));
  current = String(rounded);

  prev = null;
  op = null;
  justEvaluated = true;
  updateScreen();
}

function percent() {
  // 今の表示を100で割る（一般的な%挙動）
  const curNum = toNumber(current);
  const out = curNum / 100;
  current = String(Number(out.toFixed(10)));
  updateScreen();
}

// クリック操作
keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const num = btn.dataset.num;
  const operator = btn.dataset.op;
  const action = btn.dataset.action;

  if (num !== undefined) inputNumber(num);
  else if (operator) setOperator(operator);
  else if (action === "dot") inputDot();
  else if (action === "equal") equal();
  else if (action === "clear") clearAll();
  else if (action === "back") backspace();
  else if (action === "percent") percent();
});

// キーボード対応
document.addEventListener("keydown", (e) => {
  const k = e.key;

  if (k >= "0" && k <= "9") return inputNumber(k);
  if (k === ".") return inputDot();
  if (k === "+" || k === "-" || k === "*" || k === "/") return setOperator(k);
  if (k === "Enter" || k === "=") return equal();
  if (k === "Backspace") return backspace();
  if (k === "Escape") return clearAll();
});

updateScreen();

let firstOperand = "";
let secondOperand = "";
let secondOperandMemory = "";
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.getElementById("equalsBtn");
const clearButton = document.getElementById("clearBtn");
const deleteButton = document.getElementById("deleteBtn");
const pointButton = document.getElementById("pointBtn");
const lastOperationScreen = document.getElementById("lastOperationScreen");
const currentOperationScreen = document.getElementById(
  "currentOperationScreen"
);

window.addEventListener("keydown", handleKeyboardInput);
equalsButton.addEventListener("click", evaluate);
clearButton.addEventListener("click", clear);
deleteButton.addEventListener("click", deleteNumber);
pointButton.addEventListener("click", appendPoint);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => appendNumber(button.textContent));
});

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => setOperation(button.textContent));
});

function appendNumber(number) {
  if (currentOperationScreen.textContent === "") secondOperandMemory = "";
  if (currentOperationScreen.textContent === "0" || shouldResetScreen)
    resetScreen();
  currentOperationScreen.textContent += number;
}

function resetScreen() {
  currentOperationScreen.textContent = "";
  shouldResetScreen = false;
}

function clear() {
  currentOperationScreen.textContent = "0";
  lastOperationScreen.textContent = "";
  firstOperand = "";
  secondOperand = "";
  secondOperandMemory = "";
  currentOperation = null;
}

function appendPoint() {
  if (shouldResetScreen) resetScreen();
  if (currentOperationScreen.textContent === "")
    currentOperationScreen.textContent = "0";
  if (currentOperationScreen.textContent.includes(".")) return;
  currentOperationScreen.textContent += ".";
}

function deleteNumber() {
  // if exponential characters exist, remove them in one delete click
  if (currentOperationScreen.textContent.toString().slice(-2) === "e+") {
    currentOperationScreen.textContent = currentOperationScreen.textContent
      .toString()
      .slice(0, -2);
    return;
  }
  if (currentOperationScreen.textContent.toString().slice(-2) === "e-") {
    currentOperationScreen.textContent = currentOperationScreen.textContent
      .toString()
      .slice(0, -2);
    return;
  }
  // standard delete operation
  currentOperationScreen.textContent = currentOperationScreen.textContent
    .toString()
    .slice(0, -1);
}

function setOperation(operator) {
  // reset second operand memory and current operation when operator is clicked
  secondOperandMemory = "";
  currentOperation = null;
  if (currentOperation !== null) evaluate();
  firstOperand = currentOperationScreen.textContent;
  currentOperation = operator;
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
  shouldResetScreen = true;
}

function evaluate() {
  // if there is no operation selected and enter is pressed, don't do anything
  if (currentOperation === null || shouldResetScreen) return;

  // division by zero
  if (currentOperation === "÷" && currentOperationScreen.textContent === "0") {
    alert("You can't divide by 0!");
    return;
  }

  // get second operand from current operation screen
  secondOperand = currentOperationScreen.textContent;

  // if enter is pressed again, recursively evaluate previous operation
  if (
    lastOperationScreen.textContent.includes("=") &&
    secondOperandMemory !== ""
  ) {
    firstOperand = secondOperand;
    secondOperand = secondOperandMemory;
  }

  // operate on entered values
  currentOperationScreen.textContent = roundResult(
    operate(currentOperation, firstOperand, secondOperand)
  );
  // get second operand from current operation screen
  secondOperandMemory = secondOperand;
  // send previous equation to last operation screen
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
}

function roundResult(number) {
  return Math.round(number * 1000) / 1000;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "×":
      return multiply(a, b);
    case "÷":
      if (b === 0) return null;
      else return divide(a, b);
    default:
      return null;
  }
}

function handleKeyboardInput(e) {
  if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
  if (e.key === ".") appendPoint();
  if (e.key === "=" || e.key === "Enter") evaluate();
  if (e.key === "Backspace") deleteNumber();
  if (e.key === "Escape") clear();
  // "x" is sometimes typed for multiplication
  if (
    e.key === "+" ||
    e.key === "-" ||
    e.key === "*" ||
    e.key === "x" ||
    e.key === "/"
  )
    setOperation(convertOperator(e.key));
}

function convertOperator(keyboardOperator) {
  if (keyboardOperator === "+") return "+";
  if (keyboardOperator === "-") return "-";
  // parse "x" for multiplication
  if (keyboardOperator === "*" || keyboardOperator === "x") return "×";
  if (keyboardOperator === "/") return "÷";
}

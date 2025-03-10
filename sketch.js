let radio;
let input;
let submitButton;
let resultText = '';
let table;
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

function preload() {
  // 載入 Excel 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#e7c6ff");// 顏色為"#e7c6ff"
  fill('#390099');
  
  // 建立 radio 物件
  radio = createRadio();
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  radio.style('width', '100px');
  radio.style('text-align', 'center');
  radio.style('display', 'block'); // 確保每個選項顯示在新的一行
  radio.style('color', '#390099'); // 設置選項文字顏色

  // 建立填充題輸入框
  input = createInput();
  input.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  input.style('width', '100px');
  input.hide(); // 初始隱藏

  // 建立送出按鈕
  submitButton = createButton('送出');
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 150); // 調整按鈕位置
  submitButton.style('color', '#390099'); // 設置按鈕文字顏色
  submitButton.mousePressed(checkAnswer);

  // 顯示第一題
  displayQuestion();
}

function draw() {
  background("#e7c6ff");// 顏色為"#e7c6ff"

  // 顯示題目
  textAlign(CENTER);
  textSize(24);
  fill('#390099');
  if (currentQuestionIndex < table.getRowCount()) {
    text(table.getString(currentQuestionIndex, 'question'), windowWidth / 2, windowHeight / 2 - 20);
  }

  // 顯示結果
  textSize(18);
  textAlign(CENTER);
  if (resultText.includes('所有題目已完成')) {
    fill('#390099');
  } else {
    fill(resultText.includes('正確') ? 'green' : 'red');
  }
  text(resultText, windowWidth / 2, windowHeight / 2 + 200); // 調整結果顯示位置

  // 顯示答對和答錯紀錄
  textSize(18);
  fill('#390099');
  text(`答對: ${correctCount} 答錯: ${incorrectCount}`, windowWidth / 2, windowHeight / 2 + 250);
}

function checkAnswer() {
  let selected;
  const correctAnswer = table.getString(currentQuestionIndex, 'answer');
  if (table.getString(currentQuestionIndex, 'type') === 'choice') {
    selected = radio.value();
  } else {
    selected = input.value();
  }

  if (selected === correctAnswer) {
    resultText = '答案正確';
    correctCount++;
  } else {
    resultText = '答案錯誤';
    incorrectCount++;
  }

  // 顯示下一題
  currentQuestionIndex++;
  if (currentQuestionIndex < table.getRowCount()) {
    displayQuestion();
  } else {
    resultText = `所有題目已完成~`;
    radio.hide(); // 隱藏選項
    input.hide(); // 隱藏輸入框
    submitButton.hide(); // 隱藏按鈕
  }
}

function displayQuestion() {
  const questionType = table.getString(currentQuestionIndex, 'type');
  if (questionType === 'choice') {
    radio.show();
    input.hide();
    radio.elt.innerHTML = ''; // 清空現有選項
    for (let i = 1; i <= 4; i++) {
      radio.option(table.getString(currentQuestionIndex, `option${i}`));
    }
    radio.elt.innerHTML = radio.elt.innerHTML.replace(/<\/label>/g, '</label><br>'); // 添加換行
  } else {
    radio.hide();
    input.show();
    input.value(''); // 清空輸入框
  }
}

// public/socketConnectionTimer.js
document.addEventListener('DOMContentLoaded', () => {
  const socket = io('/stopwatch');

  let timerInterval;
  let timerRunning = false;
  let elapsedTime = 0;

  const timerElement = document.getElementById('timer');
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const resetButton = document.getElementById('resetButton');

  // 소켓 이벤트 핸들러를 추가합니다
  socket.on('connect', () => {
    console.log('타이머 페이지에서 타이머 네임스페이스에 연결되었습니다');
  });

  socket.on('myStopwatchStart-to-Other', data => {
    handleStartEvent(data.time);
  });

  socket.on('myStopwatchPause-to-Other', data => {
    handlePauseEvent(data.time);
  });

  // 시작 버튼 클릭 시 타이머 시작
  startButton.addEventListener('click', () => {
    socket.emit('start_watch', { userId: 'user123', subject: 'example' });
  });

  // 일시정지 버튼 클릭 시 타이머 일시정지
  pauseButton.addEventListener('click', () => {
    socket.emit('pause_watch', { userId: 'user123', subject: 'example', time: elapsedTime });
  });

  // 리셋 버튼 클릭 시 타이머 리셋
  resetButton.addEventListener('click', () => {
    socket.emit('reset_watch', { userId: 'user123', subject: 'example' });
  });

  // 타이머 시작 처리 함수
  function handleStartEvent(initialTime) {
    if (!timerRunning) {
      elapsedTime = initialTime;
      timerInterval = setInterval(updateTimer, 1000);
      timerRunning = true;
    }
  }

  // 타이머 일시정지 처리 함수
  function handlePauseEvent(totalTime) {
    if (timerRunning) {
      clearInterval(timerInterval);
      elapsedTime = totalTime;
      updateTimer(); // 타이머 업데이트 함수를 한 번 호출하여 현재 시간을 표시
      timerRunning = false;
    }
  }

  // 타이머 업데이트 함수
  function updateTimer() {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
    elapsedTime++;
  }
});

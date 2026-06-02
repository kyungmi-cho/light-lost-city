// =====================================================
// API — GAS 통신 모듈
// =====================================================

const API = {
  // 퀴즈 데이터 가져오기 (JSONP)
  fetchQuiz(level) {
    return new Promise((resolve, reject) => {
      const cbName = 'cb_' + Date.now();
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        delete window[cbName];
        document.body.removeChild(script);
        reject(new Error('Quiz fetch timeout'));
      }, 10000);

      window[cbName] = (data) => {
        clearTimeout(timeout);
        delete window[cbName];
        document.body.removeChild(script);
        if (data.success) resolve(data);
        else reject(new Error(data.error || 'Quiz fetch failed'));
      };

      script.src = `${CONFIG.API_URL}?action=quiz&level=${level}&callback=${cbName}`;
      script.onerror = () => { clearTimeout(timeout); reject(new Error('Script load error')); };
      document.body.appendChild(script);
    });
  },

  // 참여자 로그 저장
  async saveLog(data) {
    try {
      await fetch(CONFIG.API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'log', ...data })
      });
    } catch (e) {
      console.warn('Log save failed:', e);
    }
  }
};

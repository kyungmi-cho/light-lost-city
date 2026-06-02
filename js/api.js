// =====================================================
// API — GAS 통신 모듈
// =====================================================

const API = {
  // ── 1. 퀴즈 데이터 가져오기 (JSONP) ──
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

  // ── 2. 참여자 로그 저장 및 쿠폰 발급 요청 (JSONP) ──
  saveLog(data) {
    return new Promise((resolve, reject) => {
      // 게스트는 쿠폰이 필요 없으므로 기존 방식으로 가볍게 전송 후 종료
      if (data.userId === 'Guest') {
        fetch(CONFIG.API_URL, { 
          method: 'POST', 
          mode: 'no-cors', 
          body: JSON.stringify({ action: 'log', ...data }) 
        });
        resolve({ success: true, couponCode: "" });
        return;
      }

      // 일반 유저는 쿠폰 번호를 받아와야 하므로 JSONP 방식으로 요청
      const cbName = 'cb_log_' + Date.now();
      const script = document.createElement('script');
      const timeout = setTimeout(() => {
        delete window[cbName];
        document.body.removeChild(script);
        reject(new Error('Log/Coupon network timeout'));
      }, 10000);

      window[cbName] = (res) => {
        clearTimeout(timeout);
        delete window[cbName];
        document.body.removeChild(script);
        if (res.success) resolve(res);
        else reject(new Error(res.error || '발급 오류'));
      };

      // 💡 플레이 타임(playTime) 파라미터가 포함되어 서버로 전송됨
      const params = new URLSearchParams({
        action: 'log',
        userId: data.userId,
        nickname: data.nickname,
        marketing: data.marketing,
        character: data.character,
        level: data.level,
        cleared: data.cleared,
        playTime: data.playTime, 
        callback: cbName
      });

      script.src = `${CONFIG.API_URL}?${params.toString()}`;
      script.onerror = () => { clearTimeout(timeout); reject(new Error('Script connection error')); };
      document.body.appendChild(script);
    });
  }
};
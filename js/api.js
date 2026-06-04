// =====================================================
// api.js — GAS 통신 모듈 (JSONP 복구 및 모바일 타임아웃 해결)
// =====================================================

const API = {
  // ── 1. 퀴즈 데이터 가져오기 (JSONP) ──
  fetchQuiz(level) {
    return new Promise((resolve, reject) => {
      const cbName = 'cb_' + Date.now() + Math.floor(Math.random() * 1000);
      const script = document.createElement('script');

      // 💡 GAS 콜드스타트 및 모바일 네트워크 환경을 고려해 타임아웃을 30초로 늘림
      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        reject(new Error('서버 응답 지연 (타임아웃)'));
      }, 30000);

      window[cbName] = (data) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        if (data.success) resolve(data);
        else reject(new Error(data.error || '퀴즈 로딩 실패'));
      };

      script.src = `${CONFIG.API_URL}?action=quiz&level=${level}&callback=${cbName}`;
      
      script.onerror = () => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        reject(new Error('네트워크 연결 오류'));
      };

      // 💡 모바일 브라우저 최적화를 위해 body 대신 head에 삽입하여 최우선 실행
      document.head.appendChild(script);
    });
  },

  // ── 2. 참여자 로그 저장 및 쿠폰 발급 요청 (JSONP) ──
  saveLog(data) {
    return new Promise((resolve, reject) => {
      if (data.userId === 'Guest') {
        fetch(CONFIG.API_URL, { 
          method: 'POST', 
          mode: 'no-cors', 
          body: JSON.stringify({ action: 'log', ...data }) 
        }).catch(()=>{});
        resolve({ success: true, couponCode: "" });
        return;
      }

      const cbName = 'cb_log_' + Date.now() + Math.floor(Math.random() * 1000);
      const script = document.createElement('script');

      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        reject(new Error('서버 응답 지연 (타임아웃)'));
      }, 30000);

      window[cbName] = (res) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        if (res.success) resolve(res);
        else reject(new Error(res.error || '발급 오류'));
      };

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
      
      script.onerror = () => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.head.contains(script)) document.head.removeChild(script);
        reject(new Error('네트워크 연결 오류'));
      };

      document.head.appendChild(script);
    });
  }
};
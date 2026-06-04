// =====================================================
// api.js — GAS 통신 모듈 (콜드스타트 지연 및 재시도 대응 완벽 적용)
// =====================================================

const API = {
  // ── 1. 퀴즈 데이터 가져오기 (JSONP) ──
  // 💡 GAS 콜드스타트 지연을 고려해 retries(재시도) 파라미터 추가
  fetchQuiz(level, retries = 1) { 
    return new Promise((resolve, reject) => {
      const cbName = 'cb_' + Date.now();
      const script = document.createElement('script');
      
      // 💡 타임아웃을 10초(10000)에서 20초(20000)로 증가
      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.body.contains(script)) document.body.removeChild(script);
        
        // 타임아웃 발생 시 재시도 로직 발동
        if (retries > 0) {
          console.warn(`퀴즈 로딩 지연, ${retries}회 재시도합니다...`);
          resolve(this.fetchQuiz(level, retries - 1));
        } else {
          reject(new Error('Quiz fetch timeout'));
        }
      }, 20000); 

      window[cbName] = (data) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.body.contains(script)) document.body.removeChild(script);
        if (data.success) resolve(data);
        else reject(new Error(data.error || 'Quiz fetch failed'));
      };

      script.src = `${CONFIG.API_URL}?action=quiz&level=${level}&callback=${cbName}`;
      
      script.onerror = () => { 
        clearTimeout(timeout); 
        if (document.body.contains(script)) document.body.removeChild(script);
        if (retries > 0) resolve(this.fetchQuiz(level, retries - 1));
        else reject(new Error('Script load error')); 
      };
      
      document.body.appendChild(script);
    });
  },

  // ── 2. 참여자 로그 저장 및 쿠폰 발급 요청 (JSONP) ──
  saveLog(data, retries = 1) {
    return new Promise((resolve, reject) => {
      if (data.userId === 'Guest') {
        fetch(CONFIG.API_URL, { 
          method: 'POST', 
          mode: 'no-cors', 
          body: JSON.stringify({ action: 'log', ...data }) 
        });
        resolve({ success: true, couponCode: "" });
        return;
      }

      const cbName = 'cb_log_' + Date.now();
      const script = document.createElement('script');
      
      // 💡 저장/쿠폰 발급도 동일하게 20초 대기
      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.body.contains(script)) document.body.removeChild(script);
        
        if (retries > 0) resolve(this.saveLog(data, retries - 1));
        else reject(new Error('Log/Coupon network timeout'));
      }, 20000);

      window[cbName] = (res) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.body.contains(script)) document.body.removeChild(script);
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
        if (document.body.contains(script)) document.body.removeChild(script);
        if (retries > 0) resolve(this.saveLog(data, retries - 1));
        else reject(new Error('Script connection error')); 
      };
      
      document.body.appendChild(script);
    });
  }
};
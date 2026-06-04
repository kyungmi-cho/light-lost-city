// =====================================================
// api.js — GAS 통신 모듈 (단일 요청, 30초 대기)
// =====================================================

const API = {
  fetchQuiz(level) {
    return new Promise((resolve, reject) => {
      // 💡 콜백 이름 중복 방지를 위해 랜덤 난수 추가
      const cbName = 'cb_quiz_' + Date.now() + Math.floor(Math.random() * 1000);
      const script = document.createElement('script');
      
      // 💡 GAS가 깨어날 수 있도록 넉넉히 30초 부여
      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.body.contains(script)) script.remove();
        reject(new Error('서버 응답 지연 (다시 시도해주세요)'));
      }, 30000); 

      window[cbName] = (data) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.body.contains(script)) script.remove();
        if (data.success) resolve(data);
        else reject(new Error(data.error || 'Quiz fetch failed'));
      };

      script.src = `${CONFIG.API_URL}?action=quiz&level=${level}&callback=${cbName}`;
      
      script.onerror = () => { 
        clearTimeout(timeout); 
        if (document.body.contains(script)) script.remove();
        reject(new Error('네트워크 오류')); 
      };
      
      document.body.appendChild(script);
    });
  },

  saveLog(data) {
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

      const cbName = 'cb_log_' + Date.now() + Math.floor(Math.random() * 1000);
      const script = document.createElement('script');
      
      const timeout = setTimeout(() => {
        delete window[cbName];
        if (document.body.contains(script)) script.remove();
        reject(new Error('서버 응답 지연'));
      }, 30000);

      window[cbName] = (res) => {
        clearTimeout(timeout);
        delete window[cbName];
        if (document.body.contains(script)) script.remove();
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
        if (document.body.contains(script)) script.remove();
        reject(new Error('네트워크 오류')); 
      };
      
      document.body.appendChild(script);
    });
  }
};
/* =========================================================
   screens.js — 신규 통합 계정 전환 5단계 흐름 마크업 SSOT
   메인 디자인: 실서비스(One ID) 스타일. Pleos Connect 토큰으로 구현(서브).
   SCREENS[step](state) => htmlString. 같은 HTML을 웹/앱 프레임에 동시 주입.
   모든 버튼은 data-action, 토글 행은 data-acc/data-consent로 동작한다(showcase.js가 처리).
   state = { step, theme, loading, error, dir,
             consents:{terms,privacy}, marketing, timerSec, warn }
   ========================================================= */
(function () {
  "use strict";

  function brand() {
    return (
      '<header class="oneid__brand"><b>HYUNDAI MOTOR GROUP ONE ID</b>' +
      '<span><em>Pleos</em> Account</span></header>'
    );
  }

  function dots(step) {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      if (i === step) out += '<span class="oneid__dot oneid__dot--now">' + i + "</span>";
      else out += '<span class="oneid__dot' + (i < step ? " oneid__dot--done" : "") + '"></span>';
    }
    return '<div class="oneid__dots">' + out + "</div>";
  }

  function overlay(state) {
    return state.loading
      ? '<div class="oneid__overlay"><span class="loading loading--tension"><span class="spinner"></span></span></div>'
      : "";
  }

  function shell(step, state, main) {
    var anim = state.dir === "fwd" ? " anim-fwd" : state.dir === "back" ? " anim-back" : "";
    return (
      '<div class="oneid">' +
      brand() +
      '<div class="oneid__scroll">' +
      dots(step) +
      '<div class="oneid__content' + anim + '">' + main + "</div>" +
      "</div>" +
      overlay(state) +
      "</div>"
    );
  }

  function fmtTimer(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* ---- STEP 1 · 전환 안내 ---- */
  function step1(state) {
    var main =
      '<h2 class="oneid__title">하나의 계정으로,<br />모든 그룹 서비스</h2>' +
      '<div class="oneid__links"><span data-action="info">Pleos 계정 알아보기</span><i>|</i><span data-action="info">Pleos 계정 전환 방법</span></div>' +
      '<div class="oneid__pleos"><em>Pleos</em></div>' +
      '<div class="oneid__notice oneid__notice--fill">2027.1.25 까지 미전환 시<br />기존 계정 로그인 불가</div>' +
      '<p class="oneid__caption">혜택과 자산은 그대로 유지됩니다</p>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--filled btn--block" data-action="start">지금 전환하기 ( 약 1분 )</button>' +
      '<button class="btn btn--outline btn--block" data-action="later">다음에 하기 — 계속 이용</button>' +
      "</div>";
    return shell(1, state, main);
  }

  /* ---- STEP 2 · 이메일 인증 ---- */
  function step2(state) {
    var main =
      '<h2 class="oneid__title">이메일 인증</h2>' +
      '<p class="oneid__desc">Pleos 계정에 사용할<br />이메일을 인증해 주세요</p>' +
      '<div class="oneid__field oneid__inline">' +
      '<input class="field__input" value="jiho@email.com" />' +
      '<button class="btn btn--outline oneid__send" data-action="send">전송</button>' +
      "</div>" +
      '<div class="oneid__field oneid__inline' + (state.error ? " is-shake" : "") + '">' +
      '<input class="field__input' + (state.error ? " is-invalid" : "") + '" placeholder="인증번호 6자리 입력" inputmode="numeric" />' +
      '<span class="oneid__timer">' + fmtTimer(state.timerSec) + "</span>" +
      "</div>" +
      (state.error
        ? '<p class="oneid__error">인증번호가 올바르지 않습니다. 다시 확인해 주세요.</p>'
        : "") +
      '<p class="oneid__caption oneid__caption--left">인증번호 전송은 하루 5회까지 가능합니다</p>' +
      '<div class="oneid__notice">✓ 인증한 이메일이<br /><b>Pleos 계정 ID 가 됩니다</b></div>' +
      '<p class="oneid__caption" data-action="info">개인정보 처리 안내 보기 →</p>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--filled btn--block" data-action="verify">확인</button>' +
      '<button class="btn btn--outline btn--block" data-action="back">이전</button>' +
      "</div>";
    return shell(2, state, main);
  }

  /* ---- STEP 3 · 계정 확인 · 병합 (인증 이메일 기준 자동 조회 — 선택 아님) ---- */
  function step3(state) {
    function acct(mark, name, sub) {
      return (
        '<div class="oneid__acct oneid__acct--static">' +
        '<span class="oneid__mark">' + mark + "</span>" +
        '<span class="oneid__acct-meta"><span class="oneid__acct-name">' + name + "</span>" +
        '<span class="oneid__acct-sub">' + sub + "</span></span>" +
        '<span class="oneid__check">✓</span>' +
        "</div>"
      );
    }
    var main =
      '<h2 class="oneid__title">박지호님의 계정<br />3 개를 찾았어요</h2>' +
      '<div class="oneid__acct-list">' +
      acct("H", "마이현대", "차량 1 · 32,000P") +
      acct("K", "Kia App", "구독 1건") +
      acct("G", "MY GENESIS", "이용 이력") +
      "</div>" +
      '<p class="oneid__caption">인증 이메일 기준 보유 계정 자동 조회</p>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--filled btn--block" data-action="merge">하나로 합치기</button>' +
      '<button class="btn btn--outline btn--block" data-action="back">이전</button>' +
      "</div>";
    return shell(3, state, main);
  }

  /* ---- STEP 4 · 동의 (국가별 자동 분기 — 목업은 KR 화면) ---- */
  function step4(state) {
    function row(key, tag, label, checked) {
      var warn = state.warn && tag === "필수" && !checked ? " oneid__consent--warn" : "";
      return (
        '<div class="oneid__consent' + warn + '" data-consent="' + key + '">' +
        '<span class="oneid__consent-label">[ ' + tag + " ] " + label + "</span>" +
        (checked ? '<span class="oneid__check">✓</span>' : '<span class="oneid__radio"></span>') +
        "</div>"
      );
    }
    var main =
      '<div class="oneid__region-wrap"><span class="oneid__region">KR</span></div>' +
      '<h2 class="oneid__title oneid__title--left">약관 및 동의</h2>' +
      '<div class="oneid__consent-list">' +
      row("terms", "필수", "통합 계정 약관", state.consents.terms) +
      row("privacy", "필수", "개인정보 수집 · 이용", state.consents.privacy) +
      row("marketing", "선택", "마케팅 수신", state.marketing) +
      "</div>" +
      '<div class="oneid__notice">EU: GDPR 재동의 · 中: 국외이전<br />단독동의로 자동 분기</div>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--filled btn--block" data-action="agree">동의하고 계속</button>' +
      '<button class="btn btn--outline btn--block" data-action="back">이전</button>' +
      "</div>";
    return shell(4, state, main);
  }

  /* ---- STEP 5 · 완료 ---- */
  function step5(state) {
    var main =
      '<div class="oneid__done-circle">✓</div>' +
      '<h2 class="oneid__title">전환 완료 !</h2>' +
      '<p class="oneid__desc">자산 3 종 승계 완료<br />모든 서비스 바로 이용</p>' +
      '<div class="oneid__bubble">2027.1.25 까지 전환하지 않으면<br />기존 계정을 쓸 수 없어요 !</div>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--outline btn--block" data-action="share">카카오톡으로 공유하기</button>' +
      '<button class="btn btn--filled btn--block" data-action="finish">시작하기</button>' +
      "</div>";
    return shell(5, state, main);
  }

  window.SCREENS = { 1: step1, 2: step2, 3: step3, 4: step4, 5: step5 };
})();

/* =========================================================
   screens.js — 신규 통합 계정 전환 5단계 흐름 마크업 SSOT
   메인 디자인: 실서비스(One ID) 스타일 — 화이트 배경 · 블랙 버튼 ·
   중앙 정렬 · 숫자 도트 인디케이터. Pleos Connect 토큰으로 구현(서브).
   SCREENS[step](state) => htmlString. 같은 HTML을 웹/앱 프레임에 동시 주입.
   웹 = 모바일을 옆으로 늘려 가운데 정렬(@container, showcase.css).
   state = { step(1~5), theme, loading, error, region(KR|EU|CN) }
   ========================================================= */
(function () {
  "use strict";

  /* 상단 브랜드 헤더 */
  function brand() {
    return (
      '<header class="oneid__brand"><b>HYUNDAI MOTOR GROUP ONE ID</b>' +
      '<span><em>Pleos</em> Account</span></header>'
    );
  }

  /* 도트 인디케이터 — 현재 단계는 숫자 블랙 서클 */
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
    return (
      '<div class="oneid">' +
      brand() +
      '<div class="oneid__scroll">' +
      dots(step) +
      '<div class="oneid__content">' + main + "</div>" +
      "</div>" +
      overlay(state) +
      "</div>"
    );
  }

  /* ---- STEP 1 · 전환 안내 ---- */
  function step1(state) {
    var main =
      '<h2 class="oneid__title">하나의 계정으로,<br />모든 그룹 서비스</h2>' +
      '<div class="oneid__links"><span>Pleos 계정 알아보기</span><i>|</i><span>Pleos 계정 전환 방법</span></div>' +
      '<div class="oneid__pleos"><em>Pleos</em></div>' +
      '<div class="oneid__notice oneid__notice--fill">⚠ 2027.1.25 까지 미전환 시<br />기존 계정 로그인 불가</div>' +
      '<p class="oneid__caption">혜택과 자산은 그대로 유지됩니다</p>' +
      '<div class="oneid__actions">' +
      '<button class="btn btn--filled btn--block">지금 전환하기 ( 약 1분 )</button>' +
      '<button class="btn btn--outline btn--block">다음에 하기 — 계속 이용</button>' +
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
      '<button class="btn btn--outline oneid__send">전송</button>' +
      "</div>" +
      '<div class="oneid__field oneid__inline">' +
      '<input class="field__input" placeholder="인증번호 6자리 입력" inputmode="numeric" />' +
      '<span class="oneid__timer">9:58</span>' +
      "</div>" +
      (state.error
        ? '<p class="oneid__error">인증번호가 올바르지 않습니다. 다시 확인해 주세요.</p>'
        : "") +
      '<p class="oneid__caption oneid__caption--left">인증번호 전송은 하루 5회까지 가능합니다</p>' +
      '<div class="oneid__notice">✓ 인증한 이메일이<br /><b>Pleos 계정 ID 가 됩니다</b></div>' +
      '<p class="oneid__caption">개인정보 처리 안내 보기 →</p>' +
      '<div class="oneid__actions"><button class="btn btn--filled btn--block">확인</button></div>';
    return shell(2, state, main);
  }

  /* ---- STEP 3 · 계정 확인 · 병합 ---- */
  function step3(state) {
    function acct(mark, name, sub) {
      return (
        '<div class="oneid__acct">' +
        '<span class="oneid__mark">' + mark + "</span>" +
        '<span class="oneid__acct-meta"><span class="oneid__acct-name">' + name + "</span>" +
        '<span class="oneid__acct-sub">' + sub + "</span></span>" +
        '<span class="oneid__check">✓</span></div>'
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
      '<div class="oneid__actions"><button class="btn btn--filled btn--block">하나로 합치기</button></div>';
    return shell(3, state, main);
  }

  /* ---- STEP 4 · 동의 (국가별) ---- */
  function step4(state) {
    var region = state.region || "KR";
    function row(tag, label, optional) {
      return (
        '<div class="oneid__consent"><span class="oneid__consent-label">[ ' + tag + " ] " + label + "</span>" +
        (optional
          ? '<span class="oneid__radio"></span>'
          : '<span class="oneid__check">✓</span>') +
        "</div>"
      );
    }
    var extra = "";
    var noticeText = "EU: GDPR 재동의 · 中: 국외이전<br />단독동의로 자동 분기";
    if (region === "EU") {
      extra = row("필수", "GDPR 데이터 처리 재동의");
      noticeText = "EU 지역: GDPR 재동의 항목이<br />추가로 표시됩니다";
    } else if (region === "CN") {
      extra = row("필수", "개인정보 국외이전 단독동의");
      noticeText = "중국 지역: 국외이전 단독동의가<br />별도 단계로 표시됩니다";
    }
    var badge = { KR: "🇰🇷 KR", EU: "🇪🇺 EU", CN: "🇨🇳 CN" }[region];
    var main =
      '<div class="oneid__region-wrap"><span class="oneid__region">' + badge + "</span></div>" +
      '<h2 class="oneid__title oneid__title--left">약관 및 동의</h2>' +
      '<div class="oneid__consent-list">' +
      row("필수", "통합 계정 약관") +
      row("필수", "개인정보 수집 · 이용") +
      extra +
      row("선택", "마케팅 수신", true) +
      "</div>" +
      '<div class="oneid__notice">' + noticeText + "</div>" +
      '<div class="oneid__actions"><button class="btn btn--filled btn--block">동의하고 계속</button></div>';
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
      '<button class="btn btn--outline btn--block">카카오톡으로 공유하기</button>' +
      '<button class="btn btn--filled btn--block">시작하기</button>' +
      "</div>";
    return shell(5, state, main);
  }

  window.SCREENS = { 1: step1, 2: step2, 3: step3, 4: step4, 5: step5 };
})();

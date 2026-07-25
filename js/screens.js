/* =========================================================
   screens.js — 신규 통합 계정 전환 4단계 흐름 마크업 SSOT
   SCREENS[step](state) => htmlString. 같은 HTML을 웹/앱 프레임에 동시 주입.
   레이아웃 차이는 showcase.css의 @container 규칙이 담당.
   state = { step, theme, loading, error, selectedAccount, toast }
   ========================================================= */
(function () {
  "use strict";

  var STEPS = [
    { t: "본인 확인", s: "휴대폰 번호로 본인을 인증합니다" },
    { t: "전환할 계정 선택", s: "통합할 기존 계정을 고릅니다" },
    { t: "통합 정보 확인", s: "전환될 정보를 최종 확인합니다" },
    { t: "전환 완료", s: "통합 계정 사용을 시작합니다" },
  ];

  var ACCOUNTS = {
    personal: { icon: "🙂", name: "개인 계정", id: "user****@email.com" },
    work: { icon: "💼", name: "업무용 계정", id: "work****@company.com" },
  };

  /* 상단 내비 (Depth) */
  function nav(step) {
    return (
      '<nav class="pagenav mig__nav">' +
      '<span class="pagenav__back">‹</span>' +
      '<span class="pagenav__titles"><span class="pagenav__title">통합 계정 전환</span>' +
      '<span class="pagenav__subtitle">' + step + " / 4 단계</span></span>" +
      '<span class="pagenav__suffix">⋯</span>' +
      "</nav>"
    );
  }

  /* 단계 레일 (웹=세로 스텝, 앱=상단 인디케이터) */
  function rail(step) {
    var dots = "";
    for (var i = 1; i <= 4; i++) {
      dots +=
        '<span class="indicator__dot' + (i <= step ? " indicator__dot--active" : "") + '"></span>';
    }
    var items = STEPS.map(function (s, i) {
      var n = i + 1;
      var cls = n === step ? " steps__item--active" : "";
      return (
        '<li class="steps__item' + cls + '">' +
        '<span class="steps__num">' + (n < step ? "✓" : n) + "</span>" +
        '<span class="steps__body"><span class="steps__label">' + s.t + "</span>" +
        '<span class="steps__sub">' + s.s + "</span></span></li>"
      );
    }).join("");
    return (
      '<aside class="mig__aside">' +
      '<span class="indicator indicator--wide mig__dots">' + dots + "</span>" +
      '<ol class="steps mig__steps">' + items + "</ol>" +
      "</aside>"
    );
  }

  /* 하단 액션 */
  function actions(label, opts) {
    opts = opts || {};
    var helper = opts.helper
      ? '<p class="helper-text">' + opts.helper + "</p>"
      : "";
    var back = opts.back
      ? '<button class="btn btn--basic">이전</button>'
      : "";
    return (
      '<div class="actionbar mig__actions">' +
      '<div class="mig__actions-row">' + back +
      '<button class="btn btn--filled btn--block">' + label + "</button></div>" +
      helper +
      "</div>"
    );
  }

  function overlay(state) {
    return state.loading
      ? '<div class="mig__overlay"><span class="loading loading--tension"><span class="spinner"></span></span></div>'
      : "";
  }

  function shell(step, state, mainHtml) {
    return (
      '<div class="mig">' +
      nav(step) +
      '<div class="mig__body">' +
      rail(step) +
      '<div class="mig__main">' + mainHtml + "</div>" +
      "</div>" +
      overlay(state) +
      "</div>"
    );
  }

  /* ---- Step 1: 본인 확인 ---- */
  function step1(state) {
    var errCls = state.error ? " is-error" : "";
    var main =
      '<div class="mig__head"><h2 class="mig__title">본인 확인</h2>' +
      '<p class="mig__desc">전환을 위해 본인 인증이 필요합니다.</p></div>' +
      '<div class="field"><label class="field__label">통신사</label>' +
      '<div class="dropdown"><button class="dropdown__trigger">' +
      '<span class="dropdown__label">SKT</span><span class="dropdown__suffix">▾</span></button>' +
      '<div class="dropdown__container"><div class="dropdown__item dropdown__item--selected">SKT</div>' +
      '<div class="dropdown__item">KT</div><div class="dropdown__item">LG U+</div></div></div></div>' +
      '<div class="field"><label class="field__label">이름</label>' +
      '<input class="field__input" placeholder="이름을 입력하세요" /></div>' +
      '<div class="field' + errCls + '"><label class="field__label">휴대폰 번호</label>' +
      '<div class="mig__inline"><input class="field__input" placeholder="010-0000-0000" inputmode="numeric" />' +
      '<button class="btn btn--basic btn--sm">인증요청</button></div>' +
      (state.error
        ? '<p class="field__error">인증번호가 올바르지 않습니다.</p>'
        : "") +
      "</div>" +
      actions("다음", { helper: "전환 후에도 기존 데이터는 그대로 유지됩니다." });
    return shell(1, state, main);
  }

  /* ---- Step 2: 계정 선택 ---- */
  function step2(state) {
    function accRow(key) {
      var a = ACCOUNTS[key];
      var sel = state.selectedAccount === key ? " account--selected" : "";
      return (
        '<label class="account' + sel + '" data-account="' + key + '">' +
        '<span class="account__avatar">' + a.icon + "</span>" +
        '<span class="account__meta"><span class="account__name">' + a.name + "</span>" +
        '<span class="account__id">' + a.id + "</span></span>" +
        '<span class="account__radio"></span></label>'
      );
    }
    var main =
      '<div class="mig__head"><h2 class="mig__title">전환할 계정 선택</h2>' +
      '<p class="mig__desc">선택한 계정이 통합 계정으로 전환됩니다.</p></div>' +
      '<div class="tabs tabs--box tabs--fitted mig__filter"><div class="tabs__list">' +
      '<button class="tabs__tab tabs__tab--selected">전체</button>' +
      '<button class="tabs__tab">개인</button>' +
      '<button class="tabs__tab">업무</button></div></div>' +
      '<div class="account-list">' + accRow("personal") + accRow("work") + "</div>" +
      actions("다음", { back: true });
    return shell(2, state, main);
  }

  /* ---- Step 3: 정보 확인 ---- */
  function step3(state) {
    var a = ACCOUNTS[state.selectedAccount] || ACCOUNTS.personal;
    var main =
      '<div class="mig__head"><h2 class="mig__title">통합 정보 확인</h2>' +
      '<p class="mig__desc">아래 정보로 통합 계정이 생성됩니다.</p></div>' +
      '<div class="widget mig__summary"><div class="widget__info">' +
      '<div class="mig__kv"><span>전환 대상</span><b>' + a.name + "</b></div>" +
      '<div class="mig__kv"><span>기존 계정</span><b>' + a.id + "</b></div>" +
      '<div class="mig__kv"><span>통합 계정 ID</span><b>one****@myservice.com</b></div>' +
      "</div></div>" +
      '<label class="mig__agree"><span class="switch"><span class="switch__knob"></span></span>' +
      "<span>통합 약관 및 개인정보 이전에 동의합니다.</span></label>" +
      actions("전환하기", { back: true });
    return shell(3, state, main);
  }

  /* ---- Step 4: 완료 ---- */
  function step4(state) {
    var main =
      '<div class="mig__done">' +
      '<div class="mig__done-check">✓</div>' +
      '<h2 class="mig__title">전환이 완료됐어요</h2>' +
      '<p class="mig__desc">이제 통합 계정 하나로 모든 서비스를 이용할 수 있어요.</p>' +
      '<div class="sysnoti sysnoti--appicon mig__done-noti"><span class="sysnoti__imagery">🔐</span>' +
      '<div class="sysnoti__body"><p class="sysnoti__title">통합 계정 준비 완료</p>' +
      '<p class="sysnoti__desc">one****@myservice.com</p>' +
      '<div class="sysnoti__actions sysnoti__actions--single"><button class="btn btn--filled btn--sm btn--block">시작하기</button></div>' +
      "</div></div></div>" +
      '<div class="actionbar mig__actions"><div class="mig__actions-row">' +
      '<button class="btn btn--filled btn--block">홈으로</button></div></div>';
    return shell(4, state, main);
  }

  window.SCREENS = { 1: step1, 2: step2, 3: step3, 4: step4 };
})();

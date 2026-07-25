/* =========================================================
   showcase.js — 시나리오 리모컨 + 웹/앱 동시 라이브 렌더 + 인터랙션
   단일 상태(scenario)를 두 프레임에 같은 HTML로 주입.
   목업 내부 버튼(data-action)·토글(data-acc/data-consent)도 같은 상태를
   갱신하므로, 화면에서 이동해도 왼쪽 리모컨이 자동 동기화된다.
   ========================================================= */
(function () {
  "use strict";

  var TIMER_MAX = 598; // 9:58

  var scenario = {
    step: 1, // 1 안내 · 2 이메일 인증 · 3 계정 확인·병합 · 4 동의 · 5 완료
    theme: "light",
    env: "web", // 캔버스에 표시할 환경: web | app
    loading: false,
    error: false,
    dir: "", // 단계 전환 애니메이션 방향 (fwd/back), 렌더 후 소거
    toast: null, // {msg, variant} — 디바이스 화면 안에서 표시
    consents: { terms: true, privacy: true },
    marketing: false,
    warn: false, // 필수 동의 미체크 강조
    timerSec: TIMER_MAX,
  };

  var appFrame = document.getElementById("frame-app");
  var webFrame = document.getElementById("frame-web");
  var remoteEl = document.getElementById("remote");
  var stageEl = document.querySelector(".stage");

  /* 화면 안 토스트 — 상태로 렌더하고 일정 시간 후 소거 */
  var toastTimer = null;
  function toast(msg, variant) {
    scenario.toast = { msg: msg, variant: variant || "" };
    clearTimeout(toastTimer);
    render();
    toastTimer = setTimeout(function () {
      scenario.toast = null;
      render();
    }, 2400);
  }

  /* ---- 상태 전이 헬퍼 ---- */
  var loadingTimer = null;
  function setStep(n) {
    clearTimeout(loadingTimer); // 보류 중인 로딩 콜백이 이후 단계를 덮어쓰지 않도록
    scenario.dir = n > scenario.step ? "fwd" : n < scenario.step ? "back" : "";
    scenario.step = n;
    scenario.loading = false;
    scenario.error = false;
    scenario.warn = false;
  }
  function withLoading(ms, done) {
    clearTimeout(loadingTimer);
    scenario.loading = true;
    render();
    loadingTimer = setTimeout(function () {
      scenario.loading = false;
      done();
      render();
    }, ms);
  }

  /* ---- 리모컨 ---- */
  var GROUPS = [
    {
      label: "단계",
      items: [1, 2, 3, 4, 5]
        .map(function (n) {
          return {
            t: "S" + n,
            act: function () { setStep(n); },
            on: function (s) { return s.step === n; },
          };
        })
        .concat([
          { t: "‹", act: function () { setStep(Math.max(1, scenario.step - 1)); }, on: function () { return false; } },
          { t: "›", act: function () { setStep(Math.min(5, scenario.step + 1)); }, on: function () { return false; } },
        ]),
    },
    {
      label: "상태",
      items: [
        { t: "로딩", act: function (s) { s.loading = !s.loading; }, on: function (s) { return s.loading; } },
        { t: "에러", act: function (s) { s.error = !s.error; if (s.error) toast("인증에 실패했습니다.", "danger"); }, on: function (s) { return s.error; } },
        { t: "토스트", act: function () { toast("인증번호를 발송했습니다."); }, on: function () { return false; } },
      ],
    },
    {
      label: "테마",
      items: [
        { t: "라이트", act: function (s) { s.theme = "light"; }, on: function (s) { return s.theme === "light"; } },
        { t: "다크", act: function (s) { s.theme = "dark"; }, on: function (s) { return s.theme === "dark"; } },
      ],
    },
    {
      label: "환경",
      items: [
        { t: "Web", act: function (s) { s.env = "web"; }, on: function (s) { return s.env === "web"; } },
        { t: "App", act: function (s) { s.env = "app"; }, on: function (s) { return s.env === "app"; } },
      ],
    },
  ];

  var buttonRefs = [];

  var previewLink = null;
  function buildRemote() {
    GROUPS.forEach(function (group) {
      var lbl = document.createElement("div");
      lbl.className = "remote__group";
      lbl.textContent = group.label;
      remoteEl.appendChild(lbl);
      group.items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.className = "remote-btn";
        btn.type = "button";
        btn.textContent = item.t;
        btn.title = item.t;
        btn.addEventListener("click", function () {
          item.act(scenario);
          render();
        });
        remoteEl.appendChild(btn);
        buttonRefs.push({ el: btn, on: item.on });
      });
    });
    // 미리보기 — 현재 단계/환경/테마 그대로 캔버스 내용만 새 탭에서
    previewLink = document.createElement("a");
    previewLink.className = "remote-link";
    previewLink.textContent = "미리보기 ↗";
    previewLink.target = "_blank";
    previewLink.rel = "noopener";
    remoteEl.appendChild(previewLink);
  }

  function refreshRemote() {
    buttonRefs.forEach(function (r) {
      r.el.classList.toggle("active", !!r.on(scenario));
    });
  }

  /* ---- 렌더 ---- */
  function render() {
    var html = window.SCREENS[scenario.step](scenario);
    appFrame.innerHTML = html;
    webFrame.innerHTML = html;
    stageEl.setAttribute("data-env", scenario.env); // 캔버스에는 선택한 환경만 표시
    document.documentElement.setAttribute("data-theme", scenario.theme);
    refreshRemote();
    if (previewLink) {
      previewLink.href =
        "showcase.html?preview=1&step=" + scenario.step +
        "&env=" + scenario.env + "&theme=" + scenario.theme;
    }
    scenario.dir = ""; // 전환 애니메이션은 1회만
  }

  /* ---- 목업 내부 인터랙션 (data-action / data-acc / data-consent) ---- */
  var ACTIONS = {
    start: function () { withLoading(600, function () { setStep(2); }); },
    later: function () { toast("다음에 다시 안내해 드릴게요."); },
    info: function () { toast("상세 안내 페이지로 이동합니다. (목업)"); },
    back: function () { setStep(Math.max(1, scenario.step - 1)); render(); },
    send: function () {
      scenario.timerSec = TIMER_MAX;
      scenario.error = false;
      toast("인증번호를 발송했습니다.");
      render();
    },
    verify: function () {
      if (scenario.error) {
        toast("인증번호를 다시 확인해 주세요.", "danger");
        render(); // is-shake 재생
        return;
      }
      withLoading(500, function () { setStep(3); });
    },
    merge: function () { withLoading(800, function () { setStep(4); }); },
    agree: function () {
      var ok = scenario.consents.terms && scenario.consents.privacy;
      if (!ok) {
        scenario.warn = true;
        toast("필수 항목에 동의해 주세요.", "danger");
        render();
        return;
      }
      withLoading(600, function () { setStep(5); });
    },
    share: function () { toast("카카오톡 공유 화면을 여는 목업입니다."); },
    finish: function () { toast("통합 계정으로 서비스를 시작합니다!"); },
  };

  function wireFrames() {
    [appFrame, webFrame].forEach(function (frame) {
      frame.addEventListener("click", function (e) {
        var actEl = e.target.closest("[data-action]");
        if (actEl && frame.contains(actEl)) {
          var fn = ACTIONS[actEl.dataset.action];
          if (fn && !actEl.disabled) fn();
          return;
        }
        var dot = e.target.closest("[data-goto]");
        if (dot) {
          var n = parseInt(dot.dataset.goto, 10);
          if (n !== scenario.step) {
            setStep(n);
            render();
          }
          return;
        }
        var con = e.target.closest("[data-consent]");
        if (con) {
          var key = con.dataset.consent;
          if (key === "marketing") scenario.marketing = !scenario.marketing;
          else scenario.consents[key] = !scenario.consents[key];
          if (scenario.consents.terms && scenario.consents.privacy) {
            scenario.warn = false; // 필수가 모두 채워지면 경고 해제
          }
          render();
        }
      });
    });
  }

  /* ---- 인증 타이머 (step 2에서만 카운트다운, 재렌더 없이 텍스트만 갱신) ---- */
  setInterval(function () {
    if (scenario.step !== 2 || scenario.loading || scenario.timerSec <= 0) return;
    scenario.timerSec--;
    var m = Math.floor(scenario.timerSec / 60);
    var s = scenario.timerSec % 60;
    var txt = m + ":" + (s < 10 ? "0" : "") + s;
    document.querySelectorAll(".oneid__timer").forEach(function (el) {
      el.textContent = txt;
    });
  }, 1000);

  /* ---- init — 기본 테마는 라이트, URL 파라미터로 프리뷰/상태 복원 ---- */
  var params = new URLSearchParams(location.search);
  if (params.get("step")) scenario.step = Math.min(5, Math.max(1, parseInt(params.get("step"), 10) || 1));
  if (params.get("env") === "app" || params.get("env") === "web") scenario.env = params.get("env");
  if (params.get("theme") === "dark") scenario.theme = "dark";
  if (params.get("preview") === "1") {
    document.querySelector(".showcase").classList.add("showcase--preview");
  }
  buildRemote();
  wireFrames();
  render();
})();

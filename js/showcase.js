/* =========================================================
   showcase.js — 시나리오 리모컨 + 웹/앱 동시 라이브 렌더
   단일 상태(scenario)를 두 프레임에 같은 HTML로 주입. 테마는 전역 토글.
   ========================================================= */
(function () {
  "use strict";

  var scenario = {
    step: 1, // 1 전환 안내 · 2 이메일 인증 · 3 계정 확인·병합 · 4 동의(국가별) · 5 완료
    theme: "light",
    loading: false,
    error: false,
    region: "KR",
  };

  var appFrame = document.getElementById("frame-app");
  var webFrame = document.getElementById("frame-web");
  var remoteEl = document.getElementById("remote");

  function toast(msg, variant) {
    if (window.UI) window.UI.showToast(msg, variant);
  }

  /* 리모컨 시나리오 정의 */
  var GROUPS = [
    {
      label: "단계",
      items: [
        { t: "S1", act: function (s) { s.step = 1; s.loading = false; s.error = false; }, on: function (s) { return s.step === 1; } },
        { t: "S2", act: function (s) { s.step = 2; s.loading = false; s.error = false; }, on: function (s) { return s.step === 2; } },
        { t: "S3", act: function (s) { s.step = 3; s.loading = false; s.error = false; }, on: function (s) { return s.step === 3; } },
        { t: "S4", act: function (s) { s.step = 4; s.loading = false; s.error = false; }, on: function (s) { return s.step === 4; } },
        { t: "S5", act: function (s) { s.step = 5; s.loading = false; s.error = false; }, on: function (s) { return s.step === 5; } },
        { t: "‹", act: function (s) { s.step = Math.max(1, s.step - 1); }, on: function () { return false; } },
        { t: "›", act: function (s) { s.step = Math.min(5, s.step + 1); }, on: function () { return false; } },
      ],
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
      label: "국가",
      items: [
        { t: "KR", act: function (s) { s.region = "KR"; }, on: function (s) { return s.region === "KR"; } },
        { t: "EU", act: function (s) { s.region = "EU"; }, on: function (s) { return s.region === "EU"; } },
        { t: "中", act: function (s) { s.region = "CN"; }, on: function (s) { return s.region === "CN"; } },
      ],
    },
    {
      label: "테마",
      items: [
        { t: "라이트", act: function (s) { s.theme = "light"; }, on: function (s) { return s.theme === "light"; } },
        { t: "다크", act: function (s) { s.theme = "dark"; }, on: function (s) { return s.theme === "dark"; } },
      ],
    },
  ];

  var buttonRefs = []; // {el, on}

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
  }

  function refreshRemote() {
    buttonRefs.forEach(function (r) {
      r.el.classList.toggle("active", !!r.on(scenario));
    });
  }

  function render() {
    var html = window.SCREENS[scenario.step](scenario);
    appFrame.innerHTML = html;
    webFrame.innerHTML = html;
    document.documentElement.setAttribute("data-theme", scenario.theme);
    refreshRemote();
  }

  /* init */
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  scenario.theme = mq && mq.matches ? "dark" : "light";
  buildRemote();
  render();
})();

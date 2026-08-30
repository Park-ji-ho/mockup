/* =========================================================
   dd-showcase.js — 다음 DD 에이전트 시나리오 리모컨 + 웹/앱 동시 렌더
   단일 상태(scenario)를 두 프레임에 같은 HTML로 주입한다.
   화면 안 버튼(data-action)도 같은 상태를 갱신하므로 리모컨이 자동 동기화된다.
   ========================================================= */
(function () {
  "use strict";

  var UNDO_MAX = 27; // 실행 취소 카운트다운(초) — 기획서 A2/슬라이드 카피
  var STEP_MAX = 9;
  var STEP_TITLES = ["홈·브리핑", "선톡 알림", "대화 요약", "실행·실행취소", "연동 권한", "발송 확인", "음성 대화", "루틴 제안", "루틴 탭"];

  /* 가이드 투어 — 검정 딤 + 스포트라이트 + 설명 카드로 9단계 핵심을 순서대로 안내 */
  var GUIDE = [
    { step: 1, sel: ".dd__brief", title: "오늘의 브리핑", text: "검색하지 않아도 오늘 필요한 것이 먼저 와 있어요. 탭하면 그대로 대화로 이어져요." },
    { step: 1, sel: ".dd__fab", title: "DD 호출", text: "어느 화면에서든 보던 맥락을 그대로 물고 DD를 부릅니다." },
    { step: 2, sel: ".dd__noti", title: "먼저 말 거는 선톡", text: "묻지 않아도 챙길 것을 먼저 알려요. 알림마다 끄는 진입점이 있고, 광고는 채널이 분리됩니다." },
    { step: 3, sel: ".dd__toolrun", title: "도구 실행 과정", text: "DD가 어떤 도구(MCP)를 호출해 처리했는지 실행 로그로 그대로 보여줘요." },
    { step: 3, sel: ".dd__chip--suggest", title: "대화로 실행", text: "제안 칩을 누르거나 아래 입력창에 직접 시킬 수 있어요." },
    { step: 4, sel: ".dd__chip--undo", title: "실행 취소", text: "되돌릴 수 있는 실행에는 27초 실행 취소가 붙어요." },
    { step: 5, sel: ".dd__perm", title: "최소 권한 연동", text: "그 작업에 필요한 권한만 요청하고, 언제든 해제할 수 있어요." },
    { step: 6, sel: ".dd__confirm", title: "발송 확인", text: "되돌릴 수 없는 일은 수신자와 내용을 화면으로 확인하고 탭해야만 실행돼요." },
    { step: 7, sel: ".dd__orb", title: "음성 대화", text: "채팅에서 하던 일을 전부 말로 할 수 있어요. 말을 시작하면 DD는 즉시 멈춰요." },
    { step: 8, sel: ".dd__routine-steps", title: "루틴 제안", text: "실제 행동 횟수를 근거로 제안하고, 승인 없이는 절대 실행하지 않아요." },
    { step: 9, sel: ".dd__tasks", title: "루틴 탭", text: "DD가 돌리고 있는 작업과 루틴이 전부 여기 보이고, 한 번의 탭으로 끌 수 있어요." },
  ];

  var scenario = {
    step: 1, // 1 홈 · 2 선톡 알림 · 3 대화·요약 · 4 실행·실행취소 · 5 연동 권한 · 6 발송 확인·완료 · 7 음성 대화
    theme: "light",
    env: "app", // DD 흐름은 모바일 우선 — 기본 App
    loading: false,
    error: false,
    dir: "",
    fx: false, // 단계 이동 없는 변화(실행취소·발송)의 1회성 시퀀스 트리거
    toast: null,
    undoSec: UNDO_MAX, // S4 실행 취소 남은 시간
    undone: false, // 저장 실행 취소 여부
    connected: false, // S5 메일 권한 연결 여부
    sent: false, // S6 발송 완료 여부
    query: "", // 홈 검색어 입력값
    draft: "", // 대화 입력창 입력값
    extraMsgs: [], // 직접 입력해 보낸 메시지 (준비된 흐름 뒤에 이어 붙음)
    routineCreated: false, // S8에서 루틴을 만들었는지 (S9 목록에 반영)
    guide: -1, // 가이드 투어 진행 인덱스 (-1 = 꺼짐)
  };

  var appFrame = document.getElementById("frame-app");
  var webFrame = document.getElementById("frame-web");
  var remoteEl = document.getElementById("remote");
  var stageEl = document.querySelector(".stage");

  /* 화면 안 토스트 */
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

  /* ---- 상태 전이 ---- */
  var loadingTimer = null;
  function setStep(n) {
    clearTimeout(loadingTimer);
    scenario.dir = n > scenario.step ? "fwd" : n < scenario.step ? "back" : "";
    scenario.step = n;
    scenario.loading = false;
    scenario.error = false;
    // 단계별 서브상태 리셋 — 리모컨으로 임의 이동해도 각 장면이 초기 모습으로 보이게
    if (n <= 4) { scenario.undone = false; scenario.undoSec = UNDO_MAX; }
    scenario.connected = n >= 6;
    if (n <= 6) scenario.sent = false;
    scenario.extraMsgs = [];
    scenario.draft = "";
    if (n !== 9) scenario.routineCreated = false; // 리모컨으로 S9 직행 시 기본 목록
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
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map(function (n) {
          return {
            t: "S" + n,
            act: function () { setStep(n); },
            on: function (s) { return s.step === n; },
          };
        })
        .concat([
          { t: "‹", act: function () { setStep(Math.max(1, scenario.step - 1)); }, on: function () { return false; } },
          { t: "›", act: function () { setStep(Math.min(STEP_MAX, scenario.step + 1)); }, on: function () { return false; } },
        ]),
    },
    {
      label: "투어",
      items: [
        { t: "가이드", act: function (s) { guideGo(s.guide >= 0 ? -1 : 0); }, on: function (s) { return s.guide >= 0; } },
      ],
    },
    {
      label: "상태",
      items: [
        { t: "로딩", act: function (s) { s.loading = !s.loading; }, on: function (s) { return s.loading; } },
        { t: "에러", act: function (s) { s.error = !s.error; if (s.error) toast("메일 서버 연결에 실패했어요. 잠시 후 다시 시도해 주세요.", "danger"); }, on: function (s) { return s.error; } },
        { t: "토스트", act: function () { toast("새 글 3건을 정리했어요."); }, on: function () { return false; } },
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
    var html = window.DD_SCREENS[scenario.step](scenario);
    appFrame.innerHTML = html;
    webFrame.innerHTML = html;
    // 대화 시트는 항상 최신 메시지가 보이도록 바닥으로
    [appFrame, webFrame].forEach(function (frame) {
      var msgs = frame.querySelector(".dd__msgs");
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    });
    stageEl.setAttribute("data-env", scenario.env);
    document.documentElement.setAttribute("data-theme", scenario.theme);
    refreshRemote();
    if (previewLink) {
      previewLink.href =
        "dd.html?preview=1&step=" + scenario.step +
        "&env=" + scenario.env + "&theme=" + scenario.theme;
    }
    scenario.dir = "";
    scenario.fx = false; // 1회성 시퀀스 소거
    renderGuide();
    syncPreviewNav();
  }

  /* ---- 가이드 투어 — 딤 + 스포트라이트 + 설명 카드 ---- */
  function guideGo(idx) {
    if (idx < 0 || idx >= GUIDE.length) {
      scenario.guide = -1;
      render();
      return;
    }
    scenario.guide = idx;
    if (scenario.step !== GUIDE[idx].step) setStep(GUIDE[idx].step);
    scenario.dir = ""; // 가이드 이동은 정적 렌더 — 시퀀스 애니메이션과 겹치지 않게
    render();
  }

  function renderGuide() {
    [appFrame, webFrame].forEach(function (frame) {
      var old = frame.querySelector(".dd__guide");
      if (old) old.remove();
    });
    if (scenario.guide < 0) return;
    var item = GUIDE[scenario.guide];
    var frame = scenario.env === "app" ? appFrame : webFrame;
    var root = frame.querySelector(".dd");
    if (!root) return;
    var target = root.querySelector(item.sel);
    if (!target) {
      // 대상이 화면에 없으면(엣지 케이스) 다음 항목으로
      scenario.guide = scenario.guide < GUIDE.length - 1 ? scenario.guide + 1 : -1;
      renderGuide();
      return;
    }
    try { target.scrollIntoView({ block: "center", behavior: "instant" }); } catch (e) { target.scrollIntoView(); }
    var rootRect = root.getBoundingClientRect();
    var r = target.getBoundingClientRect();
    var pad = 8;
    var top = r.top - rootRect.top - pad;
    var left = r.left - rootRect.left - pad;
    var w = r.width + pad * 2;
    var h = r.height + pad * 2;

    // 대상의 모서리 모양을 따라간다 (원형 오브·pill 칩이 사각형으로 잘리지 않게)
    var tRadius = getComputedStyle(target).borderRadius;
    var spotRadius = /%|9999|999px/.test(tRadius)
      ? "50%"
      : "calc(" + (parseFloat(tRadius) || 8) + "px + " + pad + "px)";

    var overlay = document.createElement("div");
    overlay.className = "dd__guide";
    overlay.setAttribute("data-action", "guide-next"); // 빈 곳 탭 = 다음
    overlay.innerHTML =
      '<div class="dd__guide-spot" style="top:' + top + "px;left:" + left + "px;width:" + w +
      "px;height:" + h + "px;border-radius:" + spotRadius + '"></div>' +
      '<div class="dd__guide-tip">' +
      "<b>" + item.title + "</b><p>" + item.text + "</p>" +
      "<footer><span>" + (scenario.guide + 1) + " / " + GUIDE.length + "</span>" +
      '<button data-action="guide-exit">마치기</button>' +
      '<button class="dd__guide-next" data-action="guide-next">' +
      (scenario.guide === GUIDE.length - 1 ? "완료" : "다음") + "</button></footer></div>";
    root.appendChild(overlay);

    /* 카드 실제 높이를 재고 배치 — 스포트라이트/탭바와 겹치지 않게 클램프.
       여백이 큰 쪽(위/아래)에 붙이고, 그래도 모자라면 프레임 안으로 밀어 넣는다. */
    var tip = overlay.querySelector(".dd__guide-tip");
    var gap = 16;
    // 디바이스 프레임의 둥근 모서리(쇼케이스 32px)에 카드가 물리지 않도록 여유를 둔다
    var corner = parseFloat(getComputedStyle(frame.closest(".frame__device") || frame).borderRadius) || 0;
    var safeTop = pad + corner * 0.5;
    var tabbar = root.querySelector(".dd__tabbar");
    var safeBottom =
      rootRect.height - pad - corner * 0.5 - (tabbar ? tabbar.getBoundingClientRect().height : 0);
    if (previewNav) {
      // 프리뷰 내비가 프레임 위에 겹쳐 있으면 그 위까지만 안전 영역
      var nr = previewNav.getBoundingClientRect();
      if (nr.right > rootRect.left && nr.left < rootRect.right) {
        safeBottom = Math.min(safeBottom, nr.top - rootRect.top - gap);
      }
    }
    var tipH = tip.getBoundingClientRect().height;
    var spaceAbove = top - safeTop - gap;
    var spaceBelow = safeBottom - (top + h) - gap;
    var y;
    if (spaceBelow >= tipH) y = top + h + gap;          // 아래에 충분
    else if (spaceAbove >= tipH) y = top - gap - tipH;  // 위에 충분
    else {
      // 양쪽 다 부족 — 더 넓은 쪽에 붙이고 프레임 안으로 클램프
      y = spaceBelow >= spaceAbove ? safeBottom - tipH : safeTop;
      y = Math.max(safeTop, Math.min(y, safeBottom - tipH));
    }
    tip.style.top = y + "px";
  }

  /* ---- 미리보기 하단 내비 (?preview=1) — 단계 이동 + 가이드 시작 ---- */
  var previewNav = null;
  function buildPreviewNav() {
    previewNav = document.createElement("div");
    previewNav.className = "dd-prevnav";
    previewNav.innerHTML =
      '<button data-nav="prev" aria-label="이전 단계">‹</button>' +
      '<span class="dd-prevnav__label"></span>' +
      '<button data-nav="next" aria-label="다음 단계">›</button>' +
      '<button data-nav="guide" class="dd-prevnav__guide">가이드</button>';
    previewNav.addEventListener("click", function (e) {
      var b = e.target.closest("[data-nav]");
      if (!b) return;
      if (b.dataset.nav === "prev") { setStep(Math.max(1, scenario.step - 1)); render(); }
      else if (b.dataset.nav === "next") { setStep(Math.min(STEP_MAX, scenario.step + 1)); render(); }
      else guideGo(scenario.guide >= 0 ? -1 : 0);
    });
    document.body.appendChild(previewNav);
    // 프레임 높이에서 내비 자리를 빼 콘텐츠를 가리지 않게 한다
    document.querySelector(".showcase").classList.add("showcase--nav");
  }
  function syncPreviewNav() {
    if (!previewNav) return;
    previewNav.querySelector(".dd-prevnav__label").textContent =
      scenario.step + "/" + STEP_MAX + " " + STEP_TITLES[scenario.step - 1];
    // 가이드 중에는 카드의 마치기/다음이 조작을 맡으므로 내비를 숨긴다
    previewNav.classList.toggle("is-hidden", scenario.guide >= 0);
  }

  /* ---- 목업 내부 인터랙션 (data-action) ---- */
  var ACTIONS = {
    /* 진입/이탈 */
    "open-chat": function () { withLoading(400, function () { setStep(3); }); },
    "close-chat": function () { setStep(1); render(); },

    /* 하단 탭 · 앱바 · 바로가기 */
    tab: function (el) {
      var name = el.dataset.tab;
      if (name === "홈") { setStep(1); render(); return; }
      if (name === "루틴") { setStep(9); render(); return; }
      toast(name + " 탭은 이 시나리오에 없어요.");
    },
    menu: function () { toast("전체 서비스 메뉴는 준비 중이에요."); },
    bell: function () { toast("새 알림이 없어요."); },
    shortcut: function (el) { toast(el.dataset.name + " 화면은 준비 중이에요."); },

    /* 홈·알림 */
    listen: function () { withLoading(350, function () { setStep(7); }); },
    "open-draft": function () { toast("메일 초안 화면은 준비 중이에요."); },

    /* 루틴 (S8 제안 → S9 작업 목록) */
    "open-routine": function () { withLoading(350, function () { setStep(8); }); },
    "routine-create": function () {
      withLoading(500, function () {
        setStep(9);
        scenario.routineCreated = true;
        scenario.toast = { msg: "루틴을 만들었어요. 매일 저녁 8시에 정리해 둘게요." };
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { scenario.toast = null; render(); }, 2400);
      });
    },
    "routine-later": function () { setStep(1); render(); toast("알겠어요. 필요해지면 다시 제안할게요."); },
    "routine-never": function () { setStep(1); render(); toast("이 제안은 다시 드리지 않을게요."); },
    "task-pause": function () { toast("일시중지했어요. 언제든 다시 켤 수 있어요."); },
    "task-retry": function () { toast("다시 시도할게요. 완료되면 알려 드릴게요."); },

    /* 가이드 투어 */
    "guide-next": function () { guideGo(scenario.guide + 1); },
    "guide-exit": function () { guideGo(-1); },
    "mute-noti": function () { toast("이 알림을 그만 보낼게요. 설정에서 다시 켤 수 있어요."); },

    /* 음성 모드 (S7) — 마이크·듣기에서 진입, 화면으로/종료로 복귀 */
    voice: function () { withLoading(350, function () { setStep(7); }); },
    "voice-exit": function () { setStep(3); render(); },
    "voice-end": function () { setStep(1); render(); },

    /* 직접 입력 전송 */
    "send-chat": function () { sendChat(); },

    /* 대화 흐름 */
    "say-save": function () { setStep(4); render(); }, // 실행 과정은 대화 안 도구 시퀀스로 보인다
    "open-post": function () { toast("글 화면은 준비 중이에요."); },
    undo: function () {
      scenario.undone = true;
      scenario.fx = true; // 취소 시퀀스 1회 재생
      toast("저장을 취소했어요.");
    },
    "say-send": function () { setStep(5); render(); },
    later: function () { toast("알겠어요. 필요할 때 다시 말씀해 주세요."); },
    connect: function () { setStep(6); render(); }, // 연결 과정은 대화 안 도구 시퀀스로 보인다
    "confirm-send": function () {
      if (scenario.error) {
        toast("메일 서버 연결에 실패했어요. 잠시 후 다시 시도해 주세요.", "danger");
        render(); // is-shake 재생
        return;
      }
      scenario.sent = true;
      scenario.fx = true; // mail.send 실행 시퀀스 1회 재생
      scenario.toast = { msg: "메일을 보냈어요." };
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { scenario.toast = null; render(); }, 2400);
      render();
    },
    "edit-mail": function () { toast("초안 수정 화면은 준비 중이에요."); },
  };

  /* ---- 직접 입력 — 대화 전송 / 검색어를 대화 세션으로 승계 (스펙 §2.1) ---- */
  function focusChat() {
    var frame = scenario.env === "app" ? appFrame : webFrame;
    var el = frame.querySelector(".dd__field--chat");
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }
  var replyTimer = null;
  function sendChat() {
    var text = (scenario.draft || "").trim();
    if (!text) return;
    scenario.extraMsgs.push({ who: "user", text: text });
    scenario.draft = "";
    render();
    focusChat();
    clearTimeout(replyTimer);
    replyTimer = setTimeout(function () {
      scenario.extraMsgs.push({
        who: "ai",
        text: "여기서는 준비된 시나리오만 실행할 수 있어요.",
      });
      render();
      focusChat();
    }, 500);
  }
  function searchSubmit() {
    var q = (scenario.query || "").trim();
    if (!q) return;
    scenario.query = "";
    withLoading(400, function () {
      setStep(3);
      scenario.extraMsgs = [
        { who: "user", text: q },
        { who: "ai", text: "검색어를 대화로 가져왔어요. 무엇을 도와드릴까요?" },
      ];
    });
  }

  function wireFrames() {
    [appFrame, webFrame].forEach(function (frame) {
      // 입력 필드: 상태 저장 + 반대 프레임 미러 (재렌더 없이 포커스 유지)
      frame.addEventListener("input", function (e) {
        var f = e.target.closest(".dd__field");
        if (!f) return;
        var key = f.dataset.field;
        scenario[key] = f.value;
        var other = frame === appFrame ? webFrame : appFrame;
        var mirror = other.querySelector('.dd__field[data-field="' + key + '"]');
        if (mirror) mirror.value = f.value;
        if (key === "draft") {
          [appFrame, webFrame].forEach(function (fr) {
            var box = fr.querySelector(".dd__input");
            if (box) box.classList.toggle("has-text", !!f.value);
          });
        }
      });
      frame.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        if (e.target.classList.contains("dd__field--chat")) {
          e.preventDefault();
          sendChat();
        } else if (e.target.classList.contains("dd__field--search")) {
          e.preventDefault();
          searchSubmit();
        }
      });
      frame.addEventListener("click", function (e) {
        var actEl = e.target.closest("[data-action]");
        if (!actEl || !frame.contains(actEl)) return;
        // 카드(open-chat) 안의 버튼(listen 등)이 카드 액션까지 트리거하지 않도록 가장 안쪽만 실행
        var fn = ACTIONS[actEl.dataset.action];
        if (fn && !actEl.disabled) fn(actEl);
        e.stopPropagation();
      });
    });
  }

  /* ---- 카운트다운 (재렌더 없이 숫자만 갱신) ---- */
  setInterval(function () {
    // S4 실행 취소
    if (scenario.step === 4 && !scenario.loading && !scenario.undone && scenario.undoSec > 0) {
      scenario.undoSec--;
      if (scenario.undoSec === 0) {
        render(); // 시간이 다 되면 실행 취소 버튼 제거
      } else {
        document.querySelectorAll(".dd__undo-sec").forEach(function (el) {
          el.textContent = scenario.undoSec;
        });
      }
    }
  }, 1000);

  /* ---- init — URL 파라미터로 프리뷰/캡처/상태 복원 ---- */
  var params = new URLSearchParams(location.search);
  if (params.get("step")) scenario.step = Math.min(STEP_MAX, Math.max(1, parseInt(params.get("step"), 10) || 1));
  if (params.get("env") === "app" || params.get("env") === "web") scenario.env = params.get("env");
  if (params.get("theme") === "dark") scenario.theme = "dark";
  if (params.get("preview") === "1") {
    document.querySelector(".showcase").classList.add("showcase--preview");
    if (params.get("capture") !== "1") buildPreviewNav();
  }
  if (params.get("capture") === "1") {
    document.querySelector(".showcase").classList.add("showcase--capture");
  }
  setStep(scenario.step); // 서브상태(connected 등)를 단계와 일치시킴
  buildRemote();
  wireFrames();
  render();
  if (params.get("guide") === "1") guideGo(0);
})();

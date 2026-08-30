/* =========================================================
   dd-screens.js — 다음 DD 에이전트 6단계 흐름 마크업 SSOT
   메인 디자인: 포털 앱 홈 + 대화 시트 (DESIGN.md §5 dd 스킨).
   DD_SCREENS[step](state) => htmlString. 같은 HTML을 웹/앱 프레임에 동시 주입.
   모든 버튼은 data-action으로 동작한다(dd-showcase.js가 처리).
   state = { step, theme, env, loading, error, dir, toast:{msg,variant}|null,
             undoSec, undone, connected, sent, voiceSec,
             query, draft, extraMsgs:[{who:'user'|'ai', text}] }
   단계: 1 홈·브리핑 · 2 선톡 알림 · 3 대화 진입·요약 · 4 실행·실행취소
         5 연동 제안·권한 · 6 발송 확인·완료 · 7 음성 대화(A4)
         8 루틴 제안(A6) · 9 작업 목록(A8)
   ========================================================= */
(function () {
  "use strict";

  /* 사용자 입력을 마크업에 넣을 때 이스케이프 */
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- 공용 아이콘 — m.daum.net 원본 path 추출 (DAUM-DESIGN.md §7) ---- */
  var IC = {
    /* "D" 심벌 원본 SVG 파일 (assets/daum/logo-d.svg) */
    logo: '<img class="dd__dlogo" src="assets/daum/logo-d.svg" alt="" aria-hidden="true" />',
    /* 돋보기 — 원본 28×28 path 그대로, fill만 currentColor */
    search:
      '<svg viewBox="0 0 28 28" width="22" height="22" fill="currentColor" aria-hidden="true">' +
      '<path d="M12.5 4C17.1944 4 21 7.80558 21 12.5C21 14.501 20.3064 16.3389 19.1494 17.791C19.2295 17.8353 19.3051 17.891 19.373 17.959L24.373 22.959C24.7636 23.3495 24.7636 23.9825 24.373 24.373C23.9825 24.7636 23.3495 24.7636 22.959 24.373L17.959 19.373C17.891 19.3051 17.8353 19.2295 17.791 19.1494C16.3389 20.3064 14.501 21 12.5 21C7.80558 21 4 17.1944 4 12.5C4 7.80558 7.80558 4 12.5 4ZM12.5 6C8.91015 6 6 8.91015 6 12.5C6 16.0899 8.91015 19 12.5 19C16.0899 19 19 16.0899 19 12.5C19 8.91015 16.0899 6 12.5 6Z"/></svg>',
    /* 알림 벨 — 앱 상단 우측 (아웃라인 1.5px) */
    bell:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M18.2 16.6H5.8c.9-1 1.4-2.3 1.4-3.7v-2.6a4.8 4.8 0 0 1 9.6 0v2.6c0 1.4.5 2.7 1.4 3.7Z"/>' +
      '<path d="M10.2 19.4a2 2 0 0 0 3.6 0"/><path d="M12 5.5V4"/></svg>',
    /* 로딩 스피너 — 원본 SMIL(1s rotate) 호 그대로, stroke만 currentColor */
    spin:
      '<svg class="dd__spin" viewBox="-20 -20 40 40" width="40" height="40" aria-hidden="true"><g>' +
      '<animateTransform attributeName="transform" begin="0s" dur="1s" type="rotate" from="0 0 0" to="360 0 0" repeatCount="indefinite"></animateTransform>' +
      '<path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="currentColor" stroke-opacity="0.4" stroke-width="4" ' +
      'd="M13.587,-3.389 C13.857,-2.304 14,-1.169 14,0 C14,7.732 7.732,14 0,14 C-7.732,14 -14,7.732 -14,0 C-14,-6.563 -9.483,-12.072 -3.389,-13.587"></path></g></svg>',
    /* 메뉴(햄버거) — 앱 상단 좌측 */
    menu:
      '<svg viewBox="0 0 28 28" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path d="M5 8.5h13M5 14h10M5 19.5h13"/></svg>',
    /* 마이크 — m.daum.net 원본 28×28 path 그대로 */
    mic:
      '<svg viewBox="0 0 28 28" width="20" height="20" fill="currentColor" aria-hidden="true">' +
      '<path d="M21.3247 13.8838C21.4377 13.3433 21.9669 12.9966 22.5074 13.1094C23.0476 13.2225 23.3944 13.7517 23.2818 14.292C22.4616 18.2173 19.1051 21.2131 14.9839 21.6299C14.9913 21.679 14.9976 21.7291 14.9976 21.7803V25.0771C14.9973 25.6291 14.5496 26.077 13.9976 26.0771C13.4455 26.0771 12.9978 25.6292 12.9976 25.0771V21.7803C12.9976 21.7292 13.0019 21.6789 13.0093 21.6299C8.88861 21.2127 5.53352 18.217 4.71341 14.292C4.60067 13.7515 4.94732 13.2223 5.48782 13.1094C6.02816 12.9969 6.55754 13.3434 6.67044 13.8838C7.35792 17.1732 10.3622 19.6816 13.9976 19.6816C17.6328 19.6814 20.6373 17.1731 21.3247 13.8838ZM14.2544 2.00684C16.8873 2.14053 18.981 4.31732 18.981 6.9834V12.4014L18.9742 12.6572C18.8408 15.2904 16.6639 17.3847 13.9976 17.3848L13.7408 17.3779C11.1927 17.2486 9.15004 15.2054 9.02103 12.6572L9.01419 12.4014V6.9834C9.01419 4.23116 11.2453 2 13.9976 2L14.2544 2.00684ZM13.9976 4C12.3499 4 11.0142 5.33572 11.0142 6.9834V12.4014C11.0143 14.0489 12.35 15.3848 13.9976 15.3848C15.6451 15.3847 16.9808 14.0489 16.981 12.4014V6.9834C16.981 5.33574 15.6452 4.00002 13.9976 4Z"/></svg>',
    /* 로봇 — DD 에이전트 FAB */
    robot:
      '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="5" y="8.5" width="14" height="9.5" rx="3"/><path d="M12 8.5V6"/><circle cx="12" cy="4.6" r="1.2"/>' +
      '<path d="M9.4 12.4v1.8M14.6 12.4v1.8"/></svg>',
  };

  /* 하단 탭 아이콘 — 앱 스크린샷 기준 1.5px 아웃라인, 활성 탭만 브랜드 그라데이션.
     그라데이션 defs(#ddg)는 dd.html 문서 레벨에 한 번만 정의되어 있다. */
  var TAB_PATHS = {
    "홈": '<path d="M4.2 10.6 12 4.2l7.8 6.4v8.6a.8.8 0 0 1-.8.8h-4.6v-5.2h-4.8V20H5a.8.8 0 0 1-.8-.8Z"/>',
    "콘텐츠": '<rect x="4.8" y="4" width="14.4" height="16" rx="2"/><path d="M8.6 9h6.8M8.6 12.6h6.8M8.6 16.2h4"/>',
    "커뮤니티": '<path d="M12 4.2c4.6 0 7.8 2.9 7.8 6.5s-3.2 6.6-7.8 6.6c-.9 0-1.7-.1-2.5-.3L6 19v-3.1c-1.2-1.1-1.8-2.7-1.8-4.2 0-3.6 3.2-6.5 7.8-6.5Z"/>',
    "쇼핑": '<path d="M6 8.4h12l-.9 10.8a.9.9 0 0 1-.9.8H7.8a.9.9 0 0 1-.9-.8Z"/><path d="M9.2 10.4V7.2a2.8 2.8 0 0 1 5.6 0v3.2"/>',
    "루틴": '<path d="M6.2 9.6a6.4 6.4 0 0 1 10.6-2.2l2.4 2.2"/><path d="M19.4 5.6v4.2h-4.2"/>' +
      '<path d="M17.8 14.4a6.4 6.4 0 0 1-10.6 2.2l-2.4-2.2"/><path d="M4.6 18.4v-4.2h4.2"/>',
  };
  function tabIcon(name, active, size) {
    var s = size || 22;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="' +
      (active ? "url(#ddg)" : "currentColor") +
      '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">' +
      TAB_PATHS[name] + "</svg>"
    );
  }

  /* 탭 페이지 헤더 — 활성 탭 아이콘(그라데이션) + 제목 */
  function pageHead(tab, title) {
    return (
      '<h2 class="dd__page-title dd__page-title--tab">' +
      '<i class="dd__page-ic">' + tabIcon(tab, true, 26) + "</i>" + (title || tab) +
      "</h2>"
    );
  }

  /* ---- 상태바 (디바이스 상단, 웹 프레임에서는 dd.css가 숨김) ---- */
  function statusbar(time) {
    return (
      '<div class="dd__status"><b>' + time + "</b>" +
      '<span>LTE <i class="dd__batt"></i></span></div>'
    );
  }

  /* ---- 화면 안 토스트 / 로딩 오버레이 ---- */
  function toastLayer(state) {
    if (!state.toast) return "";
    return (
      '<div class="dd__toast"><div class="toast' +
      (state.toast.variant === "danger" ? " toast--danger" : "") +
      '"><span class="toast__text">' + state.toast.msg + "</span></div></div>"
    );
  }
  function overlay(state) {
    return state.loading
      ? '<div class="dd__overlay">' + IC.spin + "</div>"
      : "";
  }

  /* ---- 하단 5탭 + DD FAB (스펙 §2.1: 전역 FAB, 하단 탭 위) ---- */
  function tabbar(active) {
    // 탭 순서: 홈 · 콘텐츠 · 커뮤니티 · 쇼핑 · 루틴 (활성 아이콘만 그라데이션)
    // 다음 앱 5탭의 '루프' 자리를 이 제안에서 '루틴'으로 대체한다.
    var tabs = ["홈", "콘텐츠", "커뮤니티", "쇼핑", "루틴"];
    var out = tabs
      .map(function (t) {
        var on = t === active;
        return (
          '<span class="dd__tab' + (on ? " dd__tab--active" : "") +
          '" data-action="tab" data-tab="' + t + '" role="button" tabindex="0">' +
          tabIcon(t, on) + "<b>" + t + "</b></span>"
        );
      })
      .join("");
    return '<nav class="dd__tabbar">' + out + "</nav>";
  }
  function fab() {
    return (
      '<button class="dd__fab" data-action="open-chat" title="DD와 대화하기" aria-label="DD와 대화하기">' +
      IC.robot + "</button>"
    );
  }

  /* ---- STEP 1 · 홈 — 브리핑 카드 + 시간대별 바로가기 + 대기 슬롯 (기획서 A1) ---- */
  function step1(state) {
    var shortcuts = [
      { k: "메", t: "메일", n: "3" },
      { k: "카", t: "카페", n: "7" },
      { k: "증", t: "증권", n: "" },
      { k: "뉴", t: "뉴스", n: "" },
      { k: "지", t: "지도", n: "" },
      { k: "티", t: "티스토리", n: "" },
    ]
      .map(function (s) {
        return (
          '<span class="dd__shortcut" data-action="shortcut" data-name="' + s.t + '" role="button" tabindex="0">' +
          '<i class="dd__shortcut-ic">' + s.k + "</i>" +
          (s.n ? '<em class="dd__badge">' + s.n + "</em>" : "") +
          "<b>" + s.t + "</b></span>"
        );
      })
      .join("");

    var main =
      '<div class="dd__home' + anim(state) + '">' +
      '<div class="dd__appbar">' +
      '<button class="dd__appbar-ic" data-action="menu" aria-label="전체 서비스">' + IC.menu + "</button>" +
      '<button class="dd__appbar-ic dd__appbar-ic--right" data-action="bell" aria-label="알림">' + IC.bell + "</button>" +
      "</div>" +
      '<div class="dd__search">' + IC.logo +
      '<input class="dd__field dd__field--search" type="text" placeholder="검색어를 입력하세요" ' +
      'value="' + esc(state.query) + '" data-field="query" enterkeyhint="search" aria-label="통합검색" /></div>' +

      '<section class="dd__brief" data-action="open-chat" role="button" tabindex="0">' +
      '<header><b>오늘의 브리핑</b><span>오전 8:00</span>' +
      '<button class="dd__chip dd__chip--sm" data-action="listen">듣기 1:30</button></header>' +
      '<h3>최근 자주 본 ‘캠핑’ 글을 모아 왔어요</h3>' +
      '<ul>' +
      '<li>관심종목 삼성전자 <b class="dd__up">▲ +2.1%</b></li>' +
      "<li>캠핑 카페 새 글 <b>3건</b></li>" +
      "<li>안 읽은 메일 <b>2건</b></li>" +
      "</ul>" +
      "</section>" +

      '<section class="dd__card">' +
      '<div class="dd__shortcuts">' + shortcuts + "</div>" +
      "</section>" +

      '<section class="dd__card dd__pending">' +
      "<header><b>대기 중인 것</b></header>" +
      '<div class="dd__pending-row"><span>메일 초안 1건 <i>(기사 공유)</i></span>' +
      '<button class="dd__chip dd__chip--sm" data-action="open-draft">열어 보기</button></div>' +
      '<div class="dd__pending-row"><span>루틴 제안 1건</span>' +
      '<button class="dd__chip dd__chip--sm" data-action="open-routine">검토</button></div>' +
      "</section>" +
      "</div>";

    return (
      '<div class="dd">' + statusbar("07:21") +
      '<div class="dd__scroll">' + main + "</div>" +
      fab() + tabbar("홈") + toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  /* ---- STEP 2 · 선톡 알림 — 잠금화면 (기획서 A7: 끄기 진입점 필수) ---- */
  function step2(state) {
    return (
      '<div class="dd dd--lock">' + statusbar("08:12") +
      '<div class="dd__lock-body' + anim(state) + '">' +
      '<div class="dd__lock-time">08:12</div>' +
      '<div class="dd__lock-date">8월 28일 금요일</div>' +

      '<div class="dd__noti" data-action="open-chat" role="button" tabindex="0">' +
      '<header><i class="dd__noti-ic">' + IC.logo + '</i><b>다음 DD</b><span>지금</span></header>' +
      "<h4>캠핑 카페 새 글 3건을 정리했어요</h4>" +
      "<p>자주 보던 글이라 모아 보냈어요</p>" +
      '<footer><button data-action="mute-noti">이런 알림 그만</button></footer>' +
      "</div>" +

      '<div class="dd__noti dd__noti--ad">' +
      '<header><i class="dd__noti-ic">쇼</i><b>다음쇼핑 <em>(광고)</em></b><span>10분 전</span></header>' +
      "<h4>위시리스트 상품이 18% 내렸어요</h4>" +
      '<footer><button data-action="mute-noti">수신거부: 설정</button></footer>' +
      "</div>" +
      "</div>" +
      toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  /* ---- 대화 시트 공통 (3~6단계) ---- */
  function anim(state) {
    return state.dir === "fwd" ? " anim-fwd" : state.dir === "back" ? " anim-back" : "";
  }

  function aiMsg(inner, cls) {
    return (
      '<div class="dd__msg dd__msg--ai' + (cls || "") + '"><i class="dd__avatar">' + IC.logo + "</i>" +
      '<div class="dd__bubble">' + inner + "</div></div>"
    );
  }
  function userMsg(text, cls) {
    return (
      '<div class="dd__msg dd__msg--user' + (cls || "") + '"><div class="dd__bubble">' + text + "</div></div>"
    );
  }

  /* 도구 호출 과정 — 버블 위 실행 로그 (기획서 A2·A4의 🔧 표기).
     새 메시지(.dd__msg--new)에서는 행이 하나씩 나타나 스피너가 돌다 체크로 바뀌고,
     그 뒤에 결과(.dd__tool-result)가 등장한다. 시퀀스는 dd.css가 담당. */
  function toolRun(lines) {
    return (
      '<div class="dd__toolrun">' +
      lines
        .map(function (l) {
          return (
            '<div class="dd__toolrun-row' + (l.wait ? " dd__toolrun-row--wait" : "") + '">' +
            "<code>" + l.t + '</code><span class="dd__toolrun-desc">' + l.d + "</span>" +
            (l.wait
              ? '<i class="dd__toolrun-ok dd__toolrun-ok--wait">…</i>'
              : '<span class="dd__toolrun-slot"><i class="dd__toolrun-run"></i><i class="dd__toolrun-ok">✓</i></span>') +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  /* 도구 실행 + 결과를 한 버블로 — 결과는 행 수(--tr)만큼 늦게 등장 */
  function toolMsg(lines, rest) {
    return (
      toolRun(lines) +
      '<div class="dd__tool-result" style="--tr:' + lines.length + '">' + rest + "</div>"
    );
  }

  function summaryCard() {
    function row(n, title, sub) {
      return (
        '<div class="dd__post"><i>' + n + "</i>" +
        "<span><b>" + title + "</b><em>" + sub + "</em></span></div>"
      );
    }
    return (
      '<p>캠핑 카페 새 글 <b>3건</b>을 요약했어요</p>' +
      '<div class="dd__posts">' +
      row(1, "겨울 캠핑 난방 후기", "화목난로와 무시동히터 실사용 비교") +
      row(2, "초보 장비 추천 정리", "첫 캠핑 체크리스트 27종") +
      row(3, "동계 텐트 결로 잡는 법", "환기 순서만 바꿔도 달라져요") +
      "</div>" +
      '<div class="dd__chips"><button class="dd__chip" data-action="listen">음성으로 듣기</button>' +
      '<button class="dd__chip" data-action="open-post">원문 보기</button></div>'
    );
  }

  /* 직접 입력한 메시지 — 준비된 흐름 뒤에 이어 붙는다 */
  function extraMessages(state) {
    return (state.extraMsgs || [])
      .map(function (m) {
        return m.who === "user"
          ? userMsg(esc(m.text))
          : aiMsg("<p>" + esc(m.text) + "</p>");
      })
      .join("");
  }

  /* 단계별 대화 누적 — 한 시나리오가 이어지는 것처럼 보이게.
     이번 단계에서 새로 생긴 메시지에만 --new를 붙여 실행 시퀀스를 1회 재생한다. */
  function chatMessages(state) {
    var step = state.step;
    var h = "";
    function fresh(gate) {
      return gate === step && state.dir === "fwd" ? " dd__msg--new" : "";
    }

    /* S3+: 선톡 컨텍스트 칩 + 도구 실행 과정 + 요약 */
    h += '<div class="dd__context">선톡에서 이어짐 · 캠핑 카페 새 글</div>';
    h += aiMsg(
      toolMsg(
        [
          { t: "cafe.list_new", d: "카페 12곳 확인" },
          { t: "summarize", d: "새 글 3건 요약" },
        ],
        summaryCard()
      ),
      fresh(3)
    );
    if (step === 3) {
      h += '<div class="dd__suggest"><button class="dd__chip dd__chip--suggest" data-action="say-save">2번 글 저장해줘</button></div>';
    }

    /* S4+: 저장 실행 + 실행 취소 (가역 실행 — 기획서 5.1) */
    if (step >= 4) {
      h += userMsg("2번 글 저장해줘", fresh(4));
      if (state.undone) {
        h += aiMsg(
          toolMsg([{ t: "clip.delete", d: "스크랩 저장 취소" }], "<p>저장을 취소했어요</p>"),
          state.fx ? " dd__msg--new" : ""
        );
      } else {
        h += aiMsg(
          toolMsg(
            [{ t: "clip.save", d: "2번 글 스크랩 저장" }],
            "<p>내 스크랩에 저장했어요</p>" +
            '<div class="dd__chips"><button class="dd__chip" data-action="open-post">열어보기</button>' +
            (step === 4 && state.undoSec > 0 // 카운트다운은 실행 직후에만 — 지난 대화에는 남기지 않음
              ? '<button class="dd__chip dd__chip--undo" data-action="undo">실행 취소 <b class="dd__undo-sec">' + state.undoSec + "</b>초</button>"
              : "") +
            "</div>"
          ),
          fresh(4)
        );
      }
      h += aiMsg(
        "<p>2번 글, 내 메일로도 보내 둘까요?</p>" +
        (step === 4
          ? '<div class="dd__chips"><button class="dd__chip dd__chip--suggest" data-action="say-send">보내 줘</button>' +
            '<button class="dd__chip" data-action="later">나중에</button></div>'
          : ""),
        fresh(4)
      );
    }

    /* S5+: 사용자 승인 + 최소 권한 연동 (그 작업에 필요한 서비스만) */
    if (step >= 5) {
      h += userMsg("보내 줘", fresh(5));
      h += aiMsg(
        state.connected
          ? toolMsg(
              [{ t: "mail.connect", d: "메일 보내기 권한 연결" }],
              '<p class="dd__perm-ok">메일 연결됨 · 언제든 해제할 수 있어요</p>'
            )
          : toolMsg(
              [{ t: "mail.draft", d: "보내기 권한 필요", wait: true }],
              '<div class="dd__perm"><b>메일 보내기 권한이 필요해요</b>' +
              "<p>이 작업에만 쓰이고 언제든 해제됩니다</p>" +
              '<button class="btn btn--filled btn--block dd__perm-btn" data-action="connect">연결하기</button>' +
              "</div>"
            ),
        fresh(5)
      );
    }

    /* S6: L3 확인 카드 — 되돌릴 수 없는 발송은 화면 확인 + 탭 필수 (기획서 A5) */
    if (step >= 6) {
      if (!state.sent) {
        h += aiMsg(
          toolMsg(
            [{ t: "mail.send", d: "발송 전 확인 대기", wait: true }],
            '<div class="dd__confirm' + (state.error ? " is-shake dd__confirm--error" : "") + '">' +
            "<b>이 메일을 보낼까요?</b>" +
            '<div class="dd__confirm-row"><span>받는 사람</span><em>나 (ji****@daum.net)</em></div>' +
            '<div class="dd__confirm-row"><span>제목</span><em>[스크랩] 초보 장비 추천 정리</em></div>' +
            '<p class="dd__confirm-warn">발송은 되돌릴 수 없어요</p>' +
            '<div class="dd__confirm-actions">' +
            '<button class="btn btn--filled dd__perm-btn" data-action="confirm-send">보내기</button>' +
            '<button class="btn btn--outline dd__perm-btn" data-action="edit-mail">수정</button>' +
            "</div></div>"
          ),
          fresh(6)
        );
      } else {
        h += aiMsg(
          toolMsg(
            [{ t: "mail.send", d: "ji****@daum.net으로 발송" }],
            '<p><b class="dd__done">✓</b> 메일로 보내 뒀어요.<br />캠핑 카페에 새 글이 오면 다음에도 먼저 정리해 드릴게요</p>'
          ),
          state.fx ? " dd__msg--new" : ""
        );
      }
    }
    h += extraMessages(state);
    return h;
  }

  function chatScreen(state) {
    return (
      '<div class="dd dd--chat">' + statusbar("12:40") +
      '<div class="dd__dim" data-action="close-chat" title="홈으로 돌아가기"></div>' +
      '<div class="dd__sheet' + anim(state) + '">' +
      '<div class="dd__handle"></div>' +
      '<header class="dd__sheet-head"><i class="dd__avatar">' + IC.logo + "</i><b>다음 DD</b>" +
      '<button class="dd__close" data-action="close-chat" aria-label="닫기">✕</button></header>' +
      '<div class="dd__msgs">' + chatMessages(state) + "</div>" +
      '<div class="dd__input' + (state.draft ? " has-text" : "") + '">' +
      '<input class="dd__field dd__field--chat" type="text" placeholder="DD에게 무엇이든 말해 보세요" ' +
      'value="' + esc(state.draft) + '" data-field="draft" enterkeyhint="send" aria-label="DD에게 보낼 메시지" />' +
      '<button class="dd__mic dd__mic--fill" data-action="voice" aria-label="음성 입력">' + IC.mic + "</button>" +
      '<button class="dd__send" data-action="send-chat" aria-label="보내기">↑</button>' +
      "</div>" +
      "</div>" +
      toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  /* ---- STEP 7 · 음성 대화 (기획서 A4 프리톡) ----
     낭독 TTS가 아니라 채팅에서 하던 모든 일을 말로 하는 대화 모드.
     화면은 심플하게: 오브 + 파형 + 힌트 한 줄 + 버튼 2개.
     실행은 여전히 게이트웨이(L3 확인)를 거친다. */
  function step7(state) {
    var bars = "";
    for (var i = 0; i < 14; i++) bars += "<i></i>";
    return (
      '<div class="dd dd--voice">' + statusbar("20:15") +
      '<div class="dd__voice' + anim(state) + '">' +
      '<div class="dd__orb"><span class="dd__orb-core">' + IC.logo + "</span></div>" +
      '<div class="dd__wave" aria-hidden="true">' + bars + "</div>" +
      '<p class="dd__voice-hint"><em class="dd__live"></em>듣고 있어요</p>' +
      '<div class="dd__voice-ctrl">' +
      '<button class="dd__vbtn" data-action="voice-exit">채팅으로</button>' +
      '<button class="dd__vbtn dd__vbtn--end" data-action="voice-end">종료</button>' +
      "</div>" +
      "</div>" +
      toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  /* ---- STEP 8 · 루틴 제안 (기획서 A6) ----
     근거(실제 행동 횟수)를 먼저 보여 주고 스텝을 펼친다. 승인 없이는 절대 실행되지 않는다. */
  function step8(state) {
    var main =
      '<div class="dd__home' + anim(state) + '">' +
      '<h2 class="dd__page-title">이거, 루틴으로<br />만들어 드릴까요?</h2>' +
      '<p class="dd__page-desc">최근 3주간 저녁마다 캠핑 카페 새 글을 확인하시더라고요. <b>15일 중 11일</b>이요.</p>' +
      '<section class="dd__card">' +
      '<header class="dd__routine-head">이렇게 동작해요</header>' +
      '<ol class="dd__routine-steps">' +
      "<li>매일 저녁 8시, 구독 캠핑 카페 새 글 확인</li>" +
      "<li>자주 찾으신 주제(동계 장비) 글 우선 정렬</li>" +
      "<li>모아서 홈 카드 하나로 정리</li>" +
      "</ol>" +
      '<p class="dd__caption">푸시는 보내지 않아요. 각 단계는 나중에 끄거나 바꿀 수 있어요</p>' +
      "</section>" +
      '<button class="btn btn--filled btn--block dd__routine-cta" data-action="routine-create">루틴 만들기</button>' +
      '<button class="btn btn--outline btn--block dd__routine-cta" data-action="routine-later">괜찮아요</button>' +
      '<p class="dd__routine-never" data-action="routine-never">다시 제안받지 않기</p>' +
      "</div>";
    return (
      '<div class="dd">' + statusbar("19:02") +
      '<div class="dd__scroll">' + main + "</div>" +
      tabbar("루틴") + toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  /* ---- STEP 9 · 작업 목록 (기획서 A8) ----
     백그라운드 태스크는 전부 여기서 보이고 한 번의 탭으로 끈다.
     자동 생성된 것은 원문 발화를 함께 표시한다. */
  function step9(state) {
    function task(title, meta, sub, action, badge) {
      return (
        '<div class="dd__task">' +
        '<div class="dd__task-body"><b>' + title + "</b>" +
        (badge ? '<em class="dd__task-badge">' + badge + "</em>" : "") +
        '<span class="dd__task-meta">' + meta + "</span>" +
        (sub ? '<span class="dd__task-sub">' + sub + "</span>" : "") +
        "</div>" +
        (action || "") +
        "</div>"
      );
    }
    var chip = function (label, act) {
      return '<button class="dd__chip dd__chip--sm" data-action="' + act + '">' + label + "</button>";
    };
    var main =
      '<div class="dd__home' + anim(state) + '">' +
      pageHead("루틴") +
      '<section class="dd__card dd__tasks">' +
      (state.routineCreated
        ? task("저녁 캠핑 카페 정리", "루틴 · 매일 20:00 · 다음 실행 오늘 저녁", "방금 제안에서 만들어졌어요", chip("일시중지", "task-pause"), "새 루틴")
        : "") +
      task("카페 새 글 요약", '실행 중 · 구독 카페 12곳 중 <b class="dd__task-prog">8곳 완료</b>', "", chip("열기", "open-post")) +
      task("출근길 브리핑", "루틴 · 평일 07:20 · 다음 실행 월요일", "“매일 아침 브리핑 만들어 줘”에서 생성됨", chip("일시중지", "task-pause")) +
      task("위시 가격 추적", "조건 트리거 · 5% 이상 하락 시", "", chip("일시중지", "task-pause")) +
      task("주간 카페 결산", "일시중지 · 3회 연속 실패 (카페 점검)", "", chip("다시 시도", "task-retry")) +
      "</section>" +
      "</div>";
    return (
      '<div class="dd">' + statusbar("13:05") +
      '<div class="dd__scroll">' + main + "</div>" +
      tabbar("루틴") + toastLayer(state) + overlay(state) +
      "</div>"
    );
  }

  window.DD_SCREENS = {
    1: step1,
    2: step2,
    3: chatScreen,
    4: chatScreen,
    5: chatScreen,
    6: chatScreen,
    7: step7,
    8: step8,
    9: step9,
  };
})();

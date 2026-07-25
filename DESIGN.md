# DESIGN.md — 디자인 시스템

이 프로젝트의 **단일 디자인 소스(SSOT)**. 모든 UI는 이 문서의 토큰과 원칙을 따른다.

- **출처**: [Pleos Connect UI Design Guide](https://document.pleos.ai/docs/connect/guide/docs-design/Introduction/intro) (현대차그룹, 차량 IVI 디자인 시스템) — 22개 문서 페이지 전량 추출.
- **적응 원칙(Adaptation)**: 원본은 **자동차 인포테인먼트(IVI)** 시스템이다. 이 프로젝트는 **웹/모바일 목업**이므로 아래처럼 적응한다.
  - 토큰 값(색·타이포·그림자·모션)과 컴포넌트 구조·원칙은 **그대로 채택**한다.
  - 차량 전용 요소(주행뷰, 공조/Climate, Driving/Phone/Regulation 색, 3핑거 윈도우 관리, Connect-S/W 디스플레이 규격)는 **참조용 부록**으로만 남기고 화면에는 쓰지 않는다.
  - dp 단위는 웹에서 **1dp = 1px** 로 취급한다.
- **사용 규칙**: 임의의 hex·폰트 크기·여백을 직접 쓰지 않는다. 아래 [CSS 변수](#css-변수-web-adaptation)만 사용한다. 필요한 토큰이 없으면 이 문서에 먼저 정의한 뒤 쓴다.

---

## 1. 디자인 원칙

원본의 3대 원칙을 웹/모바일에 맞게 재해석한다.

1. **Easy & Safe (쉽고 안전하게)** — 인지 부하 최소화. 핵심 정보를 명확히, 불필요한 요소 제거. 한 손/한 번의 동작으로 조작 가능하게. (원본: 주행 중 영상·자동 스크롤·애니메이션 이미지 금지)
2. **Consistency (일관성)** — 아이콘·용어·인터랙션 패턴을 일관되게. 같은 의미엔 같은 토큰.
3. **Glanceability (즉시성)** — 1~2초 내 인지 가능하게. 시스템 응답은 **0.25초 이내**, 지연 시 시각 피드백 제공.

색 대비: 아이콘·텍스트·이미지는 배경 대비 **최소 4.5:1**.

---

## 2. Foundations

### 2.1 Color

듀얼 테마(Light/Dark). 구조: **Basic**(Grayscale·Alpha·Static) → **System**(시맨틱). 시맨틱 토큰은 Basic을 참조한다.

#### Basic — Grayscale

| Token | Light | Dark |
|---|---|---|
| basic_00 | #FFFFFF | #131417 |
| basic_50 | #F7F8FA | #1D1E21 |
| basic_100 | #EDEEF2 | #313236 |
| basic_200 | #E0E1E6 | #44464E |
| basic_300 | #C7C9CE | #686A72 |
| basic_400 | #A4A8AE | #A4A8AE |
| basic_500 | #686A72 | #C7C9CE |
| basic_600 | #44464E | #E0E1E6 |
| basic_700 | #313236 | #EDEEF2 |
| basic_800 | #1D1E21 | #F7F8FA |
| basic_900 | #131417 | #FFFFFF |

#### Basic — Alpha

| Group | 값 |
|---|---|
| basic_alpha_light_50~500 | #131417 @ 5 / 10 / 20 / 30 / 40 / 50% (Dark 테마: #FFFFFF 동일 %) |
| basic_alpha_dark_50~500 | #FFFFFF @ 5 / 10 / 20 / 30 / 40 / 50% (Dark 테마: #131417 동일 %) |

#### Basic — Static (테마 불변, 주로 Overlay 위 요소)

| Token | 값 | | Token | 값 |
|---|---|---|---|---|
| basic_static_light_100 | #FFFFFF | | basic_static_dark_100 | #131417 |
| basic_static_light_200 | #FFFFFF 84% | | basic_static_dark_200 | #131417 84% |
| basic_static_light_300 | #FFFFFF 64% | | basic_static_dark_300 | #131417 64% |
| basic_static_light_400 | #FFFFFF 32% | | basic_static_dark_400 | #131417 32% |

#### System Color (시맨틱)

**Background** — primary=basic_50 · secondary=basic_00 · popup=basic_00(L)/basic_100(D)
**Surface** — basic=basic_00/basic_50 · low=basic_50/basic_00 · high=basic_100 · accent=basic_200
**Text** — primary/secondary/tertiary/quaternary = static_dark_100/200/300/400 (L) → static_light_… (D)
**Icon** — 위 Text와 동일 패턴(static_dark/light 100~400)
**Fields** — background=basic_00 · focused=basic_700
**Button**

| Token | Light | Dark |
|---|---|---|
| button_basic_enabled | alpha_dark_50 | alpha_dark_50 |
| button_basic_pressed | alpha_dark_100 | alpha_dark_100 |
| button_basic_disabled | alpha_light_200 | alpha_light_200 |
| button_filled_enabled | basic_600 | basic_600 |
| button_filled_pressed | basic_700 | basic_500 |
| button_filled_disabled | alpha_dark_50 | alpha_dark_50 |
| button_switch_enabled | basic_00 | alpha_dark_200 |
| button_switch_pressed | alpha_light_500 | alpha_dark_200 |
| button_switch_disabled | alpha_light_300 | alpha_dark_300 |

**Controller** — slider_normal=alpha_dark_200/100 · slider_pressed=alpha_dark_300/200 · slider_knob=basic_00/alpha_dark_300 · tab_bg=alpha_dark_50 · stepper_bg=basic_00/alpha_light_100
**Dropdown** — normal=basic_00/alpha_dark_100 · pressed=basic_100/alpha_dark_300
**Dim** — dark_primary/secondary/tertiary=alpha_dark_50/100/200 · light_primary/secondary/tertiary=alpha_light_500/400/300
**Overlay** — overlay_default=alpha_dark_200(L)/alpha_light_500(D)
**Switch** — on=informative_active · off=alpha_dark_300/100 · disabled=alpha_dark_100 · knob_on=basic_00/basic_900 · knob_off=basic_00/basic_400

**Informative (시맨틱 강조색 — 웹에서도 사용)**

| Token | Light | Dark | 용도 |
|---|---|---|---|
| informative_active | #02C265 | #00E074 | 성공/활성 (green) |
| informative_positive | #0064FF | #0082FF | 정보/링크 (blue) |
| informative_negative | #FE3D16 | #FF4C28 | 오류/경고 (red) |
| informative_autonomous_driving | #5A46FA | #6A57FF | 강조 (violet) |

> 차량 전용 색(Climate·Driving·Gleo AI·Keyboard·Media·Phone·Regulation)은 [부록 A](#부록-a-차량-전용-색상)에 원본 그대로 보존. 웹 목업에서는 사용하지 않는다.

### 2.2 Typography

폰트: **Asta Sans** (원본). 웹에서는 시스템 폰트 스택으로 대체 가능(아래 CSS 변수 참조).
최소 크기 12px 이상, 실제 높이 18px 이상, line-height ≥ 1.5. 캐릭터 강한 폰트 지양.

| Role | Scale | Size(px) | Weight |
|---|---|---|---|
| Headline | Large / Medium / Small | 60 / 56 / 48 | Extra Bold, Bold |
| Title | Large / Medium / Small | 40 / 36 / 32 | Extra Bold, Bold, Regular |
| Body | Large / Medium / Small | 30 / 28 / 26 | Strong, Normal |
| Label | Medium / Small | 24 / 20 | Normal |

> 원본 스케일은 대형 차량 디스플레이 기준이라 크다. 웹/모바일에서는 [§3 CSS 변수](#css-변수-web-adaptation)의 축소 매핑을 사용하되 **위계(Headline>Title>Body>Label)와 비율**은 유지한다.

### 2.3 Spacing & Radius

원본은 명시적 spacing 스케일이 없어(4px 배수 관례) 아래로 정의한다. Radius는 컴포넌트에서 관찰된 값 기반.

- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 (px). 컴포넌트 간 여백은 이 배수만 사용.
- 관찰된 실측 여백: Toast side/bottom padding **24**, Spinner 컬럼 gap **24**·side pad **40**, Status bar safe-bounds **40**.
- Radius: sm 8 / md 12 / lg 16 / xl 20 / full 999 (px). 버튼·카드는 md~lg, pill/토글은 full.

### 2.4 Elevation (Shadow)

3단계. (원본 값 그대로)

| Level | 용도 | CSS `box-shadow` |
|---|---|---|
| 1 | 최저 elevation | `0 6px 24px rgba(0,0,0,0.08)` |
| 2 | 중간 | `0 8px 32px rgba(0,0,0,0.16), 0 2px 2px rgba(0,0,0,0.08)` |
| 3 | 최상위(팝업/알림) | `0 20px 40px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.20)` |

### 2.5 Motion

- 상태 설명 목적으로만 사용. 로딩: **Linear**(정적 로딩) / **Tension**(로딩이 길어질 때).
- 표준 트랜지션(원본 Bar 컴포넌트에서 관찰): **`transform 300ms cubic-bezier(0.16, 1, 0.3, 1)`**.
- 응답 지연 0.25초 초과 금지 → 초과 시 스피너 등 시각 피드백. 과도한 장식 애니메이션 지양.

### 2.6 Iconography

- 그리드 base **48×48dp(px)**, 스트로크 **1.5px**, 스타일 **Filled / Outlined** 2종.
- 마스터 1벌 제작 후 필요한 크기로 스케일. 키라인: square/circle/triangle/rect.
- App Icon: **144×144dp(px)** 그리드, rounded-square 마스킹 레이어 + 이미지 레이어.

---

## 3. CSS 변수 (Web Adaptation)

이 프로젝트가 실제로 사용하는 토큰 레이어. `css/style.css`의 `:root`에 정의하고 컴포넌트는 이 변수만 참조한다.
차량 디스플레이용 대형 타이포를 웹/모바일 스케일로 축소 매핑했다(위계·비율 유지).

```css
:root {
  /* ---- Color: Basic (Light) ---- */
  --basic-00:#FFFFFF; --basic-50:#F7F8FA; --basic-100:#EDEEF2; --basic-200:#E0E1E6;
  --basic-300:#C7C9CE; --basic-400:#A4A8AE; --basic-500:#686A72; --basic-600:#44464E;
  --basic-700:#313236; --basic-800:#1D1E21; --basic-900:#131417;

  /* ---- Color: Semantic (Light) ---- */
  --bg-primary:var(--basic-50);        /* background_primary */
  --bg-secondary:var(--basic-00);      /* background_secondary */
  --bg-popup:var(--basic-00);          /* background_popup */
  --surface:var(--basic-00);           /* surface_basic */
  --surface-low:var(--basic-50);
  --surface-high:var(--basic-100);
  --surface-accent:var(--basic-200);
  --border:var(--basic-200);
  --text-primary:var(--basic-900);     /* static_dark_100 근사 */
  --text-secondary:rgba(19,20,23,.84); /* static_dark_200 */
  --text-tertiary:rgba(19,20,23,.64);  /* static_dark_300 */
  --text-quaternary:rgba(19,20,23,.32);/* static_dark_400 */
  --field-bg:var(--basic-00);
  --field-focused:var(--basic-700);

  /* ---- Color: Informative (semantic accents) ---- */
  --success:#02C265; --info:#0064FF; --danger:#FE3D16; --accent:#5A46FA;
  --primary:var(--info);               /* 웹 목업의 기본 강조색 = informative_positive */

  /* ---- Typography (web-scaled; family는 Asta Sans 미탑재 시 fallback) ---- */
  --font-sans:"Asta Sans",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard","Segoe UI",Roboto,"Noto Sans KR",sans-serif;
  --fs-headline-l:32px; --fs-headline-m:30px; --fs-headline-s:26px; /* 60/56/48 → 축소 */
  --fs-title-l:22px;    --fs-title-m:20px;    --fs-title-s:18px;    /* 40/36/32 */
  --fs-body-l:16px;     --fs-body-m:15px;     --fs-body-s:14px;     /* 30/28/26 */
  --fs-label-m:13px;    --fs-label-s:12px;    /* 24/20 */
  --lh-base:1.5;
  --fw-bold:800; --fw-semibold:700; --fw-regular:400;

  /* ---- Spacing ---- */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-10:40px;

  /* ---- Radius ---- */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-full:999px;

  /* ---- Elevation ---- */
  --shadow-1:0 6px 24px rgba(0,0,0,.08);
  --shadow-2:0 8px 32px rgba(0,0,0,.16), 0 2px 2px rgba(0,0,0,.08);
  --shadow-3:0 20px 40px rgba(0,0,0,.24), 0 2px 4px rgba(0,0,0,.20);

  /* ---- Motion ---- */
  --ease-standard:cubic-bezier(0.16, 1, 0.3, 1);
  --dur-standard:300ms;

  /* ---- Icon ---- */
  --icon-stroke:1.5px;
}

/* Dark theme */
:root[data-theme="dark"] {
  --basic-00:#131417; --basic-50:#1D1E21; --basic-100:#313236; --basic-200:#44464E;
  --basic-300:#686A72; --basic-400:#A4A8AE; --basic-500:#C7C9CE; --basic-600:#E0E1E6;
  --basic-700:#EDEEF2; --basic-800:#F7F8FA; --basic-900:#FFFFFF;
  --text-primary:var(--basic-900);
  --text-secondary:rgba(255,255,255,.84);
  --text-tertiary:rgba(255,255,255,.64);
  --text-quaternary:rgba(255,255,255,.32);
  --success:#00E074; --info:#0082FF; --danger:#FF4C28; --accent:#6A57FF;
  --bg-popup:var(--basic-100);
  --surface:var(--basic-50); --surface-low:var(--basic-00);
}
```

---

## 4. Components

원본 컴포넌트의 **구조(anatomy)·상태(states)·옵션**을 그대로 채택한다. 웹에서 재현할 때 위 토큰만 사용한다.

### Button (Basic / Filled / Switch)
- 상태: Enabled / Pressed / Disabled. Filled = 강조(`button_filled_*` = basic_600/700), Basic = 보조(alpha).
- 웹 매핑: primary=`--primary`, filled 텍스트 #fff, disabled=`--text-quaternary` 위 `--surface-high`.

### Dropdown
- Anatomy: Root · Label · Prefix(App Icon/Icon) · Suffix(Chevron/Switch) · Container(열린 목록).
- States: Opened · Pressed · Disabled. Size: Medium / Small. 선택 항목엔 체크 표시.

### Tabs (Segmented Menu)
- Anatomy: Root · Tab Item · Label · Selected indicator · Tab Container.
- Type: **Box**(회색 컨테이너 + 흰 pill) / **Line**(선택 항목 밑줄 `#131417`). Fitted(bool): true=균등분할, false=left-aligned.
- States: Enable / Pressed / Selected. 아이콘 prefix 지원.

### Indicator (page dots)
- Anatomy: Root · Present Value(채워진 dot) · Next/Prev(흐린 dots).
- Dot 지름 ~8px. Active=`--text-primary`, inactive=32% 투명. Size: Wide(pitch 24) / Narrow(pitch 16).

### Page Navigation
- Anatomy: Root · App icon · Primary Menu(dropdown) · Secondary Menu(optional) · Suffix(icon).
- Type: **Main**(App icon + Title▾ + ⋯) / **Depth**(back ‹ + Title + ⋯). Subtitle 옵션.

### Controllers (Slider / Stepper)
- **Continuous Slider**: Root·Control·Handle·Track·Icon(prefix/suffix)·Stepper. Mode: Basic / Floating.
- **Centered Slider**: 중앙 기준 track(gradient 가능), ‹›버튼 없으면 margin 확대.
- **Stepper**: `− │ value │ +`. 상태 Min(−disabled)/Mid/Max(+disabled). 실측 400×100, 값 영역 112.
- Options: Disabled · MinValue · MaxValue · Step.

### Spinner (Picker)
- Anatomy: Root · Selection Value(중앙 강조) · Contents(스크롤 컬럼).
- Type: Date / Time. 선택행=흰/굵게 위 하이라이트 바, 거리감 fade. (실측: Date 568w, Time 468×384, gap 24, pad 40)

### Toast
- Anatomy: Root(어두운 rounded) · Toast message(흰 텍스트). Center 정렬.
- 실측: side/bottom padding **24**, max width **792**, 텍스트 max **712**.

### System Notification
- Anatomy: Root(흰 카드) · Imagery · Header(Title+Description) · Action(CTA + Sub action).
- Type: App icon / Profile(통화·문자, 배지) / Image. Button Align: Single / Vertical / Horizontal. Call variant: 받기(green)/거절(red).

### Bar (Window / Scroll)
- Window bar: 두 창 사이 핸들. Enabled opacity .2 → Pressed opacity .5·width 140→100px, `transform 300ms ease var(--ease-standard)`. Disabled opacity→0.
- Scroll bar: 창 우측. Enabled=gray-alpha-200, Pressed=gray-900.

### Widgets
- Anatomy: Root · Handle(아래로 드래그해 숨김) · Pagination(dots) · Title/Action · Information.
- States: Enabled/Pressed × Show/Hidden. 인터랙션: 수평 드래그=전환, handle down=숨김, hidden handle touch=복귀.

### Spinner/Loading
- Linear / Tension 2종. §2.5 Motion 참조.

> **차량 전용 컴포넌트** — Status Bar, GNB, App Library는 차량 IVI 셸 전용이라 웹 목업에서는 쓰지 않는다. 구조는 [부록 B](#부록-b-차량-전용-컴포넌트)에 보존.

---

## 5. Scenario Showcase (목업 프레젠테이션 패턴)

목업을 **시나리오별로, 웹/앱을 한 화면에서 동시에** 보여주기 위한 표준 프레젠테이션 셸.
개별 기획 흐름(예: 계정 통합)을 이 셸 위에 얹는다.

### 구성
- **시나리오 리모컨(`.remote`)** — 좌측. 3열 버튼 그리드 + 그룹 라벨(단계/상태/테마/환경),
  선택 시 `.active` 강조. 버튼 클릭 → 단일 상태 객체 갱신 → 프리뷰 **라이브 렌더**.
- **프리뷰 스테이지(`.stage`)** — 우측. Web/App 두 프레임에 같은 화면을 동기 렌더하되,
  캔버스에는 리모컨 **환경(Web/App) 토글**로 선택된 프레임 하나만 표시한다(`data-env`).
- **테마 토글** — 전역 `data-theme`(light/dark). 초기값은 `prefers-color-scheme`, 이후 수동 우선.
- **상태 피드백은 디바이스 화면 안에서** — 토스트·에러·로딩 오버레이는 프레임(디바이스) 내부에
  렌더한다. 쇼케이스 셸(브라우저 전역)에 띄우지 않는다.

### 웹/앱 동시 렌더 규격
- 각 프레임은 `container-type: inline-size` + 고정 폭(App 375px / Web ≥720px).
- 흐름 컴포넌트는 뷰포트 `@media`가 아니라 **`@container`로 레이아웃 분기**한다.
  기본 방침: **웹 = 모바일 레이아웃을 그대로 옆으로 늘려 콘텐츠 컬럼을 가운데 정렬**
  (`max-width` + `margin auto`). 실서비스 반응형 관행을 따르며, 별도 2열 재배치는 하지 않는다.
- 상태는 단일 객체 하나. 화면 마크업은 순수 함수 `SCREENS[step](state) => html`로 **한 번만** 정의하고,
  같은 HTML을 두 프레임에 주입 → 웹/앱 드리프트 불가.
- 주의: 흐름 마크업은 앱 셸의 뷰포트 `@media` 규칙(`.app { @media … }`)에 의존하지 말 것(프레임 오염).

### One ID 흐름 스킨 (메인 디자인)
계정 전환 흐름은 **실서비스(One ID/마이현대) 스타일을 메인**으로 하고, 본 디자인 시스템 토큰으로
구현한다(Pleos Connect 시스템은 서브 — 토큰·컴포넌트 기반 제공). 스킨 토큰은 `tokens.css`에 정의되어
있으며 흐름 CSS는 반드시 이 토큰을 소비한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--oneid-radius` | 6px | 버튼·입력·카드·안내 박스 라운드 (실서비스의 각진 느낌) |
| `--oneid-btn-bg` / `--oneid-btn-fg` | basic_900 / basic_00 | 블랙 필 버튼 (다크 테마 시 자동 반전) |
| `--oneid-btn-h` | 52px | 버튼·입력 높이 |
| `--oneid-line` | basic_200 | 카드·입력·아웃라인 버튼 테두리 |
| `--oneid-dot` / `--oneid-dot-now` | 8px / 24px | 단계 도트 / 현재 단계 숫자 서클 |

스타일 규칙:
- 화이트 배경(`--surface`), 상단 **중앙 브랜드 헤더**(대문자 타이틀 + 서브 라벨).
- 단계 표시는 **숫자 도트 인디케이터** — 현재 = 숫자 블랙 서클(24px), 지난 단계 = 블랙 도트, 남은
  단계 = 회색 도트(8px).
- 타이틀/설명은 중앙 정렬, 보조 설명은 `--text-tertiary`.
- 파랑(`--info`)은 링크·안내 박스(`--primary-weak` 배경)·완료 강조에만 사용. 버튼은 블랙.
- **기본 테마는 라이트.** 시스템 다크 모드를 따라가지 않으며, 다크는 리모컨/토글로만 전환한다.

### 미리보기 (프리뷰 모드)
- 리모컨 하단의 **미리보기** 링크는 현재 단계·환경·테마를 쿼리로 담아
  `showcase.html?preview=1&step=N&env=web|app&theme=light|dark` 를 새 탭으로 연다.
- 프리뷰 모드에서는 셸(헤더·리모컨·프레임 라벨)을 숨기고 **캔버스 내용만** 중앙에 표시한다.
  인터랙션(버튼 이동·토글)은 그대로 동작한다.

### 파일 규약
- `showcase.html` — 셸(리모컨 + 두 프레임). `css/showcase.css` — 셸/프레임/흐름 `@container` 레이아웃.
- `js/screens.js` — 흐름 마크업 SSOT. `js/showcase.js` — 상태·렌더·리모컨. `js/components.js` — 위임 인터랙션.
- 컴포넌트 갤러리는 `components.html`(전 컴포넌트 상태/변형 + 라이트·다크).

## 부록 A. 차량 전용 색상 (참조용, 웹 미사용)

- **Climate**: button_enabled=basic_200/50, button_selected=basic_00/200, toggle/slider/airvent 계열.
- **Driving**: gearshitft_background=basic_900/100 [원문 오타], charging_normal #00DB25, charging_deep #00B975/#0082FC.
- **Gleo AI**: surface_primary=basic_00/200, bubble_primary #9BA8E2/#545F93, bubble_secondary #8896D3/#3E4976, bubble_speaker #3F4B81/#B6C1F3.
- **Keyboard(Normal/Static)**: basic 스케일 기반 22개 토큰(primary/secondary/active/accents × normal/pressed + background + icon/text).
- **Media**: radio_primary #C911E7, music_primary #4781FF, radio gradients.
- **Phone**: call_normal #32B957/#3BD665, call_pressed #279E47/#2DB752, end_normal #FE3D16/#FF4C28, end_pressed #E73612/#DF4323.
- **Regulation**: blue #0064FF/#0082FF, green #00BA13/#55F165, yellow #FFC224, orange #FF8A00, red #F62E24/#FF4339, bluetooth #0082FC.

## 부록 B. 차량 전용 컴포넌트 & 규격 (참조용)

- **Status Bar**: SP0/SP1 × Static/Dynamic 영역, Time(12/24h), PAB, More(⋯). SP0↔SP1 40dp safe-bounds. 동적 인디케이터 right→left.
- **GNB**: 운전석 공조 / 앱 컨트롤 / 조수석 공조. Fixed vs Editable 슬롯. long-press 편집. OSD(2초 자동 소멸).
- **App Library**: 상단 공조 / 하단 앱. Connect-S 1줄 최대 7개, 초과 시 pagination.
- **Display**: Connect-S(17"/14.6"/12.9"), Connect-W(9:2), Connect-W-Extended(24:9), Connect-WF(4:1). 해상도표는 원본 참조.
- **Window Policy**: Connect-S 1:1/2:0, Connect-W 2:1/1:2(최대 2앱). 3핑거 스와이프 위치/크기/종료. Navigation 종료 불가. Deep link(App to App).

---

*원본 22개 페이지(Foundations 6 · Getting Started 2 · Components 13 · Intro 1) 전량 추출 기반. 값은 추출 시점 기준이며, 원본 갱신 시 재동기화 필요.*

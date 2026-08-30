# DESIGN.md — 디자인 시스템

이 프로젝트의 **단일 디자인 소스(SSOT)**. 모든 UI는 이 문서의 토큰과 원칙을 따른다.

- **출처**: 비공개 IVI 디자인 가이드 (자동차 인포테인먼트 디자인 시스템, 원 출처 비공개) — 22개 문서 페이지 전량 추출.
- **적응 원칙(Adaptation)**: 원본은 **자동차 인포테인먼트(IVI)** 시스템이다. 이 프로젝트는 **웹/모바일 목업**이므로 아래처럼 적응한다.
  - 토큰 값(색·타이포·그림자·모션)과 컴포넌트 구조·원칙은 **그대로 채택**한다.
  - 차량 전용 요소(주행뷰, 공조/Climate, Driving/Phone/Regulation 색, 3핑거 윈도우 관리, IVI-S/W 디스플레이 규격)는 **참조용 부록**으로만 남기고 화면에는 쓰지 않는다.
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

> 차량 전용 색(Climate·Driving·AI 어시스턴트·Keyboard·Media·Phone·Regulation)은 [부록 A](#부록-a-차량-전용-색상)에 원본 그대로 보존. 웹 목업에서는 사용하지 않는다.

### 2.2 Typography

폰트: **Asta Sans** — 공식 서체를 저장소에 임베드했다(`assets/fonts/AstaSans-VariableFont_wght.ttf`,
가변 100~900, 한글·영문 지원, OFL 라이선스). `tokens.css`의 `@font-face`로 로드되며 모든 페이지에
적용된다. 미로드 시 Apple SD Gothic Neo/Pretendard 폴백.
최소 크기 12px 이상, 실제 높이 18px 이상, line-height ≥ 1.5(`--lh-base`). 캐릭터 강한 폰트 지양.

**Weight 매핑** — Headline·Title: Extra Bold(`--fw-extrabold` 800) / Bold(`--fw-semibold` 700) ·
Body: Strong(`--fw-strong` 600) / Normal(`--fw-regular` 400) · Label: Normal.

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
- Radius: xs 6 / sm 8 / md 12 / lg 16 / xl 20 / full 999 (px). 버튼·카드는 md~lg, pill/토글은 full,
  Checkbox·uni 스킨은 xs.

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
- **UI 트랜지션 보강(transitions.dev 패턴 이식)** — 외부 스크립트 없이 아래 토큰으로 재현한다.
  `--ease-spring`(오버슈트 스프링, badge pop-in·시트 오픈), `--dur-fast` 180ms(마이크로 인터랙션),
  `--dur-slow` 480ms(리빌·시트). 적용 패턴: 메시지 blur-rise 리빌, 알림 카드 diagonal slide + spring
  pop-in, 성공 체크 blur+rotate pop, 에러 shake. 항상 `prefers-reduced-motion` 가드를 함께 둔다.

### 2.6 Iconography

- 그리드 base **48×48dp(px)**, 스트로크 **1.5px**, 스타일 **Filled / Outlined** 2종.
- 마스터 1벌 제작 후 필요한 크기로 스케일. 키라인: square/circle/triangle/rect.
- App Icon: **144×144dp(px)** 그리드, rounded-square 마스킹 레이어 + 이미지 레이어.

---

## 3. CSS 변수 (Web Adaptation)

이 프로젝트가 실제로 사용하는 토큰 레이어. `css/tokens.css`의 `:root`에 정의하고 컴포넌트는 이 변수만 참조한다.
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

  /* ---- Color: Static (테마 불변) ---- */
  --static-dark-200:rgba(19,20,23,.84);  /* Toast 배경 */
  --static-white:#FFFFFF;

  /* ---- Color: Informative — 상태 시맨틱 전용(성공/정보/오류). 일반 강조 금지 ---- */
  --success:#02C265; --info:#0064FF; --danger:#FE3D16; --accent:#5A46FA;
  /* Primary 강조 = 무채색. 원본의 위계 표현은 basic 스케일(대비)로 한다 */
  --primary:var(--basic-900);
  --primary-press:var(--basic-700);
  --primary-weak:var(--basic-100);

  /* ---- Typography (web-scaled; Asta Sans는 tokens.css @font-face로 임베드) ---- */
  --font-sans:"Asta Sans",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Pretendard","Segoe UI",Roboto,"Noto Sans KR",sans-serif;
  --fs-headline-l:32px; --fs-headline-m:30px; --fs-headline-s:26px; /* 60/56/48 → 축소 */
  --fs-title-l:22px;    --fs-title-m:20px;    --fs-title-s:18px;    /* 40/36/32 */
  --fs-body-l:16px;     --fs-body-m:15px;     --fs-body-s:14px;     /* 30/28/26 */
  --fs-label-m:13px;    --fs-label-s:12px;    /* 24/20 */
  --lh-base:1.5;
  --fw-extrabold:800; --fw-bold:800; --fw-semibold:700; --fw-strong:600; --fw-regular:400;

  /* ---- Spacing ---- */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-10:40px;

  /* ---- Radius ---- */
  --r-xs:6px; --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-full:999px;

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

> 그 외 `--app-max`, back-compat `--color-*`/`--shadow-sm|md|lg` 별칭, uni 스킨 토큰(§5)은
> `tokens.css`를 참조한다. 다크 블록은 `color-scheme: dark`도 함께 선언한다.

## 4. Components

원본 컴포넌트의 **구조(anatomy)·상태(states)·옵션**을 그대로 채택한다. 웹에서 재현할 때 위 토큰만 사용한다.

### Button (Basic / Filled / Switch)
- 상태: Enabled / Pressed / Disabled. Filled = 강조(`button_filled_*` = basic_600/700), Basic = 보조(alpha).
- 웹 매핑: primary=`--primary`, filled 텍스트 `--basic-00`, disabled=`--text-quaternary` 위 `--surface-high`.

### Text Field (Fields)
- Anatomy: Root · Field · Cursor · Place Holder · Suffix(Optional).
- States: Value · Focused · Disabled · Read Only · Invalid.
  시각: Enabled=회색 테두리 / Focused=진한 테두리(`--field-focused`=basic_700) / Typing=+clear(어두운 원형 X) /
  Entered / Error=레드 테두리+레드 헬퍼 텍스트 / Read only=회색 배경.
- Type: Text·Tel·Url·Email·Password(도트 마스킹) · Size: Medium/Small.
- Typing: 긴 텍스트는 좌측으로 밀림, 완료 시 끝 Truncate.

### Number Field (Fields)
- **자릿수별 개별 셀(segmented)** 구조. Anatomy: Root · Label(입력 숫자) · Cursor · Field(셀).
- States: Enabled(빈 셀) / Focused(회색 채움+블랙 테두리+커서) / Entered(숫자) / Error(레드 테두리).
- Size: Large/Medium. 인증번호 등 코드 입력에 사용.

### Switch (Selections)
- Anatomy: Root(트랙) · Knob. 52×30, `--r-full`, knob 24px(이동 22px).
- States: On(트랙=`informative_active`) / Off(`--surface-accent`) / Disabled(40% 투명).

### Checkbox (Selections)
- Anatomy: Root · Control · Icon(체크/대시). 다중 선택용.
- States: Checked · Pressed · Disabled.
- 실측(IVI 48×48·r12·border4 → 웹 1/2 스케일 24×24·r6·border2):
  미체크 border=`basic_900 @20%` / **checked 배경=informative_active(green)+흰 체크** /
  pressed 오버레이=`basic_900 @10%` / disabled=5~10% 알파, 체크 흰색 64%.

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
- **Centered Slider**: 중앙 기준 track — 원본 온도 메타포의 blue→red gradient 재현(Informative
  시맨틱 규칙의 문서화된 예외). ‹›버튼 없으면 margin 확대.
- **Stepper**: `− │ value │ +`. 상태 Min(−disabled)/Mid/Max(+disabled). 실측 400×100, 값 영역 112.
- Options: Disabled · MinValue · MaxValue · Step.

### Spinner (Picker)
- Anatomy: Root · Selection Value(중앙 강조) · Contents(스크롤 컬럼).
- Type: Date / Time. 선택행=흰/굵게 위 하이라이트 바, 거리감 fade. (실측: Date 568w, Time 468×384, gap 24, pad 40)

### Toast Popup
- Anatomy: Root · Toast message. 화면 하단 **Center**, 화면 여백(좌/우/하단) **24**.
- 실측: 배경 **#131417 @ 84%**(`--static-dark-200`, 테마 불변) · 텍스트 `--static-white` ·
  radius **16**(`--r-lg`) · 내부 패딩 상하 **24** / 좌우 **40** · 콘텐츠 max **712** (컨테이너 792).
- Duration은 원본 미명시(구현 기본 2.4s). 확장: danger variant = `--danger` 배경(에러 피드백).

### System Notification
- Anatomy: Root(흰 카드) · Imagery · Header(Title+Description) · Action(CTA + Sub action).
- Type: App icon / Profile(통화·문자, 배지) / Image. Button Align: Single / Vertical / Horizontal. Call variant: 받기(green)/거절(red).

### Bar (Window / Scroll)
- Window bar: 두 창 사이 핸들. Enabled opacity .2 → Pressed opacity .5 · 핸들 길이 140→100px
  (세로 구현: height), `opacity/height 300ms var(--ease-standard)`. Disabled opacity→0.
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
- **테마 토글** — 전역 `data-theme`(light/dark). 초기값은 **라이트 고정**(§5 uni 스킨 규칙),
  리모컨/URL 파라미터로만 전환한다.
- **상태 피드백은 디바이스 화면 안에서** — 토스트·에러·로딩 오버레이는 프레임(디바이스) 내부에
  렌더한다. 쇼케이스 셸(브라우저 전역)에 띄우지 않는다.
- **체크 위계** — 정적 확인 표시(예: 자동 조회된 계정의 ✓)는 무채색(`basic_900`),
  **인터랙티브 선택 상태**(Checkbox checked·Switch on)만 `informative_active`(green)를 쓴다.

### 웹/앱 동시 렌더 규격
- 각 프레임은 `container-type: inline-size` + 고정 폭(App 375px / Web ≥720px).
- 흐름 컴포넌트는 뷰포트 `@media`가 아니라 **`@container`로 레이아웃 분기**한다.
  기본 방침: **웹 = 모바일 레이아웃을 그대로 옆으로 늘려 콘텐츠 컬럼을 가운데 정렬**
  (`max-width` + `margin auto`). 실서비스 반응형 관행을 따르며, 별도 2열 재배치는 하지 않는다.
- 상태는 단일 객체 하나. 화면 마크업은 순수 함수 `SCREENS[step](state) => html`로 **한 번만** 정의하고,
  같은 HTML을 두 프레임에 주입 → 웹/앱 드리프트 불가.
- 주의: 흐름 마크업은 앱 셸의 뷰포트 `@media` 규칙(`.app { @media … }`)에 의존하지 말 것(프레임 오염).

### uni(계정 전환) 흐름 스킨
계정 전환 흐름은 **실서비스 스타일을 메인**으로 하고, 본 디자인 시스템 토큰으로
구현한다(IVI 디자인 시스템은 서브 — 토큰·컴포넌트 기반 제공). 스킨 토큰은 `tokens.css`에 정의되어
있으며 흐름 CSS는 반드시 이 토큰을 소비한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--uni-radius` | 6px | 버튼·입력·카드·안내 박스 라운드 (실서비스의 각진 느낌) |
| `--uni-btn-bg` / `--uni-btn-fg` | basic_900 / basic_00 | 블랙 필 버튼 (다크 테마 시 자동 반전) |
| `--uni-btn-h` | 52px | 버튼·입력 높이 |
| `--uni-line` | basic_200 | 카드·입력·아웃라인 버튼 테두리 |

스타일 규칙:
- 화이트 배경(`--surface`), 상단 **중앙 브랜드 헤더**(대문자 타이틀 + 서브 라벨).
- 단계 표시는 **§4 Indicator(Wide) 컴포넌트**를 그대로 사용 — Root/Present/Next·Prev 구조,
  dot 8px, Present=`--text-primary` 불투명, 나머지 32%, pitch 24. (도트 클릭 시 해당 단계 이동)
- 타이틀/설명은 중앙 정렬, 보조 설명은 `--text-tertiary`.
- **색 사용 원칙(중요)**: 강조·선택·버튼·인디케이터는 전부 **무채색(basic 스케일)**. Informative
  색(`--info`/`--success`/`--danger`)은 오류·성공 등 **상태 피드백에만** 쓴다. 일반 UI에 파랑 금지.
- **기본 테마는 라이트.** 시스템 다크 모드를 따라가지 않으며, 다크는 리모컨/토글로만 전환한다.

### dd(다음 DD 에이전트) 흐름 스킨
실행 에이전트 흐름(`dd.html`)은 **포털 앱 홈 + 대화 시트 스타일**로 구현한다.
**색·폰트·라디우스·그라데이션·아이콘·모션은 [DAUM-DESIGN.md](DAUM-DESIGN.md)(daum.net 프로덕션
실측 데이터)가 우선**하며 `tokens.css`의 `--daum-*` 토큰으로 소비한다. 레이아웃 치수 토큰은
`--dd-*`에 정의되어 있고 흐름 CSS(`css/dd.css`)는 반드시 이 토큰들만 소비한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `--dd-radius` | 16px(r-lg) | 홈 카드·대화 시트·알림 카드 코너 |
| `--dd-bubble-radius` | 20px(r-xl) | 대화 버블 라운드 |
| `--dd-chip-radius` | full | 검색바·칩·FAB (pill/원형) |
| `--dd-fab-size` | 56px | 전역 FAB 지름 (하단 탭 위 16px, 우측 16px) |
| `--dd-tab-h` | 58px | 하단 5탭 높이 |
| `--dd-line` | basic_100 | 홈 카드 내부 얇은 구분선 |

스타일 규칙:
- 홈은 `--bg-primary` 위 화이트 카드(`--surface`, `--dd-radius`, shadow-1). 상단 검색바는 pill.
- 대화 시트는 하단에서 올라오는 바텀 시트(그랩 핸들 + 헤더 + 메시지 + 입력바), 배경은 Dim
  (`alpha` 계열) — 딤 영역 탭으로 홈 복귀.
- 버블: 에이전트=`--surface-high` 좌측 정렬, 사용자=`--primary`(무채색 블랙) 우측 정렬.
- **선톡 알림 규칙(기획서 A7)** — 모든 선톡 카드에는 근거 한 줄과 "이런 알림 그만" 진입점을 함께
  렌더한다. 잠금화면은 Static Dark 배경(테마 불변).
- **되돌릴 수 없는 실행(기획서 A5)** — 발송·삭제류는 L3 확인 카드(수신자·내용 명시 + 탭 필수)를
  거치고, 가역 실행은 실행 취소(카운트다운) 버튼을 붙인다.
- **음성 대화 화면(기획서 A4)** — 낭독 TTS가 아니라 채팅과 동일한 일을 말로 하는 대화 모드.
  구성은 심플하게: Static Dark 배경(테마 불변) + 정적 오브(펄스 금지) + 파형 + 상태 힌트 한 줄
  + 버튼 2개(화면으로 보기/종료). 실시간 표시 점만 레드(녹음 상태 시맨틱, liveDot 점멸).
  마이크·듣기 버튼은 모두 이 화면으로 진입하고, "화면으로 보기"는 대화 시트로 돌아온다.
- 색은 무채색 원칙 그대로. Informative는 상태 피드백(주가 상승 `--success`, 위험 고지 `--danger`)에만.

### 미리보기 (프리뷰 모드)
- 리모컨 하단의 **미리보기** 링크는 현재 단계·환경·테마를 쿼리로 담아
  `showcase.html?preview=1&step=N&env=web|app&theme=light|dark` 를 새 탭으로 연다.
- 프리뷰 모드에서는 셸(헤더·리모컨·프레임 라벨·디바이스 테두리)을 숨기고 **화면을 꽉 채워**
  표시한다 — App은 실기기 비율(375:720)로 세로 100vh, Web은 브라우저 전체(100vw×100vh).
  인터랙션(버튼 이동·토글)은 그대로 동작한다.
- 프리뷰에는 **하단 내비**(‹ 3/9 대화 요약 › · 가이드)가 붙어 셸 없이도 전 단계를 오갈 수 있다.

### 가이드 투어 (시나리오 전체 안내)
시나리오의 모든 장면을 설명과 함께 순서대로 보여주는 스포트라이트 투어. 쇼케이스 리모컨의
**투어 > 가이드** 버튼, 프리뷰 하단 내비의 **가이드** 버튼, 또는 `?guide=1`로 시작한다.

- 화면 전체를 **검정 딤(72%)** 으로 덮고, 설명 대상 요소만 `box-shadow` spread 스포트라이트로
  밝게 남긴다(흰 아웃라인 2px). 딤의 빈 곳을 탭하면 다음으로 넘어간다.
- 설명 카드는 대상의 위/아래 중 여백이 큰 쪽에 붙고 `제목 · 설명 · N/총계 · 마치기 · 다음`을 담는다.
- 투어 항목은 `GUIDE` 배열(`js/dd-showcase.js`)에 `{step, sel, title, text}`로 정의한다.
  항목의 `step`이 현재 단계와 다르면 자동으로 해당 단계로 이동한 뒤 스포트라이트를 잡는다.
  대상 셀렉터가 화면에 없으면 그 항목은 건너뛴다.

### 파일 규약
- `showcase.html` — 셸(리모컨 + 두 프레임). `css/showcase.css` — 셸/프레임/흐름 `@container` 레이아웃.
- `js/screens.js` — 흐름 마크업 SSOT. `js/showcase.js` — 상태·렌더·리모컨. `js/components.js` — 위임 인터랙션.
- 다음 DD 에이전트 흐름: `dd.html`(셸 재사용) + `css/dd.css` + `js/dd-screens.js`(`window.DD_SCREENS`)
  + `js/dd-showcase.js`. 셸/프레임 스타일은 `css/showcase.css`를 공유한다.
- 컴포넌트 갤러리는 `components.html`(전 컴포넌트 상태/변형 + 라이트·다크).

## 부록 A. 차량 전용 색상 (참조용, 웹 미사용)

- **Climate**: button_enabled=basic_200/50, button_selected=basic_00/200, toggle/slider/airvent 계열.
- **Driving**: gearshitft_background=basic_900/100 [원문 오타], charging_normal #00DB25, charging_deep #00B975/#0082FC.
- **AI 어시스턴트**: surface_primary=basic_00/200, bubble_primary #9BA8E2/#545F93, bubble_secondary #8896D3/#3E4976, bubble_speaker #3F4B81/#B6C1F3.
- **Keyboard(Normal/Static)**: basic 스케일 기반 22개 토큰(primary/secondary/active/accents × normal/pressed + background + icon/text).
- **Media**: radio_primary #C911E7, music_primary #4781FF, radio gradients.
- **Phone**: call_normal #32B957/#3BD665, call_pressed #279E47/#2DB752, end_normal #FE3D16/#FF4C28, end_pressed #E73612/#DF4323.
- **Regulation**: blue #0064FF/#0082FF, green #00BA13/#55F165, yellow #FFC224, orange #FF8A00, red #F62E24/#FF4339, bluetooth #0082FC.

## 부록 B. 차량 전용 컴포넌트 & 규격 (참조용)

- **Status Bar**: SP0/SP1 × Static/Dynamic 영역, Time(12/24h), PAB, More(⋯). SP0↔SP1 40dp safe-bounds. 동적 인디케이터 right→left.
- **GNB**: 운전석 공조 / 앱 컨트롤 / 조수석 공조. Fixed vs Editable 슬롯. long-press 편집. OSD(2초 자동 소멸).
- **App Library**: 상단 공조 / 하단 앱. IVI-S 1줄 최대 7개, 초과 시 pagination.
- **Display**: IVI-S(17"/14.6"/12.9"), IVI-W(9:2), IVI-W-Extended(24:9), IVI-WF(4:1). 해상도표는 원본 참조.
- **Window Policy**: IVI-S 1:1/2:0, IVI-W 2:1/1:2(최대 2앱). 3핑거 스와이프 위치/크기/종료. Navigation 종료 불가. Deep link(App to App).

---

*원본 22개 페이지(Foundations 6 · Getting Started 2 · Components 13 · Intro 1) 전량 추출 기반. 값은 추출 시점 기준이며, 원본 갱신 시 재동기화 필요.*

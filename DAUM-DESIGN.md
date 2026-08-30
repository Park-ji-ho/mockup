# DAUM-DESIGN.md — 다음(Daum) 실서비스 디자인 데이터

DD 에이전트 흐름(`dd.html`)의 **스킨 SSOT**. 실제 다음 모바일 웹/앱에서 추출한 값을 그대로 기록하고,
`tokens.css`의 `--daum-*` 토큰으로 매핑한다. 기반 컴포넌트 구조는 [DESIGN.md](DESIGN.md)를 따르되
**색·폰트·라디우스·그라데이션은 이 문서가 우선**한다.

- **출처 1**: `www.daum.net` 모바일 프로덕션 CSS
  (`t1.daumcdn.net/top/daum/daum-m/production/20260820_102353/common.css`, 2026-08-30 실측 — CSS 커스텀 프로퍼티 122개 전수 추출)
- **출처 2**: 다음 앱 스크린샷 (홈 탭·콘텐츠 탭, 2026-08 기준 5탭 구성)
- **출처 3**: `career.daumcorp.com` (Pretendard 폰트, 참조용)

---

## 1. 브랜드 그라데이션 (시그니처)

검색바 보더·홈 탭 활성 아이콘·"D" 로고에 쓰이는 다음 브랜드 그라데이션. **원본 값 그대로**:

```css
/* common.css 실측 원본 */
linear-gradient(91.24deg, #4FA4FF 8.65%, #E28EFF 30.77%, #FF71A4 54.81%, #FFA841 78.85%, #FFC236 100%)
```

| Stop | Hex | 색 |
|---|---|---|
| 8.65% | `#4FA4FF` | 블루 |
| 30.77% | `#E28EFF` | 퍼플 |
| 54.81% | `#FF71A4` | 핑크 |
| 78.85% | `#FFA841` | 오렌지 |
| 100% | `#FFC236` | 옐로 |

적용 위치(스크린샷 실측): ① 검색바 테두리(흰 배경 + 그라데이션 1.5~2px 보더) ② 검색바 좌측 "D" 로고
③ 하단 탭바 활성 탭(홈) 아이콘 ④ 브랜드 강조 지점. 텍스트에는 쓰지 않는다.

## 2. Color (common.css 변수 실측)

### 텍스트 — 블랙 알파 스케일
| 토큰(원본) | 값 | 용도 |
|---|---|---|
| `--text-100` | `#000` | 제목·본문 강조 |
| `--text-88` | `rgba(0,0,0,.88)` | 본문 |
| `--text-72` | `rgba(0,0,0,.72)` | 보조 본문 |
| `--text-64` | `rgba(0,0,0,.64)` | 보조 |
| `--text-48` | `rgba(0,0,0,.48)` | 캡션·플레이스홀더 |
| `--text-32` | `rgba(0,0,0,.32)` | 최약 |
| `--text-link` | `#004BCC` | 링크 |

### 배경·표면
| 토큰(원본) | 값 | 용도 |
|---|---|---|
| `--bg-slot` | `#FFF` | 페이지·슬롯 기본 배경 (홈은 화이트) |
| `--bg-surface` / `--bg-on-slot` | `#F2F4F7` | 화이트 위 회색 카드 (날씨·코스피 카드) |
| `--bg-snackbar` / `--bg-bluegrey` | `#2C2E33` | 스낵바·다크 버튼 (블루그레이) |
| `--bg-btn-lightgray` | `#F2F4F7` | 회색 버튼 |
| `--bg-btn-disabled` | `#B4B9C2` | 비활성 |
| `--bg-hover` | `rgba(0,0,0,.04)` | 호버 |
| `--bg-dim-overlay-48/-32` | `rgba(0,0,0,.48/.32)` | 딤 |

### 포인트·시맨틱
| 토큰(원본) | 값 | 용도 |
|---|---|---|
| `--text-blue` / `--icon-blue` / `--indicator-activated` | `#1E84FF` | 포인트 블루(활성 인디케이터·이슈 배지) |
| `--bg-point-blue` | `#5B92FE` | 블루 배경 |
| `--text-red` / `--bg-point-red` | `#FF4E33` | 포인트 레드(속보 배지) |
| `--bg-point-red-live` | `#FF3333` | LIVE |
| `--text-green` | `#00B56D` | 그린 |
| 시세 상승/하락 | 상승 = 레드(`#FF4E33` 계열, 실측 `#f4492e` 병용) / 하락 = 블루(`#1E84FF` 계열) | **국내 증시 관례 — 상승이 빨강** |

### 카테고리 컬러 (참조)
스포츠 `#5C77FF` · 연예 `#A05CFF` · 스토리 `#FF5C66` · 관심 `#FF9429` · 멜론 `#1CE13A` · 페이 `#FEE500`
(각각 `.16`/`.08` 알파 틴트 변형 존재)

### 보더·디바이더
`--divider-4/8/16` = `rgba(0,0,0,.04/.08/.16)` · `--border-button` = `rgba(0,0,0,.1)` (pill 버튼 테두리)

## 3. Typography

```css
/* common.css 실측 폰트 스택 */
font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
  "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", sans-serif;
```

- 시스템 폰트 기반(별도 웹폰트 없음). career.daumcorp.com은 `Pretendard, sans-serif` — 폴백으로 포함.
- 스크린샷 실측 위계: 섹션 타이틀(실시간 트렌드·콘텐츠) **17~20px Bold**, 리스트 본문 15~16px Regular,
  카드 수치(28°, 5,319.71) **20~22px Bold**, 캡션·탭 라벨 11~12px.
- 숫자 강조는 Bold + 시세 색. 제목 줄바꿈은 2줄까지, 말줄임(…) 처리.

## 4. Shape & Spacing (실측)

- **라디우스 빈도(common.css)**: `8px`(최다 72회) > `10px` > `20px`(pill 버튼) > `12px` > `16px`(카드) > `50%`(원형).
  → 카드 16px, 작은 카드·썸네일 8~12px, 버튼·검색바 pill(999).
- 스크린샷 실측 간격: 페이지 좌우 여백 ~20px, 카드 내부 패딩 ~16px, 카드 간 간격 ~12px,
  리스트 행 상하 ~14px + `--divider-8` 구분선.
- 그림자 거의 없음 — **플랫**. 표면 위계는 그림자 대신 `#FFF` vs `#F2F4F7` 대비로 만든다.
  (잠금화면 알림 카드처럼 떠 있는 요소만 얕은 그림자 허용)

## 5. Components (스크린샷 실측)

- **검색바**: 흰 배경 pill + 브랜드 그라데이션 보더(§1) + 좌측 그라데이션 "D" 로고 + 우측 아이콘.
- **하단 탭바**: 5탭(홈·콘텐츠·커뮤니티·쇼핑·루프). 아이콘 1.5px 아웃라인 블랙, 라벨 11px.
  **활성 탭 아이콘만 브랜드 그라데이션 필**, 라벨은 블랙 유지. 상단 `--divider-8` 헤어라인.
- **정보 카드(날씨·코스피)**: `#F2F4F7` 플랫 카드, r-16, 수치 Bold, 시세 상승 레드 ▲/하락 블루 ▼.
- **배지**: `속보` = `#FF4E33` 필 화이트 텍스트 pill, `이슈` = `#1E84FF` 계열 pill, `(광고)`·`AD` = 그레이.
- **라인 탭(콘텐츠 상단)**: 텍스트 탭 + 활성 항목만 블랙 Bold + 2px 언더라인(`--indicator-default`).
- **pill 버튼**(새로운 주요 뉴스): 흰 배경 + `--border-button` 1px + pill.
- **링크·활성**: `#1E84FF`. 본문 링크는 `#004BCC`.
- **스낵바**: `--bg-snackbar` `#2C2E33` 배경 + 흰 텍스트, r-8, 패딩 **12 · 16**, 화면 하단에서 24 띄움.
  (DESIGN.md §4 Toast의 24·40 패딩은 IVI 대형 디스플레이 실측값이므로 모바일에는 쓰지 않는다)

## 6. `--daum-*` 토큰 매핑 (tokens.css)

이 저장소가 소비하는 레이어. dd 흐름 CSS는 **이 토큰만** 참조한다.

| 토큰 | 값(원본 매핑) |
|---|---|
| `--daum-grad` | §1 브랜드 그라데이션 원본 |
| `--daum-font` | §3 폰트 스택 (+Pretendard 폴백) |
| `--daum-bg` | `#FFF` (bg-slot) / 다크 `#1C1E21` |
| `--daum-card` | `#F2F4F7` (bg-on-slot) / 다크 `#2C2E33` |
| `--daum-text` `-sub` `-weak` | `#000` · `.72` · `.48` 알파 / 다크 화이트 알파 |
| `--daum-blue` | `#1E84FF` |
| `--daum-red` | `#FF4E33` |
| `--daum-bluegray` | `#2C2E33` (유저 버블·스낵바) |
| `--daum-divider` | `rgba(0,0,0,.08)` |
| `--daum-border-btn` | `rgba(0,0,0,.1)` |
| `--daum-r-card` | 16px · `--daum-r-sm` 8px |

다크 모드는 다음 앱 다크(배경 `#1C1E21`·`#131416` 계열, 화이트 알파 텍스트) 실측 근사로 정의한다.

## 7. 아이콘 · 로고 · 모션 (m.daum.net 실측)

### 로고
- **"D" 심벌 원본 SVG**를 m.daum.net 마크업에서 그대로 추출해 [`assets/daum/logo-d.svg`](assets/daum/logo-d.svg)로 보존
  (56×56, 마스크 + 라디얼 그라데이션 4겹: `#1E84FF` · `#22BB64` · `#2FD800` · `#FFC622`).
- 검색바 좌측 로고·대화 아바타·알림 앱 아이콘은 이 원본 파일을 `<img>`로 사용한다.

### 아이콘 (원본 path 추출, `fill=currentColor`로 치환해 사용)
- **돋보기(검색)**: 28×28, 원 + 45° 핸들, 원본 `fill-opacity .64`
- **마이크(음성)**: 28×28 원본 path — 캡슐 몸체 + 픽업 호 + 스탠드. 대화 입력바 음성 버튼에 사용
- **알림 벨**: 웹에 없어 앱 기준 1.5px 아웃라인으로 재제작 (앱바 우측)
- **로딩 스피너**: SMIL `animateTransform rotate 1s indefinite` + 호(arc) path, `stroke-opacity .4`,
  `stroke-width 4`, viewBox `-20 -20 40 40` — 다음 실제 로딩 인디케이터 그대로
- 하단 탭 아이콘(홈·콘텐츠·커뮤니티·쇼핑·루프)은 앱 전용이라 웹에 없음 → 스크린샷 기준
  1.5px 아웃라인으로 재제작, **활성 탭만 브랜드 그라데이션 스트로크**

### 모션 (common.css @keyframes 원본)
| 이름 | 원본 정의 | 이식 위치 |
|---|---|---|
| `trend_rolling` | `0% {opacity:0; translateY(30px)} → to {opacity:1; translateY(0)}` | 새 메시지·리스트 등장 |
| `appAlarm` | `0% {opacity:0; scale(0)} → to {scale(1)}` | 뱃지·알림 카드 팝인 |
| `liveDot` | `0/25% {opacity:1} 50/75% {opacity:.2} to {1}` (스텝 점멸) | 음성 실시간 표시 점 |
| `skeleton` | `background-position -120px → 689px` (시머) | 미적용 — 로딩은 원본 SMIL 스피너로 대체 |
| `btnLoading` | `rotate(0 → 360deg)` | 스피너 폴백 |
| 전환 커브 | `cubic-bezier(.22,.61,.36,1)` (`--daum-ease`) · `max-height .4s cubic-bezier(.33,1,.68,1)` | 공통 트랜지션 |

---

*값은 2026-08-30 추출 시점 기준. 다음 개편 시 common.css 재추출로 갱신한다.*

# mockup

포트폴리오 목업 사이트. 순수 정적 HTML/CSS/JS로 작성하며 GitHub Pages로 배포한다.

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- 빌드 도구 없음 (No build step)
- 호스팅: GitHub Pages

## 디렉터리 구조

```
mockup/
├── index.html            # 카테고리 목록(진입점)
├── showcase.html         # 시나리오 리모컨 + 웹/앱 동시 프리뷰
├── components.html       # 컴포넌트 갤러리(DESIGN §4)
├── account-transfer.html # (레거시) 단일 페이지 흐름 참조
├── css/
│   ├── tokens.css        # 디자인 토큰 레이어(최초 로드)
│   ├── style.css         # 베이스 리셋 + 앱 셸
│   ├── components.css    # 컴포넌트 라이브러리
│   └── showcase.css      # 쇼케이스 셸 + One ID 흐름 @container
├── js/                   # screens/showcase/components/main
├── README.md
├── DESIGN.md             # 디자인 시스템 (SSOT) — 모든 UI가 따름
├── CLAUDE.md
└── AGENTS.md
```

내비게이션(2단계): `index`(카테고리) → `showcase`(웹/앱 동시 UX 목업).
CSS 로드 순서: `tokens.css → style.css → components.css → [page].css`.

## 디자인 시스템

모든 UI는 [`DESIGN.md`](DESIGN.md)의 토큰·원칙을 따른다. 색상·타이포·간격·라운드·그림자·
모션은 DESIGN.md에 정의된 CSS 변수만 사용한다. (Pleos Connect UI Design Guide를 웹/모바일에
맞게 적응)

## 로컬 실행

빌드 과정이 없으므로 `index.html`을 브라우저로 바로 열면 된다. 다만 일부 브라우저는
로컬 파일에서 `fetch`/모듈 로딩을 막으므로 간단한 정적 서버를 쓰는 것을 권장한다.

```bash
python3 -m http.server 8000
```

이후 `http://localhost:8000` 접속.

## 배포 (GitHub Pages)

이 프로젝트는 빌드가 없어 별도의 GitHub Actions 워크플로우가 필요 없다.

1. GitHub 저장소 → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/ (root)` 선택 후 **Save**
4. 잠시 후 `https://Park-ji-ho.github.io/mockup/` 에서 확인

`main`에 push하면 자동으로 반영된다.

## Figma로 가져오기 (Export)

이 목업은 공개 URL(GitHub Pages)로 배포되므로, 별도 개발 없이 기존 플러그인으로
Figma에 편집 가능한 레이어로 임포트할 수 있다.

> 참고: Figma는 REST API로 외부에서 레이어를 *생성*할 수 없다. 노드 생성은 Figma
> 내부에서 실행되는 플러그인만 가능하므로, 아래처럼 임포트 플러그인을 사용한다.

1. Figma에서 **Menu → Plugins → Browse plugins**로 이동
2. **html.to.design** (또는 유사 HTML 임포트 플러그인)을 설치
3. 플러그인 실행 후 배포 URL 입력:
   `https://Park-ji-ho.github.io/mockup/`
4. Import를 실행하면 페이지가 프레임/레이어로 변환되어 Figma 캔버스에 들어온다.

로컬 작업본을 그대로 가져오려면 `python3 -m http.server`로 띄운 뒤
`http://localhost:8000` 을 플러그인에 입력하면 된다. (플러그인이 localhost 접근을
지원하는 경우)

### Figma 임포트가 잘 되도록 하는 작성 규칙

- 시맨틱 태그와 명확한 클래스명을 사용한다. (레이어명이 이 값으로 매핑됨)
- 레이아웃은 Flexbox/Grid로 구성한다. (Auto Layout으로 잘 변환됨)
- 이미지·아이콘은 가능하면 SVG로 둔다. (벡터로 임포트되어 재편집 용이)
- 색·간격·타이포는 CSS 변수(`:root`)로 관리한다. (디자인 토큰 대응이 쉬워짐)

## 커밋 규칙

- 커밋 메시지는 명령형 현재 시제로 간결하게 작성한다. (예: `Add hero section`, `Fix nav layout`)
- 하나의 커밋은 하나의 논리적 변경만 담는다.
- 접두어 권장: `feat`, `fix`, `style`, `docs`, `refactor`, `chore`

## 브랜치 전략

- `main`: 배포 브랜치. 항상 동작하는 상태를 유지한다.
- 기능 작업은 `feat/xxx`, 수정은 `fix/xxx` 브랜치에서 진행 후 병합한다.

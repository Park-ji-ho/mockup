# mockup

포트폴리오 목업 사이트. 순수 정적 HTML/CSS/JS로 작성하며 GitHub Pages로 배포한다.

## 기술 스택

- HTML5 / CSS3 / Vanilla JavaScript
- 빌드 도구 없음 (No build step)
- 호스팅: GitHub Pages

## 디렉터리 구조

```
mockup/
├── index.html        # 진입점
├── css/              # 스타일시트
├── js/               # 스크립트
├── assets/           # 이미지, 폰트 등 정적 리소스
├── README.md
├── CLAUDE.md
└── AGENTS.md
```

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

## 커밋 규칙

- 커밋 메시지는 명령형 현재 시제로 간결하게 작성한다. (예: `Add hero section`, `Fix nav layout`)
- 하나의 커밋은 하나의 논리적 변경만 담는다.
- 접두어 권장: `feat`, `fix`, `style`, `docs`, `refactor`, `chore`

## 브랜치 전략

- `main`: 배포 브랜치. 항상 동작하는 상태를 유지한다.
- 기능 작업은 `feat/xxx`, 수정은 `fix/xxx` 브랜치에서 진행 후 병합한다.

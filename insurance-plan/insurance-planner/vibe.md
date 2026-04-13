# 🌊 바이브 코딩(Vibe Coding) 마스터 클래스 강의 자료

> [!NOTE]
> 본 안내서는 바이브 코딩(AI 보조 코딩)의 개념을 이해하고, 형태별 주요 툴을 학습하며, 궁극적으로 하나의 웹 서비스를 기획부터 개발, 배포(Vercel) 및 백엔드(Supabase) 연동까지 완성하는 흐름을 안내하기 위해 제작되었습니다.

---

## 1. 주요 바이브 코딩 툴 소개

### 🤖 1. 대화형 AI 어시스턴트
가장 기본적인 형태로, 질문을 통해 코드 조각을 요청하거나 에러를 붙여넣기 하여 해결책을 얻는 방식입니다.

- <img alt="ChatGPT" src="https://cdn.simpleicons.org/openai/000000" width="24" height="24" style="vertical-align: middle;" /> **ChatGPT / GPT-4o**: 가장 범용적인 코딩, 로직 구성 및 문서화 툴
- <img alt="Claude" src="https://cdn.simpleicons.org/anthropic/D97757" width="24" height="24" style="vertical-align: middle;" /> **Claude 3.5 Sonnet**: 강력한 컨텍스트 인지와 뛰어난 코드 작성 능력을 지닌 최고의 프론트엔드 파트너
- <img alt="Gemini" src="https://cdn.simpleicons.org/googlegemini/8E75B2" width="24" height="24" style="vertical-align: middle;" /> **Gemini 1.5 Pro**: 구글 생태계 연동, 대규모 코드베이스 분석 및 최신 정보 검색 특화

### 💻 2. AI 네이티브 IDE (통합 개발 환경)
에디터 자체에 AI가 내장되어, 여러 파일 간의 연관성을 파악하고 프로젝트 전체를 이해하며 코드를 작성합니다.

- <img alt="Cursor" src="https://mintlify.s3-us-west-1.amazonaws.com/cursor/images/logo/cursor-logo-light.svg" width="24" height="24" style="vertical-align: middle;" /> **Cursor**: 현재 가장 인기 있는 AI 특화 에디터. Composer를 통한 다중 파일 동시 편집 기능을 제공하여 압도적인 생산성을 보여줍니다.
- <img alt="Windsurf" src="https://codeium.com/logo-blue.svg" width="24" height="24" style="vertical-align: middle;" /> **Windsurf**: Codeium 기반의 에이전틱 AI IDE로, 독립적인 터미널 실행과 분석을 지원합니다.

### 🚀 3. 에이전틱 AI 시스템 (Agentic AI)
개발자를 대신해 터미널을 직접 제어하고, 깃허브를 읽고, 실제로 파일을 만들며 다단계 작업을 자율적으로 수행하는 다음 세대 AI입니다.

- <img alt="Antigravity" src="https://cdn.simpleicons.org/google/4285F4" width="24" height="24" style="vertical-align: middle;" /> **Antigravity**: 구글 딥마인드에서 설계한 인공지능으로, 사용자의 컴퓨터 내에서 명령어 실행, 브라우저 제어, 파일 수정 등 복합적인 과제를 수행하여 서비스 기획부터 배포까지 자율적으로 책임집니다. 

---

## 2. Antigravity를 통한 페이지 제작 방법

Antigravity는 단순한 레퍼런스 제공을 넘어, 로컬 환경에서 직접 웹 서버 구동부터 디자인 및 빌드 단계까지 프로젝트 전반을 주도합니다.

### 🎯 Step 1: 명확한 초기 지시(Prompt) 작성
> **"저는 [어떤 목적]의 웹페이지를 만들고 싶습니다. 기술 스택은 [Next.js와 Tailwind CSS]를 사용해 주시고, 전체적인 디자인은 애플 느낌의 프리미엄 다크 모드로 구성해 주세요."**
* 💡 **핵심**: 만들고자 하는 목적과 사용할 기술 스택, 그리고 원하는 시각적 스타일(Aesthetics)을 명확히 전달해야 퀄리티 높은 코드가 도출됩니다.

### 📝 Step 2: Implementation Plan (구현 계획) 검토 및 승인
1. Antigravity가 작업 시작 전 `implementation_plan.md` 문서를 작성하여 보여줍니다.
2. 사용자는 생성될 파일 목록, 구조, 아키텍처를 확인한 후 **"이대로 진행해 (승인)"** 혹은 **"여기서 컬러 톤만 수정해줘"** 와 같이 방향성을 조율합니다.

### ⚡ Step 3: 자율 실행 (Auto-Execution) 진행
* 승인이 떨어지면 터미널에서 패키지 생성 커맨드(`npx create-next-app` 등)를 알아서 실행하고 컴포넌트를 구축합니다.
* 사용자는 파일 구조가 변경되고 코드가 생성되는 과정을 모니터링하며, 막히는 곳이 있을 때 승인이나 추가 답변만 제공합니다.

### 🛠️ Step 4: 실시간 확인과 반복(Iteration) 피드백
* 로컬 서버가 구동되면 화면을 보면서, "버튼 호버 이벤트를 부드럽게 해줘", "여기 간격을 넓히고 텍스트는 좌측 정렬해 줘" 와 같이 대화하듯(Vibing) 피드백하며 구체적인 UI/UX 디테일을 완성합니다.

---

## 3. Vercel 및 Supabase 연동 프레임워크

프론트엔드 호스팅은 Vercel에, 데이터베이스 관리와 유저 인증은 Supabase에 위임하여 서버리스 풀스택 애플리케이션을 완성합니다.

### 🗄️ 백엔드: Supabase 세팅 및 연동
<img alt="Supabase" src="https://cdn.simpleicons.org/supabase/3ECF8E" width="50" height="50" style="margin-bottom: 10px;" />

1. **프로젝트 생성**: [Supabase](https://supabase.com)에 로그인하여 새로운 프로젝트 조직을 생성합니다.
2. **테이블 구성**: 대시보드의 Table Editor를 통해 필요한 PostgreSQL 테이블을 빠르게 생성합니다.
3. **API Key 획득**: `Project Settings > API` 메뉴에서 **Project URL**과 **anon key**를 복사합니다.
4. **로컬 환경 변수 설정**: 
   루트 디렉토리에 `.env.local` 파일을 만들고 복사한 키를 붙여넣습니다.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=당신의_프로젝트_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=당신의_ANON_KEY
   ```
5. **AI에게 연동 지시**:
   Antigravity에게 **"내 프로젝트에 Supabase를 연결할거야. Supabase Client를 구성하는 스크립트를 작성하고 해당 환경변수를 불러와 동작하게 구성해줘."** 라고 지시하여 로직 작성을 맡깁니다.

### 🌐 프론트엔드: Vercel 포팅 및 배포
<img alt="Vercel" src="https://cdn.simpleicons.org/vercel/000000" width="50" height="50" style="margin-bottom: 10px;" />

1. **GitHub 저장소 연동**: 로컬에서 작성된 코드를 GitHub Repository에 업로드(Push) 합니다. (이 작업도 Antigravity에게 git 커맨드 실행을 위임할 수 있습니다)
2. **Vercel 프로젝트 생성**: [Vercel](https://vercel.com) 대시보드에서 `Add New Project`를 클릭하고, 방금 업로드 한 GitHub 저장소를 Import 합니다.
3. **환경 변수 등록 (Environment Variables)**:
   * 배포 전 설정 창(Configure Project)에서, 조금 전 로컬 `.env.local`에 적용했던 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 똑같이 찾아 등록해 줍니다. 그래야 상용 배포 버전에서도 DB에 무사히 연결됩니다.
4. **Deploy**: `Deploy` 버튼을 누릅니다. Vercel이 모든 빌드 과정을 자동으로 수행하고, 전 세계 어디서든 접속할 수 있는 라이브 도메인을 발급해 줍니다! 🎉

---

> [!TIP]
> **마인드셋 전환 가이드** 💡
> 코드 문법을 한 줄 한 줄 고민하며 스트레스받지 마세요. 바이브 코딩 시대에 여러분은 '코더'가 아니라 **'프로덕트 매니저(PM)'이자 '디렉터'**입니다. 내가 구현할 서비스의 **"목적과 플로우"**를 AI에게 얼마나 명확히 설명할 수 있는가가 곧 개발 실력입니다!

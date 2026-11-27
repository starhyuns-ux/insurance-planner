# 📝 CEO 종합 보고서

**구체적이고 실행 가능한 한국어 지시**

1. **트렌드 스나이퍼 실행**
	* 실행: <run_command>cd "/Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools" && python3 trend_sniper.py</run_command>
	* 설정 파일(API 키 등): /Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools/trend_sniper.json
	* 목표: 최근 30일 떡상 영상을 분석하여 다음 영상 기획안(제목·썸네일·후크)을 도출

2. **내 채널 영상 체크**
	* 실행: <run_command>cd "/Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools" && python3 my_videos_check.py</run_command>
	* 설정 파일(API 키 등): /Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools/my_videos_check.json
	* 목표: 본인 채널의 최근 영상이 잘 올라갔는지 한눈에 봄

**에이전트 배정**

* 트렌드 스나이퍼: 레오 에이전트
* 내 채널 영상 체크: 영숙 에이전트

**메모리**
* 최근 의사결정 로그: [2026-11-27] 1인 기업 24시간 운영 중. 회사 목표·각 에이전트의 개인 목표(_agents/{id}/goal.md)·최근 의사결정·메모리를 검토해서 지금 가장 가치 있는 단일 작업 1개를 결정하고, 적절한 1~2명 에이전트에게 분배해서 실행
* 최근 5일간의 릴스 및 피드 분석 결과 제시: [2026-11-27] 최근 5일간의 릴스 및 피드 분석 결과 제시

**지시**
* 트렌드 스나이퍼: 최근 30일 떡상 영상을 분석하여 다음 영상 기획안(제목·썸네일·후크)을 도출
* 내 채널 영상 체크: 본인 채널의 최근 영상이 잘 올라갔는지 한눈에 봄

---
## 🛠️ 도구 실행 결과 (시스템 자동 실행)

### 🔧 실행: `cd "/Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools" && python3 trend_sniper.py`
```
⚠️  YOUTUBE_API_KEY가 비어있어요. youtube_account.json 또는 trend_sniper.json에 입력하세요.
   발급: https://console.cloud.google.com/ → YouTube Data API v3 사용 설정 → 사용자 인증 정보 → API 키
```
_❌ exit 1_

### 🔧 실행: `cd "/Users/stroy/.connect-ai-brain/_company/_agents/youtube/tools" && python3 my_videos_check.py`
```
❌ YOUTUBE_API_KEY 미설정. youtube_account.json에 채워주세요.
```
_❌ exit 1_

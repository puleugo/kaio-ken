---
description: Spread Sheet, Git Action에 대한 설정을 수행합니다.
---

# 실행을 위한 준비

## 1. Google SpreadSheet 복제

시작하기 위해서는 [Google SpreadSheet Template](https://docs.google.com/spreadsheets/d/1cF9sShsCInHFomFTC69LC9QzVKJQZK2\_TqCs9hNMRMk/edit?gid=0#gid=0)을 복제해야합니다. SpreadSheet는 Blogs에 대한 정보를 읽어오는 데에 사용됩니다.

\[파일] -> \[사본 만들기]를 통해 복제할 수 있습니다.



<table data-full-width="true"><thead><tr><th>블로그 명</th><th data-type="number">마지막 배포 게시글 ID</th><th>마지막 배포일</th><th>RSS</th><th>플랫폼<select><option value="lGQbLCOGBq0e" label="Tistory" color="blue"></option><option value="5Xz6xbhswasi" label="Medium" color="blue"></option></select></th><th>발행 블로그 여부<select><option value="Tlytuzlg3O14" label="SUBSCRIBER" color="blue"></option><option value="0CsL6HxxnjNN" label="PUBLISHER" color="blue"></option></select></th></tr></thead><tbody><tr><td>푸르고 블로그</td><td>0</td><td>2023-12-01</td><td><a href="https://ko.puleugo.dev/rss">https://ko.puleugo.dev/rss</a></td><td><span data-option="lGQbLCOGBq0e">Tistory</span></td><td><span data-option="0CsL6HxxnjNN">PUBLISHER</span></td></tr><tr><td>Puleugo Blog</td><td>0</td><td>2023-12-01</td><td>(Subsriber Blog는 선택)</td><td><span data-option="5Xz6xbhswasi">Medium</span></td><td><span data-option="0CsL6HxxnjNN">PUBLISHER</span></td></tr></tbody></table>

위와 같은 예제가 제공됩니다.

### 속성 소개

<table><thead><tr><th>속성</th><th>설명</th><th>편집 가능 여부<select><option value="Nm7lBb8LzdtK" label="허용" color="blue"></option><option value="Tkfbsfjr4syn" label="비허용" color="blue"></option></select></th></tr></thead><tbody><tr><td>블로그 명</td><td>별 의미는 없습니다. 블로그 식별을 위한 메모 정도로 사용하시면 됩니다. </td><td><span data-option="Nm7lBb8LzdtK">허용</span></td></tr><tr><td>마지막 배포 게시글 ID</td><td>계왕권은 내부적으로 Auto Increment 전략으로 게시글을 관리합니다. 절대로 수정하지 마세요.</td><td><span data-option="Tkfbsfjr4syn">비허용</span></td></tr><tr><td>마지막 배포일</td><td>ISO 8601 표준을 사용합니다. YYYY-MM-DD의 형식입니다. 수정 허용되지 않으니 오타걱정은 하지 않으셔도 됩니다.</td><td><span data-option="Tkfbsfjr4syn">비허용</span></td></tr><tr><td>RSS</td><td>Publisher 블로그의 Rss url 주소를 입력해주세요.</td><td><span data-option="Nm7lBb8LzdtK">허용</span></td></tr><tr><td>플랫폼</td><td>현재 Tistory, Medium을 지원합니다. 게시글을 발행 후 URL을 얻을 수 있는 모든 플랫폼이 추가될 수 있습니다. 순차적으로 지원할 예정입니다.</td><td><span data-option="Nm7lBb8LzdtK">허용</span></td></tr><tr><td>발행 블로그 여부</td><td>PUBLISHER, SUBSCRIBER, UNSUBSCRIBER 속성을 지원합니다.</td><td><span data-option="Nm7lBb8LzdtK">허용</span></td></tr></tbody></table>



## 2. Git Action 추가

Github Repository를 생성하고 Github Action 파일을 추가하세요.

{% code title=".github/workflows/auto-translate.yml" lineNumbers="true" %}
```yaml
name: 'Auto Translate'

on:
  workflow_dispatch: # 수동 실행
    schedule:
        - cron: "0 4 * * *" # 매일 13시에 자동 실행

env:
  REPOSITORY: github.repository
  GITHUB_USER: github.actor

jobs:
  auto-translate:
    runs-on: ubuntu-latest
    steps:
      - name: Auto Translate
        uses: puleugo/kablog@main
        with:
            GH_REPOSITORY: 'YOUR-REPOSITORY'
            GH_USER: 'YOUR-USERNAME'
            GH_TOKEN: ${{ secrets.GH_TOKEN }}

            GOOGLE_SHEET_ID: ${{ secrets.GOOGLE_SHEET_ID }}
            GOOGLE_CLIENT_EMAIL: ${{ secrets.GOOGLE_CLIENT_EMAIL }}
            GOOGLE_PRIVATE_KEY: ${{ secrets.GOOGLE_PRIVATE_KEY }}

            OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
            MEDIUM_TOKEN: ${{ secrets.MEDIUM_TOKEN }}
            METHOD: | # 게시글을 읽어서 Github에 저장, 번역하여 배포
              - 'READ'
              - 'PUBLISH' 
```
{% endcode %}



## 3. sitemap.xml을 Git Repository에 추가합니다.

배포 블로그의 sitemap을 복사합니다. Tistory의 경우 `https://{your-id}.tistory.com/rss`를 통해 읽어올 수 있습니다.

다음과 같은 위치에 추가합니다.

```
root
├─┬ .github
│ └─┬ workflow
│   └─ auto-translate.yml
│   
└── sitemap.xml

```



## 4. 환경 변수 추가

계왕권은 노코드 툴을 지향하는 서비스이기 때문에 외부 의존성과 환경 변수를 추가해주어야 합니다. 다행인 점은 유능한 개발자분들이 많아서 대부분의 서비스에서 버튼 2-3회 클릭만으로 API 토큰을 쉽게 발급할 수 있다는 점입니다.

<table><thead><tr><th align="center">속성</th><th width="126">예상 소요시간</th><th align="center">설명</th><th align="center">발급 방법</th></tr></thead><tbody><tr><td align="center">GH_TOKEN</td><td>1m</td><td align="center">깃허브 액션 실행 토큰</td><td align="center"><a href="undefined.md#id-3-1">GO TO</a></td></tr><tr><td align="center">GOOGLE_CLIENT_EMAIL</td><td>1m</td><td align="center">GOOGLE API 호출 담당자 EMAIL<br>(Sheet API 권한 필요)</td><td align="center"><a href="undefined.md#id-3-2">GO TO</a></td></tr><tr><td align="center">GOOGLE_PRIVATE_KEY</td><td>1s</td><td align="center">GOOGLE API 호출 Key</td><td align="center"><a href="undefined.md#id-3-3.-private-key">GO TO</a></td></tr><tr><td align="center">GOOGLE_SHEET_ID</td><td>30s</td><td align="center">구글 스프레드 시트 ID</td><td align="center"><a href="undefined.md#id-3-4.-id">GO TO</a></td></tr><tr><td align="center">OPENAI_API_KEY</td><td>30s</td><td align="center">ChatGPT API Key</td><td align="center"><a href="undefined.md#id-3-5.-chat-gpt-key-open-ai">GO TO</a></td></tr><tr><td align="center">MEDIUM_TOKEN</td><td>30s</td><td align="center">Medium API Token</td><td align="center"><a href="undefined.md#id-3-6.-medium-token">GO TO</a></td></tr></tbody></table>



### 4-1. 깃허브 토큰

1. [Github 토큰 페이지 접속](https://github.com/settings/tokens)
2. Generate new token (classic) 클릭
3. workflow 권한 허용



### 4-2. 구글 클라이언트 이메일

1. [구글 클라우드 콘솔 접속](https://console.cloud.google.com/)
2. `프로젝트 선택` → `새 프로젝트` 생성
3. `API 및 서비스` → `Google Sheets API` → `사용 설정`
4. `API 및 서비스` → `사용자 인증 정보 만들기` → `서비스 계정` → `서비스 계정 ID 생성` → `완료`



### 4-3. 구글 Private Key

1. [Welcom Page로 이동](https://console.cloud.google.com/welcome)
2. `메뉴` → `IAM 및 관리자` → `서비스 계정` → `키` → `새 키 만들기` → `JSON` 선택 → `키 생성`



### 4-4. 구글 스프레드시트 ID

1. [Google Sheet 템플릿 접속](https://docs.google.com/spreadsheets/d/1cF9sShsCInHFomFTC69LC9QzVKJQZK2\_TqCs9hNMRMk)
2. `파일` → `사본 만들기`
3. `복제된 시트`의 URL에서 `https://docs.google.com/spreadsheets/d/` 뒷부분이 `GOOGLE_SHEET_ID` \
   예시: `1cF9sShsCInHFomFTC69LC9QzVKJQZK2_TqCs9hNMRMk`



### 4-5. Chat GPT Key(OPEN AI)&#x20;

1. [API Keys 페이지 접속](https://platform.openai.com/api-keys)
2. `Create new secret key` 클릭



### 4-6. Medium Token

1. [Security and apps 페이지 접속](https://medium.com/me/settings/security)
2. `Integration tokens` 클릭





##



&#x20;

\



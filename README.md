# Kaio-ken(계왕권)

![img.png](static/logo.png)

- This Is A Beta Version.

## 소개

계왕권은 자동 블로그 게시글 번역 및 배포 파이프라인입니다. Github Actions, metadata.yml 두 파일만으로 완벽하게 사용할 수 있도록 하는 것을 서비스 철학을 하고 있습니다.

```yml
publisher:
  id: 1
  title: 원본 블로그
  url: "https://ko.puleugo.dev"
  rssUrl: "https://puleugo.tistory.com/rss"
  language: ko
  platform: tistory
  publishedId: 10

subscribers:
  - id: 2
    title: 영어 블로그
    url: "https://en.puleugo.dev"
    language: en
    platform: medium
    publishedId: 10

  - id: 3
    title: 일본어 블로그
    url: "https://ja.puleugo.dev"
    language: ja
    platform: qiita
    subscribe: false
    publishedId: 0
```

## 왜 개발하는가?

저는 프로그래밍을 시작한 이후 한국의 시니어 개발자들의 이야기를 듣고 그들의 경험을 얻고자 노력했습니다.
그들의 공통된 조언이자 후회는 프로그래밍에 쏟은 노력을 외국어 학습에 쏟았다면 더 많은 기회를 얻을 수 있었을 것이라는 것이었습니다.
구글, 페이스북 같은 IT 기업의 헤드헌터에게 연락이 오더라도 영어능력의 부재로 인해 기회를 포기하는 경우도 들었으며, 본인의 역량을 그들에게 전달하지 못하는 것이 가장 큰 아쉬움이었습니다.

'계왕권'은 선배들에게 받은 조언 통해 미래의 나의 노력을 배로 향상시켜줄 것을 확신하고 개발하는 프로젝트입니다.

## 당신은 무엇을 얻을 수 있나요?

1. 단 한번의 액션으로 게시글을 번역하고 배포할 수 있습니다.
2. SEO, Localized Versioning, Manage Blogs 등에 신경써야 하는 사용하는 노력을 프로그래밍 학습, 프로젝트에 집중할 수 있습니다.
3. Affiliate Marketing, Adsense 등을 통해 기존 대비 약 44배의 수익을 얻을 수 있습니다.

## 번역 퀄리티

- 한국어(원본): https://ko.puleugo.dev/209
- 영어(번역본): https://en.puleugo.dev/refactoring-monster-methods-and-improving-performance-refactor-safely-0fe2f2140d22

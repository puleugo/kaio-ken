---
description: 번역 게시글과 원본 게시글을 연결하기 위해 도메인과 사이트맵을 적용합니다.
---

# 현지화 버저닝

## 1. 도메인 구매하기

Medium, Tistory로부터 게시글에 대한 메타데이터를 수정할 권리를 개인 도메인으로 가져와야합니다. [Porkbun](https://porkbun.com/)에서 연 2만원에 괜찮은 도메인을 구매할 수 있습니다. 구린 도메인이라면 3천원 정도로도 구할 수 있습니다.



## 2. Vercel과 Github Repository를 연결하기

Vercel을 통해 [sitemap.xml](../undefined-2/sitemap.md)을 업로드할 웹서버를 생성합니다.\
[Vercel](https://vercel.com)에 접속하여 계왕권 Action이 추가되어 있는 Git Repository를 Import를 수행하면 됩니다.&#x20;

서버 인스턴스가 생성되면 다음 Step으로 넘어갑니다.

### 2-1. Vercel에 도메인을 등록합니다.

방금 추가한 서버 인스턴스에서 Domain -> Add를 통해 도메인을 추가합니다. 서브 도메인 없이 다음과 같은 형태로 추가합니다.&#x20;

{% hint style="info" %}
Vercel을 통해 Git Repository에서 sitemap.xml을 웹서버에 배포할 수 있도록합니다.

배포된 sitemap.xml은 Google Crawler가 읽습니다.
{% endhint %}



## 3. 블로그 도메인 연결하기

이 섹션에서는 본인이 이용하는 블로그만 수행하면 됩니다.

### 3-1. Tistory

1. [Tistory 접속](https://www.tistory.com/)
2. 관리자페이지
3. 관리
4. 블로그
5. 개인 도메인 추가

서브도메인에 `ko`를 추가합니다.&#x20;

{% hint style="info" %}
예시: `ko.puleugo.dev`
{% endhint %}



### 3-2. Medium

1. [Settings](https://medium.com/me/settings)
2. Custom domain
3. Link domain

서브도메인에 `en`를 추가합니다.&#x20;

{% hint style="info" %}
예시: `en.puleugo.dev`
{% endhint %}



## 4. 도메인 Google Search Console에 등록하기

Google Search Console은 구글 검색과 크롤러와 관련된 내용을 설정할 수 있는 사이트입니다.

1. [Google Search Console 접속](https://search.google.com/search-console)
2. 속성 추가
3. 도매인(신규)
4. 당신의 도메인 입력. 예시) puleugo.dev
5. 등록 완료



### 4-1. Sitemap URL 등록

1. [Sitemaps 페이지 접속](https://app.gitbook.com/o/ZbSQLTbJpVessDnuvkGt/s/pWUdC8yZCMbut0C1Nt4J/)
2. Vercel 웹서버를 통해 배포하는 sitemap.xml 주소 등록

{% hint style="info" %}
예시: [https://puleugo.dev/sitemap.xml](https://puleugo.dev/sitemap.xml)
{% endhint %}


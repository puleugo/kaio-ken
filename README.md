# KaBlog

- This Is A Alpha Version.
- Alpha 버전입니다.

## 프로젝트 소개(Kaio-ken Blog)
양질의 개발 아티클을 자동으로 번역하여 해외 블로그로 제공하는 프로젝트입니다. 선진국 10개국에 이 서비스를 제공한다는 가정하에 단순 계산으로 약 44배의 독자층에게 노출되는 가치를 제공받을 수 있습니다. 

[Started At](https://puleugo.tistory.com/206)

## Kaio-ken Blog 프로젝트가 제공하고자 하는 가치
1. Do Not Manage: 별도의 관리 없이 알잘딱으로 번역하여 블로그에 게시합니다.
2. Free And Server-less: 무료 기능들을 사용하여 서비스를 제공합니다.
3. Run In Mobile: 구글 스프레드 시트와 Git Action을 통해 모바일 기기나 PC방에서도 쉽게 조작할 수 있습니다.

## 사용방법 (설정 약 5분)
1. [구글 스프레드 시트](https://docs.google.com/spreadsheets/d/1cF9sShsCInHFomFTC69LC9QzVKJQZK2_TqCs9hNMRMk)를 복제합니다. `[파일] → [사본 만들기]`
2. 복제한 스프레드 시트에 블로그를 등록합니다.
3. [github action](example%2Fauto-translate-example.yml)에서 필요로하는 환경변수를 설정합니다. [3분만에 환경변수 설정하기](ENVIROMENT_SHORTCUT.md)
4. `.github/workflows`에 [예시](example%2Fauto-translate-example.yml)를 참고하여 Action.yml 파일을 생성합니다.
5. 끝!

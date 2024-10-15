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

## 실행
아래 명령어는 빌드 후에 환경변수를 설정한 후 실행하는 명령어입니다.
깃 액션에서도 다음과 같이 실행됩니다. 아래 변수들은 모두 랜덤한 값입니다.
```bash
npm run build && npx cross-env \
  GH_REPOSITORY='kablog-test' \  # GITHUB_지 않는 이유는 GITHUB SECRET 명명 규칙과 충돌하기 때문입니다.
  GH_TOKEN='ghp_HIUONDc7214nCXNIOUQW1r91' \
  GH_OWNER='puleugo'\
  GOOGLE_SHEET_ID='jqhhqwui3127hiJwdiq2' \
  GOOGLE_CLIENT_EMAIL='kablog@kablog-128040912759243.iam.gserviceaccount.com' \
  GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----\nqwduqwhifuqwehfiuhwifyugwquwfuyduebfwutjfqvu\nfgquyfgquiwyegfiqenbyuixfgcvbiufegcui\nqfygiuyubiwgucyvgbiuq\nfguqywegnciuvbgiuy\n-----END PRIVATE KEY-----\n' \
  npm run start
```

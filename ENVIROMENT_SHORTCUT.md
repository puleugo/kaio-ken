# 3분만에 환경설정하기

## GH_TOKEN(1m)
1. [Github 토큰 페이지 접속](https://github.com/settings/tokens)
2. Generate new token (classic) 클릭
3. workflow 권한 허용

## GOOGLE_CLIENT_EMAIL(1m)
1. [구글 클라우드 콘솔 접속](https://console.cloud.google.com/)
2. `프로젝트 선택` → `새 프로젝트` 생성
3. `API 및 서비스` → `Google Sheets API` → `사용 설정`
4. `API 및 서비스` → `사용자 인증 정보 만들기` → `서비스 계정` → `서비스 계정 ID 생성` → `완료`

## GOOGLE_PRIVATE_KEY(1s)
1. `서비스 계정` → `키` → `새 키 만들기` → `JSON` 선택 → `키 생성`

## GOOGLE_SHEET_ID(30s)
1. [Google Sheet 템플릿 접속](https://docs.google.com/spreadsheets/d/1cF9sShsCInHFomFTC69LC9QzVKJQZK2_TqCs9hNMRMk)
2. `파일` → `사본 만들기`
3. `복제된 시트`의 URL에서 `https://docs.google.com/spreadsheets/d/` 뒷부분이 `GOOGLE_SHEET_ID` 예시: `1cF9sShsCInHFomFTC69LC9QzVKJQZK2_TqCs9hNMRMk`

## OPENAI_API_KEY(30s)
1. [API Keys 페이지 접속](https://platform.openai.com/api-keys)
2. `Create new secret key` 클릭

## MEDIUM_TOKEN(30s)
1. [Security and apps 페이지 접속](https://medium.com/me/settings/security)
2. `Integration tokens` 클릭

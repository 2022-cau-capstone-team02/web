![화면 캡처 2022-12-15 215443](https://user-images.githubusercontent.com/40621448/207865333-7d8d360e-48b5-43d2-8d8b-ab8a4f8a7193.jpg)

## 서론
- 블록체인이란 트렌잭션을 투명하게 기록하고 자산을 누구나 추적할 수 있는 프로세스를 용이하게 하는 데이터 분산 처리 기술입니다. 본 개발과제에서는 블록체인을 활용하여 유튜브 채널에 지분투자 플랫폼을 구현하고자 했습니다.
    - 왜 블록체인을 활용하여 구현하였는가
        - **배당의 투명성**
        모든 시장참가자들이 모든 거래를 투명하게 확인할 수 있으므로 감시자의 역할을 하여 투명하게 플랫폼이 운영됨을 확인할 수 있음.
        - **빠른 현금화**
        플랫폼에서 사용되는 스테이블코인 자체가 원화에 페깅 (Pegging) 되어 있으므로 회사에 코인을 반환하면 즉시 동일한 가치의 현금을 받을 수 있음.
            - 페깅 방법 : 스테이블 코인의 가격이 원화보다 낮아지면 코인을 소각하려는 수요가 발생 → 소각을 하면 공급이 줄어드는 효과를 내므로 가격 상승, 반대로 원화보다 높아지면 코인을 발행하려는 수요 발생 → 공급이 증가하므로 가격 하락. 또한 담보기반으로 동작하므로 뱅크런이 발생하기 힘든 구조임. 모든 발행과정은 체인에 기록되므로 감시자들이 항상 존재하여 문제를 예방하거나 빠른 대처가 가능. 물론 이에 해당하는 법제화가 시급.
        - **유동성이 낮은 환경에서 거래 용이**
        AMM 기반의 거래 방식을 사용하게 되면 호가 기반으로 주문을 할 때보다 훨씬 낮은 슬리피지로 거래가 가능.
- 현재 고비용 고퀄리티 컨텐츠가 많은 인기를 끌고 있는 상황에서, 신규 유튜버는 물론이고 구독자수가 많은 유튜버들의 경우도 컨텐츠 개발 비용을 조달하는데 많은 어려움을 겪고 있는 상황입니다.
- 머니게임 컨텐츠 출시를 통해 유명해진 진용진의 채널이 카카오엔터테인먼트에 5억에 매각, 재테크 관련 컨텐츠로 유명한 신사임당의 채널이 20억에 매각되는 등 유튜브 채널의 가치가 크게 오르고 있습니다. 또한, 기업들이 유튜브에서 활발하게 광고를 개시하며 본질적인 채널의 가치 증대 이외에 광고비 등의 부가적인 수익도 창출되고 있는 상황입니다.
- 본 개발과제에서는 신규/구 유튜버들에게 컨텐츠 개발에 필요한 제작 비용을 조달해주고, 이를 통해 발생한 부가가치 (e.g. 본질적인 채널의 가치 증대, 채널 가치가 증대됨에 따라 상승한 광고료 등)를 투자자들이 공유받을 수 있는 플랫폼을 개발하고자 합니다.

## 사용된 기술
- 리엑트 (https://ko.reactjs.org/)
- 리코일 (https://recoiljs.org/ko/)
- 리엑트 쿼리 (https://tanstack.com/query/v4/docs/overview)
- CosmWasm (https://cosmwasm.com/)

## 사용 방법
1. 본 플랫폼은 코스모스 체인을 활용하여 개발되었습니다. 따라서 지갑 연동에 필요한 **케플러 지갑 확장프로그램**을 설치해주세요.
    1. [https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap](https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=ko)
2. 두 가지의 레포지토리를 설치할 경로로 이동한 뒤, 터미널에서 `git clone` 을 실행합니다.
    
    → `git clone [https://github.com/2022-cau-capstone-team02/web.git](https://github.com/2022-cau-capstone-team02/web.git)`
    
    → `git clone [https://github.com/2022-cau-capstone-team02/ysip-chain.git](https://github.com/2022-cau-capstone-team02/ysip-chain)`
    
3. `ysip-chain` 디렉토리로 이동하여, `ignite chain serve` 을 실행합니다.
    1. 실행을 하기 위해선, `Go`, `Ignite`의 설치가 추가적으로 필요합니다. 
    2. Go : [https://go.dev/doc/install](https://go.dev/doc/install)
    3. Ignite : [https://docs.ignite.com/guide/install](https://docs.ignite.com/guide/install)
4. `web` 디렉토리로 이동하여, `chmod +x ./init.sh` 를 실행합니다.
    1. 쉘파일을 실행하기 위한 실행 권한을 획득하기 위해 실행합니다.
5. `web` 디렉토리에서 `./init.sh` 를 실행합니다.
    1. `/contracts` 에 있는 컨트렉트 파일들을 실행합니다.
6. `web` 디렉토리에서 플랫폼 실행에 필요한 패키지를 다운로드하기 위해 터미널에서 `yarn` 혹은 `npm` 을 실행합니다.
7. `yarn start` 를 통해 플랫폼을 실행합니다.
8. 크롬 익스텐션에 있는 **케플러 지갑**을 실행하고, 네트워크를 `ysip chain` 으로 변경합니다.
9. `ysip102xnfc6d5j8j7tshq3yrg0t7kr8tsd2y242ku0` 주소를 가지고 있는 계정을 관리자 계정으로 사용하세요.
10. ICO 컨트렉트 생성 시 채널 토큰을 만들기 위해서는 케플러 지갑을 실행하고 계정을 추가한 뒤 그 계정의 주소를 사용해주세요.


<img width="363" alt="스크린샷 2022-12-15 오후 9 55 28" src="https://user-images.githubusercontent.com/40621448/207865910-7cb49695-3716-48ad-b26d-64ac7290d45a.png">
<img width="363" alt="스크린샷 2022-12-15 오후 9 55 45" src="https://user-images.githubusercontent.com/40621448/207865921-4f43d565-3130-4da5-868e-e1f7cc2028c4.png">



const addressLi = document.getElementById("wallet_address");
const publicKeyLi = document.getElementById("wallet_publicKey");
const privateKeyLi = document.getElementById("wallet_privateKey");
const balanceLi = document.getElementById("wallet_balance");

const info = (_wallet) => {
  console.log("2-9/4-10 전달받은 지갑 정보(data)를 웹페이지에 출력");
  // 2-7
  addressLi.innerHTML = _wallet.address;
  publicKeyLi.innerHTML = _wallet.publicKey;
  privateKeyLi.innerHTML = _wallet.privateKey;
  balanceLi.innerHTML = _wallet.balance;
};

document.getElementById("new_wallet_btn").onclick = () => {
  console.log("2-1 지갑 생성 클릭했다.");
  // 2-1
  axios.post("/wallet/create").then(({ data }) => {
    // console.log(data);
    // 2-6
    console.log("2-8 응답받은 지갑 정보(data)를 info 함수에 전달");
    info(data);
  });
};

const getInfo = async (_address) => {
  // 4-2
  console.log("4-1 지갑 주소 목록 중 하나 클릭");
  const wallet = (await axios.get("/wallet/" + _address)).data;
  console.log("4-9 응답받은 지갑 정보(data)를 info 함수에 전달");
  info(wallet);
};

const listUl = document.getElementById("wallet_list");
document.getElementById("wallet_list_btn").onclick = () => {
  // 3-2
  console.log("3-1 목록 가져오기 클릭");
  axios.get("/wallet/list").then(({ data }) => {
    console.log(
      "3-5 파일 목록을 응답 받음, ul 엘리먼트 내(innerHTML)를 비우고, 받은 파일 목록으로 채운다"
    );
    // 3-6
    // console.log(data);
    listUl.innerHTML = "";
    data.forEach((item) => {
      listUl.innerHTML += `<li onclick="getInfo('${item}')">${item}</li>`;
      // 4-1 목록 아이템 클릭
    });
    // 3-7
  });
};

document.getElementById("transaction_form").onsubmit = (e) => {
  e.preventDefault();
  console.log("5-1 / 6-1 전송 버튼 클릭");
  // 조건 : 위에 지갑 데이터 있어야함 && received 입력값이 있어야함 && amount 입력값이 있어야함

  const publicKey = publicKeyLi.innerHTML;
  const address = addressLi.innerHTML;
  const received = e.target.received.value;
  const amount = +e.target.amount.value;
  // 잔액 앞에 있는 0은 문자열 그래서 +(parseInt)를 하지 않으면
  // 문자열 + 문자열로 붙어서 잔액이 50 코인 채굴 시 050이런 식으로 표기 됨
  // 그래서 e.target 앞에 +를 붙여서 앞의 문제를 해결 한다.

  const req = {
    sender: {
      publicKey,
      address,
    },
    received,
    amount,
  };
  console.log(
    "5-2 6-2 현재 지갑 정보와 입력된 값으로 /transaction/send 에 요청 보냄"
  );
  axios.post("/transaction/send", req);
};

document.getElementById("block_mine_btn").onclick = () => {
  const data = addressLi.innerHTML;
  if (data === "") return;
  axios.post("/block/mine", { data: data }).then(() => {
    axios.post("/balance", { address: data }).then(({ data }) => {
      balanceLi.innerHTML = data.balance;
    });
  });
};

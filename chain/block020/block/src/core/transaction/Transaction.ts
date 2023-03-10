import TxIn from "./TxInput";
import TxOut from "./TxOutput";
import UnspentTxOut from "./UnspentTxOut";
// 트랜잭션에 필요한 요소들을 불러온다. {TxIn, TxOut, UnspentTxOut}
import { SHA256 } from "crypto-js";

export default class Transaction implements ITransaction {
  public txIns: Array<ITxInput>;
  public txOuts: Array<ITxOutput>;
  public hash: string;

  constructor(_txIns: Array<ITxInput>, _txOuts: Array<ITxOutput>) {
    this.txIns = _txIns;
    this.txOuts = _txOuts;
    this.hash = this.createHash();
  }
  createHash(): string {
    //   const txOutStr: string = this.txOuts.reduce(
    //       (prev, curr) => prev + Object.values(curr).join(""),
    //       ""
    //       );

    // 위에 주석 방식과 같이 동작

    // ----- txOut -----
    let txOutStr: string = "";

    for (let i = 0; i < this.txOuts.length; i++) {
      const tempTxout: Array<string | number> = Object.values(this.txOuts[i]);
      // Output 내용의 값 들만 가져와 사용해야 한다. class는 객체 형식으로 만들어지기 때문에
      // Object.values를 사용하여 배열로 만들어서 키인 adress, amount의 값만 가져와서 사용
      // for문을 사용한 이유는 Output이 1개일 수 도 있지만 1개 이상 여러개가 있을 수 있는 상황이 있어서

      for (let j = 0; j < tempTxout.length; ++j) {
        txOutStr += tempTxout[j];
      }
    }

    // ----- txIn -----
    let txInStr: string = "";

    for (let i = 0; i < this.txIns.length; i++) {
      const tempTxIn: Array<string | number> = Object.values(this.txIns[i]);
      // Input 내용의 값 들만 가져와 사용해야 한다. class는 객체 형식으로 만들어지기 때문에
      // Object.values를 사용하여 배열로 만들어서 키인 adress, amount의 값만 가져와서 사용
      // for문을 사용한 이유는 Input이 1개일 수 도 있지만 1개 이상 여러개가 있을 수 있는 상황이 있어서

      for (let j = 0; j < tempTxIn.length; ++j) {
        txInStr += tempTxIn[j];
      }
    }

    console.log("txInStr:::::::::::::", txInStr);
    // chain폴더의 index.ts Chain 클래스 중 mineBlock 메서드 중 const txIn: ITxInput 참조
    console.log("txOutStr:::::::::::::", txOutStr);
    // chain폴더의 index.ts Chain 클래스 중 mineBlock 메서드 const txOut: ITxOutput 참조

    return SHA256(txInStr + txOutStr)
      .toString()
      .toUpperCase();
    // 최종적으로 트랜잭션 Hash or 트랜잭션 ID를 리턴
  }
  createUTXO(): Array<IUnspentTxOut> {
    // transaction에서 utxo를 생성해서 내보내준다.
    const utxo: Array<IUnspentTxOut> = [];
    // utxo는 빈 배열로 초기화를 한다. 왜냐면
    // utxo에 UnspentTxOut이것을 담기 위해
    console.log("this.txOuts:::::::::::", this.txOuts);
    for (let i = 0; i < this.txOuts.length; ++i) {
      // this.txOuts.length는 [[ITxOutput], [ITxOutput], [ITxOutput], ...] 이런 형태다.

      utxo.push(
        new UnspentTxOut(
          this.txOuts[i].address, // txOuts[i].address 값은 Postman에서 POST 형식에 http://localhost:8080/block/mine 주소로 Body 형식은 raw JSON 형태인 "data":"string 타입 입력 값"
          this.txOuts[i].amount, // txOuts[i].amount 값은 Chain class에 속해 있는 mineBlock 메서드 중  const txOut: ITxOutput = new TxOut(_address, 50)로 초기화 된 두 번째 매개변수 값
          this.hash, // hash 값은 this.createHash()에서 SHA256(txInStr + txOutStr)으로 리턴 된 값
          i // i는 index 위치 값
        )
      );
    }
    console.log("utxo::::::::::::", utxo);
    return utxo; // UnspentTxOut로 push된 utxo를 리턴한다.
  }
}

// npmx jest --verbose

const Chain = require("./chain");
const Block = require("../block/block");

describe("chain test", () => {
  let chain;

  beforeEach(() => {
    // 다른 테스트를 실행하기 전에 실행하는 메서드
    chain = new Chain();
  });

  describe("addBlock test", () => {
    it("데이터로 블록 추가 확인", () => {
      // it이 시작하기 전에 위에서 설정된 beforeEach가 실행된다.
      console.log(chain.chain); // 여기서 체인은 새로 생성된 체인
      chain.addBlock(["정상적인 데이터"]);
      console.log(chain.chain); // addBlock으로 정상적인 데이터가 입력(전달)되어 chain에 추가 된다.
      expect(chain.chain).toHaveLength(2);
    });
    it("잘못된 데이터로 블록 추가 확인", () => {
      // it이 시작하기 전에 위에서 설정된 beforeEach가 실행된다.
      console.log(chain.chain); // 여기서 체인은 새로 생성된 체인
      chain.addBlock("잘못된 데이터");
      console.log(chain.chain); // addBlock의 잘못된 데이터로 인해 chain에 추가 되지 않는다.
      expect(chain.chain).toHaveLength(1);
    });
  });

  describe("add2chain", () => {
    it("블록 생성 후 추가 확인", () => {
      const newBlock = new Block(["test1"], chain.lastBlock);
      chain.add2Chain(newBlock);
      expect(chain.chain).toHaveLength(2);
    });
    it("잘못된 블록 생성 후 추가 확인", () => {
      const newBlock = new Block(["test1"]);
      // new Block(["test1"]는 제네시스 블록 생성으로, chain.lastBlock이 있어야 height와 hash를 비교를 할 수 있다.
      chain.add2Chain(newBlock);
      expect(chain.chain).toHaveLength(1);
    });
  });

  describe("lastBlock check", () => {
    it("마지막 블록 확인", () => {
      chain.addBlock(["test1"]);
      const newBlock = new Block(["test2"], chain.lastBlock);
      chain.add2Chain(newBlock);
      expect(chain.lastBlock).toEqual(newBlock);
    });
  });
});

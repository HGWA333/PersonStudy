// 강한 결합 요소(Strongly Connected Component) SCC

// 강한 결합 요소는 그래프 안에서 "강하게 결합된 정점 집합"을 말한다.
// 서로 긴밀하게 연결되어 있어 강한 결합 요소라고 말한다.
// SCC는 같은 SCC에 속하는 두 정점은 서로 도달이 가능하다는 특징이 있다.
// 강한 결합 요소 알고리즘은 합집합 찾기 알고리즘에도 적용되는 대표적인 그래프 알고리즘

// 강한 결합 요소 작동 방식
//  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] 배열의 요소가 있다.

// go. = 갈 수 있다.

// 1 <-> 2 <-> 3
// 1은 2로도 go. 2는 3으로go. 3은 1로 갈 수 있는 순환구조 형태로 된 것을 강한 결합 요소라고 한다.

// 2 <- 4 -> 5
// 4는 2 or 5로 go.

// 5 -> 7 -> 6 -> 5
// 5는 7로 go. 7은 6으로 go. 6은 5로 go.

// 8 -> 5 or 9 -> 10 -> 11 -> 8
// 8은 5 or 9로 go. 9는 10으로 go. 10은 11로 go. 11은 8로 go.

// 10 -> 11 -> 3 or 8 -> 1 -> 2 -> 3
// 10은 11로 go. 11은 3으로 go. 3은 1로 go. 1은 2로 go. 2는 3으로 go.

// 이런 식으로 패스가 연결이 되어있다고 가정을 해보면

// 만약 1에서 8로 간다고 가정을 하면 1에서 8로 바로 갈 수는 없고 경로를 거쳐야지만 갈 수 있는 상황이다.
// 그래서 이런 것을 강한 결합요소라고 볼 수 없다고 한다.
// 서로 서로에게 갈 수 있을 때만 강한 결합 요소로 같은 SCC에 속해있다고 표현을 한다.

// 강한 결합 요소는 총 4개
// 1, 2, 3

// 4

// 5, 6, 7

// 8, 9, 10, 11
// 여기서 총 4개의 집합이 존재한다. 각 집합에 있는 정점끼리는 서로에게 도달할 수 있다.
// 기본적으로 순환구조 형태인 사이클이 발생한 경우 무조건 SCC에 해당한다는 특징이 있다.
// 그래서 위와 같이 방향 그래프일 때만 의미가 있다. 무향 그래프라면 그 그래프 전체는 무조건 SCC이기 때문
// 무향그래프는 예를 들어 9와 10이 서로가 연결이 되어 있는 것을 무향 그래프라고 한다.
// 무향그래프 형태 =   9 <-> 10 (서로가 연결 되어있음) 이때 9와 10은 무조건 SCC로 판단

// SCC 추출 방법
// SCC를 추출하는 대표적인 알고리즘은 코사라주 알고리즘(Kosaraju's Algorithm)과 타잔 알고리즘(Tarjan's Algorithm)이 있다.
// 일반적으로 코사라주 알고리즘이 구현하기 더 쉽지만 타잔 알고리즘이 적용하기 더 쉽다는 점이 있다. 그래서 타잔 알고리즘을 사용할 것이다.

// 타잔 알고리즘은 모든 정점에 대해 DFS 깊이 우선 탐색(Depth First Search)을 수행하여 SCC를 찾는 알고리즘이다.

// 예) Union 알고리즘 방식
// 1 -> 2 -> 3 -> 4
// 4의 기준에서 4는 자신의 부모와 연결이 되어있는지 확인을 해야 한다.
// 첫 번째 행  [1, 2, 3, 4]
// 두 번째 행  [1, 1, 1, 4]

// 예) 타잔 알고리즘 작동 방식
// 1 -> 2 -> 3 -> 4 -> 1
// [1, 2, 3, 4]
// 4는 1로 다시 돌아가는 경로가 있다면 배열의 요소 중 어떤 것을 선택 하더라도 1부터 4까지 SCC가 성립이 된다.
// 만약 3에서 1로 가는 경로가 존재한다면 이때는 1, 2, 3이 SCC가 된다. 4는 SCC에서 제외
// 결과적으로 부모로 돌아갈 수 있는 경로에 한하여 SCC가 성립이 됨
// 그래서 구체적으로 검증을 하기 위해선 부모에서 자식으로 나아가는 DFS 알고리즘이 사용된다.

// 초기상태

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// Stack 삽입 []

// 첫 번째 동작 (1에서 출발)

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 2, 1, 4, 5, 6, 7, 8, 9, 10, 11]
// Stack 삽입 [1, 2, 3]

// 두 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 6, 7, 8, 9, 10, 11]
// Stack 삽입 [] / Stack 반출 [1, 2, 3] = SCC 결합 된 상태

// 세 번째 동작 (4에서 출발)

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 6, 7, 8, 9, 10, 11]
// Stack 삽입 [4, 5, 7, 6]
// 4는 인접노드 5를 방문

// 네 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 6, 5, 8, 9, 10, 11]
// Stack 삽입 [4, 5, 7, 6]

// 다섯 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 5, 5, 8, 9, 10, 11]
// Stack 삽입 [4] / Stack 반출 [5, 6, 7] = SCC 결합 된 상태

// 여섯 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 5, 5, 8, 9, 10, 11]
// Stack 삽입 [] / Stack 반출 [4] = SCC 결합 된 상태
// Stack 삽입에서 남은 4는 이 상황에서 더이상 방문할 노드가 없다.
// 그래서 부모 값이 자기 자신과 동일 하여 4 그 자체가 SCC가 된다.

// 일곱 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 5, 5, 8, 9, 10, 11]
// Stack 삽입 [8, 9, 10, 11]

// 일곱 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 5, 5, 8, 9, 10, 8]
// Stack 삽입 [8, 9, 10, 11]

// 아홉 번째 동작

// 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
// 두 번째 행 [1, 1, 1, 4, 5, 5, 5, 8, 8, 8, 8]
// Stack 삽입 [] Stack 반출 [8, 9, 10, 11] = SCC 결합 된 상태

// 이렇게 해서 SCC 결합 된 상태는 4개의 집합 상태가 완성이 된다.
// 1. [1, 2, 3]
// 2. [4]
// 3. [5, 6, 7]
// 4. [8, 9, 10, 11]

// 강한 결합 요소 코드화

// SCC에서는 3개의 매개변수 id, d[max], finish[max]를 사용한다.
// id와 d[max]는 각 노드마다 고유한 번호를 할당하는 용도이다.
// finish[max]는 현재 특정한 노드에 대한 DFS가 끝난지 확인한 용도로
// 만약 1, 2, 3이 같은 SCC에 속해 있을 때 1이 현재 DFS를 진행하고 있는 중이기 때문에
// 2와 3은 그의 부모 값이 1로 바뀌게 하는 것이다.

const SCC = () => {
  let max = 10001; // max는 가능한 총 노드의 갯수
  let id; // 각 노드마다 고유한 번호를 할당하는 용도이다.
  let d = [max]; // 각 노드마다 고유한 번호를 할당하는 용도이다.
  bool = finish[max]; // 현재 특정한 노드에 대한 DFS가 끝난지 확인한 용도로
  let a = [max]; // 실제 인접한 노드를 담는 역할
  let scc; // scc는 한 그래프에서 여러개가 나올 수 있기 때문에 2차원 벡터를 사용해야 한다.
  let s; // scc를 담을 stack을 만든다.

  function DFS(x) {
    // DFS는 총 정점의 갯수만큼 실행하는 역할
    d[x] = ++id; // 각 노드마다 고유한 번호를 할당한다. 즉 맨 처음에 부모로 설정 된 값
    s.push(x); // stack에 자기 자신을 삽입한다.
    let parent = d[x]; // 자신의 부모가 누군지 확인하는 용도
    // 가장 처음 들어오는 매개변수는 자기 자신이 부모가 된다.
    for (let i = 0; i < a[x].size(); i++) {
      // 인접한 노드를 하나씩 확인 하는 조건
      let y = a[x][i];
      // [x] = 매개변수로 들어온 값,  [i] = for문 현재 도는 값
      // y는 인접한 노드 자체를 가르킨다.
      if (d[y] == 0) parent = min(parent, DFS(y));
      // 방문하지 않은 이웃 상황
      // 만약 해당노드를 방문한적이 없다면, 더 작은 값을 부모 가르킬 수 있도록 해당노드로 DFS를 수행한다.
      // 순서 1)
      // 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      // 두 번째 행 [1, 2, 1, 4, 5, 6, 7, 8, 9, 10, 11]
      // 순서 2)
      // 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      // 두 번째 행 [1, 1, 1, 4, 5, 6, 7, 8, 9, 10, 11]
      // 이 과정을 진행하는 중
      else if (!finish[y]) parent = min(parent, d[y]);
      // 처리 중인 이웃 상황
      // 만약 방문은 했지만 아직 처리가 되지 않았다면 현재 DFS를 수행하고 있는 노드다.
      // 이때는 부모 값을 처리되고 있는 값을 부모 값과 비교하여 작은 값을 선택 하도록 설정 = parent = min(parent, d[y])
      // finish[y] 즉 처리가 되고 있는 이웃에는 중복으로 DFS(y)를 수행할 수 없다. 그래서 현재까지 구해진 값으로 바로 확인 할 수 있도록 해야 한다.
    }
    if (parent == d[x]) {
      // 만약 부모노드가 자기 자신인 경우 실행
      let scc = {}; // scc 객체를 만들어 준다.
      while (1) {
        // 자기 자신이 나올 때 까지 값을 뽑아준다.

        // 첫 번째 행 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        // 두 번째 행 [1, 2, 1, 4, 5, 6, 7, 8, 9, 10, 11]
        // Stack 삽입 [1, 2, 3] 이 과정을 진행 중
        // Stack 반출 [1, 2, 3] = SCC 결합 된 상태

        let t = s.top();
        s.pop(); // 스택에 가장 위에 있는 것을 뽑아서
        scc.push_back(t); // scc에 넣어 준다.
        finish[t] = true; // scc가 결합이 완료가 되고 처리가 완료 되었다.
        if (t == x) break; // 자기 자신의 값이 나올 때 까지 뽑아주는 용도로
        // 만약 자기 자신의 값이 다 나왔다면 while문은 break를 실행하여 while문 종료
      }
    }
    SCC.push_back(scc);
    // 최종적으로 만들어진 SCC를 전체 SCC안에 저장한다.
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]의 데이터가 들어 갔을 때
    // 최종적으로 가공되어 나오는 형태는 [{1,2,3},{4},{5,6,7},{8,9,10,11}] 이런 형태가 된다.
  }
  return parent; // 자신의 부모 값을 반환하며 종료
};
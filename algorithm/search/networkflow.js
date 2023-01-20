// 네트워크 플로우(Network Flow)

// 네트워크 플로우는 특정한 지점에서 다른 지점으로 데이터가 얼마나 많이 흐르고 있는지를 측정하는 알고리즘이다.
// 이런 알고리즘은 교통 체증, 네트워크 데이터 전송 등 다양한 분야에 사용 되고 있다.
// 네트워크 플로우는 각 경로에 모이는 데이터들을 분산 시켜주는 것이 핵심 개념

// 네트워크 플로우에는 유량/용량 개념을 알아야 한다.
// 유량과 용량은 서로 반비례 한다. 유량이 분자, 용량이 분모에 위치하는 것이다.
// 유량 : 서울에서 부산으로 가는 길은 총 8명이 갈 수 있는데 5명이 갔다. 5/8에서 유량은 분자를 가르킨다.
// 용량 : 서울에서 부산으로 가는 길은 총 8명이 갈 수 있는 것  5/8에서 용량은 분모를 가르킨다.

// 예)
// 정점 : [A,B,C,D]
// 간선 : [0,8,6,7]

// 초기 상태
// 정점 : 간선 비용
// A->B : 8
// B->C : 6
// C->D : 7

// 네트워크 플로우 적용
// 정점 : 간선 비용
// A->B : 6/8
// B->C : 6/6
// C->D : 6/7

// 기본적으로 최대 유량문제는 단순하게 가능한 모든 경우의 수를 탐색하는 방법을 사용하며
// 이 때 BFS(너비 우선 탐색)을 이용하는 것이 일반적이고 이것을 에드몬드 카프(Edmonds-Karp)알고리즘 이라고도 한다.
// 에드몬드 카프 알고리즘은 모든 가능한 경로에 대해서 유량을 흘러 내보내는 것이 핵심

// 에드몬드 카프 알고리즘의 시간 복잡도는 O(VE^2)다.

// 네트워크 플로우 작동방식

// 초기 상태
// 1 -> 2 : 0/12
// 1 -> 4 : 0/11
// 2 -> 4 : 0/3
// 2 -> 3 : 0/6
// 2 -> 5 : 0/5
// 2 -> 6 : 0/9
// 3 -> 6 : 0/8
// 4 -> 5 : 0/9
// 5 -> 3 : 0/3
// 5 -> 6 : 0/4

// 네트워크 플로우 적용 1 -> 2 -> 3 -> 6
// 1 -> 2 : 6/12
// 2 -> 3 : 6/6
// 3 -> 6 : 6/8

// 네트워크 플로우 적용 1 -> 2 -> 6
// 1 -> 2 : 12/12
// 2 -> 6 : 6/9

// 네트워크 플로우 적용 1 -> 4 -> 5 -> 6
// 1 -> 4 : 4/11
// 4 -> 5 : 4/9
// 5 -> 6 : 4/4

// 네트워크 플로우 적용 1 -> 4 -> 5 -> 3 -> 6
// 1 -> 4 : 6/11
// 4 -> 5 : 6/9
// 5 -> 3 : 2/3
// 3 -> 6 : 8/8

// 음의 유량
// 최대 유량 알고리즘의 핵심적인 부분은 바로 음의 유량을 계산 하는 것이다.
// 최대 유량 알고리즘은 모든 가능한 경로를 다 계산해주기 위해서는 음의 유량도 계산 해주어야 한다.
// 단순하게 유량을 더해주는 과정에서 사실 보이지 않게 반대로 가는 유량이 빠지고 있다고 보면 된다.
// 쉽게 말해 남아있는 모든 가능한 경로를 더 찾아내기 위해서 음의 유량을 기록한다.

// 예) 1 -> 4 -> 5 -> 3 -> 6 의 경로에서의 2 -> 3의 경로
// 2 -> 3의 경로는 6/6 유량이 흐르고 있다.
// 2 -> 3의 경로를 역으로 보면 3 -> 2은 -6/0 즉 -6으로 볼 수 있다.

// 네트워크 플로우 적용
// 1 -> 4 : 6/11
// 4 -> 5 : 6/9
// 5 -> 3 : 2/3
// 3 -> 6 : 8/8
// 6+6+2+8 = 22

//   v  s

// 네트워크 플로우 음의 유량 방식
// 1 -> 4 : 7/11
// 4 -> 5 : 7/9
// 5 -> 3 : 3/3
// 3 -> 2 : -5/0
// 2 -> 6 : 7/9
// 7+7+3+7-5 = 19

// 위에서 보듯 네트워크 플로우를 적용한 경로의 최대 유량은 22이고 음의 유량 방식의 최대 유량은 19다. 3의 비용 차이가 생긴다.
// 최대유량을 구하는 방법은 간단하다.
// 모든 최대 유량은 시작점(출발점)에서 나온다.
// 1에서 갈 수있는 경로 2,4의 유량은
// 1 -> 2 : 12/12
// 1 -> 4 : 7/11
// 12+7 = 19 유량이 나온다.
// 최대 유량 알고리즘은 순서가 상관이 없다. 남아있는 양이 1이 넘으면 계속 흘려 보내주면 알아서 최적화가 이루어진다.
// 그래서 특별한 상황이 아니면 유량을 보내는 순서를 고려할 필요가 없다.

// 또 들어가는 유량을 반으로 쪼갤 시 최대의 유량 값이 나온다.

// 시작점
// 1 -> 2 : 12/12
// 1 -> 4 : 7/11
// 12+7 = 19

// 중간점
// 2 -> 3 : 5/6
// 2 -> 6 : 7/9
// 4 -> 5 : 7/9
// 5+7+7 = 19

// 네트워크 플로우 코드화

const MAX = 100; // 노드의 갯수
const INF = 100000000; // 무한대의 값 설정

let n = 6; // 정점(노드)의 갯수
let result; // 최대 유량의 결과 값

let cap = c[MAX][MAX]; // 용량
let flow = f[MAX][MAX]; // 유량
let arrival = d[MAX]; // 현재 특정한 노드가 방문을 했는지 확인하는 용도
let line = a[MAX]; // 모든 간선 표현

function maxFlow(_start, _end) {
  while (1) {
    fill(d, d + MAX, -1);
    let queue = q;
    q.push(_start);
    while (!q.empty()) {
      let x = q.front();
      q.pop();
      for (let i = 0; i < a[x].size(); i++) {
        let y = a[x][i];
        if (c[x][y] - f[x][y] > 0 && d[y] == -1) {
          // 방문하지 않은 노드 중 용량이 남아 있을 경우 실행
          q.push(y);
          d[y] = x; // 경로를 기억하는 용도
          if (y == end) break; // 도착지에 도달 한 경우 멈춘다.
        }
      }
    }
    if (d[end] == -1) break;
    // 모든 경로를 다 찾은 뒤에 반복문을 탈출하는 용도
    if (d[end] == -1) break;
    let flow = INF;

    for (let i = _end; i != _start; i = d[i]) {
      // 거꾸로 최소 유량을 탐색하는 용도
      flow = min(flow, c[d[i][i] - f[d[i][i]]]);
    }
    for (let i = _end; i != _start; i = d[i]) {
      // 최소 유량만큼 추가하는 용도
      f[d[i][i]] += flow;
      f[[i][d[i]]] -= flow;
    }
  }
  result += flow;
}

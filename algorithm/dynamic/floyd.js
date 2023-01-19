// 플로이드 와샬(Floyd Warshall) 알고리즘
// 다익스트라 알고리즘은 하나의 정점(노드)에서 출발했을 때 다른 모든 정점으로 최단 경로를 구하는 알고리즘이다.
// 하지만 만약에 모든 정점에서 모든 정점으로 최단 경로를 구해야 한다면, 플로이드 와샬 알고리즘을 사용해야 한다.
// 다익스트라 알고리즘은 가장 적은 비용을 하나씩 선택해야 했다면, 플로이드 와샬 알고리즘은 기본적으로 거쳐가는 정점을 기준으로 알고리즘을 수행한다.

// 다익스트라 그리고 플로이드 와샬의 차이점
// 다익스트라: 하나의 정점(노드)에서 출발을 했을 때 다른 모든 정점으로 최단 경로를 구하는 알고리즘 가장 적은 비용을 하나씩 선택 한다.
// 플로이드 와샬: 플로이드 와샬의 정점은 기본적으로 거쳐가는 정점을 기준으로 한다. 핵심은 거쳐가는 정점을 기준으로 최단 거리를 구하는 것이다.

// 플로이드 와샬 알고리즘 작동방식

// 노드의 갯수 4개
// 예) [1, 2, 3, 4]

// 간선의 갯수 7개
// 1) 1 -> 2  비용: 5
// 2) 1 -> 4  비용: 8
// 3) 2 -> 1  비용: 7
// 4) 2 -> 3  비용: 9
// 5) 3 -> 1  비용: 2
// 6) 3 -> 4  비용: 4
// 7) 4 -> 3  비용: 3

// 위 정점(노드)에서 다른 정점으로 가는 비용을 이차원 배열 형태로 출력했을 때 형태

// 노드 1)  1 - 1    1 - 2    1 - 3    1 - 4
//            0        5      무한       8

// 노드 2)  2 - 1    2 - 2    2 - 3    2 - 4
//            7        0        9      무한

// 노드 3)  3 - 1    3 - 2    3 - 3    3 - 4
//            2      무한       0        4

// 노드 4)  4 - 1    4 - 2    4 - 3    4 - 4
//          무한      무한      3        0

// 각 노드를 거쳐가는 상황
// 노드 1 = [0, 5, , INF, 8]
// 노드 2 = [7, 0, , 9, INF]
// 노드 3 = [2, INF, 0, 4]
// 노드 4 = [INF, INF, 3, 0]

// 예)
// 노드1을 거쳐가는 경우 (진행 방향은 왼쪽에서 오른쪽)
// 각 노드를 거쳐 변환 된 상황

// 노드 1 = [0, 5, , INF, 8]
// 노드 2 = [7, 0, , 9, INF]
// 노드 3 = [2, INF, 0, 4]
// 노드 4 = [INF, INF, 3, 0]

//       ↓

// 노드 1 = [0, 5, (1->4 + 4->3), 8]
// 노드 2 = [7, 0, , 9, (2->3 + 3->4)]
// 노드 3 = [2, (3->1 + 1->2), 0, 4]
// 노드 4 = [(4->3 + 3->1), (4->3 + 3->1 + 1->2), 3, 0]

//       ↓

// 노드 1 = [0, 5, 14, 8]
// 노드 2 = [7, 0, , 9, 13]
// 노드 3 = [2, 7, 0, 4]
// 노드 4 = [5, 10, 3, 0]

// [7, 0, , 2->3(9), 2->4(15)] / 2->3 = 9 vs (2->1 = 7 + 1->3 = 무한)
// 여기서 노드 1을 거처가는 비용은 7 + 무한이라 기존 2->3으로 가는 비용 9 보다 크다. 그래서 갱신할 필요가 없다.
// 여기서 결과적으로 3으로 가는 결과는 같아서 비교를 한 것이다. 여기서 어떤 걸 거처가는지가 중요하다.
// 이걸 수식화 하면 x에서 y로 가는 최소비용 vs x에서 (노드 1로가는 비용 + 노드1에서 Y로 가는 비용)이다.
// D[2,3] vs (D[2,1] + D[1,3]) 중에서 더 작은 값으로 교체되는 형태이다.

// 플로이드 와샬 (Floyd Warshall) 알고리즘 코드화

// 전체 그래프를 초기화 하는 과정

let INF = 1000000;
let floyd = [
  [0, 5, INF, 8],
  [7, 0, 9, INF],
  [2, INF, 0, 4],
  [INF, INF, 3, 0],
];

function floydWarshaa() {
  let d = [number][number];
  // 결과 그래프를 초기화

  for (let i = 0; i < number; i++) {
    for (let j = 0; j < number; j++) {
      d[i][j] = a[i][j];
    }
  }

  // k = 거처가는 노드
  for (let k = 0; k < number; k++) {
    // i = 출발 하는 노드
    for (let i = 0; i < number; i++) {
      // j = 도착 노드
      for (let j = 0; j < number; j++) {
        if (d[i][k] + d[k][j] < d[i][j]) {
          // i에서 k로 갔다가 k에서 j로 갔을 때 이 값이  d[i][j]보다 값이 클 때 실행
          d[i][j] = d[i][k] + d[k][j];
          // 여기서 if문이 실행이 됐을 때 아래와 같이 동작한다.

          // 노드 1 = [0, 5, (1->4 + 4->3), 8]
          // 노드 2 = [7, 0, , 9, (2->3 + 3->4)]
          // 노드 3 = [2, (3->1 + 1->2), 0, 4]
          // 노드 4 = [(4->3 + 3->1), (4->3 + 3->1 + 1->2), 3, 0]
          //       ↓
          // 노드 1 = [0, 5, 14, 8]
          // 노드 2 = [7, 0, , 9, 13]
          // 노드 3 = [2, 7, 0, 4]
          // 노드 4 = [5, 10, 3, 0]
          // 이 과정을 진행중이다.
        }
      }
    }
  }
  // 최단 거리를 구한 후 결과를 출력
  for (let i = 0; i < number; i++) {
    for (let j = 0; j < number; j++) {
      console.log("플로이드 알고리즘 완료", d[i][j]);
    }
    console.log(`\n`);
  }
}

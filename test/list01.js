const {picat} = await import('../src/picat.js');
const assert = await import('assert');

describe('List 01', function () {
  it('1. in(Var,List) + even(Int)', function () {
    let result = picat.var(`main(E)=>in(E,[1,2,3,4,5,6]),odd(E).`,'main(E)');
    assert.deepEqual(result,[{E:1n},{E:3n},{E:5n}]);

  });

  it('2. in(Var,List) + prime(Int)', function () {
    let result = picat.var(`main(E)=>in(E,[1,2,3,4,5,6]),prime(E).`,'main(E)','map');
    assert.deepEqual(result,[{ E: 1n }, { E: 2n }, { E: 3n }, { E: 5n } ]);
  });

  it('3. in(Var,List) + in(Var,List) + prime(Int) + odd(Int)', function () {
    let result = picat.str(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)','map');
    assert.deepEqual(result,[
      'main(1,5)',
      'main(1,7)',
      'main(2,5)',
      'main(2,7)',
      'main(3,5)',
      'main(3,7)'
    ]);
  });

  it('4. in(Var,range(Int,Int))', function () {
    let result = picat.var(`main(E)=>in(E,range(3,7)).`,'main(E)');
    assert.deepEqual(result.map(d=>d.E),[ 3n, 4n, 5n, 6n, 7n ]);
  });

  it('5. in(Var,range(Int,Int))', function () {
    let result = picat.var(null,'in(E,range(1,3))');
    assert.deepEqual(result.map(d=>d.E),[ 1n,2n,3n]);
    // console.log(35,result);
  });

  it('6. in(Var,range(Int,Int))', function () {
    let result = picat.var(null,'=(E,range(1,3))');
    assert.deepEqual(result,[ { E: [ 1n, 2n, 3n ] } ]);
  });
});



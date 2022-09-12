const {picat} = await import('../src/picat.js');
const assert = await import('assert');

describe('Goal 01', function () {
  it('1. Query fact', function () {
    let result = picat.var(`man(andrey).`,'man(A)');
    assert.deepEqual(result,[ { A: 'andrey' } ]);
  });

  it('2. Query rule :- ', function () {
    let result = picat.var(`man(andrey).human(A):-man(A).`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' } ]);
  });
  it('3. Query rules :- ', function () {
    let result = picat.var(`man(andrey).human(A):-man(A).human(sergey).`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' },{ A: 'sergey' } ]);
  });

  it('4. Query rule => ', function () {
    let result = picat.var(`man(andrey).human(A)=>man(A).`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' } ]);
  });
  it('5. Query rules => ', function () {
    let result = picat.var(`man(andrey).human(A)=>man(A). human(sergey)=>true.`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' }]);
  });
  it('6. Query rules => ', function () {
    let result = picat.var(`man(andrey). 
human(A) => man(A). 
human(S) => =(S,sergey).
`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' }]);
  });

  it('7. Query rules ?=> ', function () {
    let result = picat.var(`man(andrey). 
human(A) ?=> man(A). 
human(S) => =(S,sergey).
`,'human(A)');
    assert.deepEqual(result,[ { A: 'andrey' },{ A: 'sergey' }]);
  });

  it('8. Query rules => with condition', function () {
    let result = picat.var(` 
pos(N),false => true. 
pos(N),>(N,0) => true. 
neg(N),<(N,0) => true. 
`,'pos(5)');
    // console.log(48,result);
    assert.deepEqual(result,[ true ]);
  });

  it('9. Query rules => with condition', function () {
    let result = picat.var(` 
pos(N),false => true. 
pos(N),>(N,0) => true. 
neg(N),<(N,0) => true. 
`,'pos(-5)');
    // console.log(48,result);
    assert.deepEqual(result,[]);
  });

  it('10. Query rules => with condition', function () {
    let result = picat.var(` 
pos(N),false => true. 
pos(N),>(N,0) => true. 
neg(N),<(N,0) => true. 
`,'neg(-5)');
    // console.log(48,result);
    assert.deepEqual(result,[true]);
  });
  it('11. Query rules => with condition', function () {
    let result = picat.var(` 
pos(N),false => true. 
pos(N),>(N,0) => true. 
neg(N),<(N,0) => true. 
`,'neg(5)');
    // console.log(48,result);
    assert.deepEqual(result,[]);
  });

  it('12. Query function fn(A)', function () {
    let result = picat.var(` 
fn(N,A) => =(N,fn(A)).
fn(A) = *(2,A).
`,'fn(N,5)');
    // console.log(48,result);
    assert.deepEqual(result,[{N:10n}]);
  });

  it('13. Query function fn(A) with => body', function () {
    let result = picat.var(` 
fn(A) = *(Y,2) => =(Y,A).
`,'=(N,fn(5))');
    // console.log(48,result);
    assert.deepEqual(result,[{N:10n}]);
  });

  it('14. Query function fn(A) conds => body ', function () {
    let result = picat.var(` 
fn(A) = *(Y,2), >(A,4) => =(Y,A).
fn(A) = *(Y,4), <=(A,4) => =(Y,A).
`,'=(N,fn(3))');
    // console.log(48,result);
    assert.deepEqual(result,[{N:12n}]);
  });

  it('15. Return function value fn(A) conds => body ', function () {
    let result = picat.val(` 
fn(A) = *(Y,2), >(A,4) => =(Y,A).
fn(A) = *(Y,4), <=(A,4) => =(Y,A).
`,'fn(3)');
     // console.log(48,result);
    assert.deepEqual(result,12n);
  });

});
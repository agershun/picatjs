const {picat} = await import('../src/picat.js');
const assert = await import('assert');

const answer = [
  'main(1,5)',
  'main(1,7)',
  'main(2,5)',
  'main(2,7)',
  'main(3,5)',
  'main(3,7)',
];



describe('Picat 01', function () {
  it('1. picat()', function () {
    let {result} = picat(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)');
    assert.equal([...result].length,answer.length);
  });

  it('2. picat.log()', function () {
    let tmp = console.log;
    let s = '';
    console.log = (function(){ s += [...arguments].join()+'\n'; }).bind(console);
    let res = picat.log(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)');
    console.log = tmp;
    assert.equal(s,
`main(1,5).
main(1,7).
main(2,5).
main(2,7).
main(3,5).
main(3,7).
`);
  });

  it('3. picat.genvar()', function () {
    let result = picat.genvar(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)','map');
    assert.deepEqual([...result],[
      { E: 1n, A: 5n },
      { E: 1n, A: 7n },
      { E: 2n, A: 5n },
      { E: 2n, A: 7n },
      { E: 3n, A: 5n },
      { E: 3n, A: 7n },
    ]);
  });

  it('4. picat.var()', function () {
    let result = picat.var(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)','map');
    assert.deepEqual(result,[
      { E: 1n, A: 5n },
      { E: 1n, A: 7n },
      { E: 2n, A: 5n },
      { E: 2n, A: 7n },
      { E: 3n, A: 5n },
      { E: 3n, A: 7n },
    ]);
  });

  it('5. picat.genstr()', function () {
    let result = picat.genstr(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)');
    assert.deepEqual([...result],answer);
  });


  it('6. picat.str()', function () {
    let result = picat.str(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)');
    assert.deepEqual(result,answer);
  });

  it('7. picat.all()', function () {
    let result = picat.all(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)','map');
      assert.equal(answer.length,result.length);
  });

  it('8. picat.out()', function () {
    let result = picat.out('main => println(range(1,3)).');

//    let result = picat.out(`main(E,A)=>in(E,[1,2,3,4]),in(A,[4,5,6,7]),prime(E),odd(A).`,'main(E,A)','map');
//    console.log(78,result);
      assert.equal(result,`[1,2,3]\n`);
  });
});



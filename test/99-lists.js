const {picat} = await import('../src/picat.js');
const assert = await import('assert');

describe('99. Ninety-Nine Picat Problems: Lists (http://picat-lang.org/p99/lists.html)', function () {

  it('P1_01. myLast(List)', function () {
    let result = picat.out(`

      myLast([X]) = X.
      myLast([_|Xs]) = myLast(Xs).

      main => print(myLast([1,2,3,4,5,6])).

    `);
    assert.equal(result,'6');
  });

  it('P2_02. myButLast(List)', function () {
    let result = picat.out(`

      myButLast([X,_]) = X.
	  myButLast([_|Xs]) = myButLast(Xs).

      main => print(myButLast([1,2,3,4,5,6])).

    `);
    assert.equal(result,'5');
  });

//   it('P1_03. elementAt(Int,List)', function () {
//     let result = picat.log(`

// elementAt([X|_],1) = X.
// elementAt([_|Xs],K) = Kth, >(K,1) => =(Kth,elementAt(Xs,-(K,1))).

//       main => print(elementAt(3,[1,2,3,4,5,6])).

//     `);
//     assert.equal(result,'3');
//   });

  it('P2_04. myLength(List)', function () {
    let result = picat.out(`

      myLength(L) = myLength(L,0).

      myLength([],Len) = Len.
      myLength([_|Xs],Len) = myLength(Xs,+(Len,1)).

      main => print(myLength([1,2,3,4,5,6])).

    `);
    assert.equal(result,'6');
  });

  it('P2_05. myReverse(List)', function () {
    let result = picat.out(`

      myReverse(L) = myReverse(L,[]).

      myReverse([],R) = R.
      myReverse([X|Xs],R) = myReverse(Xs,[X|R]).

      main => print(myReverse([1,2,3,4,5,6])).

    `);
    assert.equal(result,'[6,5,4,3,2,1]');
  });

  it('P2_06. isPalindrome(List) + myReverse(List)', function () {
    let result = picat.str(`

      myReverse(L) = myReverse(L,[]).

      myReverse([],R) = R.
      myReverse([X|Xs],R) = myReverse(Xs,[X|R]).

      isPalindrome(Xs) => ==(Xs,myReverse(Xs)).

    `,'isPalindrome([1,2,3,3,2,1])');
     assert.deepEqual(result,[`isPalindrome([1,2,3,3,2,1])`]);
  });

  it('P2_06a. isPalindrome(List) + myReverse(List)', function () {
    let result = picat.str(`

      myReverse(L) = myReverse(L,[]).

      myReverse([],R) = R.
      myReverse([X|Xs],R) = myReverse(Xs,[X|R]).

      isPalindrome(Xs) => ==(Xs,myReverse(Xs)).

    `,'isPalindrome([1,2,3,3,2,99])');
     assert.deepEqual(result,[]);
  });


  it('P2_07. myFlatten(List)', function () {
    let result = picat.out(`

    myFlatten([X|Xs]) =  ++(myFlatten(X),myFlatten(Xs)).
    myFlatten([]) = [].
    myFlatten(X) = [X].

    main => print(myFlatten([1,[2,[3,4]],5])).
    `);

     assert.deepEqual(result,`[1,2,3,4,5]`);
  });

  it('P2_08. myFlatten(List)', function () {
    let result = picat.log(`

      compress([X|Ys @ [X|_]]) = compress(Ys).
      compress([X|Ys]) = [X|compress(Ys)].
      compress(Ys) = Ys.

      main => print(compress([1,1])).
    `);
//      compress([X|Ys]) = compress([X|_]), =(Ys,[X|_]) => true .
//      compress([X,X|_]) = compress([X|_]).
//      compress([X|[X|_]]) = compress([X|_]).

//      main => print(compress([7,7,1,2,3,3,4,5,5])).

     //assert.deepEqual(result,`[1,2,3,4,5]`);
  });

/*

  it('1. println(List)', function () {
    let result = picat.out(`main => println([1,2,3,4,5,6]).`);
    assert.equal(result,'[1,2,3,4,5,6]\n');
  });
*/
});



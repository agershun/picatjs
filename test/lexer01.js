const Lexer = await import('../src/Lexer.js');
const lexer = Lexer.lexer;
const assert = await import('assert');

describe('Lexer 01', function () {
  it('1. Lex simple Prolog program', function () {

    let prog = `
            father(andrey,david).
            son(sasha,andrey).
            father(X,Y):-son(Y,X).
        `;
    let ls = [...lexer(prog)];

    assert.deepEqual(ls,[
      'father', '(','andrey', ',', 'david',')','.',
      'son','(','sasha', ',','andrey',')','.',
      'father','(','X',',','Y',')',':-','son','(','Y',',','X',')','.'
    ]);
  });

  it('2. Lex simple Picat program', function () {

    let prog = `
            father(X,Y)=>son(Y,X).
        `;
    let ls = [...lexer(prog)];

    assert.deepEqual(ls,[
      'father','(','X',',','Y',')','=>','son','(','Y',',','X',')','.'
    ]);
  });

});


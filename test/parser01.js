const Lexer = await import('../src/Lexer.js');
const lexer = Lexer.lexer;

const Parser = await import('../src/Parser.js');
const parser = Parser.parser;
const assert = await import('assert');

describe('Parser 01', function () {
  it('1. Parse single fact', function () {

    let prog = `father(andrey,david).`;
    let rules = parser(lexer(prog)).parseRules();

    assert.deepEqual(rules,[
      {
        functor: '.',
        head: {
          functor: 'father',
          args: [
            { args: [], functor: 'andrey' },
            { args: [], functor: 'david' }
          ]
        },
        body: { val:true}
      }
    ]);
  });


  it('2. Parse single rule', function () {

    let prog = `father(X,Y):-son(Y,X).`;
    let rules = parser(lexer(prog)).parseRules();

    assert.deepEqual(rules,[
       {
        body:  {
          args: [
             {
              name: 'Y'
            },
             {
              name: 'X'
            }
          ],
          functor: 'son'
        },
        functor: ':-',
        head:  {
          args: [
             {
              name: 'X'
            },
             {
              name: 'Y'
            }
          ],
          functor: 'father'
        }
      }
    ]

    );
  });

  it('3. Parse single Picat rule', function () {

    let prog = `father(X,Y) =>son(Y,X).`;
    //console.log(69,[...lexer(prog)]);
    let rules = parser(lexer(prog)).parseRules();

    assert.deepEqual(rules,[
   {
    body:  {
      functor:',',
      args: [
         {
          args: [],
          functor: '!'
        },
        {
          args: [
             {
              name: 'Y'
            },
             {
              name: 'X'
            }
          ],
          functor: 'son'
        }
      ]
    },
    functor: '=>',
        head:  {
          args: [
             {
              name: 'X'
            },
             {
              name: 'Y'
            }
          ],
          functor: 'father'
        }
      }
    ]

    );
  });


});


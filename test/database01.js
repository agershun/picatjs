const Lexer = await import('../src/Lexer.js');
const lexer = Lexer.lexer;

const Parser = await import('../src/Parser.js');
const parser = Parser.parser;

const PiDatabase = (await import('../src/PiDatabase.js')).PiDatabase;

const assert = await import('assert');

describe('Database 01', function () {
  it('1. Database with single fact', function () {

    let prog = `father(andrey,david).`;
    let rules = parser(lexer(prog)).parseRules();
    let db = new PiDatabase(rules);

    assert.deepEqual(db,
    {
  rules: [
     {
      body: undefined,
      cond: undefined,
      functor: '.',
      head:  {
        args: [
           {
            args: [],
            functor: 'andrey'
          },
           {
            args: [],
            functor: 'david'
          }
        ],
        functor: 'father'
      }
    }
  ]
  });
});
});


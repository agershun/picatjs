const Lexer = await import('../src/Lexer.js');
const lexer = Lexer.lexer;

const Parser = await import('../src/Parser.js');
const parser = Parser.parser;
const assert = await import('assert');

describe('Parser 01', function() {
    it('1. Parse single fact: f().', function() {

        let prog = `father(andrey,david).`;
        let rules = parser(lexer(prog)).parseRules();

        assert.deepEqual(rules, [{
            functor: '.',
            head: {
                functor: 'father',
                args: [
                    { args: [], functor: 'andrey' },
                    { args: [], functor: 'david' }
                ]
            },
            body: undefined,
            cond: undefined
        }]);
    });


    it('2. Parse single rule: head :- body.', function() {

        let prog = `father(X,Y):-son(Y,X).`;
        let rules = parser(lexer(prog)).parseRules();

        assert.deepEqual(rules, [{
                functor: ':-',
                head: {
                    functor: 'father',                  
                    args: [
                      { name: 'X' },
                      { name: 'Y' }
                    ],
                },
                body: {
                    functor: 'son',
                    args: [{
                            name: 'Y'
                        },
                        {
                            name: 'X'
                        }
                    ],
                },
                cond: undefined
            }]

        );
    });

    it('3. Parse single Picat rule: head => body.', function() {

        let prog = `father(X,Y) => son(Y,X).`;
        //console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();

        assert.deepEqual(rules, [{
          functor: '=>',
          head: {
              functor: 'father',
              args: [
                  { name: 'X' },
                  { name: 'Y' }
              ],
          },
          body: {
                functor: 'son',
                args: [
                    { name: 'Y' },
                    { name: 'X' }
                ],
          },
          cond: undefined
      }]);
  });

    it('4. Parse single Picat rule: head ?=> body.', function() {

        let prog = `father(X,Y) ?=> son(Y,X).`;
        //console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();

        assert.deepEqual(rules, [{
          functor: '?=>',
          head: {
              functor: 'father',
              args: [
                  { name: 'X' },
                  { name: 'Y' }
              ],
          },
          body: {
                functor: 'son',
                args: [
                    { name: 'Y' },
                    { name: 'X' }
                ],
          },
          cond: undefined
      }]);
  });

    it('5. Parse single Picat rule with single condition: head,cond => body.', function() {

        let prog = `father(X,Y),man(X) => son(Y,X).`;
        //console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();

        assert.deepEqual(rules, [{
          functor: '=>',
          head: {
              functor: 'father',
              args: [
                  { name: 'X' },
                  { name: 'Y' }
              ],
          },
          body: {
                functor: 'son',
                args: [
                    { name: 'Y' },
                    { name: 'X' }
                ],
          },
          cond: {
              functor: 'man',
              args: [
                  { name: 'X' },
              ],
          },
      }]);
  });


    it('6. Parse single Picat function fact: head =  expr.', function() {

        let prog = `fn(X) = 1.`;
        // console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();
// console.log(148,rules);
        assert.deepEqual(rules, [{
          functor: '=',
          head: {
              functor: 'fn',
              args: [
                  { name: 'X' },
              ],
          },
          expr: {
            val:1n
          },
          cond: undefined,
          body: undefined
      }]);
  });


    it('7. Parse single Picat function rule: head = expr => body.', function() {

        let prog = `fn(X) = Y => =(Y,3).`;
        // console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();
// console.log(148,rules);
        assert.deepEqual(rules, [{
          functor: '=',
          head: {
              functor: 'fn',
              args: [
                  { name: 'X' },
              ],
          },
          expr: {
            name:'Y'
          },
          cond: undefined,
          body: {
            functor: '=',
            args:[
              { name: 'Y' },
              {val:3n}
            ]
          },
      }]);
  });

    it('8. Parse single Picat function rule: head = expr,cond => body.', function() {

        let prog = `fn(X) = Y, >(X,2) => =(Y,3).`;
        // console.log(69,[...lexer(prog)]);
        let rules = parser(lexer(prog)).parseRules();
// console.log(148,rules);
        assert.deepEqual(rules, [{
          functor: '=',
          head: {
              functor: 'fn',
              args: [
                  { name: 'X' },
              ],
          },
          expr: {
            name:'Y'
          },
          cond: {
            functor: '>',
            args:[
              { name: 'X' },
              {val:2n}
            ]
          },
          body: {
            functor: '=',
            args:[
              { name: 'Y' },
              {val:3n}
            ]
          },
      }]);
  });


});

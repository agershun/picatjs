
export function *lexer(text) {
    var tokenRegexp = /\:\-|\=\>|\?\=\>|\|\||[()\[\]\{\}\.\,\|\;]|[0-9A-Za-z_\+\-\*\/\=\!\>\<\$]+/g;
    var match;
    while ((match = tokenRegexp.exec(text)) !== null) {
        yield match[0];
    }
}
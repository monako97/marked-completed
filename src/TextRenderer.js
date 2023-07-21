/**
 * TextRenderer
 * returns only the textual part of the token
 */
module.exports = class TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }

  em(text) {
    return text;
  }

  codespan(text) {
    return text;
  }

  del(text) {
    return text;
  }

  html(text) {
    return text;
  }

  text(text) {
    return text;
  }

  link(href, title, text) {
    return '' + text;
  }

  image(href, title, text) {
    return '' + text;
  }

  br() {
    return '';
  }

  mark(text) {
    return text;
  }

  sup(text) {
    return text;
  }

  sub(text) {
    return text;
  }

  ins(text) {
    return text;
  }

  s(text) {
    return text;
  }

  textEmoji(text) {
    return text;
  }

  codeEmoji(text) {
    return text;
  }

  katexInline(text) {
    return text;
  }

  colorFont(text, color, size, face, opacity) {
    return text;
  }
};

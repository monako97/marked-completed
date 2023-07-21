const { defaults } = require('./defaults.js');
const {
  cleanUrl,
  escape
} = require('./helpers.js');

/**
 * Renderer
 */
class Renderer {
  constructor(options) {
    this.options = options || defaults;
    this.itoc = [];
    this.itocIndex = 0;
  }

  code(code, infostring, escaped) {
    let _infostring = infostring || '';
    const lang = _infostring.match(/\S*/)[0];
    let langToolbar = '';
    if (this.options.langToolbar) {
      langToolbar = '<div class="toolbar" data-lang="' + lang + '">';
      for (let i = 0, len = this.options.langToolbar.length; i < len; i++) {
        langToolbar += '<button class="toolbar-'
        + this.options.langToolbar[i]
        + '"></button>';
      }
      langToolbar += '</div>';
    }
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }
    const lineNumber = this.options.langLineNumber ? ' class="line-numbers"' : '';

    if (!lang) {
      return '<pre'
        + lineNumber
        + '>'
        + langToolbar
        + '<code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }
    const className = this.options.langPrefix + lang + (_infostring.match(/\s\S *.+/g) || '');
    _infostring = null;
    return '<pre data-lang="'
      + lang
      + '"'
      + lineNumber
      + '>'
      + langToolbar
      + '<code class="'
      + className
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  }

  katexBlock(code, escaped) {
    return '<div class="n-katex-block">' + (escaped ? code : escape(code, true)) + '</div>\n';
  }

  blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  }

  blockquoteTip(quote) {
    return '<blockquote class="n-tip">\n' + quote + '</blockquote>\n';
  }

  html(html) {
    return html;
  }

  heading(text, level, id, slugger) {
    let headerPrefix = '';
    if (this.options.headerIds) {
      headerPrefix = ' data-prefix="'
      + this.options.headerPrefix
      + '"';
    }
    // ignore IDs
    return '<h' + level + headerPrefix + ' role="heading" aria-level="' + level + '" id="' + id + '">' + text + '</h' + level + '>\n';
  }

  hr() {
    return this.options.xhtml ? '<hr role="separator"/>\n' : '<hr role="separator">\n';
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + ' role="listbox">\n' + body + '</' + type + '>\n';
  }

  listitem(text) {
    return '<li role="option">' + text + '</li>\n';
  }

  checkbox(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox" role="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  }

  paragraph(text) {
    return '<p>' + text + '</p>\n';
  }

  table(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';

    return '<table role="grid">\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  }

  tablerow(content) {
    return '<tr role="row">\n' + content + '</tr>\n';
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th role="gridcell"' : 'td role="gridcell"';
    const tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  }

  // span level renderer
  strong(text) {
    return '<strong>' + text + '</strong>';
  }

  em(text) {
    return '<em>' + text + '</em>';
  }

  codespan(text) {
    return '<code>' + text + '</code>';
  }

  br() {
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  del(text) {
    return '<del>' + text + '</del>';
  }

  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = '<img role="dialog" src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  text(text) {
    return text;
  }

  textEmoji(text) {
    return text;
  }

  codeEmoji(text) {
    if (this.options.emojiSource) {
      return '<img class="n-emoji" style="width: 20px;height: 20px;" src="' + this.options.emojiSource + text + '.png" alt="' + text + '"/>';
    }
    return this.options.emoji[text] || ' :' + text + ': ';
  }

  mark(text) {
    return '<mark>' + text + '</mark>';
  }

  sup(text) {
    return '<sup>' + text + '</sup>';
  }

  sub(text) {
    return '<sub>' + text + '</sub>';
  }

  s(text) {
    return '<s>' + text + '</s>';
  }

  ins(text) {
    return '<ins>' + text + '</ins>';
  }

  katexInline(text) {
    return '<span class="n-katex-inline">' + text + '</span>';
  }

  colorFont(text, color, size, face) {
    console.log({ text, color, size, face });
    return `<font${color ? ` color="${color}"` : ''}${size ? ` size="${size}"` : ''}${face ? ` face="${face}"` : ''}>${text}</font>`;
  }

  addToc(anchor, text, level) {
    this.itoc.push({ anchor, level, text });
    return anchor;
  }

  // 使用堆栈的方式处理嵌套的ul,li，level即ul的嵌套层次，1是最外层
  toTocHTML() {
    const levelStack = [];
    let result = '';

    const addStartUL = () => {
      if (!result.trim().length) {
        result += '<ol class="n-md-toc" role="menubar">';
      } else {
        result += '<ol>';
      }
    };
    const addEndUL = () => {
      result += '</ol>\n';
    };
    const addLI = (anchor, text) => {
      result += '<li role="menuitemradio"><a href="#' + anchor + '">' + text + '</a></li>\n';
    };

    this.itoc.forEach(item => {
      let levelIndex = levelStack.indexOf(item.level);
      // 没有找到相应level的ul标签，则将li放入新增的ul中

      if (levelIndex === -1) {
        levelStack.unshift(item.level);
        addStartUL();
        addLI(item.anchor, item.text);
      } else if (levelIndex === 0) {
        // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
        addLI(item.anchor, item.text);
      } else {
        // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
        while (levelIndex--) {
          levelStack.shift();
          addEndUL();
        }
        addLI(item.anchor, item.text);
      }
    });
    // 如果栈中还有level，全部出栈打上闭合标签
    while (levelStack.length) {
      levelStack.shift();
      addEndUL();
    }
    // 清理先前数据供下次使用
    this.itoc = [];
    this.itocIndex = 0;

    return result;
  }
}

// Renderer.prototype.emoji = require('../emoji.js');
module.exports = Renderer;

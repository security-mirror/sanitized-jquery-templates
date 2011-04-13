// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==


/** @define{boolean} */
var DEBUG = true;


/**
 * Outside an HTML tag, directive, or comment.  (Parsed character data).
 * @const
 */
var STATE_HTML_PCDATA = 0;

/**
 * Inside an element whose content is RCDATA where text and entities
 * can appear but where nested elements cannot.
 * The content of {@code <title>} and {@code <textarea>} fall into
 * this category since they cannot contain nested elements in HTML.
 * @const
 */
var STATE_HTML_RCDATA = 1;

/** Just before a tag name.  @const */
var STATE_HTML_BEFORE_TAG_NAME = 2;

/** Inside a tag name.  @const */
var STATE_HTML_TAG_NAME = 3;

/** Before an HTML attribute or the end of a tag.  @const */
var STATE_HTML_TAG = 4;

/** Inside an HTML attribute name.  @const */
var STATE_HTML_ATTRIBUTE_NAME = 5;

/**
 * Following an equals sign (<tt>=</tt>) after an attribute name in an HTML tag.
 * @const
 */
var STATE_HTML_BEFORE_ATTRIBUTE_VALUE = 6;

/** Inside an HTML comment.  @const */
var STATE_HTML_COMMENT = 7;

/** Inside a normal (non-CSS, JS, or URI) HTML attribute value.  @const */
var STATE_HTML_NORMAL_ATTR_VALUE = 8;

/** In CSS content outside a comment, string, or URI.  @const */
var STATE_CSS = 9;

/** In CSS inside a comment.  @const */
var STATE_CSS_COMMENT = 10;

/** In CSS inside a double quoted string.  @const */
var STATE_CSS_DQ_STRING = 11;

/** In CSS inside a single quoted string.  @const */
var STATE_CSS_SQ_STRING = 12;

/** In CSS in a URI terminated by the first close parenthesis.  @const */
var STATE_CSS_URI = 13;

/** In CSS in a URI terminated by the first double quote.  @const */
var STATE_CSS_DQ_URI = 14;

/** In CSS in a URI terminated by the first single quote.  @const */
var STATE_CSS_SQ_URI = 15;

/** In JavaScript, outside a comment, string, or Regexp literal.  @const */
var STATE_JS = 16;

/** In JavaScript inside a line comment.  @const */
var STATE_JS_LINE_COMMENT = 17;

/** In JavaScript inside a block comment.  @const */
var STATE_JS_BLOCK_COMMENT = 18;

/** In JavaScript inside a double quoted string.  @const */
var STATE_JS_DQ_STRING = 19;

/** In JavaScript inside a single quoted string.  @const */
var STATE_JS_SQ_STRING = 20;

/** In JavaScript inside a regular expression literal.  @const */
var STATE_JS_REGEX = 21;

/** In an HTML attribute whose content is a URI.  @const */
var STATE_URI = 22;

/** Not inside any valid HTML/CSS/JS construct.  @const */
var STATE_ERROR = 23;

/** All of the state bits set.  @const */
var STATE_ALL = 31;
function stateOf(context) { return context & STATE_ALL; }

function isErrorContext(context) {
  return stateOf(context) === STATE_ERROR;
}


/** A type of HTML element. */

/** No element.  @const */
var ELEMENT_TYPE_NONE = 0;

/** A script element whose content is raw JavaScript.  @const */
var ELEMENT_TYPE_SCRIPT = 1 << 5;

/** A style element whose content is raw CSS.  @const */
var ELEMENT_TYPE_STYLE = 2 << 5;

/**
 * A textarea element whose content is encoded HTML but which cannot contain
 * elements.
 * @const
 */
var ELEMENT_TYPE_TEXTAREA = 3 << 5;

/**
 * A title element whose content is encoded HTML but which cannot contain
 * elements.
 * @const
 */
var ELEMENT_TYPE_TITLE = 4 << 5;

/** A listing element whose content is raw CDATA.  @const */
var ELEMENT_TYPE_LISTING = 5 << 5;

/** An XMP element whose content is raw CDATA.  @const */
var ELEMENT_TYPE_XMP = 6 << 5;

/**
 * An element whose content is normal mixed PCDATA and child elements.
 * @const
 */
var ELEMENT_TYPE_NORMAL = 7 << 5;

/** All of the element bits set.  @const */
var ELEMENT_TYPE_ALL = 7 << 5;
function elementTypeOf(context) { return context & ELEMENT_TYPE_ALL; }


/** Describes the content of an HTML attribute. */

/** No attribute.  @const */
var ATTR_TYPE_NONE = 0;

/** Mime-type text/javascript.  @const */
var ATTR_TYPE_SCRIPT = 1 << 8;

/** Mime-type text/css.  @const */
var ATTR_TYPE_STYLE = 2 << 8;

/** A URI or URI reference.  @const */
var ATTR_TYPE_URI = 3 << 8;

/**
 * Other content.  Human readable or other non-structured plain text or keyword
 * values.
 * @const
 */
var ATTR_TYPE_PLAIN_TEXT = 4 << 8;

/** All of the attribute type bits set.  @const */
var ATTR_TYPE_ALL = 7 << 8;
function attrTypeOf(context) { return context & ATTR_TYPE_ALL; }


/**
 * Describes the content that will end the current HTML attribute.
 */

/** Not in an attribute.  @const */
var DELIM_TYPE_NONE = 0;

/** {@code "}  @const */
var DELIM_TYPE_DOUBLE_QUOTE = 1 << 11;

/** {@code '}  @const */
var DELIM_TYPE_SINGLE_QUOTE = 2 << 11;

/** A space or {@code >} symbol.  @const */
var DELIM_TYPE_SPACE_OR_TAG_END = 3 << 11;

/** All of the delimiter type bits set.  @const */
var DELIM_TYPE_ALL = 3 << 11;
function delimTypeOf(context) { return context & DELIM_TYPE_ALL; }


/**
 * Describes what a slash ({@code /}) means when parsing JavaScript
 * source code.  A slash that is not followed by another slash or an
 * asterisk (<tt>*</tt>) can either start a regular expression literal
 * or start a division operator.
 * This determination is made based on the full grammar, but Waldemar
 * defined a very close to accurate grammar for a JavaScript 1.9 draft
 * based purely on a regular lexical grammar which is what we use in
 * the autoescaper.
 *
 * @see #isRegexPreceder
 */

/** Not in JavaScript.  @const */
var JS_FOLLOWING_SLASH_NONE = 0;

/**
 * A slash as the next token would start a regular expression literal.
 * @const
 */
var JS_FOLLOWING_SLASH_REGEX = 1 << 13;

/** A slash as the next token would start a division operator.  @const */
var JS_FOLLOWING_SLASH_DIV_OP = 2 << 13;

/**
 * We do not know what a slash as the next token would start so it is
 * an error for the next token to be a slash.
 * @const
 */
var JS_FOLLOWING_SLASH_UNKNOWN = 3 << 13;

/** All of the JS following slash bits set.  @const */
var JS_FOLLOWING_SLASH_ALL = 3 << 13;
function jsFollowingSlashOf(context) { return context & JS_FOLLOWING_SLASH_ALL; }


/**
 * Describes the part of a URI reference that the context point is in.
 *
 * <p>
 * We need to distinguish these so that we can<ul>
 *   <li>normalize well-formed URIs that appear before the query,</li>
 *   <li>encode raw values interpolated as query parameters or keys,</li>
 *   <li>filter out values that specify a scheme like {@code javascript:}.
 * </ul>
 */

/** Not in a URI.  @const */
var URI_PART_NONE = 0;

/**
 * Where a scheme might be seen.  At ^ in {@code ^http://host/path?k=v#frag}.
 * @const
 */
var URI_PART_START = 1 << 15;

/**
 * In the scheme, authority, or path.
 * Between ^s in {@code h^ttp://host/path^?k=v#frag}.
 * @const
 */
var URI_PART_PRE_QUERY = 2 << 15;

/**
 * In the query portion.  Between ^s in {@code http://host/path?^k=v^#frag}.
 * @const
 */
var URI_PART_QUERY = 3 << 15;

/** In the fragment.  After ^ in {@code http://host/path?k=v#^frag}.  @const */
var URI_PART_FRAGMENT = 4 << 15;

/**
 * Not {@link #NONE} or {@link #FRAGMENT}, but unknown.  Used to join different
 * contexts.
 * @const
 */
var URI_PART_UNKNOWN_PRE_FRAGMENT = 5 << 15;

/** Not {@link #NONE}, but unknown.  Used to join different contexts.  @const */
var URI_PART_UNKNOWN = 6 << 15;

/** All of the URI part bits set.  @const */
var URI_PART_ALL = 7 << 15;
function uriPartOf(context) { return context & URI_PART_ALL; }


var DELIM_TEXT = {};
DELIM_TEXT[DELIM_TYPE_DOUBLE_QUOTE] = '"';
DELIM_TEXT[DELIM_TYPE_SINGLE_QUOTE] = '\'';
DELIM_TEXT[DELIM_TYPE_SPACE_OR_TAG_END] = '';

/** Encodes HTML special characters.  @const */
var ESC_MODE_ESCAPE_HTML = 0;

/**
 * Like {@link #ESCAPE_HTML} but normalizes known safe HTML since RCDATA can't
 * contain tags.
 * @const
 */
var ESC_MODE_ESCAPE_HTML_RCDATA = 1;

/**
 * Encodes HTML special characters, including quotes, so that the
 * value can appear as part of a quoted attribute value.  This differs
 * from {@link #ESCAPE_HTML} in that it strips tags from known safe
 * HTML.
 * @const
 */
var ESC_MODE_ESCAPE_HTML_ATTRIBUTE = 2;

/**
 * Encodes HTML special characters and spaces so that the value can
 * appear as part of an unquoted attribute.
 * @const
 */
var ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE = 3;

/**
 * Only allow a valid identifier - letters, numbers, dashes, and underscores.
 * Throw a runtime exception otherwise.
 * @const
 */
var ESC_MODE_FILTER_HTML_IDENT = 4;

/**
 * Encode all HTML special characters and quotes, and JS newlines as
 * if to allow them to appear literally in a JS string.
 * @const
 */
var ESC_MODE_ESCAPE_JS_STRING = 5;

/**
 * If a number or boolean, output as a JS literal.  Otherwise surround
 * in quotes and escape.  Make sure all HTML and space characters are
 * quoted.
 * @const
 */
var ESC_MODE_ESCAPE_JS_VALUE = 6;

/**
 * Like {@link #ESCAPE_JS_STRING} but additionally escapes RegExp specials like
 * <code>.+*?$^[](){}</code>.
 * @const
 */
var ESC_MODE_ESCAPE_JS_REGEX = 7;

/**
 * Must escape all quotes, newlines, and the close parenthesis using
 * {@code \} followed by hex followed by a space.
 * @const
 */
var ESC_MODE_ESCAPE_CSS_STRING = 8;

/**
 * If the value is numeric, renders it as a numeric value so that
 * <code>{$n}px</code> works as expected, otherwise if it is a valid
 * CSS identifier, outputs it without escaping, otherwise surrounds in
 * quotes and escapes like {@link #ESCAPE_CSS_STRING}.
 * @const
 */
var ESC_MODE_FILTER_CSS_VALUE = 9;

/**
 * Percent encode all URI special characters and characters that
 * cannot appear unescaped in a URI such as spaces.  Make sure to
 * encode pluses and parentheses.
 * This corresponds to the JavaScript function {@code encodeURIComponent}.
 * @const
 */
var ESC_MODE_ESCAPE_URI = 10;

/**
 * Percent encode non-URI characters that cannot appear unescaped in a
 * URI such as spaces, and encode characters that are not special in
 * URIs that are special in languages that URIs are embedded in such
 * as parentheses and quotes.  This corresponds to the JavaScript
 * function {@code encodeURI} but additionally encodes quotes
 * parentheses, and percent signs that are not followed by two hex
 * digits.
 * @const
 */
var ESC_MODE_NORMALIZE_URI = 11;

/**
 * Like {@link #NORMALIZE_URI}, but filters out schemes like {@code javascript:}
 * that load code.
 * @const
 */
var ESC_MODE_FILTER_NORMALIZE_URI = 12;

/**
 * The explicit rejection of escaping.
 * @const
 */
var ESC_MODE_NO_AUTOESCAPE = 13;

/** Compresses better than false.  @const */
var FALSEY = 0;
/** Compresses better than true.  @const */
var TRUTHY = 1;

var IS_ESC_MODE_HTML_EMBEDDABLE = [];
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML] = TRUTHY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_RCDATA] = TRUTHY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE] = TRUTHY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE] = TRUTHY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_HTML_IDENT] = TRUTHY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_STRING] = FALSEY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_VALUE] = FALSEY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_REGEX] = FALSEY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_CSS_STRING] = TRUTHY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_CSS_VALUE] = FALSEY;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_URI] = TRUTHY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_NORMALIZE_URI] = FALSEY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_NORMALIZE_URI] = FALSEY;
//IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_NO_AUTOESCAPE] = FALSEY;

/**
 * A snippet of HTML that does not start or end inside a tag, comment, entity,
 * or DOCTYPE; and that does not contain any executable code
 * (JS, {@code <object>}s, etc.) from a different trust domain.
 * @const
 */
var CONTENT_KIND_HTML = 0;

/**
 * A sequence of code units that can appear between quotes (either kind) in a
 * JS program without causing a parse error, and without causing any side
 * effects.
 * <p>
 * The content should not contain unescaped quotes, newlines, or anything else
 * that would cause parsing to fail or to cause a JS parser to finish the
 * string its parsing inside the content.
 * <p>
 * The content must also not end inside an escape sequence ; no partial octal
 * escape sequences or odd number of '{@code \}'s at the end.
 * @const
 */
var CONTENT_KIND_JS_STR_CHARS = 1;

/** A properly encoded portion of a URI.  @const */
var CONTENT_KIND_URI = 2;


var CONTENT_KIND_FOR_ESC_MODE = [];
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML] = CONTENT_KIND_HTML;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_RCDATA] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_HTML_IDENT] = null;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_STRING] = CONTENT_KIND_JS_STR_CHARS;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_NORMALIZE_URI] = CONTENT_KIND_URI;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_URI] = CONTENT_KIND_URI;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_VALUE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_REGEX] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_CSS_STRING] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_CSS_VALUE] = null;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_NORMALIZE_URI] = CONTENT_KIND_URI;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_NO_AUTOESCAPE] = null;

var ESC_MODE_FOR_STATE = [];
ESC_MODE_FOR_STATE[STATE_HTML_PCDATA] = ESC_MODE_ESCAPE_HTML;
ESC_MODE_FOR_STATE[STATE_HTML_RCDATA] = ESC_MODE_ESCAPE_HTML_RCDATA;
ESC_MODE_FOR_STATE[STATE_HTML_BEFORE_TAG_NAME] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_TAG_NAME] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_TAG] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_ATTRIBUTE_NAME] = ESC_MODE_FILTER_HTML_IDENT;
//ESC_MODE_FOR_STATE[STATE_HTML_BEFORE_ATTRIBUTE_VALUE] = void 0;
ESC_MODE_FOR_STATE[STATE_HTML_COMMENT] = ESC_MODE_ESCAPE_HTML_RCDATA;
ESC_MODE_FOR_STATE[STATE_HTML_NORMAL_ATTR_VALUE]
    = ESC_MODE_ESCAPE_HTML_ATTRIBUTE;
ESC_MODE_FOR_STATE[STATE_CSS] = ESC_MODE_FILTER_CSS_VALUE;
//ESC_MODE_FOR_STATE[STATE_CSS_COMMENT] = void 0;
ESC_MODE_FOR_STATE[STATE_CSS_DQ_STRING] = ESC_MODE_ESCAPE_CSS_STRING;
ESC_MODE_FOR_STATE[STATE_CSS_SQ_STRING] = ESC_MODE_ESCAPE_CSS_STRING;
ESC_MODE_FOR_STATE[STATE_CSS_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_CSS_DQ_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_CSS_SQ_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_JS] = ESC_MODE_ESCAPE_JS_VALUE;
//ESC_MODE_FOR_STATE[STATE_JS_LINE_COMMENT] = void 0;
//ESC_MODE_FOR_STATE[STATE_JS_BLOCK_COMMENT] = void 0;
ESC_MODE_FOR_STATE[STATE_JS_DQ_STRING] = ESC_MODE_ESCAPE_JS_STRING;
ESC_MODE_FOR_STATE[STATE_JS_SQ_STRING] = ESC_MODE_ESCAPE_JS_STRING;
ESC_MODE_FOR_STATE[STATE_JS_REGEX] = ESC_MODE_ESCAPE_JS_REGEX;
ESC_MODE_FOR_STATE[STATE_URI] = ESC_MODE_ESCAPE_HTML_ATTRIBUTE;

function contextToString(context) {
  var parts = [];
  switch (stateOf(context)) {
  case STATE_HTML_PCDATA: parts.push("HTML_PCDATA"); break;
  case STATE_HTML_RCDATA: parts.push("HTML_RCDATA"); break;
  case STATE_HTML_BEFORE_TAG_NAME: parts.push("HTML_BEFORE_TAG_NAME"); break;
  case STATE_HTML_TAG_NAME: parts.push("HTML_TAG_NAME"); break;
  case STATE_HTML_TAG: parts.push("HTML_TAG"); break;
  case STATE_HTML_ATTRIBUTE_NAME: parts.push("HTML_ATTRIBUTE_NAME"); break;
  case STATE_HTML_BEFORE_ATTRIBUTE_VALUE:
    parts.push("HTML_BEFORE_ATTRIBUTE_VALUE"); break;
  case STATE_HTML_COMMENT: parts.push("HTML_COMMENT"); break;
  case STATE_HTML_NORMAL_ATTR_VALUE: parts.push("HTML_NORMAL_ATTR_VALUE"); break;
  case STATE_CSS: parts.push("CSS"); break;
  case STATE_CSS_COMMENT: parts.push("CSS_COMMENT"); break;
  case STATE_CSS_DQ_STRING: parts.push("CSS_DQ_STRING"); break;
  case STATE_CSS_SQ_STRING: parts.push("CSS_SQ_STRING"); break;
  case STATE_CSS_URI: parts.push("CSS_URI"); break;
  case STATE_CSS_DQ_URI: parts.push("CSS_DQ_URI"); break;
  case STATE_CSS_SQ_URI: parts.push("CSS_SQ_URI"); break;
  case STATE_JS: parts.push("JS"); break;
  case STATE_JS_LINE_COMMENT: parts.push("JS_LINE_COMMENT"); break;
  case STATE_JS_BLOCK_COMMENT: parts.push("JS_BLOCK_COMMENT"); break;
  case STATE_JS_DQ_STRING: parts.push("JS_DQ_STRING"); break;
  case STATE_JS_SQ_STRING: parts.push("JS_SQ_STRING"); break;
  case STATE_JS_REGEX: parts.push("JS_REGEX"); break;
  case STATE_URI: parts.push("URI"); break;
  case STATE_ERROR: parts.push("ERROR"); break;
  }
  switch (elementTypeOf(context)) {
  case ELEMENT_TYPE_SCRIPT: parts.push("SCRIPT"); break;
  case ELEMENT_TYPE_STYLE: parts.push("STYLE"); break;
  case ELEMENT_TYPE_TEXTAREA: parts.push("TEXTAREA"); break;
  case ELEMENT_TYPE_TITLE: parts.push("TITLE"); break;
  case ELEMENT_TYPE_LISTING: parts.push("LISTING"); break;
  case ELEMENT_TYPE_XMP: parts.push("XMP"); break;
  case ELEMENT_TYPE_NORMAL: parts.push("NORMAL"); break;
  }
  switch (attrTypeOf(context)) {
  case ATTR_TYPE_SCRIPT: parts.push("SCRIPT"); break;
  case ATTR_TYPE_STYLE: parts.push("STYLE"); break;
  case ATTR_TYPE_URI: parts.push("URI"); break;
  case ATTR_TYPE_PLAIN_TEXT: parts.push("PLAIN_TEXT"); break;
  }
  switch (delimTypeOf(context)) {
  case DELIM_TYPE_DOUBLE_QUOTE: parts.push("DOUBLE_QUOTE"); break;
  case DELIM_TYPE_SINGLE_QUOTE: parts.push("SINGLE_QUOTE"); break;
  case DELIM_TYPE_SPACE_OR_TAG_END: parts.push("SPACE_OR_TAG_END"); break;
  }
  switch (jsFollowingSlashOf(context)) {
  case JS_FOLLOWING_SLASH_REGEX: parts.push("REGEX"); break;
  case JS_FOLLOWING_SLASH_DIV_OP: parts.push("DIV_OP"); break;
  case JS_FOLLOWING_SLASH_UNKNOWN: parts.push("UNKNOWN"); break;
  }
  switch (uriPartOf(context)) {
  case URI_PART_START: parts.push("START"); break;
  case URI_PART_PRE_QUERY: parts.push("PRE_QUERY"); break;
  case URI_PART_QUERY: parts.push("QUERY"); break;
  case URI_PART_FRAGMENT: parts.push("FRAGMENT"); break;
  case URI_PART_UNKNOWN_PRE_FRAGMENT: parts.push("UNKNOWN_PRE_FRAGMENT"); break;
  case URI_PART_UNKNOWN: parts.push("UNKNOWN"); break;
  }
  return '[Context ' + parts.join(' ') + ']';
}

var REGEX_PRECEDER_KEYWORDS = {
  "break" : TRUTHY,
  "case" : TRUTHY,
  "continue" : TRUTHY,
  "delete" : TRUTHY,
  "do" : TRUTHY,
  "else" : TRUTHY,
  "finally" : TRUTHY,
  "instanceof" : TRUTHY,
  "return" : TRUTHY,
  "throw" : TRUTHY,
  "try" : TRUTHY,
  "typeof": TRUTHY
};

/**
 * True iff a slash after the given run of non-whitespace tokens
 * starts a regular expression instead of a div operator : (/ or /=).
 * <p>
 * This fails on some valid but nonsensical JavaScript programs like
 * {@code x = ++/foo/i} which is quite different than
 * {@code x++/foo/i}, but is not known to fail on any known useful
 * programs.  It is based on the draft
 * <a href="http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html">JavaScript 2.0
 * lexical grammar</a> and requires one token of lookbehind.
 *
 * @param {string} jsTokens A run of non-whitespace, non-comment, non string
 *     tokens not including the '/' character.  Non-empty.
 */
function isRegexPreceder(jsTokens) {
  // Tokens that precede a regular expression in JavaScript.
  // "!", "!=", "!==", "#", "%", "%=", "&", "&&",
  // "&&=", "&=", "(", "*", "*=", "+", "+=", ",",
  // "-", "-=", "->", ".", "..", "...", "/", "/=",
  // ":", "::", ";", "<", "<<", "<<=", "<=", "=",
  // "==", "===", ">", ">=", ">>", ">>=", ">>>",
  // ">>>=", "?", "@", "[", "^", "^=", "^^", "^^=",
  // "{", "|", "|=", "||", "||=", "~",
  // "break", "case", "continue", "delete", "do",
  // "else", "finally", "instanceof", "return",
  // "throw", "try", "typeof"

  var jsTokensLen = jsTokens.length;
  var lastChar = jsTokens.charAt(jsTokensLen - 1);
  switch (lastChar) {
  case '+':
  case '-':
    // ++ and -- are not
    var signStart = jsTokensLen - 1;
    // Count the number of adjacent dashes or pluses.
    while (signStart > 0 && jsTokens.charAt(signStart - 1) === lastChar) {
      --signStart;
    }
    var numAdjacent = jsTokensLen - signStart;
    // True for odd numbers since "---" is the same as "-- -".
    // False for even numbers since "----" is the same as "-- --" which ends
    // with a decrement, not a minus sign.
    return (numAdjacent & 1) === 1;
  case '.':
    if (jsTokensLen === 1) {
      return TRUTHY;
    }
    // There is likely to be a .. or ... operator in next version of EcmaScript.
    var ch = jsTokens.charAt(jsTokensLen - 2);
    return !('0' <= ch && ch <= '9');
  case '/':  // Match a div op, but not a regexp.
    return jsTokensLen === 1;
  default:
    // [:-?] matches ':', ';', '<', '=', '>', '?'
    // [{-~] matches '{', '|', '}', '~'
    if (/[#%&(*,:-?\[^{-~]/.test(lastChar)) { return TRUTHY; }
    // Look for one of the keywords above.
    var word = jsTokens.match(/[\w$]+$/);
    return word && REGEX_PRECEDER_KEYWORDS[word[0]] === TRUTHY;
  }
}

/**
 * A context which is consistent with both contexts.  This should be
 * used when multiple execution paths join, such as the path through
 * the then-clause of an <code>{if}</code> command and the path
 * through the else-clause.
 * @return STATE_ERROR when there is no such context consistent with both.
 */
function contextUnion(a, b) {
  if (a === b) {
    return a;
  }

  if (a === ((b & ~JS_FOLLOWING_SLASH_ALL) | jsFollowingSlashOf(a))) {
    return (a & ~JS_FOLLOWING_SLASH_ALL) | JS_FOLLOWING_SLASH_UNKNOWN;
  }

  var aUriPart = uriPartOf(a);
  if (a === ((b & ~URI_PART_ALL) | aUriPart)) {
    var bUriPart = uriPartOf(b);
    return (a & ~URI_PART_ALL) | (
        // If the parts differ but neither could be in the fragment then a
        // ? will conclusively transition into the query state, so use
        // UKNNOWN_PRE_FRAGMENT to allow ${...}s after '?'.
        // With unknown, ${...}s are only allowed after a '#'.
        aUriPart !== URI_PART_FRAGMENT && bUriPart !== URI_PART_FRAGMENT &&
        aUriPart !== URI_PART_UNKNOWN && bUriPart !== URI_PART_UNKNOWN ?
        URI_PART_UNKNOWN_PRE_FRAGMENT : URI_PART_UNKNOWN);
  }

  // Order by state so that we don't have to duplicate tests below.
  var aState = stateOf(a), bState = stateOf(b);
  if (aState > bState) {
    var swap = a;
    a = b;
    b = swap;
    swap = aState;
    aState = bState;
    bState = swap;
  }

  // If we start in a tag name and end between attributes, then treat us as
  // between attributes.
  // This handles <b{if $bool} attrName="value"{/if}>.
  if (aState == STATE_HTML_TAG_NAME && bState == STATE_HTML_TAG) {
    // We do not need to compare elementTypeOf(a) and elementTypeof(b) since in
    // HTML_TAG_NAME, there is no tag name, so no loss of information.
    return b;
  }

  if (aState === STATE_HTML_TAG && elementTypeOf(a) === elementTypeOf(b)) {
    // If one branch is waiting for an attribute name and the other is waiting
    // for an equal sign before an attribute value, then commit to the view that
    // the attribute name was a valueless attribute and transition to a state
    // waiting for another attribute name or the end of a tag.
    if (bState === STATE_HTML_ATTRIBUTE_NAME ||
        // In an attribute value ended by a delimiter.
        delimTypeOf(b) === DELIM_TYPE_SPACE_OR_TAG_END) {
      // TODO: do we need to require a space before any new attribute name?
      return a;
    }
  }

  return STATE_ERROR;
}

/**
 * Some epsilon transitions need to be delayed until we get into a branch.
 * For example, we do not transition into an unquoted attribute value
 * context just because the raw text node that contained the "=" did
 * not contain a quote character because the quote character may appear
 * inside branches as in
 *     {@code <a href={{if ...}}"..."{{else}}"..."{{/if}}>}
 * which was derived from production code.
 * <p>
 * But we need to force epsilon transitions to happen consistentky before
 * a dynamic value is considered as in
 *    {@code <a href=${x}>}
 * where we consider $x as happening in an unquoted attribute value context,
 * not as occuring before an attribute value.
 */
function contextBeforeDynamicValue(context) {
  var state = stateOf(context);
  if (state === STATE_HTML_BEFORE_ATTRIBUTE_VALUE) {
    context = computeContextAfterAttributeDelimiter(
        elementTypeOf(context), attrTypeOf(context),
        DELIM_TYPE_SPACE_OR_TAG_END);
  }
  return context;
}

function computeContextAfterAttributeDelimiter(elType, attrType, delim) {
  var state;
  var slash = JS_FOLLOWING_SLASH_NONE;
  var uriPart = URI_PART_NONE;
  switch (attrType) {
  case ATTR_TYPE_PLAIN_TEXT:
    state = STATE_HTML_NORMAL_ATTR_VALUE;
    break;
  case ATTR_TYPE_SCRIPT:
    state = STATE_JS;
    // Start a JS block in a regex state since
    //   /foo/.test(str) && doSideEffect();
    // which starts with a regular expression literal is a valid and possibly
    // useful program, but there is no valid program which starts with a
    // division operator.
    slash = JS_FOLLOWING_SLASH_REGEX;
    break;
  case ATTR_TYPE_STYLE:
    state = STATE_CSS;
    break;
  case ATTR_TYPE_URI:
    state = STATE_URI;
    uriPart = URI_PART_START;
    break;
  // NONE is not a valid AttributeType inside an attribute value.
  default: throw new Error(attrType);
  }
  return state | elType | attrType | delim | slash | uriPart;
}

var processRawText = (function () {
  var global = this;

  var HTML_ENTITY_NAME_TO_TEXT = {
    lt: '<',
    gt: '>',
    amp: '&',
    quot: '"',
    apos: "'"
  };

  function unescapeHtml(html) {
    if (html.indexOf('&') < 0) { return html; }  // Fast path for common case.
    return html.replace(
      /&(?:#(?:(x[0-9a-f]+)|([0-9]+))|(lt|gt|amp|quot|apos));/gi,
      function (entity, hex, decimal, entityName) {
        if (hex || decimal) {
          return String.fromCharCode(  // String.fromCharCode coerces its argument
              /** @type {number} */
              (0 + (hex || decimal)));
        }
        // We don't need to escape all entities, just the ones that could be token boundaries.
        return HTML_ENTITY_NAME_TO_TEXT[entityName.toLowerCase()];
      }
    );
  }


  /**
   * @return The end of the attribute value of -1 if delim indicates we are not in an attribute.
   *     {@code rawText.length} if we are in an attribute but the end does not appear in rawText.
   */
  function findEndOfAttributeValue(rawText, delim) {
    var rawTextLen = rawText.length;
    if (delim === DELIM_TYPE_NONE) { return -1; }
    if (delim === DELIM_TYPE_SPACE_OR_TAG_END) {
      var match = rawText.match(/[\s>]/);
      return match ? match.index : rawTextLen;
    }
    var quote = rawText.indexOf(DELIM_TEXT[delim]);
    return quote >= 0 ? quote : rawTextLen;
  }


  /**
   * Encapsulates a grammar production and the context after that production is seen in a chunk of
   * HTML/CSS/JS input.
   * @param {RegExp} pattern
   * @constructor
   */
  function Transition(pattern) {
    /** Matches a token. */
    this.pattern = pattern;
  }

  /**
   * True iff this transition can produce a context after the text in
   * {@code rawText[0:match.index + match[0].length]}.
   * This should not destructively modify the match.
   * Specifically, it should not call {@code find()} again.
   * @param {number} prior The context prior to the token in match.
   * @param {Array.<String>} match The token matched by {@code this.pattern}.
   */
  Transition.prototype.isApplicableTo = function (prior, match) {
    return TRUTHY;
  };

  /**
   * Computes the context that this production transitions to after
   * {@code rawText[0:match.index + match[].length]}.
   * @param {number} prior The context prior to the token in match.
   * @param {Array.<String>} match The token matched by {@code this.pattern}.
   * @return The context after the given token.
   */
  Transition.prototype.computeNextContext = function (prior, match) {
    throw new Error();  // Must be implemented by subclasses.
  };


  function TransitionSubclass(ctor, computeNextContext, opt_isApplicableTo) {
    var proto = ctor.prototype = new Transition(/(?!)/);
    proto.constructor = ctor;
    proto.computeNextContext = computeNextContext;
    if (opt_isApplicableTo) { proto.isApplicableTo = opt_isApplicableTo; }
  }


  /**
   * A transition to a given context.
   * @param {RegExp} regex
   * @param {number} dest a context.
   * @constructor
   * @extends Transition
   */
  function ToTransition(regex, dest) {
    Transition.call(this, regex);
    this.dest = dest;
  }
  TransitionSubclass(
      ToTransition,
      function (prior, match) { return this.dest; });


  /**
   * A transition to a context in the body of an open tag for the given element.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function ToTagTransition(regex, el) {
    Transition.call(this, regex);
    this.el = el;
  }
  TransitionSubclass(
      ToTagTransition,
      function (prior, match) { return STATE_HTML_TAG | this.el; });


  var TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT = {};
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_SCRIPT]
      = STATE_JS | JS_FOLLOWING_SLASH_REGEX;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_STYLE] = STATE_CSS;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_NORMAL] = STATE_HTML_PCDATA;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_LISTING] = STATE_HTML_RCDATA;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_TEXTAREA] = STATE_HTML_RCDATA;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_TITLE] = STATE_HTML_RCDATA;
  TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[ELEMENT_TYPE_XMP] = STATE_HTML_RCDATA;

  /**
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TagDoneTransition(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      TagDoneTransition,
      function (prior, match) {
        var elType = elementTypeOf(prior);
        var partialContext = TAG_DONE_ELEMENT_TYPE_TO_PARTIAL_CONTEXT[elType];
        if (typeof partialContext !== 'number') { throw new Error(elType); }
        return partialContext === STATE_HTML_RCDATA ? partialContext | elType : partialContext;
      });


  /**
   * A transition back to a context in the body of an open tag.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TransitionBackToTag(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
       TransitionBackToTag,
       function (prior, match) {
         return STATE_HTML_TAG | elementTypeOf(prior);
       });


  /**
   * Lower case names of attributes whose value is a URI.
   * This does not identify attributes like {@code <meta content>} which is conditionally a URI
   * depending on the value of other attributes.
   * @see <a href="http://www.w3.org/TR/html4/index/attributes.html">HTML4 attrs with type %URI</a>
   */
  var URI_ATTR_NAMES = {
      "action" : TRUTHY,
      "archive" : TRUTHY,
      "background" : TRUTHY,
      "cite" : TRUTHY,
      "classid" : TRUTHY,
      "codebase" : TRUTHY,
      "data" : TRUTHY,
      "dsync" : TRUTHY,
      "href" : TRUTHY,
      "longdesc" : TRUTHY,
      "src" : TRUTHY,
      "usemap" : TRUTHY
    };

  /**
   * A transition to a context in the name of an attribute whose type is determined from its name.
   * @param {RegExp} regex A regular expression whose group 1 is a prefix of an attribute name.
   * @constructor
   * @extends Transition
   */
  function TransitionToAttrName(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      TransitionToAttrName,
      function (prior, match) {
        var attrName = match[1].toLowerCase();
        var attr;
        if ('on' === attrName.substring(0, 2)) {
          attr = ATTR_TYPE_SCRIPT;
        } else if ("style" === attrName) {
          attr = ATTR_TYPE_STYLE;
        } else if (URI_ATTR_NAMES[attrName] === TRUTHY) {
          attr = ATTR_TYPE_URI;
        } else {
          attr = ATTR_TYPE_PLAIN_TEXT;
        }
        return STATE_HTML_ATTRIBUTE_NAME | elementTypeOf(prior) | attr;
      });

  /**
   * A transition to a context in the name of an attribute of the given type.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TransitionToAttrValue(regex, delim) {
    Transition.call(this, regex);
    this.delim = delim;
  }
  TransitionSubclass(
      TransitionToAttrValue,
      function (prior, match) {
        return computeContextAfterAttributeDelimiter(
            elementTypeOf(prior), attrTypeOf(prior), this.delim);
      });


  /**
   * A transition to the given state.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TransitionToState(regex, state) {
    Transition.call(this, regex);
    this.state = state;
  }
  TransitionSubclass(
      TransitionToState,
      function (prior, match) {
        return (prior & ~(URI_PART_ALL | STATE_ALL)) | this.state;
      });

  /**
   * A transition to the given state.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TransitionToJsString(regex, state) {
    Transition.call(this, regex);
    this.state = state;
  }
  TransitionSubclass(
      TransitionToJsString,
      function (prior, match) {
        return (prior & (ELEMENT_TYPE_ALL | ATTR_TYPE_ALL | DELIM_TYPE_ALL)) | this.state;
      });

  /**
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function SlashTransition(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      SlashTransition,
      function (prior, match) {
        switch (jsFollowingSlashOf(prior)) {
        case JS_FOLLOWING_SLASH_DIV_OP:
          return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL)) | STATE_JS | JS_FOLLOWING_SLASH_REGEX;
        case JS_FOLLOWING_SLASH_REGEX:
          return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL))
              | STATE_JS_REGEX | JS_FOLLOWING_SLASH_NONE;
        default:
          throw new Error(
              "Ambiguous / could be a RegExp or division.  " +
              "Please add parentheses before `" + match[0] + "`"
          );
        }
      });

  /**
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function JsPuncTransition(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      JsPuncTransition,
      function (prior, match) {
        return (prior & ~JS_FOLLOWING_SLASH_ALL) | (isRegexPreceder(match[0])
            ? JS_FOLLOWING_SLASH_REGEX : JS_FOLLOWING_SLASH_DIV_OP);
      });

  /**
   * A transition that consumes some content without changing state.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function TransitionToSelf(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      TransitionToSelf,
      function (prior, match) { return prior; });


  /** Consumes the entire content without change if nothing else matched. */
  var TRANSITION_TO_SELF = new TransitionToSelf(/$/);
  // Matching at the end is lowest possible precedence.

  var URI_PART_TRANSITION = new Transition(/[?#]|$/);
  URI_PART_TRANSITION.computeNextContext = function (prior, match) {
    var uriPart = uriPartOf(prior);
    if (uriPart === URI_PART_START) {
      uriPart = URI_PART_PRE_QUERY;
    }
    if (uriPart !== URI_PART_FRAGMENT) {
      var m0 = match[0];
      if ("?" === m0 && uriPart !== URI_PART_UNKNOWN) {
        uriPart = URI_PART_QUERY;
      } else if ("#" === m0) {
        uriPart = URI_PART_FRAGMENT;
      }
    }
    return (prior & ~URI_PART_ALL) | uriPart;
  };

  /**
   * Matches the end of a special tag like {@code script}.
   * @param {RegExp} pattern
   * @constructor
   * @extends Transition
   */
  function EndTagTransition(pattern) {
    Transition.call(this, pattern);
  }
  TransitionSubclass(
      EndTagTransition,
      // TODO: This transitions to an HTML_TAG state which accepts attributes.
      // So we allow nonsensical constructs like </br foo="bar">.
      // Add another HTML_END_TAG state that just accepts space and >.
      function (prior, match) {
        return STATE_HTML_TAG | ELEMENT_TYPE_NORMAL;
      },
      function (prior, match) {
        return attrTypeOf(prior) === ATTR_TYPE_NONE;
      });
  var SCRIPT_TAG_END = new EndTagTransition(/<\/script\b/i);
  var STYLE_TAG_END = new EndTagTransition(/<\/style\b/i);


  var ELEMENT_TYPE_TO_TAG_NAME = {};
  ELEMENT_TYPE_TO_TAG_NAME[ELEMENT_TYPE_TEXTAREA] = 'textarea';
  ELEMENT_TYPE_TO_TAG_NAME[ELEMENT_TYPE_TITLE] = 'title';
  ELEMENT_TYPE_TO_TAG_NAME[ELEMENT_TYPE_LISTING] = 'listing';
  ELEMENT_TYPE_TO_TAG_NAME[ELEMENT_TYPE_XMP] = 'xmp';

  /**
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function RcdataEndTagTransition(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      RcdataEndTagTransition,
      function (prior, match) {
        return STATE_HTML_TAG | ELEMENT_TYPE_NORMAL;
      },
      function (prior, match) {
        return match[1].toLowerCase()
            === ELEMENT_TYPE_TO_TAG_NAME[elementTypeOf(prior)];
      });

  /**
   * Matches the beginning of a CSS URI with the delimiter, if any, in group 1.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function CssUriTransition(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      CssUriTransition,
      function (prior, match) {
        var delim = match[1];
        var state;
        if ('"' === delim) {
          state = STATE_CSS_DQ_URI;
        } else if ("'" === delim) {
          state = STATE_CSS_SQ_URI;
        } else {
          state = STATE_CSS_URI;
        }
        return (prior & ~(STATE_ALL | URI_PART_ALL)) | state | URI_PART_START;
      });

  /**
   * Matches a portion of JavaScript that can precede a division operator.
   * @param {RegExp} regex
   * @constructor
   * @extends Transition
   */
  function DivPreceder(regex) {
    Transition.call(this, regex);
  }
  TransitionSubclass(
      DivPreceder,
      function (prior, match) {
        return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL)) | STATE_JS | JS_FOLLOWING_SLASH_DIV_OP;
      });

  /** Characters that break a line in JavaScript source suitable for use in a regex charset. */
  var JS_LINEBREAKS = "\r\n\u2028\u2029";

  /**
   * For each state, a group of rules for consuming raw text and how that affects the document
   * context.
   * The rules each have an associated pattern, and the rule whose pattern matches earliest in the
   * text wins.
   */
  var TRANSITIONS = [];
  TRANSITIONS[STATE_HTML_PCDATA] = [
    new TransitionToSelf(/^[^<]+/),
    new ToTransition(/<!--/, STATE_HTML_COMMENT),
    new ToTagTransition(/<script(?=[\s>\/]|$)/i, ELEMENT_TYPE_SCRIPT),
    new ToTagTransition(/<style(?=[\s>\/]|$)/i, ELEMENT_TYPE_STYLE),
    new ToTagTransition(/<textarea(?=[\s>\/]|$)/i, ELEMENT_TYPE_TEXTAREA),
    new ToTagTransition(/<title(?=[\s>\/]|$)/i, ELEMENT_TYPE_TITLE),
    new ToTagTransition(/<xmp(?=[\s>\/]|$)/i, ELEMENT_TYPE_XMP),
    new ToTransition(/<\/?/, STATE_HTML_BEFORE_TAG_NAME)];
  TRANSITIONS[STATE_HTML_BEFORE_TAG_NAME] = [
    new ToTransition(/^[a-z]+/i, STATE_HTML_TAG_NAME),
    new ToTransition(/^(?=[^a-z])/i, STATE_HTML_PCDATA)];
  TRANSITIONS[STATE_HTML_TAG_NAME] = [
    new TransitionToSelf(/^[a-z0-9:-]*(?:[a-z0-9]|$)/i),
    new ToTagTransition(/^(?=[\/\s>])/, ELEMENT_TYPE_NORMAL)];
  TRANSITIONS[STATE_HTML_TAG] = [
    // Allows {@code data-foo} and other dashed attribute names, but intentionally disallows
    // "--" as an attribute name so that a tag ending after a value-less attribute named "--"
    // cannot be confused with a HTML comment end ("-->").
    new TransitionToAttrName(/^\s*([a-z][\w-]*)/i),
    new TagDoneTransition(/^\s*\/?>/),
    new TransitionToSelf(/^\s+$/)];
  TRANSITIONS[STATE_HTML_ATTRIBUTE_NAME] = [
    new TransitionToState(/^\s*=/, STATE_HTML_BEFORE_ATTRIBUTE_VALUE),
    // For a value-less attribute, make an epsilon transition back to the tag body context to
    // look for a tag end or another attribute name.
    new TransitionBackToTag(/^/)];
  TRANSITIONS[STATE_HTML_BEFORE_ATTRIBUTE_VALUE] = [
    new TransitionToAttrValue(/^\s*"/, DELIM_TYPE_DOUBLE_QUOTE),
    new TransitionToAttrValue(/^\s*'/, DELIM_TYPE_SINGLE_QUOTE),
    new TransitionToAttrValue(/^(?=[^"'\s>])/,  // Matches any unquoted value part.
                              DELIM_TYPE_SPACE_OR_TAG_END),
    // Epsilon transition back if there is an empty value followed by an obvious attribute
    // name or a tag end.
    // The first branch handles the blank value in:
    //    <input value=>
    // and the second handles the blank value in:
    //    <input value= name=foo>
    new TransitionBackToTag(/^(?=>|\s+[\w-]+\s*=)/),
    new TransitionToSelf(/^\s+/)];
  TRANSITIONS[STATE_HTML_COMMENT] = [
    new ToTransition(/-->/, STATE_HTML_PCDATA),
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_HTML_NORMAL_ATTR_VALUE] = [
    TRANSITION_TO_SELF];
  // The CSS transitions below are based on http://www.w3.org/TR/css3-syntax/#lexical
  TRANSITIONS[STATE_CSS] = [
    new TransitionToState(/\/\*/, STATE_CSS_COMMENT),
    // TODO: Do we need to support non-standard but widely supported C++ style comments?
    new TransitionToState(/"/, STATE_CSS_DQ_STRING),
    new TransitionToState(/'/, STATE_CSS_SQ_STRING),
    new CssUriTransition(/\burl\s*\(\s*(["']?)/i),
    STYLE_TAG_END,
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_COMMENT] = [
    new TransitionToState(/\*\//, STATE_CSS),
    STYLE_TAG_END,
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_DQ_STRING] = [
    new TransitionToState(/"/, STATE_CSS),
    new TransitionToSelf(/\\(?:\r\n?|[\n\f"])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    STYLE_TAG_END,  // TODO: Make this an error transition?
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_SQ_STRING] = [
    new TransitionToState(/'/, STATE_CSS),
    new TransitionToSelf(/\\(?:\r\n?|[\n\f'])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    STYLE_TAG_END,  // TODO: Make this an error transition?
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_URI] = [
    new TransitionToState(/[\\)\s]/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToState(/["']/, STATE_ERROR),
    STYLE_TAG_END];
  TRANSITIONS[STATE_CSS_SQ_URI] = [
    new TransitionToState(/'/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToSelf(/\\(?:\r\n?|[\n\f'])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    STYLE_TAG_END];
  TRANSITIONS[STATE_CSS_DQ_URI] = [
    new TransitionToState(/"/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToSelf(/\\(?:\r\n?|[\n\f"])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    STYLE_TAG_END];
  TRANSITIONS[STATE_JS] = [
    new TransitionToState(/\/\*/, STATE_JS_BLOCK_COMMENT),
    new TransitionToState(/\/\//, STATE_JS_LINE_COMMENT),
    new TransitionToJsString(/"/, STATE_JS_DQ_STRING),
    new TransitionToJsString(/'/, STATE_JS_SQ_STRING),
    new SlashTransition(/\//),
    // Shuffle words, punctuation (besides /), and numbers off to an analyzer which does a
    // quick and dirty check to update isRegexPreceder.
    new JsPuncTransition(/(?:[^<\/"'\s\\]|<(?!\/script))+/i),
    new TransitionToSelf(/\s+/),  // Space
    SCRIPT_TAG_END];
  TRANSITIONS[STATE_JS_BLOCK_COMMENT] = [
    new TransitionToState(/\*\//, STATE_JS),
    SCRIPT_TAG_END,
    TRANSITION_TO_SELF];
  // Line continuations are not allowed in line comments.
  TRANSITIONS[STATE_JS_LINE_COMMENT] = [
    new TransitionToState(new RegExp("[" + JS_LINEBREAKS + "]"), STATE_JS),
    SCRIPT_TAG_END,
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_JS_DQ_STRING] = [
    new DivPreceder(/"/),
    SCRIPT_TAG_END,
    new TransitionToSelf(new RegExp(
              "^(?:" +                              // Case-insensitively, from start of string
                "[^\"\\\\" + JS_LINEBREAKS + "<]" + // match any chars except newlines, quotes, \s;
                "|\\\\(?:" +                        // or backslash followed by a
                  "\\r\\n?" +                       // line continuation
                  "|[^\\r<]" +                      // or an escape
                  "|<(?!/script)" +                 // or less-than that doesn't close the script.
                ")" +
                "|<(?!/script)" +
              ")+", 'i'))];
  TRANSITIONS[STATE_JS_SQ_STRING] = [
    new DivPreceder(/'/),
    SCRIPT_TAG_END,
    new TransitionToSelf(new RegExp(
              "^(?:" +                              // Case-insensitively, from start of string
                "[^'\\\\" + JS_LINEBREAKS + "<]" +  // match any chars except newlines, quotes, \s;
                "|\\\\(?:" +                        // or a backslash followed by a
                  "\\r\\n?" +                       // line continuation
                  "|[^\\r<]" +                      // or an escape;
                  "|<(?!/script)" +                 // or less-than that doesn't close the script.
                ")" +
                "|<(?!/script)" +
              ")+", 'i'))];
  TRANSITIONS[STATE_JS_REGEX] = [
    new DivPreceder(/\//),
    SCRIPT_TAG_END,
    new TransitionToSelf(new RegExp(
              "^(?:" +
                // We have to handle [...] style character sets specially since in /[/]/, the
                // second solidus doesn't end the regular expression.
                "[^\\[\\\\/<" + JS_LINEBREAKS + "]" +      // A non-charset, non-escape token;
                "|\\\\[^" + JS_LINEBREAKS + "]" +          // an escape;
                "|\\\\?<(?!/script)" +
                "|\\[" +                                   // or a character set containing
                  "(?:[^\\]\\\\<" + JS_LINEBREAKS + "]" +  // a normal character,
                  "|\\\\(?:[^" + JS_LINEBREAKS + "]))*" +  // or an escape;
                  "|\\\\?<(?!/script)" +                   // or an angle bracket possibly escaped.
                "\\]" +
              ")+", 'i'))];
    // TODO: Do we need to recognize URI attributes that start with javascript:, data:text/html,
    // etc. and transition to JS instead with a second layer of percent decoding triggered by
    // a protocol in (DATA, JAVASCRIPT, NONE) added to Context?
  TRANSITIONS[STATE_URI] = [URI_PART_TRANSITION];
  TRANSITIONS[STATE_HTML_RCDATA] = [
    new RcdataEndTagTransition(/<\/(\w+)\b/),
    TRANSITION_TO_SELF];


  /** @constructor */
  function RawTextContextUpdater() {
    /** The amount of rawText consumed. */
    this.numCharsConsumed = 0;
    /** The context to which we transition. */
    this.next = 0;
  }

  /**
   * Consume a portion of text and compute the next context.
   * Output is stored in member variables.
   * @param {string} text Non empty.
   */
  RawTextContextUpdater.prototype.processNextToken = function (text, context) {
    if (isErrorContext(context)) {  // The ERROR state is infectious.
      this.numCharsConsumed = text.length;
      this.next = context;
      return;
    }

    // Find the transition whose pattern matches earliest in the raw text.
    var earliestStart = 0x7fffffff;
    var earliestEnd = -1;
    var earliestTransition;
    var earliestMatch;
    var stateTransitions = TRANSITIONS[stateOf(context)];
    var transition, match, start, end;
    var i, n = stateTransitions.length;
    for (i = 0; i < n; ++i) {
      transition = stateTransitions[i];
      match = text.match(transition.pattern);
      if (match) {
        start = match.index;
        if (start < earliestStart) {
          end = start + match[0].length;
          if (transition.isApplicableTo(context, match)) {
            earliestStart = start;
            earliestEnd = end;
            earliestTransition = transition;
            earliestMatch = match;
          }
        }
      }
    }

    if (earliestTransition) {
      this.next = earliestTransition.computeNextContext(context, earliestMatch);
      this.numCharsConsumed = earliestEnd;
    } else {
      this.next = STATE_ERROR;
      this.numCharsConsumed = text.length;
    }
    if (this.numCharsConsumed === 0 && stateOf(this.next) === stateOf(context)) {
      throw new Error(  // Infinite loop.
          // Avoid an explicit dependency on contentToString.  If we're
          // debugging uncompiled, then we get the benefit of it, but the
          // compiler can treat it as dead code.
          (DEBUG ? contextToString(context) : context));
    }
  };


  /**
   * @param {string} rawText A chunk of HTML/CSS/JS.
   * @param {number} context The context before rawText.
   * @return The context after rawText.
   */
  function processRawText(rawText, context) {
    while (rawText) {

      // If we are in an attribute value, then decode rawText (except
      // for the delimiter) up to the next occurrence of delimiter.

      // The end of the section to decode.  Either before a delimiter
      // or > symbol that closes an attribute, at the end of the rawText,
      // or -1 if no decoding needs to happen.

      var attrValueEnd = findEndOfAttributeValue(rawText, delimTypeOf(context));
      if (attrValueEnd === -1) {
        // Outside an attribute value.  No need to decode.
        var cu = new RawTextContextUpdater();
        cu.processNextToken(rawText, context);
        rawText = rawText.substring(cu.numCharsConsumed);
        context = cu.next;

      } else {
        // Inside an attribute value.  Find the end and decode up to it.

        // All of the languages we deal with (HTML, CSS, and JS) use
        // quotes as delimiters.
        // When one language is embedded in the other, we need to
        // decode delimiters before trying to parse the content in the
        // embedded language.
        //
        // For example, in
        //       <a onclick="alert(&quot;Hello {$world}&quot;)">
        // the decoded value of the event handler is
        //       alert("Hello {$world}")
        // so to determine the appropriate escaping convention we
        // decode the attribute value before delegating to processNextToken.
        //

        // We could take the cross-product of two languages to avoid
        // decoding but that leads to either an explosion in the
        // number of states, or the amount of lookahead required.
        var rawTextLen = rawText.length;

        // The end of the attribute value.  At attrValueEnd, or
        // attrValueend + 1 if a delimiter needs to be consumed.
        var attrEnd = attrValueEnd < rawTextLen ?
            attrValueEnd + DELIM_TEXT[delimTypeOf(context)].length : -1;

        // Decode so that the JavaScript rules work on attribute values like
        //     <a onclick='alert(&quot;{$msg}!&quot;)'>

        // If we've already processed the tokens "<a", " onclick='" to
        // get into the single quoted JS attribute context, then we do
        // three things:
        //   (1) This class will decode "&quot;" to "\"" and work below to
        //       go from STATE_JS to STATE_JS_DQ_STRING.
        //   (2) Then the caller checks {$msg} and realizes that $msg is
        //       part of a JS string.
        //   (3) Then, the above will identify the "'" as the end, and so we
        //       reach here with:
        //       r a w T e x t = " ! & q u o t ; ) ' > "
        //                                         ^ ^
        //                              attrValueEnd attrEnd

        // We use this example more in the comments below.

        var attrValueTail = unescapeHtml(rawText.substring(0, attrValueEnd));
        // attrValueTail is "!\")" in the example above.

        // Recurse on the decoded value.
        var attrCu = new RawTextContextUpdater();
        while (attrValueTail.length !== 0) {
          attrCu.processNextToken(attrValueTail, context);
          attrValueTail = attrValueTail.substring(attrCu.numCharsConsumed);
          context = attrCu.next;
        }

        // TODO: Maybe check that context is legal to leave an attribute in.
        // Throw if the attribute ends inside a quoted string.

        if (attrEnd !== -1) {
          rawText = rawText.substring(attrEnd);
          // rawText is now ">" from the example above.

          // When an attribute ends, we're back in the tag.
          context = STATE_HTML_TAG | elementTypeOf(context);
        } else {
          // Whole tail is part of an unterminated attribute.
          if (attrValueEnd !== rawText.length) {
            throw new Error();  // Illegal State
          }
          rawText = "";
        }
      }
    }
    return context;
  }


  // TODO: If we need to deal with untrusted templates, then we need to make
  // sure that tokens like <!--, </script>, etc. are never split with empty
  // strings.
  // We could do this by walking all possible paths through each template
  // (both branches for ifs, each case for switches, and the 0,1, and 2+
  // iteration case for loops).
  // For each template, tokenize the original's rawText nodes using
  // RawTextContextUpdater and then tokenize one single rawText node made by
  // concatenating all rawText.
  // If one contains a sensitive token, e.g. <!--/ and the other doesn't, then
  // we have a potential splitting attack.
  // That and disallow unquoted attributes, and be paranoid about prints
  // especially in the TAG_NAME productions.

  return processRawText;
}());

/**
 * @param context the input context before the substitution.
 * @param out
 *   receives firstEscMode and secondEscMode properties with values from the
  ESC_MODE_* enum.
 */
function computeEscapingModeForSubst(contextBefore, out) {
  var context = contextBeforeDynamicValue(contextBefore);
  var escMode = ESC_MODE_FOR_STATE[stateOf(context)];
  switch (uriPartOf(context)) {
    case URI_PART_START:
      escMode = ESC_MODE_FILTER_NORMALIZE_URI;
      context = (context & ~URI_PART_ALL) | URI_PART_PRE_QUERY;
      break;
    case URI_PART_QUERY: case URI_PART_FRAGMENT:
      escMode = ESC_MODE_ESCAPE_URI; break;
  }
  var secondEscMode = null;
  var delimType = delimTypeOf(context);
  if (delimType !== DELIM_TYPE_NONE) {
    switch (escMode) {
      case ESC_MODE_ESCAPE_HTML: break;
      case ESC_MODE_ESCAPE_HTML_ATTRIBUTE:
        if (delimType === DELIM_TYPE_SPACE_OR_TAG_END) {
          escMode = ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE;
        }
        break;
      case ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE: break;
      default:
        if (!IS_ESC_MODE_HTML_EMBEDDABLE[escMode]) {
          secondEscMode = delimType === DELIM_TYPE_SPACE_OR_TAG_END
              ? ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE
              : ESC_MODE_ESCAPE_HTML_ATTRIBUTE;
        }
        break;
    }
  }
  out.firstEscMode = escMode;
  out.secondEscMode = secondEscMode;
  return context;
}

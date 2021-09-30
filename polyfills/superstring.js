const VsCodeTextBuffer = require('@vscode/textbuffer')
window.VsCodeTextBuffer = VsCodeTextBuffer
const { PieceTreeTextBufferBuilder } = VsCodeTextBuffer
// const TermKitTextBuffer = require("terminal-kit/lib/TextBuffer")

const Range = require('text-buffer/lib/range')
const Point = require('text-buffer/lib/point')
const fs = require('fs')

const DefaultLineFeeds = {
  LF: 1,
  CRLF: 2
}

class TextBuffer {
  constructor() {
    const textBufferBuilder = new PieceTreeTextBufferBuilder()
    const textBufferTreeFactory = textBufferBuilder.finish(true)

    this._buffer = textBufferTreeFactory.create(DefaultLineFeeds.LF)
  }

    // Extended: Return true if the buffer contains any astral-plane Unicode characters that
  // are encoded as surrogate pairs.
  //
  // Returns a {Boolean}.
  hasAstral () {
    //debugger
    if (this.cachedHasAstral !== null) {
      return this.cachedHasAstral
    } else {
      this.cachedHasAstral = this.buffer.hasAstral()
    }
  }

  // Experimental: Asynchronously search the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  //
  // Returns a {Promise} that resolves with the first {Range} of text that
  // matches the given regex.
  find (regex) { 
    //debugger
    return this.buffer.find(regex) 
  }

  // Experimental: Asynchronously search a given range of the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  // * `range` A {Range} to search within.
  //
  // Returns a {Promise} that resolves with the first {Range} of text that
  // matches the given regex.
  findInRange (regex, range) { 
    //debugger
    return this.buffer.findInRange(regex, range) 
  }

  // Experimental: Search the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  //
  // Returns the first {Range} of text that matches the given regex.
  findSync (regex) { 
    //debugger
    return this.buffer.findSync(regex) 
  }

  // Experimental: Search a given range of the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  // * `range` A {Range} to search within.
  //
  // Returns the first {Range} of text that matches the given regex.
  findInRangeSync (regex, range) { 
    //debugger
    return this.buffer.findInRangeSync(regex, range) 
  }

  // Experimental: Asynchronously search the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  //
  // Returns a {Promise} that resolves with an {Array} containing every
  // {Range} of text that matches the given regex.
  findAll (regex) { 
    //debugger
    return this.buffer.findAll(regex) 
  }

  // Experimental: Asynchronously search a given range of the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  // * `range` A {Range} to search within.
  //
  // Returns a {Promise} that resolves with an {Array} containing every
  // {Range} of text that matches the given regex.
  findAllInRangeSync (regex, range) { 
    //debugger
    
    const textInRange = this.getTextInRange(range);
    const matches = Array.from(textInRange.matchAll(regex));
    
    const offsetStart = this.buffer.getOffsetAt(range.start.row + 1, range.start.column + 1);    
    return matches.map(match => {
      const [matchText] = match
      const { index } = match

      //TODO God willing: result range probably starts at the position
      const resultOffsetStart = offsetStart + index
      const startPos = this.buffer.getPositionAt(resultOffsetStart);
      const endPos = this.buffer.getPositionAt(resultOffsetStart + matchText.length);

      return Range(
        Point(startPos.lineNumber - 1,  startPos.column - 1), 
        Point(endPos.lineNumber - 1,  endPos.column - 1)
      )
    })
  }

  // Experimental: Run an regexp search on the buffer
  //
  // * `regex` A {RegExp} to search for.
  //
  // Returns an {Array} containing every {Range} of text that matches the given
  // regex.
  findAllSync (regex) { 
    //debugger
    return this.buffer.findAllSync(regex) 
  }

  // Experimental: Search a given range of the buffer for a given regex.
  //
  // * `regex` A {RegExp} to search for.
  // * `range` A {Range} to search within.
  //
  // Returns an {Array} containing every {Range} of text that matches the given
  // regex.
  findAllInRange (regex, range) { 
    //debugger
    return this.findAllInRangeSync(regex, range) 
  }

  // Experimental: Find fuzzy match suggestions in the buffer
  //
  // * `query` A {String} to search for.
  // * `extraWordCharacters` A {String} of additional word characters to use when
  //    deciphering word boundaries
  // * `maxCount` A {Number} that limits the number of matches returned
  //
  // Returns an {Array} containing every {SubsequenceMatch} of text that matches the given
  // query.
  findWordsWithSubsequence (query, extraWordCharacters, maxCount) {
    //debugger
    return this.buffer.findWordsWithSubsequence(query, extraWordCharacters, maxCount)
  }

  // Experimental: Find fuzzy match suggestions in the buffer in a given range
  //
  // * `query` A {String} to search for.
  // * `extraWordCharacters` A {String} of additional word characters to use when
  //    deciphering word boundaries
  // * `maxCount` A {Number} that limits the number of matches returned
  // * `range` A {Range} that specifies the portion of the buffer to search
  //
  // Returns an {Array} containing every {SubsequenceMatch} of text that matches the given
  // query in the given range.
  findWordsWithSubsequenceInRange (query, extraWordCharacters, maxCount, range) {
    //debugger
    return this.buffer.findWordsWithSubsequenceInRange(query, extraWordCharacters, maxCount, range)
  }

  // Experimental: Search a given range of the buffer for a given regex. Store
  // the matching ranges in the given marker layer.
  //
  // * `markerLayer` A {MarkerLayer} to populate.
  // * `regex` A {RegExp} to search for.
  // * `range` A {Range} to search within.
  //
  // Returns an {Array} of {Marker}s representing the matches.
  findAndMarkAllInRangeSync (markerLayer, regex, range, options = {}) {
    //debugger
    const startId = this.nextMarkerId
    const exclusive = options.invalidate === 'inside' || !options.tailed
    this.nextMarkerId += this.buffer.findAndMarkAllSync(
      markerLayer.index,
      startId,
      exclusive,
      regex,
      Range.fromObject(range)
    )
    const markers = []
    for (let id = startId; id < this.nextMarkerId; id++) {
      const marker = new Marker(id, markerLayer, null, options, true)
      markerLayer.markersById[id] = marker
      markers.push(marker)
    }
    return markers
  }

  // Public: Get the number of lines in the buffer.
  //
  // Returns a {Number}.
  getLineCount () { 
    return this.buffer.getLineCount() 
  }
  
  // Public: Get the maximal position in the buffer, where new text would be
  // appended.
  //
  // Returns a {Point}.
  getExtent () { 
    const lineCount = this.buffer.getLineCount();
    const lineLength = this.buffer.getLineLength(lineCount);

    return Point(lineCount - 1, lineLength);
  }

  // Public: Get the length of the buffer's text.
  getLength () {
    return this.buffer.getLength() 
  }
  
  // Public: Convert a position in the buffer in row/column coordinates to an
  // absolute character offset, inclusive of line ending characters.
  //
  // The position is clipped prior to translating.
  //
  // * `position` A {Point} or point-compatible {Array}.
  //
  // Returns a {Number}.
  characterIndexForPosition (position) {
    //debugger
    return this.buffer.characterIndexForPosition(Point.fromObject(position))
  }

  // Public: Convert an absolute character offset, inclusive of newlines, to a
  // position in the buffer in row/column coordinates.
  //
  // The offset is clipped prior to translating.
  //
  // * `offset` A {Number}.
  //
  // Returns a {Point}.
  positionForCharacterIndex (offset) {
    //debugger
    return Point.fromObject(this.buffer.positionForCharacterIndex(offset))
  }

  /*
  Section: Reading Text
  */

  // Public: Determine whether the buffer is empty.
  //
  // Returns a {Boolean}.
  isEmpty () {
    //debugger
    return this.buffer.getLength() === 0
  }

  // Public: Get the entire text of the buffer. Avoid using this unless you know that the
  // buffer's text is reasonably short.
  //
  // Returns a {String}.
  getText () {
    const start = Point(0, 0);
    const end = this.getExtent();

    return this.getTextInRange(Range(start, end));
  }

  getCharacterAtPosition (position) {
    //debugger
    return this.buffer.getCharacterAtPosition(Point.fromObject(position))
  }

  // Public: Get the text in a range.
  //
  // * `range` A {Range}
  //
  // Returns a {String}
  getTextInRange (range) {
    const offsetStart = this.buffer.getOffsetAt(range.start.row + 1, range.start.column + 1);
    const offsetEnd = this.buffer.getOffsetAt(range.end.row + 1, range.end.column + 1)

    const startPos = this.buffer.getPositionAt(offsetStart);
    const endPos = this.buffer.getPositionAt(offsetEnd);

    const val = this.buffer.getValueInRange({
      startLineNumber: startPos.lineNumber,
      startColumn: startPos.column,
      endLineNumber: endPos.lineNumber,
      endColumn: endPos.column
    })

    return val
  }

  // Public: Get the text of all lines in the buffer, without their line endings.
  //
  // Returns an {Array} of {String}s.
  getLines () {
    //debugger
    return this.buffer.getLines()
  }

  // Public: Get the text of the last line of the buffer, without its line
  // ending.
  //
  // Returns a {String}.
  getLastLine () {
    //debugger
    return this.lineForRow(this.getLastRow())
  }

  getLastRow() {
    this.buffer.getLineCount()
  }

  // Public: Get the text of the line at the given 0-indexed row, without its
  // line ending.
  //
  // * `row` A {Number} representing the row.
  //
  // Returns a {String}.
  lineForRow (row) {
    return this.buffer.getLineContent(row + 1)
  }

  // Public: Get the line ending for the given 0-indexed row.
  //
  // * `row` A {Number} indicating the row.
  //
  // Returns a {String}. The returned newline is represented as a literal string:
  // `'\n'`, `'\r\n'`, or `''` for the last line of the buffer, which
  // doesn't end in a newline.
  lineEndingForRow (row) {
    const lineNum = row + 1;
    if (this.getLineCount() === lineNum) return '';
    return this.buffer.getEOL()
  }

  // Public: Get the length of the line for the given 0-indexed row, without its
  // line ending.
  //
  // * `row` A {Number} indicating the row.
  //
  // Returns a {Number}.
  lineLengthForRow (row) {
    return this.buffer.getLineLength(row + 1)
  }

  // Public: Insert text at the given position.
  //
  // * `position` A {Point} representing the insertion location. The position is
  //   clipped before insertion.
  // * `text` A {String} representing the text to insert.
  // * `options` (optional) {Object}
  //   * `normalizeLineEndings` (optional) {Boolean} (default: true)
  //   * `undo` (optional) *Deprecated* {String} 'skip' will skip the undo
  //     system. This property is deprecated. Call groupLastChanges() on the
  //     {TextBuffer} afterward instead.
  //
  // Returns the {Range} of the inserted text.
  setTextInRange (range, newText) {
    //debugger
    const offsetStart = this.buffer.getOffsetAt(range.start.row + 1, range.start.column + 1);
    
    if (!newText) {
      const offsetEnd = this.buffer.getOffsetAt(range.end.row + 1, range.end.column + 1);
      return this.buffer.delete(offsetStart, offsetEnd - offsetStart)
    }

    return this.buffer.insert(offsetStart, newText);
  }

  baseTextMatchesFile(source, encoding) {
    //debugger
  }

  baseTextDigest() {
    //debugger
  }

  deserializeChanges() {
    //debugger
  }
  
  serializeChanges() {
    //debugger
  }

  reset() {
    //debugger
  }

  isModified() {
    //debugger
  }

  async save(pathOrStream, encoding) {
    //https://nodejs.org/api/fs.html#fs_filehandle_write_buffer_offset_length_position

    const val = this.getText()
    return await new Promise((res, rej) => {
      fs.writeFile(pathOrStream, val, { encoding }, (err) => {
        err ? rej(err) : res()
      });
    });
  }

  loadSync(pathOrStream, encoding, cb) {
    //debugger
  }

  async load(pathOrStream, options, cb) {
    //https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback

    const { encoding, force, patch } = options
    const data = await new Promise((res, rej) => {
      fs.readFile(pathOrStream, { encoding }, (err, data) => {
        err ? rej(err) : res(data)
      });
    });

    this.setTextInRange(Range(Point(0, 0)), data);
  }

  getMarkerLayer(id) {
    //debugger
  }

  addMarkerLayer(options) {
    //debugger
  }

  clipRange(range) {
    //debugger
  }

  clipPosition(position) {
    //debugger
  }

  get transactCallDepth() {
    //debugger
  }

  get languageMode() {
    //debugger
    //languageMode.onDidChangeHighlighting(cb)
  }

  get nextDisplayLayerId() {
    //debugger
  }

  get displayLayers() {
    //debugger
  }

  get maxUndoEntries() {
    //debugger
  }

  get buffer() {
    return this._buffer
  }
}

const MarkerIndex = require("marker-index").default;
MarkerIndex.prototype.has = function (id) {
  //debugger
  return !!this.endNodesById[id]
}

MarkerIndex.prototype.remove = function (id) {
  //debugger
  return this.delete(id)
}

module.exports = {
  Patch: require("atom-patch"),
  MarkerIndex,
  TextBuffer
}
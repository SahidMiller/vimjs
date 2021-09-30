const fs = require('fs');
const path = require('path');

class File {
  constructor(path) {
    this.path = path;
  }

  getPath() {
    return this.path;
  }

  createWriteStream() {
    return fs.createWriteStream(this.path)
  }

  existsSync() {
    return fs.existsSync(this.path);
  }

  setEncoding(encoding) {
    this.encoding = encoding;
  }

  getBaseName() {
    return this.split(path.sep).pop();
  }

  createReadStream() {
    return fs.createReadStream(this.path);
  }

  onDidChange() {
    return {
      dispose() {
        
      }
    }
  }

  onDidDelete() {
    return {
      dispose() {
        
      }
    }
  }

  onDidRename() {
    return {
      dispose() {

      }
    }
  }

  onWillThrowWatchError() {
    return {
      dispose() {
        
      }
    }
  }
}

module.exports = { File }
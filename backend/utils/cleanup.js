const fs = require('fs');
const path = require('path');

// Deletes files older than 15 minutes from a temp directory
module.exports = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) return;
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() > stats.mtimeMs + 15 * 60 * 1000) fs.unlink(filePath, () => {});
      });
    });
  });
};

const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return `## ${filePath}\n\n\`\`\`\n${content}\n\`\`\`\n`;
}

function processDirectory(directory) {
  let output = '';
  const ignoreDirs = [
    'node_modules', 'dist', 'build', '.git',
    'coverage', '__tests__', '__mocks__'
  ];
  const ignoreFiles = [
    '.eslintignore', '.eslintrc', '.gitignore',
    '.prettierrc','package-lock.json'
  ];

  function traverseDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(file)) {
          traverseDirectory(filePath);
        }
      } else {
        const extension = file.split('.').pop();
        if (
          //,'json'
          ['js', 'ts', 'jsx', 'tsx', 'css', 'scss', 'less', 'html', 'md'].includes(extension) &&
          !ignoreFiles.includes(file)
        ) {
          output += processFile(filePath);
        }
      }
    }
  }

  traverseDirectory(directory);
  return output;
}

function convertRepoToText(repoPath, outputFile) {
  const text = `# 代码仓库: ${repoPath}\n\n`;
  const output = text + processDirectory(repoPath);

  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`转换完成,结果保存在: ${outputFile}`);
}

// 示例用法
const repoPath = "~/program/temp/nats.js";
const outputFile = "nats.js-js.md";
convertRepoToText(repoPath, outputFile);
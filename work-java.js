const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return `## ${filePath}\n\n\`\`\`\n${content}\n\`\`\`\n`;
}

function processDirectory(directory) {
  let output = '';
  const ignoreDirs = [
    'target', 'build', '.git', 'coverage', '__tests__', '__mocks__'
  ];
  const ignoreFiles = [
    '.gitignore', 'pom.xml'
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
        if (extension === 'java' && !ignoreFiles.includes(file)) {
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
const repoPath = "/Users/liangding/program/gitee/MicroCommunity";
const outputFile = "Java-MicroCommunity.md";
convertRepoToText(repoPath, outputFile);
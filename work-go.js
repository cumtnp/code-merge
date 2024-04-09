const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`Processing file: ${filePath}`);
  return `## ${filePath}\n\n\`\`\`python\n${content}\n\`\`\`\n`;
}

function processDirectory(directory) {
  let output = '';
  const ignoreDirs = [
    '__pycache__', 'venv', 'env', '.git', 'dist', 'build', 'tests', 'test',
    'doc', 'docs', 'imgs', 'logs', 'resources', 'StyleText', 'applications', 'configs','pse'
  ];
  const ignoreFiles = [
    '.gitignore', 'requirements.txt', 'setup.py', 'LICENSE', 'README.md', 'Makefile',
    '.clang-format', '.pre-commit-config.yaml', '.pylintrc', '.style.yapf', 'setup.cfg',
    'train.sh', 'MANIFEST.in','*_test.go'
  ];

  function traverseDirectory(currentDir) {
    console.log(`Traversing directory: ${currentDir}`);
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        if (!ignoreDirs.includes(file)) {
          traverseDirectory(filePath);
        } else {
          console.log(`Ignoring directory: ${filePath}`);
        }
      } else {
        if (file.endsWith('_test.go')) {
          console.log(`Ignoring test file: ${filePath}`);
          continue;
        }
        const extension = file.split('.').pop();
        if (
          ['go', 'xml'].includes(extension) &&
          !ignoreFiles.includes(file)
        ) {
          output += processFile(filePath);
        } else {
          console.log(`Ignoring file: ${filePath}`);
        }
      }
    }
  }

  traverseDirectory(directory);
  return output;
}

function convertRepoToText(repoPath, outputFile) {
  console.log(`Converting repository: ${repoPath}`);
  const text = `# 代码仓库: ${repoPath}\n\n`;
  const output = text + processDirectory(repoPath);
  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`转换完成,结果保存在: ${outputFile}`);
}

// 示例用法
const repoPath = "/Users/liangding/program/temp/nats-server/server";
const outputFile = "nats-server.md";
convertRepoToText(repoPath, outputFile);
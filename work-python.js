const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return `## ${filePath}\n\n\`\`\`python\n${content}\n\`\`\`\n`;
}

function processDirectory(directory) {
  let output = '';
  const ignoreDirs = [
    '__pycache__', 'venv', 'env', '.git', 'dist', 'build', 'tests', 'test',
    'doc', 'docs', 'imgs', 'logs', 'resources', 'StyleText', 'configs','applications','configs'
  ];
  const ignoreFiles = [
    '.gitignore', 'requirements.txt', 'setup.py', 'LICENSE', 'README.md', 'Makefile',
    '.clang-format', '.pre-commit-config.yaml', '.pylintrc', '.style.yapf',
    'setup.cfg', 'train.sh', 'MANIFEST.in'
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
          ['py', 'html', 'css', 'js', 'json', 'yml', 'yaml', 'txt', 'md'].includes(extension) &&
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
const repoPath = "program/open-source/crewai-experiments";
const outputFile = "crewai-experiments.md";
convertRepoToText(repoPath, outputFile);
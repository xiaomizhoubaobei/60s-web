import { rm, readdir } from 'fs/promises';
import { join } from 'path';
import { formatDistCss } from './formatDistCss.js';
import { formatDistJs } from './formatDistJs.js';

async function cleanDist() {
  try {
    // 1. 移除不需要的文件
    const filesToRemove = ['stats.html'];
    for (const file of filesToRemove) {
      try {
        await rm(join(process.cwd(), 'dist', file), { force: true });
        console.log(`已移除不需要的 ${file} 文件`);
      } catch {
        /* 忽略不存在 */
      }
    }

    // 2. 检查并报告构建产物结构
    const files = await readdir(join(process.cwd(), 'dist'), { withFileTypes: true });
    const assetsDir = files.find(f => f.isDirectory() && f.name === 'assets');
    if (assetsDir) {
      const assetTypes = await readdir(join(process.cwd(), 'dist', 'assets'), { withFileTypes: true });
      const assetTypeNames = assetTypes.filter(f => f.isDirectory()).map(f => f.name);
      console.log(`构建产物已按类型组织: ${assetTypeNames.join(', ')}`);
    }

    console.log('构建产物清理完成');
  } catch (error) {
    console.warn('清理构建产物时出现错误:', error.message);
  }
}

/* ------- 新增：串行执行格式化 ------- */
(async () => {
  try {
    await cleanDist();      // 先清理构建产物
    await formatDistCss();  // 然后格式化 CSS
    await formatDistJs();   // 最后格式化 JS
    console.log('所有构建产物格式化完成');
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
})();
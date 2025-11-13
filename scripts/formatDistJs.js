/**
 * 原地格式化 dist 目录下的 *.js
 * 支持 ESModule、CommonJS、TSX/JSX（按需改 glob 与 parser）
 */
import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import prettier from 'prettier';
import pLimit from 'p-limit';
import {join} from "path";

const distRoot = join(process.cwd(), 'dist');

async function formatDistJs() {
    const files = await glob('assets/js/**/*.js', { cwd: distRoot, absolute: true });
    if (!files.length) {
        console.log('未找到需要格式化的 JS 文件');
        return;
    }

    const limit = pLimit(4);
    const errors = [];

    await Promise.all(
        files.map(file =>
            limit(async () => {
                try {
                    const raw = (await readFile(file, 'utf8')).toString()

                    const formatted = await prettier.format(raw, {
                        parser: 'babel',
                        printWidth: 100,
                        tabWidth: 2,
                        singleQuote: true,
                        trailingComma: 'es5',
                        semi: true,
                    });

                    if (formatted !== raw) await writeFile(file, formatted, 'utf8');
                } catch (e) {
                    errors.push({ file, err: e.message });
                }
            })
        )
    );

    const ok = files.length - errors.length;
    console.log(`JS 格式化完成：成功 ${ok} 个，失败 ${errors.length} 个`);
    if (errors.length) {
        console.warn('---- 失败列表 ----');
        errors.forEach(({ file, err }) => console.warn(`${file}: ${err}`));
    }
}

export { formatDistJs };
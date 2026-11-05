// 构建后处理：GitHub Pages 没有 SPA 回退，
// 把 index.html 复制一份成 404.html，刷新子路由时就不会 404。
import { copyFileSync, existsSync } from 'node:fs';

if (existsSync('dist/index.html')) {
  copyFileSync('dist/index.html', 'dist/404.html');
  console.log('[postbuild] dist/404.html 已生成');
}

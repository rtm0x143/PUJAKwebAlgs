import gulp from 'gulp';

import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';

global.app = {
    gulp: gulp,
    path: path,
    plugins: plugins
}

import { copy } from './gulp/tasks/copy.js';
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { scss } from './gulp/tasks/scss.js';
import { images } from './gulp/tasks/images.js';
// import { fontConvert, convertTtfToOff } from './gulp/tasks/fonts.js';
import { fontStyle } from './gulp/tasks/fonts.js';

function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.images, images);
}

// const fonts = gulp.series(fontConvert, convertTtfToOff);

const mainTask = gulp.series(fontStyle, gulp.parallel(copy, html, scss, images));
const dev = gulp.series(reset, mainTask, gulp.parallel(watcher, server));

gulp.task('default', dev);
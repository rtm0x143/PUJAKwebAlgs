import fileinclude from "gulp-file-include";
import gulpVersionNumber from "gulp-version-number";

export const html = () => {
    return app.gulp.src(app.path.src.html)
        .pipe(fileinclude())
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                message: "Error: <%= error.message %>"
            }))
        )
        // .pipe(
        //     gulpVersionNumber({
        //         'value': '%DT%',
        //         'append': {
        //             'key': '_v',
        //             'cover': 0,
        //             'to': [
        //                 'css',
        //                 'js',
        //             ]
        //         },
        //         'output': {
        //             'file': 'gulp/version.json'
        //         }
        //     })
        // )
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browserSync.stream())
}
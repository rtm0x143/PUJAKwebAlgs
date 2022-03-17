import fileinclude from "gulp-file-include";

export const html = () => {
    return app.gulp.src(app.path.src.html)
        .pipe(fileinclude({
            prefix:'@@',
            basepath: '@file'
        }))
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "HTML",
                subtitle: "Fail HTML COMPILATION",
                message: "Error: <%= error.message %>"
            }))
        )
        .pipe(app.gulp.dest(app.path.build.html))
        .pipe(app.plugins.browserSync.stream())
}
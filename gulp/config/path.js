import nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const build = './build';
const src = './src';

export const path = {
    build: {
        css: `${build}/css/`,
        html: `${build}/`,
        images: `${build}/img/`,
        fonts: `${build}/fonts/`,
        files:  `${build}/files/`,
        js: `${build}/`
    },
    src: {
        images: `${src}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${src}/img/**/*.svg`,
        scss: `${src}/scss/style.scss`,
        html: `${src}/*.html`,
        files: `${src}/files/**/*.*`,
        js: `${src}/*.js`
    },
    watch: {
        scss: `${src}/scss/**/*.scss`,
        html: `${src}/*.html`,
        templates: `${src}/html/**/*.html`,
        files: `${src}/files/**/*.*`,
        images: `${src}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        js: `${src}/*.js`
    },
    
    clean: build,
    srcFolder: src,
    rootFolder: rootFolder,
}

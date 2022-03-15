import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = './build';
const srcFolder = './src';

export const path = {
    build: {
        css: `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images: `${buildFolder}/img/`,
        fonts: `${buildFolder}/fonts/`,
        files:  `${buildFolder}/files/` 
    },
    src: {
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg: `${srcFolder}/img/**/*.svg`,
        scss: `${srcFolder}/scss/style.scss`,
        html: `${srcFolder}/*.html`,
        files: `${srcFolder}/files/**/*.*`
    },
    watch: {
        scss: `${srcFolder}/scss/**/*.scss`,
        html: `${srcFolder}/*.*`,
        templates: `${srcFolder}/html/*.html`,
        files: `${srcFolder}/files/**/*.*`,
        images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`
    },
    
    clean: buildFolder,
    srcFolder: srcFolder,
    rootFolder: rootFolder,
}

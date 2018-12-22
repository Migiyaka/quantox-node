const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const path = require('path');
const execSync = require('child_process').execSync;

gulp.task('init-db', async () => {
    console.info('INIT DB: Dropping existing database.');

    try {
        execSync(path.resolve('./node_modules/.bin/sequelize db:drop'));
    } catch (e) {
        console.log('INIT DB: Can\'t drop db!');
    }

    console.info('INIT DB: Proceeding with database creation.');

    execSync(path.resolve('./node_modules/.bin/sequelize db:create'));
    execSync(path.resolve('./node_modules/.bin/sequelize db:migrate'));
    execSync(path.resolve('./node_modules/.bin/sequelize db:seed --seed 20181221210000-seed'));

    console.info('INIT DB: Database creation finished.');
});

gulp.task('server-dev', () => {
    nodemon({
        script: 'bin/www',
        ignore: ['views/**/*'],
    });
});

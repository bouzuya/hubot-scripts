module.exports = {
  options: {
    unused: true,
    undef: true,
    node: true,
    indent: 2,
    force: true,
    reporter: require('jshint-stylish')
  },
  grunt: ['Gruntfile.js', 'grunt/*.js'],
  src: ['src/**/*.js'],
  test: {
    options: {
      expr: true,
      globals: {
        it: false,
        describe: false,
        before: false,
        beforeEach: false,
        after: false,
        afterEach: false
      }
    },
    files: {
      src: ['test/**/*.js']
    }
  }
};


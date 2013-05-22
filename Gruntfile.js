module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      javap_min: {
        files: {
          'javap.min.js': ['src/main/classLoader.js', 'src/main/byteCodeParser.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
};

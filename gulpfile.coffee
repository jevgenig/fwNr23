gulp = require "gulp"
progeny = require "gulp-progeny"
gulpFilter = require "gulp-filter"
fs = require "fs"

through = require "through2"
underscore = require "underscore"
stylus = require "stylus"

gulp.task "build", ["stylus"]
gulp.task "default", ["build", "watch"]

gulp.task "stylus", ->
  currentPath = ""
  relativePath = ""
  GLOBAL.define = (moduleDeps, moduleDef) ->
    resolvedDeps = []
    localModule = {}

    for moduleDep in moduleDeps
      rPath = ""
      if (moduleDep == "exports")
        resolvedDeps.push exports
      else if (moduleDep == "module")
        resolvedDeps.push localModule
      else if (moduleDep == "underscore")
        resolvedDeps.push underscore
      else if (moduleDep.match /^core\//)
        rPath = __dirname + "/build/es6/" + moduleDep
      else
        rPath = __dirname + "/build" + relativePath + "es6/" + moduleDep

      if (rPath)
        require rPath
        resolvedDeps.push module.exports
    moduleDef.apply(null, resolvedDeps);
    module.exports = localModule.exports

  makeIncludeViewFun = (file) ->
    (includePath) ->
      currentPath = file.path.match(/^(.*?\/)[^\/]*$/)[1];
      relativePath = currentPath.substr(__dirname.length)
      modulePath = __dirname + "/build" + relativePath + includePath.string
      require.cache[modulePath + ".js"] = null
      delete require.cache[modulePath + ".js"]
      require modulePath
      test = module.exports

      css = test.css || test.constructor.css
      str = []
      for k,v of css({tablet: true})
        str.push k
        for ak,av of v
          str.push " " + ak + " " + av

      localCSS = stylus str.join("\n"),
        compress: true
      localCSS.set 'cache', false
      new stylus.nodes.Literal localCSS.render()

  gulp.src "apps/**/*.styl"
#.pipe cache "stylus"
#.pipe do progeny
  .pipe do ->
    through.obj (file, enc, cb)->
      pathMatch = file.path.match(/^(.*?\/)([^\/]*)$/)
      myCurrentPath = pathMatch[1]
      myFileName = pathMatch[2]
      myRelativePath = myCurrentPath.substr(__dirname.length)
      try
        css = stylus file.contents.toString("utf8")
        css.define "include-view", makeIncludeViewFun(file)
        css.set "compress", true
        css.set "cache", false
        css.render (err, css)=>
          throw(err) if err
          fs.writeFile __dirname + "/build" + myRelativePath + (myFileName.replace ".styl", ".css"), css
          cb()
      catch err
        console.log err.toString()
        cb()
  .pipe gulpFilter ["*/**", "!*/**/_*"]
  .pipe gulp.dest "./"


gulp.task "watch", ->
  gulp.watch ["apps/**/*.styl", "build/**/*.js"], ["stylus"]
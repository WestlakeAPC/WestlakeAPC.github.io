# WestlakeAPC.github.io
The Westlake APC public website.

## Dependencies

- Ruby 3.3
- Bundler 1.13.7
- Node.js 7.4.0
- Yarn 0.18.1 (for CLI)
- Gulp 4.0 (for CLI)

## To clone, install, and view

```bash
# Download and open directory.
https://github.com/WestlakeAPC/WestlakeAPC.github.io.git && cd WestlakeAPC.github.io

# Install ES and Ruby dependencies.
npm install && bundle install

# Run default gulp task to build project.
gulp
```

## Before committing/submitting PRs

Please run the following Gulp task before committing, to build your Jade, Sass, and TypeScript sources, and shrinkwrap dependencies if you have changed or updated the dependency list:

```bash
gulp build
````

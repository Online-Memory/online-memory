# Online Memory

![Ruby](https://github.com/andreasonny83/online-memory/workflows/Ruby/badge.svg?branch=master)

## Release

**Note:** This process is already integrated by GitHub Actions. Use the following steps only for local development/debug

This project uses [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)
for automatically generate the changelog file visible on the production website.

`github_changelog_generator` requires Ruby >=v2.5.0. If you don't have it already, install it with [rvm](https://codingpad.maryspad.com/2017/04/29/update-mac-os-x-to-the-current-version-of-ruby/):

```sh
$ curl -L https://get.rvm.io | bash -s stable
```

The upgrade your Ruby version to 2.5.0 with

```sh
$ rvm install ruby-2.5.0
$ rvm use 2.5.0
```

Then install `github_changelog_generator` with

```sh
$ gem install github_changelog_generator
```
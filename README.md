# Online Memory

![Ruby](https://github.com/Online-Memory/online-memory/workflows/Ruby/badge.svg?branch=master)

<p align="center">
  <img width="460" height="300" src="/assets/Readme.png">
</p>

This is an Online Memory game build with Love, React, NodeJS, AWS AppSync, GraphQL and more.

## Prerequisites

This project requires NodeJS (version 12.4.0 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
6.9.0
v12.4.0
```

This project will also require a server side instance running on AWS.
Read the Server side App section to know more

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/Online-Memory/online-memory.git
$ cd online-memory
```

Then install the Node dependencies with Yarn

```sh
$ yarn
```

## Usage

### Serving the app

```sh
$ yarn start
```

## Server Side App

This app will require a GraphQL server instance running on AWS.
To create a development version of the infrastructure required, you will first need an AWS account.
Then make sure your AWS credentials are available to Severless. (Follow the official guide from https://serverless.com/framework/docs/providers/aws/guide/credentials/)

Then just run the following Yarn script to make use of AWS Cloud Formation for creating all the required AWS services.

```sh
$ ACCOUNT_ID={YOUR_AWS_ACCOUNT_ID_HERE} yarn server:dev:deploy
```

Once done, rename the `.env.sample` file under the `packages/server/` to `.env` and fill the missing information

### What AWS services are going to be created/used by this app?

#### AppSync

AppSync is a GraphQL service running on AWS. We use this to manage all the communications between client and backend applications as well as establishing a websocket connection for real-time communication

#### Lambda

AWS Lambdas will be used to perform some GraphQL resolvers

#### S3

An S3 bucket will be used to store the code for the Lambdas

#### DynamoDB

A Dynamo database will be used for storing users and games infomation

#### Cognito

AWS Cognito will take care of the user authentication process

#### Iam

The AWS Identity and Access Management service will be used to manage the access/permissions to the different services allowing them to interact with each other

#### CloudWatch

CloudWatch is used for debugging the backend services running on AWS.
This is not enabled by default and it recommended to only turn this on on a Development or Staging environment.
To enable the debug mode, uncomment the last section of the `serverless.yml` file inside the `packages/server` folder

## Changelog Script

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

Now you can run `github_changelog_generator` with

```sh
$ github_changelog_generator -u andreasonny83 -p online-memory --token YOUR_GITHUB_TOKEN --no-unreleased
```

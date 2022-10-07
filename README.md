# weshare.click

Weshare.click (or `weshare` for short) is a simple file-sharing application that you can self-host on AWS and use as an alternative to file-transfer services such as WeTransfer or Dropbox Transfer.

The first version of this application was built from scratch by [Eoin](https://twitter.com/eoins) and [Luciano](https://twitter.com/loige) on a series of live streams as part of the [AWS Bites](https://awsbites.com) show. The full playlist (6 episodes / ~8 hours) is [available on YouTube](https://www.youtube.com/playlist?list=PLAWXFhe0N1vI1_z-06EzJ22pz95_gBrId).

The idea was to showcase how to build a real application using AWS, Serverless, and Node.js. The application is still minimal but usable.


## What are the use cases?

Imagine that you have a file you want to share with others, or even with yourself on another device. You don't want to use Google Drive, Dropbox, or any of the public cloud services, perhaps because they are blocked in some way.
This codebase will allow you to deploy your own, **branded** file-sharing service!


## Features

 - Upload a file using REST APIs or a CLI application
 - Ability to use a custom domain
 - Authentication (OAuth 2.0 & OAuth 2.0 device flow)

The feature set is still minimal, but it gives you a fully functional and usable backend.

If there's any feature that you'd like to see here, please [submit an issue](https://github.com/awsbites/weshare.click/issues/new) or, even better, [a PR](https://github.com/awsbites/weshare.click/compare).


## Current Architecture

The current architecture makes use of the following services:

  - **Lambda** for the backend
  - **API Gateway** for the API
  - **Cognito User Pool** for authentication
  - **S3** for file storage (using pre-signed URLs)
  - **Route53** and **ACM** to manage your custom domains and certificates


A high-level [architecture diagram](./arch-diag.png) is available in this repository.

The CLI authentication uses the OAuth 2.0 device authentication flow, which is not supported by Cognito by default, so we built a shim on top of the built-in Cognito OAuth 2.0 code flow. A [diagram](./auth-flow.png) that showcases how that works is available.


## Installation guide

### Requirements

  - Your AWS account
  - The [AWS CLI](https://aws.amazon.com/cli/) configured with the right credentials to deploy to your AWS account
  - [Node.js](https://nodejs.org/) (v16 or higher)
  - [Serverless framework](https://www.serverless.com/framework) (v3 or higher)
  - Your custom domain (easier if already registered with Route53)
  - A bash-compatible environment (Tested on Mac OSx but it should also work on Linux and Windows with subsystem for Linux)


### 1. Get the code & dependencies

The first step is to get the code locally by cloning this repository:

```bash
git clone git@github.com:awsbites/weshare.click.git
cd weshare.click
```

Now you can run the following script to download the necessary dependencies for every package:

```bash
./setup.sh
```

### 2. Configuration

Before deploying your weshare instance you need to provide some configuration.

To do that you have to create a file named `config.cjs` at the root of the project with the following content:

```js
// @ts-check
'use strict'

const { defineConfig } = require('./weshare.cjs')

exports.config = defineConfig({
  // region: 'eu-west-1', // inferred from AWS_REGION or DEFAULT_AWS_REGION (or 'eu-west-1' if not set)
  // stage: 'dev', // the name of the stage to deploy to (e.g. 'dev', 'prod')
  domain: '' // <-- ADD YOUR DOMAIN NAME HERE (e.g. 'files.weshare.click' or 'weshare.click')
})
```

> **Note**: If you don't like copy pasting you can instead run `mv config.cjs~sample config.cjs`)

You only need to specify the `domain` name but you can also change the default `region` and the `stage`.



### 3. Deployment

To deploy all the stacks you can run:

```bash
./deploy.sh
```

> **Warning**: The first deployment will need some manual intervention. The deployment will create a new Route 53 hosted zone. You will need to make sure that the DNS are propagated correctly to that new Hosted Zone. This is something that needs to be done **DURING THE FIRST DEPLOYMENT**. In fact, the deployment will also create a certificate in ACM and it will try to validate it based on resolving some DNS on that hosted zone. Until ACM is able to validate the domain, your deployment will be pending. See below how to manually configure the Hosted zone.

<details>
  <summary><h4>Configure NS records for the new hosted zone</h4></summary>

When the new hosted zone is created it gets a `NS` record that contains 4 different name servers. You will need to update your domain configuration (in your domain provider site) to point to the nameserver to the 4 name servers in this record.

If you need a one liner on how to get the name servers:

```bash
export DOMAIN='example.com' # <-- replace with your actual domain name
aws route53 get-hosted-zone --id $(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN | jq -r .HostedZones[0].Id) | jq -r .DelegationSet.NameServers[]
```

</details>


### 4. Create users

TODO ...

## Usage

TODO ...

## Uninstall

TODO ...


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/awsbites/weshare.click).

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino, Eoin Shanaghy.

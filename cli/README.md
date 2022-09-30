# weshare.click CLI client

`Weshare.click` is a simple personal file sharing service built by [Eoin Shanaghy](https://twitter.com/eoins)
and [Luciano Mammino](https://twitter.com/loige) during a [series of live coding streams](https://www.youtube.com/watch?v=EfRElTYilyY&list=PLAWXFhe0N1vI1_z-06EzJ22pz95_gBrId) as part of the [AWS Bites](https://awsbites.com) show.

Weshare.click is a minimal, yet fully-functional private file sharing system that can be used as an alternative to tools like WeTransfer or Dropbox Transfer.

The simple idea is that you upload a file, get a URL, then anyone you give that URL to can download the file.

This client allows you to interact with your instance of `weshare.click` by using the CLI.

If you still need to provision your `weshare.click` instance, check out the [`weshare.click` repository](https://github.com/awsbites/weshare.click) to learn how to do that.


## Install

Using npm:

```bash
npm install --global weshare
```

(requires Node.js v14 or higher)


## Usage

Before you can start uploading files, you need to authenticate your cli

The command:

```bash
weshare login
```

Will guide you through the process.

Once you have logged in, you can upload files with:

```bash
weshare [upload] <filename>
```

For example:

```bash
weshare upload README.md
```

This should print the public URL of the uploaded file.

You can share this URL with anyone you want to give the file to.


For more usage information run:

```bash
weshare --help
```

**NOTE**: `weshare` is also available with the alias `wsh` (in case you like to be extremely efficient at typing!)


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/awsbites/weshare.click).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino, Eoin Shanaghy.

# [`Substreams`](https://substreams.streamingfast.io/) [Telegram](https://telegram.org/) CLI `Node.js`

<!-- [<img alt="github" src="" height="20">](https://github.com/pinax-network/substreams-sink-telegram) -->
<!-- [<img alt="npm" src="" height="20">](https://www.npmjs.com/package/substreams-sink-telegram) -->
<!-- [<img alt="GitHub Workflow Status" src="" height="20">](https://github.com/pinax-network/substreams-sink-telegram/actions?query=branch%3Amain) -->

> `substreams-sink-telegram` is a tool that allows developers to pipe data extracted from a blockchain to the Telegram messaging social platform.

## 📖 Documentation

<!-- ### https://www.npmjs.com/package/substreams-sink-telegram -->

### Further resources

- [**Substreams** documentation](https://substreams.streamingfast.io)
- [**Telegram** Bot API documentation](https://core.telegram.org/bots/api)

### Protobuf

## CLI
[**Use pre-built binaries**](https://github.com/pinax-network/substreams-sink-telegram/releases)
- [x] MacOS
- [x] Linux
- [x] Windows

**Install** globally via npm
```
$ npm install -g substreams-sink-telegram
```

**Run**
```
$ substreams-sink-telegram run [options] <spkg>
```

## Features

- Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [ ] Read from `*.spkg` local filesystem
  - [ ] Read from `substreams.yaml` local filesystem
- [x] Handle `cursor` restart
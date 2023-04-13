# [`Substreams`](https://substreams.streamingfast.io/) Socials CLI `Node.js`

<!-- [<img alt="github" src="" height="20">](https://github.com/pinax-network/substreams-sink-socials) -->
<!-- [<img alt="npm" src="" height="20">](https://www.npmjs.com/package/substreams-sink-socials) -->
<!-- [<img alt="GitHub Workflow Status" src="" height="20">](https://github.com/pinax-network/substreams-sink-socials/actions?query=branch%3Amain) -->

> `substreams-sink-socials` is a tool that allows developers to pipe data extracted from a blockchain to their favorite messaging social platform.

## 📖 Documentation

<!-- ### https://www.npmjs.com/package/substreams-sink-socials -->

### Further resources

- [**Substreams** documentation](https://substreams.streamingfast.io)

### Protobuf

## CLI
[**Use pre-built binaries**](https://github.com/pinax-network/substreams-sink-socials/releases)
- [x] MacOS
- [x] Linux
- [x] Windows

**Install** globally via npm
```
$ npm install -g substreams-sink-socials
```

**Run**
```
$ substreams-sink-socials run [options] <spkg>
```

## Features

- Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [ ] Read from `*.spkg` local filesystem
  - [ ] Read from `substreams.yaml` local filesystem
- [x] Handle `cursor` restart
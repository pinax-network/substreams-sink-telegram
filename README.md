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
- [**Telegram** MarkdownV2 specifications](https://core.telegram.org/bots/api#markdownv2-style)
- [**Telegram** HTML specifications](https://core.telegram.org/bots/api#html-style)

### Protobuf

- [`sf.substreams.entity.v1.EntityChanges`](https://github.com/streamingfast/substreams-entity-change/blob/develop/proto/entity/v1/entity.proto)

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

### Formatting
Supports `JSON` and `YAML` format for configuration file. Example of `config.json` format configuration file:

```json
[
    {
        "entity": "Transfer",
        "chat_ids": [
            "@some_chat_id",
            "@some_other_chat_id"
        ],
        "message": "This *{user_id}* made a transaction with id [{trx_id}](https://someblockexplorer.com/transactions/{trx_id})"
    },
    {
        "entity": "Transfer",
        "parse_mode": "HTML",
        "chat_ids": [
            "@some_chat_id"
        ],
        "message": "PRIVATE GROUP: This <b>{user_id}</b> made a transaction with id <a href=\"https://someblockexplorer.com/transactions/{trx_id}\">{trx_id}</a>"
    },
    {
        "entity": "OtherEntity",
        "chat_ids": [
            "@some_chat_id"
        ],
        "message": "This {other_field}"
    }
]
```

Text between `{}` are field names and are used as labels for message templating. In the example above, all `EntityChanges` messages coming from the substream with `entity` key having `Transfer` as value, will be sent to [Telegram](https://telegram.org/) chats with id `@some_chat_id` and `@some_other_chat_id`, as specified in the first and second json object.

## Features

### Substreams

- Consume `*.spkg` from:
  - [x] Load URL or IPFS
  - [ ] Read from `*.spkg` local filesystem
  - [ ] Read from `substreams.yaml` local filesystem
- [x] Handle `cursor` restart

### Telegram
- [x] Handle rate limit
- [x] HTML message parsing
- [x] MarkdownV2 message parsing (by default)
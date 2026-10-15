# XailonOrbit

**XailonCode, in your pocket.** XailonOrbit is the mobile connector for [XailonCode](https://xailoncode.infinialabs.ai/): run XailonCode, Claude Code, Codex, Cursor or any ACP agent on your own computer, and start, steer and approve it from your phone. End-to-end encrypted, with a free agent built in so you can try it without logging in to anything.

## Get started in a minute

**1. Install the daemon** on the computer where your agents run:

```sh
npm install -g xailon-orbitd          # Node.js 22+, macOS / Linux x64 / Windows x64
brew install infinialabs-ai/tap/xailon-orbitd   # or Homebrew
```

**2. Start it:**

```sh
xailon-orbitd start
```

**3. Scan the QR code** it prints with the XailonOrbit app, then pick an agent. **XailonCode** is the default: XailonOrbit uses the `xailon` CLI if it is installed ([install it](https://xailoncode.infinialabs.ai/)) and otherwise downloads it (macOS Apple Silicon). Choose **Free** to start chatting right away; no account or API key required.

## Why XailonOrbit

- **One app for every agent.** XailonCode, Claude Code, Codex, Cursor, GitHub Copilot, Google Antigravity, OpenCode, Qwen Code, Kimi CLI and other [ACP](https://agentclientprotocol.com) agents. Switch agents and session options from your phone.
- **Start sessions from your phone.** The daemon runs in the background and starts with your computer, so you don't need to leave a terminal open or launch agents through a wrapper.
- **Your code stays on your machine.** Everything is end-to-end encrypted: the relay only forwards ciphertext. You can also [self-host the relay][relay].
- **Built for being away from the keyboard.**
  - Get a push notification when a task finishes.
  - Approve permission requests from your phone.
  - Talk to your agent with push-to-talk voice chat and hear a short spoken summary of each reply.
- **Review real work, not just chat.**
  - Browse files, Git changes, diffs and history.
  - Preview the HTML pages and charts your agent produces.
  - Watch a live view of the iOS Simulator, Android emulator or browser tab your agent is driving.
- **Built to keep running.** Drafts survive restarts, and the daemon can keep your computer awake while agents work.

## How it works

```text
XailonOrbit app  ⇄  Relay (ciphertext only)  ⇄  xailon-orbitd (your computer)  ⇄  ACP agents
```

`xailon-orbitd` connects out to the relay, so you don't need to open ports or set up a VPN. Your phone and computer pair with a secret Pairing ID, which is carried in the QR code, and derive the encryption keys from it.

**Keep the Pairing ID secret.** Anyone who has it can use your agents. Don't include it in screenshots or issue reports. If it leaks, run `xailon-orbitd reset` to rotate it.

---

## More install options

```sh
# Windows (Scoop)
scoop bucket add infinialabs https://github.com/infinialabs-ai/scoop-bucket
scoop install xailon-orbitd

# From source
cargo install --path crates/daemon
```

To upgrade an npm install, run `xailon-orbitd stop`, then `npm install -g xailon-orbitd@latest`, then `xailon-orbitd start`. Stop the daemon before you uninstall it. If you change your Node installation or npm's global directory, run `xailon-orbitd restart` from the new installation so autostart uses the new path.

## Daemon commands

| Command | Description |
| --- | --- |
| `xailon-orbitd start` | Register autostart, start in the background and show the pairing QR code |
| `xailon-orbitd stop` | Stop the daemon and remove autostart |
| `xailon-orbitd restart` | Restart the background service |
| `xailon-orbitd status` | Show service status, PID, relay URL, Pairing ID and QR code |
| `xailon-orbitd reset` | Rotate the Pairing ID and clear local connection state (agents and history are kept) |
| `xailon-orbitd` / `xailon-orbitd run` | Run in the foreground |

Options can go before or after the command and are saved for future starts:

```sh
xailon-orbitd restart --relay-url wss://your-relay.example/ws
xailon-orbitd reset --pairing-id <NEW_PAIRING_ID>
```

When you use a custom relay, the QR code carries both the Pairing ID and the relay URL. If you type the Pairing ID in manually, the app uses the default relay (`wss://xailon-relay.infinialabs.ai/ws`).

## Troubleshooting

- **Cannot connect:** check `xailon-orbitd status` and make sure the app uses the same Pairing ID and relay. Then try `xailon-orbitd restart`, and confirm that your network allows WebSocket connections to the relay.
- **Still stuck:** run `xailon-orbitd reset`, then tap **Reset App** in the app's Settings and scan the code again.
- **Connection preempted:** close any other client that shares the same device identity.
- **Connected, but an agent fails:** check that the agent's CLI works locally, and look at the daemon logs.

| OS | Daemon data directory |
| --- | --- |
| macOS | `~/Library/Application Support/xailonorbit/` |
| Linux | `${XDG_DATA_HOME:-~/.local/share}/xailonorbit/` |
| Windows | `%LOCALAPPDATA%\xailonorbit\` |

Logs are written to `logs/xailon-orbitd.YYYY-MM-DD.log`, one file per day, and the last 7 days are kept. Set `RUST_LOG=debug` for more detail. Save any logs you need before you run `reset`.

## Privacy

Android completion notifications are sent through a forwarder (`xailon-relay.infinialabs.ai/push`) to Firebase Cloud Messaging. The payload contains only the agent and session IDs, never prompts or replies. Legacy UUID Pairing IDs use plaintext transport; new installs always use encrypted `xop1_` IDs. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## For teams

We're exploring a team edition with a self-hosted relay, SSO, an approved-agent allowlist, audit logs and device management. If your team is interested, email [hello@infinialabs.ai](mailto:hello@infinialabs.ai) and tell us which agents you use and what your security review requires.

## License

[MIT](LICENSE). XailonOrbit is based on [AgentDeck](https://github.com/mantou132/AgentDeck) by mantou132.

[relay]: https://github.com/infinialabs-ai/xailon-relay

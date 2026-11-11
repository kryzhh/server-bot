# server-bot

A Discord-based remote system management bot with a modular command architecture. Currently implemented for Minecraft server management, but designed from the ground up to be extensible — any system operation (fetching hardware stats, managing services, triggering scripts, monitoring processes) can be added as a self-contained command module without touching the core.

## Architecture

The bot uses a filesystem-based dynamic command loader. Drop a `.js` file into the appropriate folder under `commands/` and it's automatically discovered, registered, and available as a slash command — no changes to `app.js` required.

Each command module is fully self-contained:
- Its own dependencies
- Its own authorization logic
- Its own Discord interaction handling

This makes it straightforward to extend beyond its current Minecraft use case. Want to add a `/cpu-stats` command that fetches live system metrics? A `/service-restart` that manages systemd units? A `/disk-usage` that reports storage? Each is just a new file.

Role-based access control is handled via an environment-configured allowlist (`ALLOWED_USERS`), so privileged commands are gated without hardcoding user IDs into the codebase.

## To Do
- Add battery check every 5 mins — if power is lost, stop server and wait until power is restored before restarting

---

## Setup (Minecraft)

The current implementation manages a Minecraft server running in a tmux session. Here's how to get it running:

- Install tmux
- Download `server.jar` from the Minecraft site
- Run it once and accept the EULA
- Create a polkit rule to allow shutdown/reboot without sudo:

```
sudo nano /etc/polkit-1/localauthority/50-local.d/allow-shutdown.pkla
```

Enter your username after `user:` (replace `console`):

```
Identity=unix-user:console
Action=org.freedesktop.login1.power-off;org.freedesktop.login1.reboot
ResultAny=yes
ResultInactive=yes
ResultActive=yes
```

Save and reboot (or `sudo systemctl restart polkit`).

- Clone the repo into the same folder where you ran `server.jar`:

```
git clone github.com/kryzhh/server-bot
```

- Install dependencies:

```
npm install
```

- Create a `.env` file:

```
clientId=<Add clientId from discord dev portal>
TOKEN=<Get your token from discord dev portal>
ALLOWED_USERS=<Get userId for all users who should have admin access, comma separated>
```

- Register slash commands:

```
node deploy-commands.js
```

- Run the bot:

```
npm run test
```

*(Script name will be updated)*

---

## Points to Remember

- To access the Minecraft console: `tmux a -t minecraft`
- To detach without killing the server: `Ctrl+B` then `D` — do **not** use `Ctrl+C`
- The `/ip` command requires manual setup — recommend configuring DDNS via NoIP or similar

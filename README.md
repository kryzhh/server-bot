# server-bot

To do list:
- Add the battery check every 5 mins if electricity gone, if yes, stop server and wait till the check returns true

## How to use:
- Install tmux
- Download server.jar from Minecraft site
- Run it once, accept the eula
- Create a polkit rule at:
`sudo nano /etc/polkit-1/localauthority/50-local.d/allow-shutdown.pkla`
Enter your username after user: (replace console)
```
Identity=unix-user:console
Action=org.freedesktop.login1.power-off;org.freedesktop.login1.reboot
ResultAny=yes
ResultInactive=yes
ResultActive=yes
```
Save and reboot (or `sudo systemctl restart polkit`).
- `git clone github.com/kryzhh/server-bot` into same folder where you ran server.jar
- `npm install`
- Create a `.env` file
```
clientId=<Add clientId from discord dev portal>
TOKEN=<Get your token from discord dev portal>
ALLOWED_USERS=<Get userId for all users who should have admin acccess, comma seperated>
```
- Deploy commands: `node deploy-commands.js`
- Run the app `npm run test` (Will change the script for running later)

## Points to remember:
- To access console `tmux a -t minecraft`
- To exit `Ctrl + B` then press `D` (DON'T `Ctrl+C`. IT KILLS THE SERVER)
- I know the IP command doesn't work, you are supposed to add it yourself. I would recommend setting up DDNS using NoIP or something similar

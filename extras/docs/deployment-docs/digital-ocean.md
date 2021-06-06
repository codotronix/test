

## CREATE NEW ENVIRONMENT
- Create a droplet (select `ssh` for connecting)
- Connect to the droplet via `ssh` using putty etc
    - In putty, create a new session with the `ipv4` of the newly created droplet, with `port 22` and `connection type: SSH`


### Install NodeJS and NPM
- Install **NVM** (Node Version Manager) with `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash`. Here is the [github repo](https://github.com/nvm-sh/nvm) for nvm for complete documentaions.

- Close and reopen the terminal.

- Install the latest LTS version of nodejs. Go to nodejs.org to check the latest lts version. `nvm install 12.19.0` or *shorthand* command for LTS - `nvm install --lts`

- Check the installation with `node -v` and `npm -v`


### Install MongoDB
- Check here for [Official Docs](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition)

- Import the MongoDB public GPG Key withthis command - `wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -`

- Create a list file for MongoDB with this command `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list`

- Reload local package database - `sudo apt-get update`

- Install the MongoDB packages - `sudo apt-get install -y mongodb-org`

- start MongoDB with systemctl. `sudo systemctl start mongod`

- check status with `sudo systemctl status mongod`

- enable automatically starting MongoDB when the system starts with `sudo systemctl enable mongod`


### Setup PM2
- PM2 is a daemon process manager that will help you manage and keep your application online 24/7. See documentation for all the commands - [PM2 Docs](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

- Install pm2 with `npm install -g pm2`

- Make pm2 auto-boot at server restart with `pm2 startup`

- Next we will keep on adding our processes e.g. reactale server and reacto server etc when we setup the codebase


### Reactale Codebase
- Create directory *code* with `mkdir code`

- Enter into *code* with `cd code`
- Clone `reactale-v2` here. `git clone https://github.com/reactale/reactale-v2.git`
- Enter into the directory `cd reactale-v2`

- Do `npm i` for npm installing the node side stuff.

- Do `npm run build` (it will automatically go into the `fe` directory, do npm install and build, and then come bacl to current directory)

- Do `npm run dev` to start the server and then go to the browser and hit the IPv4:9090 (don't forget to append the port 9090) of this Droplet. It should be showing our website.

- If everything is good so far, we will now register our reactale server with pm2 to make it auto start on server reboot.'

- In the reactale-v2 folder there is a **start.sh** file which we will be starting with pm2. So, make sure we are in the reactale root folder i.e. reactale-v2 and then run `pm2 start start.sh --name reactale`

- To freeze a process list for automatic respawn: `pm2 save`

- To check pm2 running processes `pm2 ls`


### Setup Reacto
- Run `mkdir /var/www/html/reacto` to create the reacto folder inside /var/www/html/ from where nginx can serve static contents

- Clone reacto repo in the ~/code folder - `git clone https://github.com/reactale/reacto.git`

- Run `cd ~/codes/reacto/gatsby-src` to get into our gatsby src folder

- Run `npm run deploy` which will 
    - build gatsby codebase. 
    - delete everything from reacto folder created under /var 
    - copy everything from currently built public folder to the aforementioned reacto folder



### Setup NGINX
- Install nginx. `sudo apt update` and then `sudo apt install nginx`

- Now if we go to our droplet ip address, we should see the nginx welcome page

- Next we need to configure the nginx default file which is located at `/etc/nginx/sites-available/default`. In our repo, we already have a default file stored at `reactale-v2/extras/nginx/backups/default`. Open our stored file, do the url modification **IF NEEDED** [not needed for production. Change only if using under other test domain]

- If edit required do - `nano ./extras/nginx/backups/default`. Change whatever you need to change [generally we need to change all reactale.com to reactale.tech or whatever we want for development deployment]. Once done, save it with `Ctrl + x`

- Now copy the file to required location. `sudo cp ./extras/nginx/backups/default /etc/nginx/sites-available/default`

- After changing configs, to check for syntax error, run `nginx -t`

- To restart nginx, run `sudo systemctl restart nginx`

- Now again if we hit our ip, we should see reactale home page instead of nginx default page.


### Firewall Setup
Setup the firewall to block access to all unneceessary ports.

- Optional. Generally these steps are not required. If firewall is not installed, use this `sudo apt install ufw`. Open config `sudo nano /etc/default/ufw` and mark `IPV6=yes`

- Set firewall to default 
```
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

- Allow neccessary connections only
```
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

- Configurations done. Activate firewall - `sudo ufw enable`. Now if we hit port 9090 or any other port, they will not be served.


### Setup Backups Folder
- In the server root, create backups folder and enter into it. `mkdir backups && cd backups`

- Clone the dumps repo. `git clone https://github.com/codotronix/dummy-dumps.git`

- Enter into it `cd dummy-dumps` and then enter either `dev` ot `prod` depending on your environment.

- If we wan to create a dump, we will create a folder with the naming convention **YYYY_MM_DD__H:M** and enter into that folder. Then the command would be `mongodump -d=rtl2`. This would create a dump of the database specified in that foolder. Git push it to save the dump for future. Here is the [mongodump docs](https://docs.mongodb.com/database-tools/mongodump/)

- To restore a dump, we need to specify `mongorestore path_till_dump/dump/`

- Also inside backups folder clone this repo for image backups - `git clone https://github.com/codotronix/rtl-img-dump.git`





## UPDATE LATEST CODE
Whenever we want to update our codebase.
- Connect with putty
- Do `ls` and navigate to the specific git folder
- Just do `git pull` to take in the latest code
- Build if needed, e.g. `npm run build`
- Normally `nodemon` will automatically pickup the latest changes. If not, then do next 2 steps.
- Run `pm2 ls` to check all running pm2 processes
- Restart the desired process with `pm2 restart app_name`
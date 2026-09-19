# Deploying Assemble3 to EC2 (Ubuntu + Apache)

Layout on the server: `/var/www/assemble` = this repo (Laravel at the root, the
editor's sources in `editor/`, which the server does not need to build); the
editor build lives in `/var/www/assemble/public/editor` (not in git — built
locally and uploaded). URLs: `https://assemble.theiagod.com/` (Laravel) and
`https://assemble.theiagod.com/editor/` (editor).

## 1. Server packages (once)

```sh
sudo apt update
sudo apt install -y apache2 mysql-server composer \
  php8.4 libapache2-mod-php8.4 php8.4-mysql php8.4-xml php8.4-mbstring \
  php8.4-curl php8.4-zip php8.4-bcmath php8.4-intl php8.4-gd
sudo a2enmod rewrite headers expires deflate
```

If `php8.4` is not in the distro's repos: `sudo add-apt-repository ppa:ondrej/php && sudo apt update` first.

## 2. Database

```sh
sudo mysql -e "CREATE DATABASE assemble CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'temp';
FLUSH PRIVILEGES;"
```

## 3. Laravel

```sh
sudo mkdir -p /var/www/assemble && sudo chown $USER:www-data /var/www/assemble
git clone -b c3-reskin --filter=blob:none https://github.com/thiagobarrado99/GDevelop-C3-Reskin.git /var/www/assemble
cd /var/www/assemble
composer install --no-dev --optimize-autoloader
cp .env.example .env         # then set DB_PASSWORD=temp, APP_ENV=production, APP_DEBUG=false
php artisan key:generate
php artisan migrate --force
php artisan config:cache && php artisan route:cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

## 4. Apache + HTTPS

DNS: an `A` record `assemble.theiagod.com` → the EC2 public IP (security group: 80 + 443 open).

```sh
sudo cp deploy/apache/assemble.theiagod.com.conf /etc/apache2/sites-available/
sudo a2ensite assemble.theiagod.com && sudo a2dissite 000-default
sudo apache2ctl configtest && sudo systemctl reload apache2
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d assemble.theiagod.com
```

## 5. The editor

On your machine (Git Bash), from the repo root:

```sh
bash deploy/build-editor.sh
rsync -az --delete public/editor/ ubuntu@<ec2-ip>:/var/www/assemble/public/editor/
```

(No rsync on Windows? `scp -r public/editor ubuntu@<ec2-ip>:/var/www/assemble/public/` works too.)

`build-editor.sh` builds `editor/newIDE/app` with `PUBLIC_URL=/editor`, copies the
GDJS game runtime into the build (the fork's runtime, not GDevelop's CDN), and
copies everything to `public/editor`. Apache serves that folder directly
(`/editor` → `/editor/` → `index.html`); `public/editor/.htaccess` sets the
cache headers. Previews and the external editors (Piskel…) run from the same
origin, so no CORS setup is needed.

## Updating

- Laravel: `git pull && composer install --no-dev && php artisan migrate --force && php artisan config:cache && php artisan route:cache`.
- Editor: rebuild + rsync as in step 5. The service worker picks up new builds on the next load.

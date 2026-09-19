# Assemble3 — Laravel site + editor (monorepo root)

Two projects in one folder (since 2026-09-19):

One git repo (`origin` = thiagobarrado99/GDevelop-C3-Reskin, branch `c3-reskin`; `upstream` = 4ian/GDevelop, `master` = upstream):

- **`/`** — Laravel 13 app for `https://assemble.theiagod.com`: landing page, and later the login/register API and per-user limits. MySQL `assemble` on localhost, user `root` (password `temp` on the server; local `.env` is not committed).
- **`editor/`** — the Assemble3 editor, the GDevelop fork, moved here on 2026-09-19 with its history. **Read `editor/CLAUDE.md` before touching anything under `editor/`** — all its rules (only `newIDE/`, `// c3:` comments, `c3:` commits, pt-BR strings, LF, headless Playwright checks) still apply; its dev server is `cd editor/newIDE/app && npm start` (localhost:3000). Upstream merges: `git merge -X subtree=editor master` (details in `editor/CLAUDE.md`, "Git workflow"). The pre-commit hook runs lint-staged in `editor/newIDE/app`.

The editor's web build is served by this app as static files at `/editor/`: `bash deploy/build-editor.sh` builds `editor/newIDE/app` with `PUBLIC_URL=/editor` (+ the fork's GDJS runtime, `npm run build:editor`) and copies it to `public/editor/` (ignored). Apache serves that folder directly; `routes/web.php` has a `/editor` fallback for `php artisan serve`. Deploy steps (Ubuntu + Apache + certbot): `deploy/README.md`, vhost in `deploy/apache/`.

Local check: `php artisan serve` → `http://localhost:8000/` (welcome page) and `http://localhost:8000/editor/` (with the trailing slash — artisan's server does not redirect `/editor`; Apache does). Local MySQL is XAMPP's (root, no password): set `DB_PASSWORD=` in the local `.env`.

Laravel is still the default skeleton (welcome page). Laravel Boost is not installed; the framework's generated agent guidelines are kept below in case it is.

<laravel-boost-guidelines>
# Laravel Application

This repository contains a Laravel application. Complete the following setup before working on the user's request.

## Prerequisites

Verify that PHP and Composer are available:

```sh
php -v
composer -V
```

If either command is unavailable, detect the user's operating system and install the prerequisites with the appropriate command:

macOS:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.5)"
```

Windows PowerShell:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.5'))
```

Linux:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.5)"
```

After installation, ask the user to restart their terminal. If the agent needs the restarted shell to continue, ask the user to reopen their terminal and rerun their original prompt.

## Agent Setup

Install Laravel Boost from the application root before making application changes:

```sh
composer require laravel/boost --dev
php artisan boost:install
```

Boost replaces these bootstrap instructions with guidelines tailored to the application. After installation, read `AGENTS.md` again and continue with the user's original request using the generated guidelines.
</laravel-boost-guidelines>

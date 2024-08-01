# mooctest-data-accessment-frontend

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development and serves locally

```shell
npm run serve_local_dev
```

### Compiles and minifies for production and serves locally

```shell
npm run serve_local_pro
```


Note that we don't have to use this command. The code in [.github/workflows](.github/workflows) will automatically call this command. For gitlab without git-action the workflow doesn't work.

### To Build the project for production

Just replace the `serve` with `build` in the above commands.

### Compiles and minifies for production for github page

```shell
npm run build_github
```

### About the AJAX API

Remember to add some suffix like `/api/v2`.

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

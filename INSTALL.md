# Installation Instructions

This package is hosted on **GitHub Packages**. To install it, you must configure your local environment to tell `npm` where to find the `@sanmugamks` scope.

## 1. Create a `.npmrc` file

In the root of the project where you want to **install** this package, create or update a file named `.npmrc` with the following content:

```text
@sanmugamks:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

## 2. Generate a Personal Access Token (PAT)

You need a GitHub PAT with at least `read:packages` permissions to install this package.

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
2. Generate a new token with the `read:packages` scope.
3. Replace `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` in the `.npmrc` file with your new token.

## 3. Install the package

Once your `.npmrc` is configured, you can install the package as usual:

```bash
npm install @sanmugamks/modular-based-architecture
```

> [!IMPORTANT]
> Do not commit your Personal Access Token to a public repository! Use environment variables or local-only `.npmrc` files if possible.

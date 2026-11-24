# NgxFloaty

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.30.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Releasing

Releases are published to npm by [`.github/workflows/release.yml`](.github/workflows/release.yml) when a GitHub release is published. It uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers/) (no npm token) and attaches provenance.

The published version lives in **`projects/ngx-floaty/package.json`**. The root `package.json` is the private dev workspace: keep it at `0.0.0`.

1. Bump the library version and push:

   ```bash
   cd projects/ngx-floaty
   npm version 0.1.0 --no-git-tag-version   # or 0.1.0-alpha.1, 0.1.0-rc.0, ...
   cd ../..
   git commit -am "chore(release): 0.1.0"
   git push
   ```

2. Wait for CI on `master` to pass.
3. On GitHub: **Releases → Draft a new release**.
   - Tag: `v<version>` exactly, created on `master` (e.g. `v0.1.0`).
   - For a prerelease version (with `-`), tick **Set as a pre-release**.
   - **Publish release**.

4. Approve the deployment: **Actions → Release run → Review deployments → npm → Approve and deploy**. The `npm` environment only accepts `v*` tags and requires a reviewer.
5. The workflow checks that the tag matches the library version, runs lint, unit tests and the library build, then publishes `dist/ngx-floaty`.
6. Check: `npm view ngx-floaty dist-tags`. Right after publishing, npmjs.com shows the version as "Validating" and the registry returns 404 for it for about a minute; that is normal.

Dist-tags: versions with a `-` (`0.1.0-alpha.0`) go to `next`; stable versions go to `latest`.

If a release run fails, nothing was published. Fix the cause on `master`, then delete the GitHub release and its tag (`git push origin :refs/tags/v<version>`) and create the release again, so the tag points at the fixed commit. A version that was published can't be reused: bump to the next one.

One-time setup (done): the package exists on npm; the trusted publisher on npmjs.com points to `farengeyt451/ngx-floaty`, workflow `release.yml`, environment `npm`; publishing access is "Require two-factor authentication and disallow tokens"; the GitHub environment `npm` exists.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

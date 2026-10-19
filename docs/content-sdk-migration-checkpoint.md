# Content SDK migration research — paused checkpoint

## State

- User requested: finish the current MCP call, record its response, then pause before the next iteration; preserve recovery/transport records; do not reset, reinitialize, or start a second worker.
- The last tool batch returned before that request. No pending call is visible in this conversation.
- This checkpoint records the received responses and references only. No subsequent research, scaffold execution, dependency installation, application migration, reset, reinitialization, or additional worker was started.
- Existing source, configuration, discovery documents, temporary artifacts, and stored tool responses are left intact.
- Research is **paused**, not completed. No migration decisions have been approved.

## Recovery references

- Repository: `/home/fedmuj/projects/Sitecore.Demo.XmCloud.PlaySummit`
- Baseline commit: `1ea92e5`, branch `main`.
- Existing discovery: `docs/discovery.md`.
- Published initializer package, downloaded and extracted **without executing it**: `/tmp/playsummit-content-sdk-3lsv0leo/package/`.
- Package metadata summaries: `/tmp/playsummit-content-sdk-3lsv0leo/`.
- Artifact pointer: `/tmp/playsummit-content-sdk-latest`.
- Earlier read-only audit artifacts: `/tmp/playsummit-discovery.993sEa/`; audit timed out with exit 124. Existing files are preserved.
- Audit artifact pointer: `/tmp/playsummit-discovery-latest`.
- Temporary artifacts remain temporary; this checkpoint does not guarantee their retention outside this session.

### Stored research response IDs

These identifiers are recorded without refetching, clearing, or modifying their associated transport/content records:

- `muzozlwrl1oz2n` — initial search page content.
- `muzozlx1q9nd67` — initial search results.
- `muzozzjeyvqakv` — raw npm/latest metadata, GitHub latest-release response, and raw migration page.
- `muzp070dx05163` — complete readable JSS 22.0 → Content SDK 2.1 migration guide.
- `muzp06hz3mpnii` — further search page content.
- `muzp06ifuxd198` — further search results.
- `muzp0k1w01cb4u` — migration overview, Content SDK 2.1–2.4 changes, Next.js 16 and React 19 guides.
- `muzp1n61cp13ov` — package metadata for existing integrations and Content SDK packages.
- `muzp22mw3517uw` — configuration docs, App Router revalidation docs, Next.js package 2.4.0 release; includes an unsuccessful tracking-guide URL fetch.
- `muzp2go2njb0ih` — tracking/editing/variant search page content.
- `muzp2goa4rb4s5` — tracking/editing/variant search results.
- `muzp367fblwb46` — **last completed fetch response**, recorded below.

## Findings already received, not migration decisions

Registry verification on 2026-10-08:

| Package | Published latest version |
| --- | --- |
| `@sitecore-content-sdk/nextjs` | `2.4.0` |
| `@sitecore-content-sdk/react` | `2.4.0` |
| `@sitecore-content-sdk/cli` | `2.3.0` |
| `create-content-sdk-app` | `2.4.0` |
| `@sitecore-content-sdk/events` | `2.1.2` |
| `@sitecore-content-sdk/analytics-core` | `2.1.2` |
| `@sitecore-content-sdk/personalize` | `2.1.0` |

The Next.js package declares Node `>=24`, Next `^16.2.0`, React/React DOM `^19.2.1`, and optional TypeScript peer `^5.4.0`. Published packages version independently.

Official migration guidance still supports Pages Router. Moving to App Router is a separate choice. Experience Editor and Content Editor Preview are removed; Pages/Page Builder metadata editing replaces them.

The current Search React SDK `2.2.2`, Discover React SDK `1.1.1`, React Redux `8.0.4`, and Storybook Next.js `7.6.15` do not declare React 19 peer support. The latest Search React `3.0.0` declares React 19 support; latest Discover React `1.2.4` still declares support only through React 18. Peer declarations are compatibility constraints, not runtime test results. No forced install was attempted.

Existing repository coupling inventory: JSS imports in 131 source/script files; old generated configuration in 24 files; context hooks/HOCs in 20 files; old page-mode references in 24 files; Next Pages router imports in 23 files. This is not an import-only upgrade.

The recommendation communicated, but not approved, was a clean Content SDK head with incremental feature migration. Decisions on router, integration scope, legacy shop isolation, editing workflow, test acceptance, hosting and rollback remain open.

## Last completed tool batch

The completed parallel batch consisted of `functions.fetch_content` and `functions.bash`. No MCP worker identity, transport recovery file, or in-flight MCP request was exposed by these tools. This checkpoint records the tool responses actually received; it does not assert that a separate unseen MCP worker was controlled or stopped.

### Fetch request

```json
{
  "urls": [
    "https://doc.sitecore.com/sai/en/developers/content-sdk/20/initializing-tracking,-events,-and-personalization-in-the-content-sdk.html",
    "https://doc.sitecore.com/sai/en/developers/sitecoreai/environment-editing-hosts-and-rendering-hosts.html",
    "https://doc.sitecore.com/sai/en/developers/sitecoreai/deploying-sitecoreai/deploy-app/manage-an-environment/context-id-environment-variables.html"
  ],
  "mode": "readable"
}
```

### Received fetch response

```text
## Fetched URLs

- Initializing tracking, events, and personalization in the Content SDK (7173 chars)
- Environment, editing hosts and rendering hosts (3797 chars)
- Context ID environment variables (5104 chars)

---
Use get_search_content({ responseId: "muzp367fblwb46", urlIndex: 0 }) to retrieve bounded content slices.
```

Full fetched content remains associated with `muzp367fblwb46`. It was not retrieved in another iteration after the pause request.

### Received bash response

```text
Reference scaffold starter commands and package context
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initialize.js:57:    if (!args.noInstall) {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initialize.js:58:        (0, common_1.installPackages)(args.destination, args.silent);
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initialize.js:59:        (0, common_1.lintFix)(args.destination, args.silent);
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initialize.js:62:        const pkg = (0, common_1.openJsonFile)(path_1.default.resolve(`${args.destination}${path_1.sep}package.json`));
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs/prompts.js:15:        name: 'prerender',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs/prompts.js:16:        message: 'How would you like to prerender your application?',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs/prompts.js:20:            if (answers.yes && !answers.prerender) {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs/prompts.js:21:                answers.prerender = DEFAULT_PRERENDER;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs/prompts.js:23:            return !answers.prerender;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router-cache-components/index.js:17:const prompts_1 = require("../nextjs-app-router/prompts");
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router-cache-components/index.js:23:            const templatePath = path_1.default.resolve(__dirname, '../../templates/nextjs-app-router-cache-components');
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/utils/helpers.js:73:const writeFileToPath = (destinationPath, content) => {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/utils/helpers.js:74:    fs_1.default.writeFileSync(destinationPath, content, 'utf8');
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/index.js:23:            const templatePath = path_1.default.resolve(__dirname, '../../templates/nextjs-app-router');
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/prompts.js:15:        name: 'prerender',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/prompts.js:16:        message: 'How would you like to prerender your application?',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/prompts.js:20:            if (answers.yes && !answers.prerender) {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/prompts.js:21:                answers.prerender = DEFAULT_PRERENDER;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/initializers/nextjs-app-router/prompts.js:23:            return !answers.prerender;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/processes/transform.js:86:const populateEjsData = (args, destination) => {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/processes/transform.js:89:            isDev: (0, helpers_1.isDevEnvironment)(destination || args.destination),
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/processes/transform.js:104:    const destinationPath = path_1.default.resolve(args.destination);
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/common/processes/transform.js:114:            let pathToNewFile = `${destinationPath}${path_1.sep}${file}`;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:28:        boolean: ['force', 'noInstall', 'yes', 'silent', 'help'],
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:32:        string: ['destination', 'template'],
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:36:    // we need to coerce string parameters in minimist above (to prevent string options without a value e.g. `--template` from coming in as a boolean `true`).
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:56:  ${chalk_1.default.yellow('--destination')} ${chalk_1.default.dim('<path>')}    Destination folder
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:58:  ${chalk_1.default.yellow('--force')}                 Continue if destination is not empty
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:59:  ${chalk_1.default.yellow('--noInstall')}             Skip package install and lint fix
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:66:        throw new Error('Unable to get destinations, provided template is empty');
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:68:    // validate/gather destination
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:71:    let destination = args.destination;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:72:    if (!destination) {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:73:        destination = args.yes
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:77:    return destination;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:83:        name: 'destination',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:86:    })).destination;
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:102:        // use --template arg
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:124:        const destination = yield (0, exports.getDestination)(args, template);
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:125:        if (!args.force && fs_1.default.existsSync(destination) && fs_1.default.readdirSync(destination).length > 0) {
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:127:                throw new Error(`Directory '${destination}' not empty. To overwrite it, use the --force flag.`);
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:132:                message: `Directory '${destination}' not empty. Are you sure you want to continue?`,
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/bin.js:138:        yield (0, initialize_1.initialize)(template, Object.assign(Object.assign({}, args), { destination, template }));
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/templates/nextjs/next.config.js:54:        destination: '/api/healthz',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/templates/nextjs/next.config.js:59:        destination: '/api/robots',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/templates/nextjs/next.config.js:64:        destination: '/api/llms-txt',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/templates/nextjs/next.config.js:69:        destination: '/api/sitemap',
/tmp/playsummit-content-sdk-3lsv0leo/package/dist/templates/nextjs/next.config.js:74:        destination: '/api/editing/feaas/render',

Demo bootstrap customizations
src/rendering/scripts/bootstrap.ts:33:import './generate-categories-data';
src/rendering/package.json:90:    "@storybook/addon-essentials": "^7.6.15",
src/rendering/package.json:91:    "@storybook/addon-styling": "^1.0.5",
src/rendering/package.json:92:    "@storybook/nextjs": "^7.6.15",
src/rendering/package.json:93:    "@storybook/react": "^7.6.15",
src/rendering/package.json:123:    "storybook": "^7.6.15",
src/rendering/package.json:132:  "scripts": {
src/rendering/package.json:134:    "storybook": "npm-run-all --serial bootstrap storybook:start",
src/rendering/package.json:135:    "storybook:start": "storybook dev -p 6006",
src/rendering/package.json:136:    "build-storybook": "npm-run-all --serial bootstrap storybook:build",
src/rendering/package.json:137:    "storybook:build": "storybook build",
src/rendering/package.json:138:    "eslint": "eslint ./src/**/*.tsx ./src/**/*.ts ./scripts/**/*.ts",
src/rendering/package.json:144:    "install-pre-push-hook": "ts-node --project tsconfig.scripts.json ./scripts/install-pre-push-hook.ts",
src/rendering/package.json:149:    "bootstrap": "ts-node --require dotenv-flow/config --project tsconfig.scripts.json scripts/bootstrap.ts",
src/rendering/package.json:150:    "build": "cross-env NODE_ENV=production npm-run-all --serial bootstrap next:build",
src/rendering/package.json:152:    "graphql:update": "cross-env GRAPH_QL_ENDPOINT=https://cm.xmcloudcm.localhost/sitecore/api/graph/edge ts-node --project tsconfig.scripts.json ./scripts/fetch-graphql-introspection-data.ts",
src/rendering/package.json:154:    "next:build": "next build",
src/rendering/package.json:157:    "scaffold": "ts-node --project tsconfig.scripts.json scripts/scaffold-component/index.ts",
src/rendering/package.json:159:    "start:production": "cross-env-shell NODE_ENV=production npm-run-all --serial bootstrap next:build next:start",
src/rendering/package.json:160:    "start:watch-components": "ts-node --project tsconfig.scripts.json scripts/generate-component-builder/index.ts --watch"
docs/website.md:59:The `\components` folder contains serialized Sitecore Components components, styles and datasources. The scripts that take care of the serialization are located at the root of the project.
docs/website.md:77:The `\personalize` folder contains serialized Sitecore Embedded Personalization data. The scripts that take care of the serialization are located at the root of the project.
docs/website.md:106:The project uses [Storybook](https://github.com/storybookjs/storybook) for "disconnected" development. Standard JSS "disconnected" mode is not available in XM Cloud solution templates. `jss start` runs connected and expects Sitecore to be running using the provided Docker compose container environment.
docs/website.md:108:To browse the existing stories, run `jss storybook` or `npm run storybook`.
docs/website.md:252:Debugging of the Next.js application is possible by using the `start:connected` or `start` scripts (they do the same thing) from the Next.js `package.json`, and the pre-configured _Attach to Process_ VS Code launch configuration.

Root host config/script migration touchpoints (no secrets)
up.ps1:43:$nodeVersion = $xmCloudBuild.renderingHosts.PlayWebsite.nodeVersion
up.ps1:44:if (![string]::IsNullOrWhitespace($nodeVersion)) {
up.ps1:46:    Set-EnvFileVariable "NODEJS_VERSION" -Value $xmCloudBuild.renderingHosts.PlayWebsite.nodeVersion
up.ps1:53:if ($currentNodeJsVersion -ne $nodeVersion) {
up.ps1:54:    Write-Warning "ERROR: You are currently running NodeJs $currentNodeJsVersion and this project requires a different version. Please switch to NodeJs $nodeVersion. Then delete the /src/rendering/node_modules folder. Then run this script again."
xmcloud.build.json:5:            "nodeVersion": "20.10.0",
xmcloud.build.json:10:            "runCommand": "next:start"
docker/build-and-push-images.yml:30:            versionSpec: '20.10.0'
docker/build-and-push-images.yml:44:            npm run lint
docker/build-and-push-images.yml:45:          displayName: 'npm run lint'
docker/build-and-push-images.yml:48:            npm run build:local
docker/build-and-push-images.yml:49:          displayName: 'npm run build:local'
docker/build-and-push-images.yml:62:            versionSpec: '20.10.0'
docker/build-and-push-images.yml:76:            npm run build-storybook
docker/build-and-push-images.yml:77:          displayName: 'npm run build-storybook'
docker/build/rendering/Dockerfile:14:#ENTRYPOINT "npm install && npm install next@canary && npm run start:connected"
docker/build/rendering/Dockerfile:15:ENTRYPOINT "npm install && npm run start:connected"
```

## Resume boundary

Await explicit user instruction before another research or migration iteration. The next action has not been executed. Existing recovery and transport records were neither cleared nor replaced.

# 📦 Creating and Using Shared Packages in Turborepo (pnpm)

This guide outlines the standardized process for creating a shared package within the monorepo's `packages/` directory and consuming it in an application. We will use **`@repo/example-config`** as a placeholder name.

## 1\. Package Creation and Initialization 🛠️

1.  **Create the Directory:** Navigate to the `packages` directory and create the new package folder.

    ```bash
    cd packages
    mkdir example-config
    cd example-config
    ```

2.  **Initialize `package.json`:**

    ```bash
    pnpm init
    ```

3.  **Configure `package.json`:** Edit the file to define the workspace name, entry points, and scripts.
    - **Name:** Use the standard monorepo naming convention (e.g., `"@repo/example-config"`).
    - **Entry Points:** Point to the **compiled output** (`dist`).
    - **Scripts:** Define the `build` script using `tsc`.

    <!-- end list -->

    ```json
    // packages/example-config/package.json
    {
      "name": "@repo/example-config",
      "version": "1.0.0",
      "main": "dist/index.js",   <-- Points to compiled JS
      "types": "dist/index.d.ts", <-- Points to compiled types
      "scripts": {
        "build": "tsc"          <-- Runs the TypeScript compiler
      },
      "devDependencies": {
        "typescript": "^5.x.x",
        "@repo/typescript-config": "workspace:*" // Inherit from your shared config
      }
    }
    ```

4.  **Install Dependencies:** Run install inside the new package directory.

    ```bash
    pnpm install
    ```

---

## 2\. TypeScript and Source Setup ⚙️

1.  **Create `tsconfig.json`:** Inherit from your base config and define the input (`src`) and output (`dist`).

    ```json
    // packages/example-config/tsconfig.json
    {
      "extends": "@repo/typescript-config/base.json",
      "include": ["src/**/*.ts"],
      "compilerOptions": {
        "outDir": "dist",
        "rootDir": "src"
      }
    }
    ```

2.  **Create Source File:** Create the source directory and the entry point file. This is the code that will be shared.

    ```bash
    mkdir src
    touch src/index.ts
    ```

3.  **Handle Node Environment Types (🚨 Pitfall 1):**
    If your package code uses Node.js global variables like `process.env` (as in the Prisma client singleton), you must install the types for TypeScript to recognize them.

    ```bash
    pnpm install -D @types/node
    ```

---

## 3\. Package Consumption 🚀

1.  **Add Dependency to App:** In the consuming application (e.g., `apps/web/package.json`), add the new package using the pnpm workspace protocol.

    ```json
    // apps/web/package.json
    {
      "dependencies": {
        "@repo/example-config": "workspace:*"
        // ...
      }
    }
    ```

2.  **Crucial: Re-link Dependencies (🚨 Pitfall 2):**
    Whenever a new dependency is added, you **must** run `pnpm install` from the **monorepo root** to update the symlinks for the entire workspace.

    ```bash
    # Run from the monorepo root
    pnpm install
    ```

3.  **Build the Shared Package (🚨 Pitfall 3):**
    The app cannot import the package until it has been compiled into JavaScript. If you see **"Cannot find module..."**, the package hasn't been built or linked.

    ```bash
    # Build the package once
    pnpm --filter @repo/example-config build
    ```

    _Hint: Ensure your `turbo.json` handles this automatically by using `"dependsOn": ["^build"]` for your app's build/dev script._

4.  **Import and Use:** You can now safely import the package in your application code.

    ```typescript
    import { someExport } from "@repo/example-config";
    ```

---

## 4\. Essential pnpm Commands in Turborepo 💻

These commands are executed from the **root directory** of your monorepo.

### 1. Installation and Linking 🔗

These commands manage dependencies and the workspace structure.

| Command                                                 | Purpose                                                                             | Notes                                                                       |
| :------------------------------------------------------ | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| `pnpm install`                                          | **Installs all dependencies** for all packages and links them within the workspace. | **MUST RUN** this after changing _any_ `package.json` file in the monorepo. |
| `pnpm add <package-name>`                               | Installs a new package as a dependency in the root directory.                       | Use this for tools like ESLint/TypeScript that are globally shared.         |
| `pnpm add <package-name> --filter <app-or-pkg-name>`    | Installs a new external package into a **specific app or package**.                 | Example: `pnpm add axios --filter web`                                      |
| `pnpm remove <package-name> --filter <app-or-pkg-name>` | Removes an external package from a specific project.                                |                                                                             |
| `pnpm upgrade --latest`                                 | Updates all packages in the monorepo to the latest version.                         | This can be slow; use with caution.                                         |

---

### 2. Running Scripts (Filtering) ⚙️

This is the most common use of `pnpm` in a Turborepo—executing a script (like `dev` or `build`) on a specific package or group of packages using the `--filter` flag.

| Command                                       | Purpose                                                                          | Turborepo Context                                        |
| :-------------------------------------------- | :------------------------------------------------------------------------------- | :------------------------------------------------------- |
| `pnpm <script-name> --filter <pkg-name>`      | **Runs a script** defined in a specific package's `package.json`.                | Example: `pnpm dev --filter web`                         |
| `pnpm <script-name> --filter "./apps/*"`      | Runs the script on **all packages** within the `apps` directory.                 | Useful for running `test` across all frontend apps.      |
| `pnpm <script-name> --filter "<pkg-name>..."` | Runs the script on the specified package **and all packages that depend on it.** | Example: `pnpm build --filter "ui..."`                   |
| `pnpm <script-name> --filter "...<pkg-name>"` | Runs the script on the specified package **and all packages it depends on.**     | Rarely used, but helpful for deep dependency checks.     |
| `pnpm run <script-name>`                      | Executes a script defined in the **root** `package.json`.                        | Example: `pnpm run clean` (for a global cleanup script). |

> **Note:** For parallel tasks like `build` or `dev`, it's often more efficient and powerful to use the **Turborepo CLI** directly (e.g., `turbo run build --filter=web`) as it leverages caching and parallelization better than `pnpm` alone.

---

### 3. Shared Package Management (Your `prisma-config` Case) 📦

These commands are specific to managing your shared packages like `@repo/prisma-config`.

| Command                                                 | Purpose                                                                     | Example                                                                                                     |
| :------------------------------------------------------ | :-------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| `pnpm build --filter <pkg-name>`                        | **Compiles a shared package** to create its `dist` output.                  | `pnpm build --filter prisma-config`                                                                         |
| `pnpm db:generate --filter <pkg-name>`                  | **Runs the Prisma Client generation** script on the shared package.         | `pnpm db:generate --filter prisma-config`                                                                   |
| `pnpm add @repo/package-a@workspace:* --filter <app-b>` | **Adds a shared workspace package** as a dependency to another app/package. | This should ideally be done by manually editing `package.json` and then running `pnpm install` at the root. |

---

### 4. General Workspace Tools 🛠️

| Command                         | Purpose                                                  | Notes                                                             |
| :------------------------------ | :------------------------------------------------------- | :---------------------------------------------------------------- |
| `pnpm recursive exec <command>` | Executes a shell command in every package directory.     | Use with caution, often better replaced by `pnpm run --filter`.   |
| `pnpm why <package-name>`       | Shows the dependency tree of why a package is installed. | Excellent for debugging unexpected packages or version conflicts. |

---

## Common Pitfalls and Solutions You Encountered

| Pitfall / Error                                            | Cause                                                                                                                                                                              | Solution                                                                                                                                                                  |
| :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`"None of the selected packages has a 'build' script"`** | The `package.json` file in the shared package is missing the `"build": "tsc"` line in the `scripts` section.                                                                       | **Add the script:** Ensure `packages/example-config/package.json` contains `"build": "tsc"`.                                                                              |
| **`"Cannot find name 'process'..."`**                      | The package uses global Node.js variables (`process`, `globalThis`) but lacks the corresponding TypeScript type definitions.                                                       | **Install types:** Run `pnpm install -D @types/node` in the shared package.                                                                                               |
| **`"Cannot find module '@repo/example-config'..."`**       | **MOST COMMON ISSUE:** The module cannot be resolved because the package was never built, or pnpm failed to create the symlink to the package's compiled output (`dist/index.js`). | **1. Build:** Run `pnpm --filter @repo/example-config build`. **2. Link:** Run `pnpm install` from the monorepo root. **3. Restart:** Restart your editor and dev server. |
| **`"main": "src/index.ts"`**                               | Incorrectly pointing the entry point to a TypeScript source file instead of the compiled output.                                                                                   | **Correct `package.json`:** Set `"main": "dist/index.js"` and `"types": "dist/index.d.ts"`.                                                                               |

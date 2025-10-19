# 🔧 Fixing tsconfig.json Errors After `pnpm install`

## Why This Happens

When you run `pnpm install` in a workspace monorepo, pnpm installs packages using **symlinks** in the `node_modules` directory. This is more efficient than copying files, but VS Code's TypeScript language server doesn't always immediately recognize these symlinked type definitions.

The TypeScript compiler itself works fine (as you can see when running `pnpm dev` - it compiles successfully), but the VS Code editor shows red squiggly lines because its language server is still looking at the old state.

---

## ✅ The Solution (3 Steps)

### Step 1: Verify the Types ARE Installed

The error messages say "Cannot find type definition file for 'node', 'react', 'react-dom'" but these ARE actually installed. You can verify this:

```bash
ls apps/web/node_modules/@types
```

You'll see:
- `node` (symlink to pnpm store)
- `react` (symlink to pnpm store)
- `react-dom` (symlink to pnpm store)

✅ **The types exist!** The problem is just VS Code not seeing them yet.

---

### Step 2: Reload VS Code's TypeScript Server

**Option A: Use Command Palette (Recommended)**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: `TypeScript: Restart TS Server`
3. Press Enter

**Option B: Reload VS Code Window**
1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type: `Developer: Reload Window`
3. Press Enter

**Option C: Close and Reopen VS Code**
- Close VS Code completely
- Reopen your project folder

---

### Step 3: Verify the Errors Are Gone

Open `apps/web/tsconfig.json` and check - the red squiggly lines should be gone!

---

## 🎯 Quick Fix (One Command)

If you want to avoid this issue, you can add a VS Code setting to automatically restart the TS server:

1. Open VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for: `typescript.tsserver.experimental.enableProjectDiagnostics`
3. **Uncheck** this option (disable it)

This reduces the eagerness of the TS server and prevents false errors during install.

---

## 📝 What's in tsconfig.json (For Reference)

The file is correctly configured:

```json
{
  "extends": "@workspace/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@workspace/ui/*": ["../../packages/ui/src/*"],
      "@workspace/db/*": ["../../packages/db/src/*"]
    },
    "types": ["node"],  // ← This helps VS Code find @types/node
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "next.config.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

The `"types": ["node"]` line explicitly tells TypeScript to include @types/node.

---

## 🚨 When to Actually Worry

**DON'T worry if:**
- ❌ VS Code shows tsconfig.json errors but `pnpm dev` compiles successfully
- ❌ The error appears right after `pnpm install`
- ❌ The types exist in `node_modules/@types`

**DO worry if:**
- ⚠️ `pnpm dev` fails to compile
- ⚠️ You get runtime errors about missing modules
- ⚠️ Types are actually missing from `node_modules/@types`

---

## 🔍 Still Not Working?

If restarting the TS server doesn't fix it, try this:

```bash
# Clean everything and reinstall
cd C:\Users\kcitl\hackathon\hacktx25\Astrarium_Frontend
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

Then restart the TS server again.

---

## 💡 Pro Tip

You can ignore the tsconfig.json errors if:
1. The app compiles and runs (`pnpm dev` works)
2. You know the types are installed
3. You're in the middle of development

Just restart the TS server when you have a moment. The errors are purely cosmetic and don't affect functionality.

---

## Summary

1. **The Problem**: VS Code's TS server doesn't see new symlinks from pnpm
2. **The Fix**: Restart the TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server")
3. **The Reality**: Your code compiles fine; this is just an editor display issue

**Remember:** If `pnpm dev` works, your TypeScript is configured correctly! 🎉

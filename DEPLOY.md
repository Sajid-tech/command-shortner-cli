# 🚀 Deployment & Usage Guide

This guide covers everything you need to know about building, running, using, and deploying the **Command Shortner CLI**.

---

## 🛠️ Development Setup

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd command-shortner-cli
npm install
```

### 2. Running Locally (Development Mode)
Run the CLI immediately without building:
```bash
npm run dev -- --help
# Example:
npm run dev -- list
```

### 3. Build Project
Compile the TypeScript source code into the `dist` directory:
```bash
npm run build
```

### 4. Link for Local Testing
Symlink the package globally to test it as if it were installed from NPM:
```bash
npm link
# Now you can use the command globally:
boost list
```
*(To unlink later: `npm unlink -g command-shortner`)*

---

## 📦 Publishing to NPM

Follow these steps to deploy a new version to the NPM registry.

### 1. Login to NPM
Ensure you are logged in to your NPM account:
```bash
npm login
```

### 2. Build and Verify
Make sure the project builds clean and tests pass:
```bash
npm run build
npm test
```

### 3. Update Version
Update the version in `package.json` (also creates a git tag):
```bash
# For a patch release (0.0.X):
npm version patch

# For a minor release (0.X.0):
npm version minor

# For a major release (X.0.0):
npm version major
```

### 4. Publish
Push the package to NPM:
```bash
npm publish --access public
```

---

## 🔥 Features & Usage

The CLI is packed with features to boost your productivity. The main command is **`boost`**.

### 🔹 Core Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| **Add** | `boost add <alias> "<command>"` | Create a new shortcut. <br>_Ex: `boost add gs "git status"`_ |
| **Run** | `boost run <alias>` | Execute a saved command. <br>_Ex: `boost run gs`_ |
| **List** | `boost list` | Show all saved aliases in a formatted table. |
| **Remove** | `boost remove <alias>` | Delete an alias. |

### 🚀 Advanced Features

#### 1. Interactive Mode
Launch a Terminal User Interface (TUI) to manage commands with a menu system.
```bash
boost interactive
```

#### 2. Chain Commands
Run multiple aliases sequentially in a single go.
```bash
boost chain-alias alias1,alias2,alias3
# Or via interactive menu
```

#### 3. Export & Import (Backup)
Share your commands or move them to a new machine.
```bash
# Export all commands to a JSON file
boost export ./my-commands.json

# Import commands from a JSON file
boost import ./my-commands.json
```

#### 4. Windows Compatibility
If you face execution policy errors on Windows PowerShell:
```bash
boost fix-windows
```

### ⚡ Shortcuts (Shorthand)
You don't always need to type `run`. If the alias matches the internal logic, you can execute it directly (depends on implementation), but `run` is the explicit method.

---

## 🧪 Testing

Run strict unit and integration tests to ensure stability:
```bash
npm test
```

## 🏗️ Project Structure
- **`src/`**: Source Code
    - `commands/`: Individual command logic.
    - `core/`: Configuration and Execution logic.
    - `utils/`: UI and helpers.
- **`dist/`**: Compiled JavaScript (Production).
- **`scripts/`**: Post-install hooks.
- **`bin/`**: Executable entry points.

## 📜 License

This project is licensed under the **GNU General Public License v3.0**.  
See the full [LICENSE](./LICENSE) file for detailed terms and conditions.


# ⚡ Boost Productivity with **`command-shortner`** 🚀  

**Save and run long terminal commands with short, memorable aliases!**  

[![npm](https://img.shields.io/npm/v/command-shortner?color=blue&label=Latest%20Version)](https://www.npmjs.com/package/command-shortner)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/command-shortner?color=orange)](https://npm-stat.com/charts.html?package=command-shortner)  

## 🌟 Why Use This?

Tired of repetitive long commands? **`command-shortner`** supercharges your workflow with:

✔ **Alias management** - Save lengthy commands  
✔ **Command chaining** - Run multiple commands sequentially  
✔ **Interactive UI** - Visual command management  
✔ **Cross-platform** - Works everywhere  
✔ **Import/Export** - Share your shortcuts  

```bash
# Instead of typing this...
docker-compose up --build --force-recreate --remove-orphans

# Just type this!
boost run dc-up
```

---

## **📦 Installation**  

Install globally to use anywhere in your terminal:  

```bash
npm install -g command-shortner
```  

After installation, you'll see a beautiful welcome message with usage examples!

---

## 🛠 Core Features

### 🔖 Basic Commands
```bash
# Add new shortcut
boost add <alias> "<command>"

# Run command
boost run <alias>

# List all shortcuts
boost list

# Remove shortcut
boost remove <alias>
```

### ⛓ Advanced Command Chaining
```bash
# Chain existing aliases
boost chain-alias alias1,alias2,alias3

# Example:
boost add build "npm run build"
boost add test "npm test"
boost chain-alias build,test
```

### 📁 Import/Export
```bash
# Export all commands to JSON
boost export [filename.json]

# Import commands from JSON
boost import commands.json
```

### 🖥 Interactive Mode
```bash
boost interactive
```
Launches a beautiful terminal UI with:
- Command browser with search
- One-click execution
- Visual feedback
- Easy management

---

## 🎨 Special Features

### 🪄 Silent Mode
```bash
boost run <alias> --silent  # Runs without output
```

### 🛠 Windows Fix
```bash
boost fix-windows  # Solves PowerShell issues
```

### ⚙️ Configuration
```bash
# Set default shell (e.g., zsh, bash, powershell)
boost config set shellOverride /bin/zsh
```

---

## 🚦 Troubleshooting

### PowerShell Issues
```powershell
# Run as admin then execute:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Command Not Found
```bash
# Ensure npm global bin is in your PATH
npm bin -g
```

### Permission Issues
```bash
# On Linux/Mac
sudo npm install -g command-shortner --unsafe-perm
```

---

## 🧩 Real-World Examples

| Command | Description |
|---------|-------------|
| `boost add deploy "git push && npm run build && scp -r ./dist user@server:/app"` | Full deployment shortcut |
| `boost add logs "docker-compose logs -f --tail=100"` | Docker log tracking |
| `boost run deploy` | Runs `git push && npm run build && scp -r ./dist user@server:/app` |
| `boost remove deploy` | Deletes the `deploy` shortcut |
| `boost add refresh "rm -rf node_modules && npm install"` | Project reset |
| `boost chain-alias test,build,deploy` | CI/CD pipeline |

---

## 🤝 Contributing

Found a bug or have a feature request?  
[Open an issue](https://github.com/Sajid-tech/command-shortner-cli/issues) or submit a PR!

---






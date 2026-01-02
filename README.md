# ⚡ Command Shortner CLI (Boost)

> **Professional Command Alias Manager for Developers**
> *Save time, reduce errors, and boost productivity by creating shortcuts for your most used shell commands.*

![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6.svg)
![Version](https://img.shields.io/badge/version-2.2.0-green.svg)

## 🌟 Features

- **Cross-Platform**: Works seamlessly on Windows (PowerShell/CMD), macOS, and Linux.
- **Smart Translation**: Automatically translates common Linux commands (`ls`, `rm`, `pwd`) to Windows equivalents.
- **Interactive Mode**: User-friendly TUI for managing aliases without remembering flags.
- **Chain Aliases**: Execute multiple aliases in sequence with a single command.
- **Type Safety**: Built with strict TypeScript for reliability.
- **Zero Config Setup**: Works out of the box with intuitive commands.

## 🚀 Installation

Install globally via npm:

```bash
npm install -g command-shortner
```

## 📖 Usage

### Basic Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Add Alias** | `boost add <alias> "<command>"` | Create a new shortcut. |
| **Run Alias** | `boost run <alias>` | Execute a saved command. |
| **List** | `boost list` | View all saved aliases. |
| **Remove** | `boost remove <alias>` | Delete a shortcut. |
| **Interactive** | `boost interactive` | Launch the TUI menu. |
| **Export** | `boost export [file]` | Backup commands to JSON. |
| **Import** | `boost import <file>` | Restore commands from JSON. |

### ⚡ Power Features

#### Chaining Commands
Run multiple aliases in sequence, perfect for deployment or setup workflows.

```bash
# Define atomic commands
boost add build "npm run build"
boost add deploy "firebase deploy"

# Run them together
boost chain-alias build,deploy
```

#### Windows Compatibility
If you are on Windows, `boost` automatically translates many Unix commands.
For example, if you save `ls -la`, it will execute `dir /a` on Windows automatically.

**PowerShell Users**: If you encounter execution policy errors, run:
```powershell
boost fix-windows
```

## 🛠️ Development

### Prerequisites
- Node.js >= 16
- npm >= 8

### Setup
```bash
git clone https://github.com/Sajid-tech/command-shortner-cli.git
cd command-shortner-cli
npm install
```

### Build & Test
```bash
# Compile TypeScript
npm run build

# Run Tests
npm test

# Lint Code
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

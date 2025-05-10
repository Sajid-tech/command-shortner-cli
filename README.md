# 🔥 Boost Productivity with **`command-shortner`** ⚡  

**Save and run long terminal commands with short, memorable aliases!**  

[![npm](https://img.shields.io/npm/v/command-shortner?color=blue&label=Latest%20Version)](https://www.npmjs.com/package/command-shortner)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/command-shortner?color=orange)](https://npm-stat.com/charts.html?package=command-shortner)  

### **🚀 Why Use This?**
Tired of typing long commands like `docker-compose up --build` or `git push origin main --force`?
**`command-shortner`** lets you:
✔ **Save** lengthy commands under short aliases
✔ **Run** them with just a few keystrokes
✔ **Manage** your shortcuts easily  

---

## **📦 Installation**  

Install globally to use anywhere in your terminal:  

```bash
npm install -g command-shortner
```  

---

## **🛠 Usage**  

### **1️⃣ Add a New Shortcut**
```bash
boost add <alias> "<command>"
```
**Example:**
```bash
boost add dc-up "docker-compose up --build"
```  

### **2️⃣ Run a Command by Alias**
```bash
boost run <alias>
```
**Example:**
```bash
boost run dc-up
```  

### **3️⃣ List All Saved Shortcuts**
```bash
boost list
```  

### **4️⃣ Remove a Shortcut**
```bash
boost remove <alias>
```  

---

## **💻 Special Features**

### **Windows PowerShell Users**
If you're having issues with execution policy in PowerShell, run:
```bash
boost fix-windows
```
This creates a special batch file that makes `boost` work in both PowerShell and CMD.

### **Silent Mode**
Run commands without showing the execution info:
```bash
boost run <alias> --silent
```

---

## **🔧 Troubleshooting**

### **Common Issues**

#### **PowerShell Execution Policy Error**
If you see an error about scripts being disabled:
1. Run `boost fix-windows` to create a batch file
2. Or change your PowerShell execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

#### **Command Not Found**
Make sure npm's global bin directory is in your PATH. You can check where it is with:
```bash
npm bin -g
```

#### **Stderr Output Issues**
Some commands normally output to stderr even when successful. If a command runs but shows errors, it might still be working correctly.

---

## **💡 Examples**  

| Command | What It Does |
|---------|-------------|
| `boost add gp "git push origin main"` | Saves `git push origin main` as `gp` |
| `boost run gp` | Runs `git push origin main` |
| `boost remove gp` | Deletes the `gp` shortcut |
| `boost add clean "rm -rf node_modules && npm install"` | Saves a cleanup command as `clean` |
| `boost add dc-logs "docker-compose logs -f"` | Saves docker logs command |

---

## **📜 License**
MIT © [Sajid Hussain](https://github.com/Sajid-tech)  

---
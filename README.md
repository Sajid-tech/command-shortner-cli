# CLI Productivity Booster

A tool that lets you save and run long terminal commands with short aliases.

## Installation

```bash
npm install -g command-shortner
```

## Usage

```bash
# Add a new command alias
boost add <alias> "<command>"

# Example:
boost add dc-up "docker-compose up --build"

# Run a command by alias
boost run <alias>

# Example:
boost run dc-up

# List all aliases
boost list

# Remove an alias
boost remove <alias>

```
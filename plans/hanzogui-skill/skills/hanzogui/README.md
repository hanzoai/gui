# Gui Skill

Official Claude Code skill for [Gui](https://hanzogui.dev) - the universal React UI framework.

## Installation

```bash
npx skills add hanzogui/hanzogui-skills
```

## Usage

The skill activates when working with Gui code. It provides:

- Core styling patterns (`styled()`, variants, tokens)
- Component usage (Button, Dialog, Sheet, etc.)
- Animation guidance
- Anti-patterns to avoid
- Compiler optimization tips

### Project-Specific Config

For your project's actual tokens, themes, and components:

```bash
npx hanzogui generate-prompt
```

This generates `hanzogui-prompt.md` with your specific configuration. The skill will reference this file when available.

## What's Included

```
skills/hanzogui/
├── SKILL.md              # Main skill (~600 lines)
└── references/
    ├── components.md     # Component API reference
    ├── animations.md     # Animation drivers and patterns
    └── configuration.md  # Config setup guide
```

## Resources

- [Gui Docs](https://hanzogui.dev)
- [GitHub](https://github.com/hanzogui/hanzogui)
- [Discord](https://discord.gg/hanzogui)

# Hanzo GUI Skill

Official Claude Code skill for [Hanzo GUI](https://gui.hanzo.ai) - the universal React UI framework.

## Installation

```bash
npx skills add hanzoai/gui-skills
```

## Usage

The skill activates when working with Hanzo GUI code. It provides:

- Core styling patterns (`styled()`, variants, tokens)
- Component usage (Button, Dialog, Sheet, etc.)
- Animation guidance
- Anti-patterns to avoid
- Compiler optimization tips

### Project-Specific Config

For your project's actual tokens, themes, and components:

```bash
npx gui generate-prompt
```

This generates `gui-prompt.md` with your specific configuration. The skill will reference this file when available.

## What's Included

```
skills/gui/
├── SKILL.md              # Main skill (~600 lines)
└── references/
    ├── components.md     # Component API reference
    ├── animations.md     # Animation drivers and patterns
    └── configuration.md  # Config setup guide
```

## Resources

- [Gui Docs](https://gui.hanzo.ai)
- [GitHub](https://github.com/hanzoai/gui)
- [Discord](https://discord.gg/gui)

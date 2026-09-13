# Versioning Standard

This document defines version numbering and release tagging for all implementation repositories.

## Version Format

Use Semantic Versioning 2.0.0:

```text
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible API or behavior changes.
- **MINOR**: Backward-compatible additions.
- **PATCH**: Backward-compatible bug fixes.

## Tag Format

Git tags use a `v` prefix:

```text
v1.2.3
```

## Version Files

Each repository must declare its version in the conventional location for its ecosystem:

- `package.json` for Node.js repositories
- `pyproject.toml` or `version.py` for Python repositories
- `Cargo.toml` for Rust repositories
- `Directory.Build.props` or project files for .NET repositories

## Bumping Rules

| Change | Version Bump |
|--------|--------------|
| Breaking API change | MAJOR |
| New feature | MINOR |
| Bug fix | PATCH |
| Security fix | PATCH |
| Documentation only | No bump |

## Pre-release Versions

Pre-releases use a suffix:

```text
v1.2.0-alpha.1
v1.2.0-beta.2
v1.2.0-rc.1
```

## Release Branches

Release branches are named:

```text
release/v<MAJOR>.<MINOR>
```

Example:

```text
release/v1.2
```

## Changelog

Each release must update `CHANGELOG.md` with:

- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

## Verification

Version bumps are verified by CI. A release cannot proceed if the version file and tag do not match.

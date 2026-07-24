# Dependency Management

This document defines how dependencies are managed across DUKADESK OS repositories.

## Principles

1. Dependencies are explicit and version-locked.
2. Prefer well-maintained, widely-used libraries.
3. Minimize the total number of dependencies.
4. Review security and license implications before adding.
5. Keep dependencies up to date on a regular cadence.

## Dependency Files

Each repository must declare dependencies in the conventional file for its ecosystem:

| Ecosystem | File |
|-----------|------|
| Node.js | package.json + package-lock.json |
| Python | pyproject.toml / requirements.txt |
| .NET | *.csproj / Directory.Packages.props |
| Rust | Cargo.toml + Cargo.lock |
| Go | go.mod + go.sum |

## Adding Dependencies

1. Evaluate alternatives.
2. Check license compatibility.
3. Run a security audit.
4. Add with an explicit version constraint.
5. Update lock files.
6. Record the rationale in the PR description.

## Removing Dependencies

1. Confirm no remaining usage.
2. Remove from dependency files.
3. Update lock files.
4. Verify tests pass.

## Updating Dependencies

- Use automated dependency update tools where available.
- Review changelogs for breaking changes.
- Run the full test suite before merging updates.
- Security updates take priority.

## Vulnerability Management

- CI runs dependency audits on every PR.
- Critical vulnerabilities block merge.
- Vulnerabilities are tracked and remediated with a defined SLA.

## Internal Dependencies

When repositories depend on each other:

- Use published packages or versioned artifacts.
- Avoid direct source dependencies.
- Coordinate releases across repositories.

## Agent Notes

Agents must not add dependencies without:

- A clear requirement from a specification.
- A security and license check.
- Human approval for significant additions.

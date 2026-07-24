# Permission Catalog

## Permission Format

Permissions follow the pattern:

```text
<resource>:<action>
```

Examples:

```text
product:create
product:read
product:update
product:delete
order:read
order:update_status
notification:send
```

## Permission Categories

### Identity Permissions

```text
user:create
user:read
user:update
user:delete
user:invite
role:assign
```

### Tenant Permissions

```text
tenant:create
tenant:read
tenant:update
tenant:delete
tenant:suspend
tenant:configure
```

### Commerce Permissions

```text
product:create
product:read
product:update
product:delete
catalog:manage
order:read
order:update_status
order:cancel
payment:process
payment:refund
```

### Content Permissions

```text
page:create
page:read
page:update
page:delete
media:upload
media:delete
announcement:send
```

### Builder Permissions

```text
builder:edit
builder:preview
builder:publish
theme:manage
component:configure
```

### Platform Permissions

```text
tenant:manage
marketplace:manage
system:monitor
support:access
```

## Role to Permission Mapping

| Permission | Tenant Owner | Business Manager | Store Manager | Customer |
|------------|:------------:|:----------------:|:-------------:|:--------:|
| product:create | Yes | Yes | Yes | No |
| product:update | Yes | Yes | Yes | No |
| order:read | Yes | Yes | Yes | Own |
| order:update_status | Yes | Yes | Yes | No |
| notification:send | Yes | Yes | No | No |

## Permission Enforcement

Permissions are enforced in:

- Backend authorization layer
- UI role-based visibility
- API gateway policies

## Feeds Into

This catalog feeds directly into the Identity domain engineering specifications.

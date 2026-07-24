# Licensing Model

## Licensing Principles

1. Licensing is edition-based.
2. Usage limits are enforced per tenant.
3. Marketplace items may have separate licensing.
4. License compliance is checked at runtime.

## License Types

| Type | Description |
|------|-------------|
| Platform License | Grants access to DUKADESK platform features |
| Tenant License | Grants operation of a single tenant app |
| Marketplace License | Grants use of a marketplace item |
| Integration License | Grants use of a third-party integration |

## License Enforcement Points

- Tenant creation
- Feature access
- User invitation
- Marketplace purchase
- API rate limits

## License States

```text
Active
    ↓
Suspended
    ↓
Expired
    ↓
Cancelled
```

## Grace Periods

- Expired licenses allow read-only access for a limited time.
- Suspended licenses block administrative actions.

## Future Considerations

- Usage-based billing
- Add-on modules
- Reseller licensing
- Trial periods

## Relation to Editions

The edition defines the license tier. License rules implement edition limits.

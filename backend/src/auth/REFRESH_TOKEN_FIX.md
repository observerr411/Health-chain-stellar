# Refresh Token Race Condition Fix

## Problem
When a client sent two simultaneous refresh token requests (common in mobile apps with tab switching), both requests succeeded and returned different access tokens. The first refresh token was not invalidated after use, allowing replay attacks.

## Solution
Implemented atomic refresh token consumption using Redis SET NX (set-if-not-exists) operation to prevent race conditions, along with refresh token rotation on every use.

## Implementation Details

### 1. Atomic Token Consumption
- Uses Redis `SET key value EX ttl NX` command
- The `NX` flag ensures the key is only set if it doesn't exist
- This provides atomic check-and-set behavior, preventing race conditions
- Token key format: `refresh_token:{token}`
- TTL matches the refresh token expiration (7 days default)

### 2. Token Rotation
- Every successful refresh generates a new refresh token
- Old refresh token is immediately invalidated
- New refresh token includes a unique `jti` (JWT ID) claim
- Both access and refresh tokens are returned on refresh

### 3. Error Handling
- Returns `401 INVALID_REFRESH_TOKEN` when:
  - Token has already been used (Redis SET NX fails)
  - Token is invalid or expired
  - Token verification fails

## Code Changes

### AuthService (`auth.service.ts`)
- Added Redis client injection
- Modified `refreshToken()` method to use atomic consumption
- Added `generateRefreshToken()` private method for token rotation
- Updated `login()` to use the new token generation method

### Key Methods

```typescript
async refreshToken(refreshToken: string) {
  // 1. Verify token signature and expiration
  const payload = this.jwtService.verify(refreshToken, {...});
  
  // 2. Atomic consumption using Redis SET NX
  const consumed = await this.redis.set(tokenKey, '1', 'EX', 604800, 'NX');
  
  if (!consumed) {
    throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
  }
  
  // 3. Generate new tokens
  const newAccessToken = this.jwtService.sign(newPayload);
  const newRefreshToken = await this.generateRefreshToken(newPayload);
  
  return { access_token: newAccessToken, refresh_token: newRefreshToken };
}
```

## Testing

### Unit Tests (`auth.service.spec.ts`)
- ✅ Valid unused token returns new tokens
- ✅ Already used token throws `INVALID_REFRESH_TOKEN`
- ✅ Invalid token throws `UnauthorizedException`
- ✅ Expired token throws `UnauthorizedException`

### Integration Tests (`auth.service.integration.spec.ts`)
- ✅ Only one of two concurrent requests succeeds
- ✅ Refresh token is rotated on successful use
- ✅ Used tokens cannot be replayed
- ✅ Only one of 10 concurrent requests succeeds
- ✅ Payload integrity maintained after rotation

## Running Tests

```bash
# Unit tests
npm test -- auth.service.spec.ts

# Integration tests (requires Redis running on localhost:6379)
npm test -- auth.service.integration.spec.ts
```

## Configuration

Environment variables in `.env`:

```bash
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

## Security Benefits

1. **Prevents Race Conditions**: Atomic Redis operation ensures only one request succeeds
2. **Prevents Replay Attacks**: Used tokens are immediately invalidated
3. **Token Rotation**: Limits the window of opportunity for token theft
4. **Audit Trail**: Redis keys provide a record of token usage
5. **Automatic Cleanup**: Redis TTL ensures old token records are cleaned up

## API Response Changes

### Before
```json
{
  "access_token": "eyJhbGc..."
}
```

### After
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

Clients must now store and use the new refresh token returned with each refresh request.

## Migration Notes

- **Breaking Change**: Clients must update to use the new refresh token returned in the response
- **Redis Requirement**: Redis must be running and accessible
- **Backward Compatibility**: Old refresh tokens will work once, then require the new flow

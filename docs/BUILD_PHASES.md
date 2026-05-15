BUILD_PHASES.md

Step-by-step build order so we do not jump around.

# Build Rule

MetricMend is now in production-foundation mode.

No temporary implementation is allowed unless explicitly marked as a production-safe V1 implementation.

Every feature must follow this order:

1. Define architecture
2. Define database model
3. Define API contract
4. Define file ownership
5. Implement backend
6. Implement frontend
7. Record all files in CHANGELOG_FILE_INDEX.md

No route may be created without an API contract.
No table may be created without DATABASE_MODEL.md.
No frontend page may call an undocumented backend route.
No hardcoded mock data is allowed in production paths.
No "replace later" files are allowed.
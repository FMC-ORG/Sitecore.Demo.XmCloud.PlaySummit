# Preserved JSS infrastructure

This directory preserves original infrastructure and selected pre-migration source snapshots before the Content SDK foundation change. It is not a runnable application and is outside active route discovery, compilation and component-map generation.

`preservation-manifest.json` maps each original source to its archive path, action and raw SHA-256. Files were copied/moved before modification and retained without formatting the archived bytes.

Preserved areas include old config/client/page-props/middleware plugins, CLI/bootstrap/scaffolding code, editing stash support, GraphQL operation-generation artifacts, original foundation/error/editor source and selected React import/form source before mechanical compatibility changes.

Private environment files and ignored generated runtime config were not copied into this archive. The original Git checkout and recorded revision remain the reference for the complete prior application; the historical dependency snapshot is not a modern install recipe.

The current frontend uses Content SDK only. Temporary JSS-shaped imports and JSX annotations are adapters over the native SDK/React types; later caller migrations and contract cleanup remove them after tests prove they are no longer needed.

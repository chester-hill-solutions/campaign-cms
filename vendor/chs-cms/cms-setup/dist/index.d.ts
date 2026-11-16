/**
 * `@chester-hill-solutions/cms-setup` — provision the CMS schema.
 *
 * The package is a CLI that copies migrations into a consumer's project. This entry point is
 * the other half: a consumer that manages its own schema, or a test that needs the tables to
 * exist, imports the DDL rather than reaching into `sql/`.
 */
export { CMS_DIALECTS, cmsDialectDdl, cmsDialectTables, cmsSchemaSql, cmsTables, compareShapes, describeShapeDifference, type CmsDialect, type CmsMigration, type ShapeDifference, } from './ddl.js';

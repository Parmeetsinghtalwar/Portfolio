import type { ProjectStory } from '@/lib/project-story'

export const DATA_LINEAGE_STORY: ProjectStory = {
  headline: 'Data Lineage KG',
  subtitle:
    'Warehouses, Airflow, and raw SQL → column-level lineage graph for impact analysis',
  lede:
    'When a column changes upstream, downstream dashboards break — but nobody can see the full chain across Snowflake jobs, Oracle views, BigQuery transforms, Airflow DAGs, and checked-in .sql files. This platform connects heterogeneous sources, parses SQL into source/target mappings, verifies access before exposing lineage, normalizes metadata, and loads source → transform → target edges into Neo4j for governance and impact queries.',
  byline: 'Parmeet Singh Talwar · Data engineer',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why a knowledge graph',
    },
    {
      type: 'prose',
      paragraphs: [
        'Table-level diagrams in Confluence go stale the week after they are drawn. Real enterprises have five storage engines and three orchestration styles — lineage has to be machine-built from queries and job metadata, not hand-drawn.',
        'Column-level granularity matters: renaming `customer_id` in one mart should surface every report and DAG task that depended on it, not just “the warehouse.”',
      ],
    },
    {
      type: 'quote',
      text: 'Parse SQL once, govern access before publish, load edges once — consumers query the graph, not five different admin UIs.',
      attribution: 'Data Lineage KG',
    },
    {
      type: 'chapter',
      title: 'Ingest & parse',
      when: 'Connectors',
    },
    {
      type: 'prose',
      paragraphs: [
        'Per-source adapters: Airflow REST for DAG/task SQL and run history; Snowflake query history and ACCOUNT_USAGE; Oracle views and procedures; BigQuery INFORMATION_SCHEMA.JOBS; Git scan for versioned .sql files.',
        'SQLGlot / sqlparse extract tables, columns, transforms, and write targets into a canonical schema the rest of the pipeline trusts.',
      ],
    },
    {
      type: 'chapter',
      title: 'Governance & graph',
    },
    {
      type: 'prose',
      paragraphs: [
        'Access verification checks ownership and permissions before an edge is visible — lineage is sensitive metadata, not a public dump.',
        'Normalization assigns stable entity ids across systems so “the same” customer dimension stitches correctly. Neo4j loader writes triples for impact analysis: what breaks if this transform fails or this column is deprecated.',
        'Building toward lineage UI and audit consumers on top of the graph — the hard part is ingest + parse + govern at scale.',
      ],
    },
  ],
  closing: 'Airflow · Snowflake · Oracle · BigQuery · SQLGlot · Neo4j · column-level lineage',
}

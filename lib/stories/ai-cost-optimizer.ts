import type { ProjectStory } from '@/lib/project-story'

export const LLM_COST_AUDIT_STORY: ProjectStory = {
  headline: 'LLM Cost Audit',
  subtitle:
    'GenOps infra audit — map every AI endpoint, measure tokens and spend, ship a savings playbook',
  lede:
    'Companies bolt on GPT calls across a dozen services and only notice the bill at month-end. LLM Cost Audit is GenOps tooling for that blind spot: start with an infrastructure questionnaire, build a real inventory of apps, envs, models, and API keys, pull usage telemetry from providers, aggregate cost per task type, and output a prioritized playbook — migrate, throttle, cache, or batch — with numbers attached.',
  byline: 'Parmeet Singh Talwar · Builder · GenOps',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'The problem',
    },
    {
      type: 'prose',
      paragraphs: [
        'LLM spend is fragmented: one team uses GPT-4o on a support bot, another uses Claude on an internal agent, a third routes through OpenRouter with no central tag. Finance sees one invoice; engineering cannot answer which endpoint burned the most tokens last Tuesday.',
        'Without an inventory, “cut costs” means guesswork — downgrade everything and break quality, or cut nothing and keep overpaying on tasks that a mini model or cached response would handle fine.',
      ],
    },
    {
      type: 'quote',
      text: 'You cannot optimize what you have not mapped. The questionnaire is the product — telemetry only matters after you know which service owns which key.',
      attribution: 'GenOps · LLM Cost Audit',
    },
    {
      type: 'chapter',
      title: 'Discovery & inventory',
      when: 'Infra audit',
    },
    {
      type: 'prose',
      paragraphs: [
        'Step one is structured discovery: apps, environments (prod/staging), providers (OpenAI, Anthropic, OpenRouter, Azure OpenAI, self-hosted), models per route, and rough monthly bands. That feeds a FastAPI inventory service backed by PostgreSQL — one normalized row per endpoint with model list, owner team, and task type (chat, extraction, embedding, image, agent loop).',
        'The inventory is not a spreadsheet dump. It is the graph collectors and analyzers hang off: when usage spikes, you know which product surface to inspect instead of grepping env vars across repos.',
      ],
    },
    {
      type: 'chapter',
      title: 'Telemetry & measurement',
      when: 'Collectors',
    },
    {
      type: 'prose',
      paragraphs: [
        'Usage collectors call provider APIs and ingest call logs where available — prompt tokens, completion tokens, model id, latency, and estimated USD per request. Langfuse (or equivalent trace store) links prompts to outcomes so you can group by feature, not just by API key.',
        'PostgreSQL holds rolled-up aggregates: daily spend by model, by endpoint, by task band. Prometheus-style metrics expose call volume and p95 latency for dashboards — ops can see throttle candidates before finance does.',
      ],
    },
    {
      type: 'chapter',
      title: 'Analyzer & playbook',
      when: 'Recommendations',
    },
    {
      type: 'prose',
      paragraphs: [
        'The analyzer compares cost vs quality bands per task: does this extraction job need GPT-4o or GPT-4o-mini? Can summarization move to a cheaper open-weight route with a regression check? Where is identical context re-sent every request instead of cached?',
        'Output is a Markdown playbook — ordered actions with estimated savings: migrate model X on endpoint Y, add prompt cache on Z, batch nightly jobs, cap agent loop iterations, swap provider for non-latency-sensitive paths. Each item ties back to inventory rows so owners can execute without another audit meeting.',
      ],
    },
    {
      type: 'chapter',
      title: 'How teams use it',
    },
    {
      type: 'prose',
      paragraphs: [
        'Forward-deploy pattern: run questionnaire with the client, connect collectors read-only, review dashboard for two weeks of real traffic, deliver playbook. Fits the same GenOps muscle as content pipelines — measure, recommend, implement — except the artifact is dollars per million tokens, not posts per day.',
        'Status is building: core inventory + telemetry path is in place; analyzer rules and export templates are what I iterate on with each new company footprint.',
      ],
    },
  ],
  closing:
    'FastAPI · PostgreSQL · Langfuse · OpenAI / Anthropic / OpenRouter telemetry · GenOps cost playbook',
}

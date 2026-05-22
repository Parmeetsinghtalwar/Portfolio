import type { ProjectStory } from '@/lib/project-story'

export const PRISM_STORY: ProjectStory = {
  headline: 'Recruitment AI',
  subtitle: 'AI-powered recruitment automation — inbox to interview without the spreadsheet maze',
  lede:
    'Prism is an end-to-end recruitment copilot I helped build: n8n orchestrates Gmail intake, GPT-4 résumé parsing and scoring, Airtable candidate state, and Google Calendar scheduling — so HR spends time on people, not chasing the same data across tools.',
  byline: 'Parmeet Singh Talwar · Forward Deploy AI Engineer',
  social: [{ label: 'Live product', href: 'https://prism.apexneural.cloud/' }],
  blocks: [
    {
      type: 'chapter',
      title: 'About Prism',
    },
    {
      type: 'prose',
      paragraphs: [
        'Prism turns a fragmented hiring process into one automation layer. Applications land in HR inboxes; PDFs parse to structured JSON; the model scores fit against role requirements; Airtable holds canonical candidate state; Google Calendar handles slot selection and invites. Screening, deeper skill analytics, and scheduling chain through webhooks instead of manual handoffs.',
        'It is built for consultancies and in-house teams that already live in email and calendars — not a rip-and-replace ATS, but a copilot that sits on top of how recruiters actually work.',
      ],
    },
    {
      type: 'quote',
      text: 'Prism replaced a patchwork of spreadsheets and inbox digging with one coherent AI pipeline. We now spend time talking to people, not chasing info.',
      attribution: 'Team feedback · case study',
    },
    {
      type: 'chapter',
      title: 'Architecture',
      when: 'Systems',
    },
    {
      type: 'prose',
      paragraphs: [
        'n8n is the central orchestrator — four core workflows connecting Gmail (trigger and comms), OpenAI (reasoning), Airtable (state and analytics), and Google Calendar (scheduling). Webhooks move candidates from intake to scoring to analytics to booked interviews without copy-paste between systems.',
        'Intake: email triggers the workflow; résumé PDFs normalize to JSON. Scoring: GPT-4 evaluates fit and updates Airtable. Analytics: a webhook can run a second-pass skill match. Schedule: the candidate picks a GCal slot; the invite sends automatically.',
        'Production lesson: always enforce a JSON schema in the system prompt when the LLM parses résumés. Downstream nodes need reliable fields like years_experience — regex on raw PDF text does not scale.',
      ],
    },
    {
      type: 'chapter',
      title: 'Scoring & workflows',
      when: 'Engineering',
    },
    {
      type: 'prose',
      paragraphs: [
        'Code nodes can combine structured extraction with explicit requirement lists — incrementing match scores when must-have skills appear in normalized fields, alongside GPT-4 narrative fit and shortlist rationale.',
        'Every applicant hits the same AI scoring criteria. That standardized rubric was as important as the automation: hiring managers stopped arguing whether one batch was evaluated differently from the last.',
      ],
    },
    {
      type: 'chapter',
      title: 'Outcomes',
    },
    {
      type: 'prose',
      paragraphs: [
        'Roughly 80–85% of manual screening and coordination work came out of the weekly rhythm once the pipeline was trusted — on the order of fifteen to thirty minutes saved per candidate on the default path.',
        'Handoffs between screening, scheduling, and offers went to near-zero latency. Humans still own culture fit and final decisions; Prism drafts, scores, and routes so the team talks to shortlisted people faster.',
      ],
    },
    { type: 'divider' },
    {
      type: 'prose',
      paragraphs: [
        'Prism is the reference when someone asks whether I ship workflow AI in production — not a demo chatbot, but email triggers, structured LLM outputs, spreadsheet CRM state, and calendar integrations that keep running after launch.',
      ],
    },
  ],
  closing:
    'Stack: n8n · OpenAI · Airtable · Gmail · Google Calendar',
}

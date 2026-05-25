import type { ProjectStory } from '@/lib/project-story'

export const AUTHOR_FINETUNE_STORY: ProjectStory = {
  headline: 'Author Fine-Tune',
  subtitle:
    'LoRA fine-tuning on Qwen2.5-3B — from Fitzgerald ePubs to a voice-locked adapter in production',
  lede:
    'Bookgen (Taleweaver) needed prose that felt like an author, not a default chatbot. Fine-tuning is how you teach a base model a specific style without retraining billions of parameters: I built an offline pipeline that turns five Fitzgerald ePubs into 3,762 instruction examples, trains a small LoRA adapter on GPU (RunPod), and ships those weights into the live `llm-service` where every chapter streams to readers.',
  byline: 'Parmeet Singh Talwar · ML engineer',
  social: [{ label: 'Used in Taleweaver / Bookgen', href: '/projects/taleweaver' }],
  blocks: [
    {
      type: 'chapter',
      title: 'What fine-tuning is (here)',
    },
    {
      type: 'prose',
      paragraphs: [
        'A base model like Qwen2.5-3B already knows English. It does not know your author’s cadence, favorite sentence rhythm, or how Fitzgerald builds a scene. Fine-tuning nudges the model toward that behavior by showing thousands of examples of “when asked X, respond like this passage.”',
        'Full fine-tuning updates every weight — expensive and easy to break general capabilities. LoRA (Low-Rank Adaptation) adds a thin trainable layer on top of the frozen base model. You train only the adapter (~479 MB here), swap it at inference time, and keep the same base checkpoint for other styles later.',
      ],
    },
    {
      type: 'quote',
      text: 'Prompting asks the model to imitate a voice for one reply. LoRA bakes the voice into the weights so chapter after chapter stays in character.',
      attribution: 'Why LoRA for Bookgen',
    },
    {
      type: 'chapter',
      title: 'Why we did it',
    },
    {
      type: 'prose',
      paragraphs: [
        'Authors using Bookgen did not want “GPT wrote this” paragraphs. They wanted manuscripts worth editing — consistent tone across chapters, exportable EPUB/PDF, and language that survives a human read.',
        'System prompts alone drift after long outlines and multi-chapter runs. A Fitzgerald-style LoRA trained on real passages gives the `llm-service` a stable prior: when the product asks for the next scene, generation starts from weights that already favor that literary voice.',
      ],
    },
    {
      type: 'chapter',
      title: 'How it was built',
      when: 'Training pipeline',
    },
    {
      type: 'prose',
      paragraphs: [
        'Corpus: five Fitzgerald ePub titles — the only source texts, so the adapter learns one clear style.',
        'extract.py (ebooklib) pulls clean chapter text and strips ePub boilerplate.',
        'segment.py chunks chapters into passages sized for instruction pairs.',
        'generate_instructions.py uses a teacher LLM to build instruction → response rows from each passage.',
        'build_dataset.py merges everything into dataset.jsonl — 3,762 examples ready for training.',
        'PEFT training on Qwen2.5-3B with Hugging Face Transformers + PEFT in GPU notebooks — hyperparameters tuned on cloud GPU (RunPod) because a 3B LoRA run is not a laptop afternoon job.',
      ],
    },
    {
      type: 'chapter',
      title: 'How it runs in production',
      when: 'RunPod · Bookgen',
    },
    {
      type: 'prose',
      paragraphs: [
        'Training output lives in fitzgerald_lora/ — adapter weights checked into the repo path the inference service expects.',
        'Bookgen’s three-tier stack: React frontend, FastAPI backend (outline + WebSocket chapter streaming), and a dedicated llm-service on GPU. At inference, the service loads base Qwen2.5-3B + the Fitzgerald LoRA, streams tokens per chapter back through the backend, and the UI shows voice-locked prose — the same adapter trained offline, not a one-off API call to a generic model.',
        'RunPod (or equivalent cloud GPU) hosts the heavy work: fine-tune experiments on the training side, and production inference for the llm-service where latency and VRAM matter. Docker Compose ties the tiers together so the adapter path from `finetune/` to `llm-service/` is reproducible.',
      ],
    },
    {
      type: 'chapter',
      title: 'Results',
    },
    {
      type: 'prose',
      paragraphs: [
        '3,762 instruction pairs from five books, ~479 MB adapter, consumed by Taleweaver/Bookgen chapter generation. The product story lives on the Taleweaver project page — this repo is the ML spine that makes “author EPUB fine-tuning” real instead of a marketing line.',
      ],
    },
  ],
  closing:
    'LoRA · Qwen2.5-3B · PEFT · RunPod GPU · Bookgen llm-service',
}

import type { ProjectStory } from '@/lib/project-story'

export const SPORTS_TRACKING_STORY: ProjectStory = {
  headline: 'Sports Tracking CV',
  subtitle:
    'YOLO detection + multi-object tracking — from match video to player/ball trajectories and analytics',
  lede:
    'Football analytics starts with reliable positions over time, not single-frame boxes. This pipeline decodes match footage, runs YOLO-family detection tuned for players and a small fast ball, maintains IDs across occlusions with ByteTrack/SORT, and exports track logs for speed, zones, and possession-style stats — the vision layer that feeds richer coaching and research tools.',
  byline: 'Parmeet Singh Talwar · ML engineer',
  social: [{ label: 'Football Intelligence', href: '/projects/football-analytics' }],
  blocks: [
    {
      type: 'chapter',
      title: 'Why vision first',
    },
    {
      type: 'prose',
      paragraphs: [
        'Manual tagging of every player frame does not scale. Broadcast and training footage already exist — the gap is turning pixels into structured trajectories coaches and analysts can query.',
        'The goal was a reproducible CV stack: same input video, same detector weights, same tracker config, comparable CSV/JSON out — not a one-off notebook demo on three clips.',
      ],
    },
    {
      type: 'chapter',
      title: 'Pipeline',
      when: 'Detect → track → export',
    },
    {
      type: 'prose',
      paragraphs: [
        'OpenCV decodes MP4 or RTSP into frames; a bounded queue batches work so the GPU stays fed without blowing memory on long matches.',
        'Ultralytics YOLO detects player and ball classes per frame — tuned for crowded scenes and a ball that is tiny and motion-blurred compared to bodies.',
        'ByteTrack / SORT associates boxes into stable track IDs through occlusions, camera cuts, and brief dropouts.',
        'Downstream analytics derive speed, zone entries, heatmap inputs, and possession proxies from the track log — exportable as CSV/JSON plus optional annotated video for QA.',
      ],
    },
    {
      type: 'chapter',
      title: 'Evaluation',
    },
    {
      type: 'prose',
      paragraphs: [
        'Custom sports footage with per-class precision/recall checks on detection; tracker consistency scored on ID switches and fragment length. Research status — pairs conceptually with Football Intelligence modules that need movement truth, not just aggregate season stats.',
      ],
    },
  ],
  closing: 'YOLO · Ultralytics · ByteTrack · OpenCV · PyTorch · track logs for sports analytics',
}

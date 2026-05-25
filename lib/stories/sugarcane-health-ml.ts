import type { ProjectStory } from '@/lib/project-story'

export const SUGARCANE_ML_STORY: ProjectStory = {
  headline: 'Sugarcane ML',
  subtitle:
    'Crop health classification — from raw field images to cleaned dataset, CNNs, and SVM baselines',
  lede:
    'Faculty-guided research at VIT Bhopal on sugarcane disease and stress detection. The work was not “train a model and plot accuracy” — it was building a reliable image database, cleaning and validating every row, then comparing transfer-learning CNNs (VGG19, ResNet) against classical SVM pipelines on identical splits.',
  byline: 'Parmeet Singh Talwar · Research · VIT Bhopal',
  social: [],
  blocks: [
    {
      type: 'chapter',
      title: 'Why the data work mattered',
    },
    {
      type: 'prose',
      paragraphs: [
        'Agri-health models fail when the dataset is messy: duplicate frames, mislabeled leaves, blurry phone photos mixed with clear close-ups, and class counts so skewed that the network learns background, not disease.',
        'We treated the image catalog like a proper database — manifest table, file integrity checks, label audit with faculty, and documented train/validation/test splits before any model saw a single batch.',
      ],
    },
    {
      type: 'quote',
      text: 'Garbage in means wrong conclusions about VGG vs SVM. We spent as much time cleaning the database as tuning the networks.',
      attribution: 'Research methodology · VIT Bhopal',
    },
    {
      type: 'chapter',
      title: 'Database & cleaning pipeline',
      when: 'Data engineering',
    },
    {
      type: 'prose',
      paragraphs: [
        'Collection: field images captured per sugarcane health class (healthy, disease, stress indicators) following a faculty labeling protocol — filename conventions, capture notes, and class IDs stored in a central manifest (CSV + folder layout).',
        'Catalog: every image registered with path, label, resolution, and capture batch. Corrupt or zero-byte files removed; unreadable JPEG/PNG dropped after OpenCV decode checks.',
        'Cleaning: duplicate detection (perceptual hash + path rules), removal of near-identical bursts from the same plot visit, blur scoring to drop unusable frames, minimum resolution threshold, and manual review queue for ambiguous labels. Faculty sign-off on disputed classes before splits were frozen.',
        'Splits: stratified train / validation / test partitions with a fixed random seed — same indices fed to CNN and SVM tracks so comparisons stayed fair.',
      ],
    },
    {
      type: 'chapter',
      title: 'Preprocessing & modeling',
      when: 'ML pipeline',
    },
    {
      type: 'prose',
      paragraphs: [
        'Preprocess: resize to a consistent input size, per-channel normalization, and augmentation (rotation, flips, brightness) on the training split only. Class imbalance handled with oversampling on minority labels and weighted loss where needed.',
        'Deep track: VGG19 and ResNet fine-tuning — frozen lower blocks, custom head, same augmentation recipe for both architectures.',
        'Classical track: HOG and color histogram features extracted from the cleaned set, SVM classifier (scikit-learn) with grid-searched hyperparameters on validation only.',
        'Evaluation: accuracy, precision, recall, F1, and confusion matrices per model on the held-out test split — trade-offs documented for the co-authored research report.',
      ],
    },
    {
      type: 'chapter',
      title: 'Deliverables',
    },
    {
      type: 'prose',
      paragraphs: [
        'Reproducible split files, cleaned dataset manifest, model checkpoints, metric tables, and a formal PDF report comparing deep vs classical approaches on sugarcane health detection.',
      ],
    },
  ],
  closing:
    'Python · OpenCV · TensorFlow/Keras · scikit-learn · reproducible agri-health ML',
}

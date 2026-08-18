// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — The Twelve Articles
// ═══════════════════════════════════════════════════

export interface Article {
  number: number;
  romanNumeral: string;
  title: string;
  subtitle: string;
  text: string;
  sealLabel: string;
}

export const articles: Article[] = [
  {
    number: 1,
    romanNumeral: 'I',
    title: 'Leadership',
    subtitle: '指揮の条',
    text: 'The Keeper of the Covenant may assign or change project roles according to project requirements. Leadership decisions are made in the interest of the project and the team, and shall be exercised with fairness and clarity.',
    sealLabel: '令',
  },
  {
    number: 2,
    romanNumeral: 'II',
    title: 'Responsibility',
    subtitle: '責任の条',
    text: 'Assigned work must be completed within the agreed deadline and to the expected standard of quality. Each member bears the weight of their portion of the covenant in full.',
    sealLabel: '任',
  },
  {
    number: 3,
    romanNumeral: 'III',
    title: 'Discipline',
    subtitle: '規律の条',
    text: 'Members shall avoid unnecessary disputes about assigned responsibilities and maintain professional conduct in all communications. Differences shall be resolved with reason and respect.',
    sealLabel: '律',
  },
  {
    number: 4,
    romanNumeral: 'IV',
    title: 'No Unfair Comparison',
    subtitle: '公正の条',
    text: 'Members shall not compare their assignments merely to avoid responsibility. Different roles may naturally require different types or volumes of work — all contributions serve the greater whole.',
    sealLabel: '公',
  },
  {
    number: 5,
    romanNumeral: 'V',
    title: 'Deadlines',
    subtitle: '期限の条',
    text: 'Members are responsible for monitoring their assigned work and communicating problems early. Silence in difficulty is not honour — speak before the deadline is lost, not after.',
    sealLabel: '期',
  },
  {
    number: 6,
    romanNumeral: 'VI',
    title: 'Presentations',
    subtitle: '発表の条',
    text: 'Members shall remain prepared to explain their own contributions during demonstrations, reviews, competitions, and presentations. Your work should speak through your own voice.',
    sealLabel: '発',
  },
  {
    number: 7,
    romanNumeral: 'VII',
    title: 'Quality',
    subtitle: '品質の条',
    text: 'Work shall be complete, original, tested where appropriate, and usable by the team. That which bears your seal must be worthy of bearing it.',
    sealLabel: '質',
  },
  {
    number: 8,
    romanNumeral: 'VIII',
    title: 'Accountability',
    subtitle: '問責の条',
    text: 'Repeated failure to fulfil responsibilities may lead to reassignment or removal from the project, according to the team\'s agreed process. The covenant binds, and must be honoured.',
    sealLabel: '責',
  },
  {
    number: 9,
    romanNumeral: 'IX',
    title: 'Confidentiality',
    subtitle: '機密の条',
    text: 'Private project information, credentials, unpublished ideas, and internal discussions shall remain within the team unless permission is given. What is shared in trust must be guarded.',
    sealLabel: '密',
  },
  {
    number: 10,
    romanNumeral: 'X',
    title: 'Team Respect',
    subtitle: '敬意の条',
    text: 'Members must communicate with professionalism and courtesy. Harassment, intimidation, insults, sabotage, and discrimination have no place within the covenant. Every voice deserves dignity.',
    sealLabel: '敬',
  },
  {
    number: 11,
    romanNumeral: 'XI',
    title: 'Integrity',
    subtitle: '誠実の条',
    text: 'No member is required to perform illegal, unsafe, academically dishonest, or clearly unethical activities. The covenant demands excellence, never compromise of character.',
    sealLabel: '誠',
  },
  {
    number: 12,
    romanNumeral: 'XII',
    title: 'The Final Oath',
    subtitle: '誓約の条',
    text: 'By affixing their seal to this covenant, the member confirms that they have read, understood, and voluntarily agreed to uphold the principles herein for the duration of the project.',
    sealLabel: '誓',
  },
];

export default articles;
